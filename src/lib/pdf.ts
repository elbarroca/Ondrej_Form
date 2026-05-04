import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
  rgb,
} from "pdf-lib";
import type { Identity, Receipt, ReceiptCategory, Trip } from "./types";

const CATEGORY_ORDER: ReceiptCategory[] = [
  "travel",
  "lodging",
  "meals",
  "conferences",
  "supplies",
  "translation",
  "other",
];

interface CategoryGroup {
  category: ReceiptCategory;
  receipts: Receipt[];
  sum: number;
  description: string;
  pageRange: string;
}

function buildGroups(
  trip: Trip,
  receipts: Receipt[],
  pageCounts: Map<string, number>,
): CategoryGroup[] {
  const groups: CategoryGroup[] = [];
  let pageCursor = 2;
  const ordered = [...receipts].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category);
    const bi = CATEGORY_ORDER.indexOf(b.category);
    if (ai !== bi) return ai - bi;
    return a.date.localeCompare(b.date);
  });
  for (const cat of CATEGORY_ORDER) {
    const items = ordered.filter((r) => r.category === cat);
    if (items.length === 0) continue;
    const sum = items.reduce((s, r) => s + r.convertedAmount, 0);
    const customDesc = trip.categoryDescriptions?.[cat]?.trim();
    const description = customDesc
      ? customDesc
      : `${cat} (${items.length} ${items.length === 1 ? "receipt" : "receipts"})`;
    const totalPages = items.reduce(
      (s, r) => s + (pageCounts.get(r.id) ?? 1),
      0,
    );
    const start = pageCursor;
    const end = pageCursor + totalPages - 1;
    const pageRange = totalPages === 1 ? `Page ${start}` : `Pages ${start}-${end}`;
    pageCursor = end + 1;
    groups.push({ category: cat, receipts: items, sum, description, pageRange });
  }
  return groups;
}

async function countReceiptPages(receipt: Receipt): Promise<number> {
  if (receipt.imageType !== "application/pdf") return 1;
  try {
    const buf = new Uint8Array(await receipt.imageBlob.arrayBuffer());
    const src = await PDFDocument.load(buf, { ignoreEncryption: true });
    return src.getPageCount();
  } catch {
    return 1;
  }
}

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 40;
const ROW_H = 18;

interface DrawCtx {
  page: PDFPage;
  font: PDFFont;
  bold: PDFFont;
}

function fmtMoney(n: number, cur: string): string {
  return `${n.toFixed(2)} ${cur}`;
}

function sanitize(text: string): string {
  return text
    .replace(/[→➤➜]/g, "->")
    .replace(/[←]/g, "<-")
    .replace(/[–—]/g, "-")
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[•·‧]/g, "·")
    .replace(/…/g, "...")
    .replace(/ /g, " ");
}

function drawText(
  ctx: DrawCtx,
  text: string,
  x: number,
  y: number,
  size = 10,
  bold = false,
): void {
  ctx.page.drawText(sanitize(text), {
    x,
    y,
    size,
    font: bold ? ctx.bold : ctx.font,
    color: rgb(0, 0, 0),
  });
}

function drawLine(
  page: PDFPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): void {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
}

function drawBox(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.5,
  });
}

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const words = sanitize(text).split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const trial = current ? `${current} ${w}` : w;
    if (font.widthOfTextAtSize(trial, size) > maxW && current) {
      lines.push(current);
      current = w;
    } else {
      current = trial;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function drawCover(
  doc: PDFDocument,
  ctx: DrawCtx,
  identity: Identity,
  trip: Trip,
  receipts: Receipt[],
  signatureImg: Uint8Array | null,
  pageCounts: Map<string, number>,
): Promise<void> {
  const { page } = ctx;
  const tableW = PAGE_W - MARGIN * 2;
  let y = PAGE_H - MARGIN;

  drawText(ctx, "REIMBURSEMENT SHEET", MARGIN, y, 13, true);
  y -= 15;
  if (trip.organizationName) {
    drawText(ctx, trip.organizationName, MARGIN, y, 11, true);
    y -= 14;
  }
  drawText(
    ctx,
    `${trip.eventName}${trip.location ? ` - ${trip.location}` : ""}`,
    MARGIN,
    y,
    11,
    true,
  );
  y -= 14;

  // Identity table — match template layout
  type Row =
    | { kind: "single"; label: string; value: string }
    | { kind: "triple"; cells: Array<[string, string]> }
    | { kind: "note"; text: string; color: ReturnType<typeof rgb> };
  const idRows: Row[] = [
    { kind: "single", label: "Name:", value: identity.fullName },
    { kind: "single", label: "Address:", value: identity.address },
    {
      kind: "triple",
      cells: [
        ["Postal code:", identity.postalCode],
        ["Place:", identity.place],
        ["Country:", identity.country],
      ],
    },
    {
      kind: "triple",
      cells: [
        ["Phone:", identity.phone],
        ["E-mail:", identity.email],
        ["", ""],
      ],
    },
    { kind: "single", label: "Bank account:", value: identity.bankAccount },
    {
      kind: "note",
      text: "If you have a foreign bank, please provide IBAN and SWIFT",
      color: rgb(0.85, 0.15, 0.15),
    },
    { kind: "single", label: "IBAN number:", value: identity.iban },
    { kind: "single", label: "BIC/SWIFT address:", value: identity.bicSwift },
  ];

  const idTableTop = y;
  let rowY = idTableTop;
  for (const row of idRows) {
    rowY -= ROW_H;
    drawBox(page, MARGIN, rowY, tableW, ROW_H);
    if (row.kind === "single") {
      drawText(ctx, row.label, MARGIN + 4, rowY + 5, 9, true);
      const labelW = ctx.bold.widthOfTextAtSize(sanitize(row.label), 9);
      drawText(ctx, row.value || "", MARGIN + 8 + labelW, rowY + 5, 9);
    } else if (row.kind === "triple") {
      const cellW = tableW / 3;
      for (let i = 0; i < 3; i++) {
        const x = MARGIN + cellW * i;
        if (i > 0) drawLine(page, x, rowY, x, rowY + ROW_H);
        const [lab, val] = row.cells[i];
        if (lab) {
          drawText(ctx, lab, x + 4, rowY + 5, 9, true);
          const lw = ctx.bold.widthOfTextAtSize(sanitize(lab), 9);
          drawText(ctx, val || "", x + 8 + lw, rowY + 5, 9);
        }
      }
    } else {
      page.drawText(sanitize(row.text), {
        x: MARGIN + 4,
        y: rowY + 5,
        size: 9,
        font: ctx.bold,
        color: row.color,
      });
    }
  }
  y = rowY - 16;

  // Expenses section header + callout
  drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
  drawText(ctx, "EXPENSES FOR REIMBURSEMENT", MARGIN + 4, y - 13, 10, true);
  y -= ROW_H;
  const calloutH = 28;
  page.drawRectangle({
    x: MARGIN,
    y: y - calloutH,
    width: tableW,
    height: calloutH,
    color: rgb(1, 0.96, 0.6),
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.5,
  });
  const calloutLines = wrap(
    "Please paste a copy or picture of your receipts in this document. Everything must be delivered as 1 PDF file.",
    ctx.bold,
    9,
    tableW - 8,
  );
  let cyc = y - 11;
  for (const line of calloutLines) {
    page.drawText(sanitize(line), {
      x: MARGIN + 4,
      y: cyc,
      size: 9,
      font: ctx.bold,
      color: rgb(0.78, 0.1, 0.1),
    });
    cyc -= 11;
  }
  y -= calloutH;

  // Expense table
  const groups = buildGroups(trip, receipts, pageCounts);
  const colDescX = MARGIN;
  const colSumX = MARGIN + 320;
  const colAttachX = MARGIN + 410;

  drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
  drawLine(page, colSumX, y - ROW_H, colSumX, y);
  drawLine(page, colAttachX, y - ROW_H, colAttachX, y);
  drawText(ctx, "Description of costs:", colDescX + 4, y - 13, 9, true);
  drawText(ctx, `Sum ${trip.outputCurrency}:`, colSumX + 4, y - 13, 9, true);
  drawText(ctx, "Attached receipt:", colAttachX + 4, y - 13, 9, true);
  y -= ROW_H;

  let total = 0;
  const minRows = 6;
  const renderedGroups = groups.slice(0, minRows);
  for (const g of renderedGroups) {
    drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
    drawLine(page, colSumX, y - ROW_H, colSumX, y);
    drawLine(page, colAttachX, y - ROW_H, colAttachX, y);
    drawText(ctx, g.description.slice(0, 60), colDescX + 4, y - 13, 9);
    drawText(ctx, g.sum.toFixed(2), colSumX + 4, y - 13, 9);
    drawText(ctx, g.pageRange, colAttachX + 4, y - 13, 9);
    total += g.sum;
    y -= ROW_H;
  }
  for (let i = renderedGroups.length; i < minRows; i++) {
    drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
    drawLine(page, colSumX, y - ROW_H, colSumX, y);
    drawLine(page, colAttachX, y - ROW_H, colAttachX, y);
    y -= ROW_H;
  }

  drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
  drawText(
    ctx,
    `Total sum in ${trip.outputCurrency}: ${total.toFixed(2)}`,
    colDescX + 4,
    y - 13,
    10,
    true,
  );
  y -= ROW_H;

  drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
  drawText(
    ctx,
    `Approved grant in ${trip.outputCurrency}:`,
    colDescX + 4,
    y - 13,
    10,
    true,
  );
  y -= ROW_H + 14;

  // Comments box — always rendered, content from trip.comments only
  const commentsBoxH = 56;
  const commentsLabelW = 96;
  const commentsTop = y;
  drawBox(page, MARGIN, commentsTop - commentsBoxH, commentsLabelW, commentsBoxH);
  drawBox(
    page,
    MARGIN + commentsLabelW,
    commentsTop - commentsBoxH,
    tableW - commentsLabelW,
    commentsBoxH,
  );
  drawText(ctx, "Comments:", MARGIN + 4, commentsTop - 13, 9, true);
  const commentText = (trip.comments ?? "").trim();
  if (commentText) {
    let ccy = commentsTop - 13;
    for (const line of wrap(
      commentText,
      ctx.font,
      9,
      tableW - commentsLabelW - 8,
    )) {
      if (ccy < commentsTop - commentsBoxH + 6) break;
      drawText(ctx, line, MARGIN + commentsLabelW + 4, ccy, 9);
      ccy -= 11;
    }
  }
  y = commentsTop - commentsBoxH - 6;

  // Claims-for row
  drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
  drawText(
    ctx,
    "CLAIMS FOR REIMBURSEMENT SHALL BE SENT TO:",
    MARGIN + 4,
    y - 13,
    9,
    true,
  );
  y -= ROW_H;
  drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
  drawText(ctx, trip.recipientEmail || "", MARGIN + 4, y - 13, 10);
  y -= ROW_H;

  // Date / Signature row
  const dateW = 200;
  drawBox(page, MARGIN, y - ROW_H * 2, dateW, ROW_H * 2);
  drawBox(
    page,
    MARGIN + dateW,
    y - ROW_H * 2,
    tableW - dateW,
    ROW_H * 2,
  );
  drawText(
    ctx,
    `Date: ${new Date().toISOString().slice(0, 10)}`,
    MARGIN + 4,
    y - 13,
    9,
    true,
  );
  drawText(ctx, "Your signature:", MARGIN + dateW + 4, y - 13, 9, true);
  if (signatureImg) {
    try {
      const png = await doc.embedPng(signatureImg);
      const sigW = 140;
      const sigH = Math.min((png.height / png.width) * sigW, ROW_H * 2 - 6);
      const sigWAdj = (png.width / png.height) * sigH;
      page.drawImage(png, {
        x: MARGIN + dateW + 6,
        y: y - ROW_H * 2 + 4,
        width: sigWAdj,
        height: sigH,
      });
    } catch {
      // ignore
    }
  }
  y -= ROW_H * 2 + 16;

  const accountability =
    `By submitting this form, I accept full responsibility for returning any advance reimbursement back to ${trip.organizationName || "the organization"} in case of being unable to attend the activity or failing to deliver required outcomes within 14 days after attending the activity. The refund would be processed no later than 14 days after cancelling my own participation. I understand that unexpected conditions may be covered by a separate insurance for the trip.`;
  for (const line of wrap(accountability, ctx.font, 9, tableW)) {
    drawText(ctx, line, MARGIN, y, 9);
    y -= 11;
  }
}

function bannerLine(receipt: Receipt, ordinal: number, trip: Trip): string {
  return `Receipt ${ordinal + 1} - ${receipt.category} - ${receipt.date} - ${fmtMoney(receipt.originalAmount, receipt.originalCurrency)} -> ${fmtMoney(receipt.convertedAmount, trip.outputCurrency)} (rate ${receipt.fxRate.toFixed(4)})`;
}

function drawBanner(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  text: string,
): void {
  const w = page.getWidth();
  const h = page.getHeight();
  const bannerH = 22;
  page.drawRectangle({
    x: 0,
    y: h - bannerH,
    width: w,
    height: bannerH,
    color: rgb(1, 1, 1),
    opacity: 0.92,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.5,
  });
  drawText({ page, font, bold }, text, 8, h - 15, 9, true);
}

async function appendImageReceiptPage(
  doc: PDFDocument,
  font: PDFFont,
  bold: PDFFont,
  receipt: Receipt,
  ordinal: number,
  trip: Trip,
): Promise<void> {
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const ctx: DrawCtx = { page, font, bold };
  let y = PAGE_H - MARGIN;
  drawText(ctx, `Receipt ${ordinal + 1} - ${receipt.category}`, MARGIN, y, 12, true);
  y -= 16;
  drawText(
    ctx,
    `${receipt.date}  ·  ${fmtMoney(receipt.originalAmount, receipt.originalCurrency)}  ->  ${fmtMoney(receipt.convertedAmount, trip.outputCurrency)}  (rate ${receipt.fxRate.toFixed(4)})`,
    MARGIN,
    y,
    9,
  );
  y -= 14;
  if (receipt.description) {
    for (const line of wrap(receipt.description, font, 9, PAGE_W - MARGIN * 2)) {
      drawText(ctx, line, MARGIN, y, 9);
      y -= 11;
    }
  }
  y -= 6;

  const buf = new Uint8Array(await receipt.imageBlob.arrayBuffer());
  const isPng = receipt.imageType.includes("png");
  let img;
  try {
    img = isPng ? await doc.embedPng(buf) : await doc.embedJpg(buf);
  } catch {
    try {
      img = await doc.embedPng(buf);
    } catch {
      drawText(ctx, "[Could not embed image]", MARGIN, y - 16, 10);
      return;
    }
  }
  const maxW = PAGE_W - MARGIN * 2;
  const maxH = y - MARGIN;
  const ratio = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  page.drawImage(img, { x: MARGIN + (maxW - w) / 2, y: y - h, width: w, height: h });
}

async function appendPdfReceipt(
  doc: PDFDocument,
  font: PDFFont,
  bold: PDFFont,
  receipt: Receipt,
  ordinal: number,
  trip: Trip,
): Promise<number> {
  const buf = new Uint8Array(await receipt.imageBlob.arrayBuffer());
  try {
    const src = await PDFDocument.load(buf, { ignoreEncryption: true });
    const indices = src.getPageIndices();
    const copied = await doc.copyPages(src, indices);
    copied.forEach((p, i) => {
      doc.addPage(p);
      if (i === 0) drawBanner(p, font, bold, bannerLine(receipt, ordinal, trip));
    });
    return copied.length;
  } catch {
    await appendImageReceiptPage(doc, font, bold, receipt, ordinal, trip);
    return 1;
  }
}

function dataUrlToBytes(dataUrl: string): Uint8Array | null {
  const m = /^data:[^;]+;base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  const bin = atob(m[1]);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function generatePdf(
  identity: Identity,
  trip: Trip,
  receipts: Receipt[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const sigBytes = identity.signaturePng
    ? dataUrlToBytes(identity.signaturePng)
    : null;

  const pageCounts = new Map<string, number>();
  await Promise.all(
    receipts.map(async (r) => {
      pageCounts.set(r.id, await countReceiptPages(r));
    }),
  );

  const cover = doc.addPage([PAGE_W, PAGE_H]);
  await drawCover(
    doc,
    { page: cover, font, bold },
    identity,
    trip,
    receipts,
    sigBytes,
    pageCounts,
  );

  const orderedGroups = buildGroups(trip, receipts, pageCounts);
  const ordered = orderedGroups.flatMap((g) => g.receipts);
  for (let i = 0; i < ordered.length; i++) {
    const r = ordered[i];
    if (r.imageType === "application/pdf") {
      await appendPdfReceipt(doc, font, bold, r, i, trip);
    } else {
      await appendImageReceiptPage(doc, font, bold, r, i, trip);
    }
  }

  return doc.save();
}

export function downloadPdf(
  bytes: Uint8Array,
  filename: string,
): void {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

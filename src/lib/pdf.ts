import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
  rgb,
} from "pdf-lib";
import type { Identity, Receipt, Trip } from "./types";

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

function drawText(
  ctx: DrawCtx,
  text: string,
  x: number,
  y: number,
  size = 10,
  bold = false,
): void {
  ctx.page.drawText(text, {
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
  const words = text.split(/\s+/);
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
): Promise<void> {
  const { page } = ctx;
  let y = PAGE_H - MARGIN;

  drawText(ctx, "REIMBURSEMENT SHEET", MARGIN, y, 14, true);
  y -= 18;
  if (trip.organizationName) {
    drawText(ctx, trip.organizationName, MARGIN, y, 11, true);
    y -= 14;
  }
  drawText(
    ctx,
    `${trip.eventName}${trip.location ? ` — ${trip.location}` : ""}`,
    MARGIN,
    y,
    11,
    true,
  );
  y -= 20;

  const tableW = PAGE_W - MARGIN * 2;
  const labelW = 110;
  const rows: Array<[string, string]> = [
    ["Name", identity.fullName],
    ["Address", identity.address],
    [
      "Postal / Place / Country",
      [identity.postalCode, identity.place, identity.country]
        .filter(Boolean)
        .join(" / "),
    ],
    ["Phone", identity.phone],
    ["E-mail", identity.email],
    ["Bank account", identity.bankAccount],
    ["IBAN", identity.iban],
    ["BIC/SWIFT", identity.bicSwift],
  ];

  drawBox(page, MARGIN, y - rows.length * ROW_H, tableW, rows.length * ROW_H);
  for (let i = 0; i < rows.length; i++) {
    const rowY = y - (i + 1) * ROW_H;
    drawLine(page, MARGIN + labelW, rowY, MARGIN + labelW, rowY + ROW_H);
    if (i > 0) drawLine(page, MARGIN, rowY + ROW_H, MARGIN + tableW, rowY + ROW_H);
    drawText(ctx, rows[i][0], MARGIN + 4, rowY + 5, 9, true);
    drawText(ctx, rows[i][1] ?? "", MARGIN + labelW + 4, rowY + 5, 9);
  }
  y -= rows.length * ROW_H + 20;

  drawText(ctx, "EXPENSES FOR REIMBURSEMENT", MARGIN, y, 11, true);
  y -= 16;
  drawText(
    ctx,
    `Total in ${trip.outputCurrency}. Receipts attached on following pages.`,
    MARGIN,
    y,
    8,
  );
  y -= 14;

  const colDescX = MARGIN;
  const colCatX = MARGIN + 240;
  const colOrigX = MARGIN + 330;
  const colConvX = MARGIN + 430;
  const headerY = y;
  drawBox(page, MARGIN, headerY - ROW_H, tableW, ROW_H);
  drawText(ctx, "Description", colDescX + 4, headerY - 13, 9, true);
  drawText(ctx, "Category", colCatX + 4, headerY - 13, 9, true);
  drawText(ctx, "Original", colOrigX + 4, headerY - 13, 9, true);
  drawText(
    ctx,
    `Sum ${trip.outputCurrency}`,
    colConvX + 4,
    headerY - 13,
    9,
    true,
  );
  y = headerY - ROW_H;

  let total = 0;
  for (let i = 0; i < receipts.length; i++) {
    const r = receipts[i];
    drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
    drawLine(page, colCatX, y - ROW_H, colCatX, y);
    drawLine(page, colOrigX, y - ROW_H, colOrigX, y);
    drawLine(page, colConvX, y - ROW_H, colConvX, y);
    const desc = r.description || `Receipt ${i + 1}`;
    drawText(ctx, desc.slice(0, 40), colDescX + 4, y - 13, 9);
    drawText(ctx, r.category, colCatX + 4, y - 13, 9);
    drawText(
      ctx,
      fmtMoney(r.originalAmount, r.originalCurrency),
      colOrigX + 4,
      y - 13,
      9,
    );
    drawText(ctx, r.convertedAmount.toFixed(2), colConvX + 4, y - 13, 9);
    total += r.convertedAmount;
    y -= ROW_H;
    if (y < MARGIN + 160) break;
  }

  drawBox(page, MARGIN, y - ROW_H, tableW, ROW_H);
  drawText(ctx, "TOTAL", colDescX + 4, y - 13, 10, true);
  drawText(
    ctx,
    `${total.toFixed(2)} ${trip.outputCurrency}`,
    colConvX + 4,
    y - 13,
    10,
    true,
  );
  y -= ROW_H + 20;

  if (trip.comments && trip.comments.trim()) {
    drawText(ctx, "Comments:", MARGIN, y, 9, true);
    y -= 12;
    const boxH = 60;
    drawBox(page, MARGIN, y - boxH, PAGE_W - MARGIN * 2, boxH);
    let cy = y - 12;
    for (const line of wrap(
      trip.comments.trim(),
      ctx.font,
      9,
      PAGE_W - MARGIN * 2 - 12,
    )) {
      if (cy < y - boxH + 6) break;
      drawText(ctx, line, MARGIN + 6, cy, 9);
      cy -= 11;
    }
    y -= boxH + 10;
  }

  if (trip.recipientEmail) {
    drawText(ctx, "Claims for reimbursement shall be sent to:", MARGIN, y, 9);
    y -= 12;
    drawText(ctx, trip.recipientEmail, MARGIN, y, 10, true);
    y -= 18;
  }

  drawText(ctx, `Date: ${new Date().toISOString().slice(0, 10)}`, MARGIN, y, 9);
  drawText(ctx, "Signature:", MARGIN + 200, y, 9);
  y -= 6;

  if (signatureImg) {
    try {
      const png = await doc.embedPng(signatureImg);
      const sigW = 140;
      const sigH = (png.height / png.width) * sigW;
      page.drawImage(png, {
        x: MARGIN + 250,
        y: y - sigH,
        width: sigW,
        height: sigH,
      });
      y -= sigH + 4;
    } catch {
      y -= 30;
    }
  } else {
    y -= 30;
  }

  drawLine(page, MARGIN + 250, y, MARGIN + 250 + 160, y);
  y -= 16;

  const accountability =
    "By submitting this form, I accept full responsibility for the accuracy of the information provided. I confirm the listed expenses were incurred in connection with the stated event and that supporting receipts are attached.";
  for (const line of wrap(accountability, ctx.font, 8, PAGE_W - MARGIN * 2)) {
    drawText(ctx, line, MARGIN, y, 8);
    y -= 11;
  }
}

async function drawReceiptPage(
  doc: PDFDocument,
  ctx: DrawCtx,
  receipt: Receipt,
  index: number,
  trip: Trip,
): Promise<void> {
  const { page } = ctx;
  let y = PAGE_H - MARGIN;
  drawText(ctx, `Receipt ${index + 1} — ${receipt.category}`, MARGIN, y, 12, true);
  y -= 16;
  drawText(
    ctx,
    `${receipt.date}  ·  ${fmtMoney(receipt.originalAmount, receipt.originalCurrency)}  →  ${fmtMoney(receipt.convertedAmount, trip.outputCurrency)}  (rate ${receipt.fxRate.toFixed(4)})`,
    MARGIN,
    y,
    9,
  );
  y -= 14;
  if (receipt.description) {
    for (const line of wrap(receipt.description, ctx.font, 9, PAGE_W - MARGIN * 2)) {
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

  const cover = doc.addPage([PAGE_W, PAGE_H]);
  await drawCover(doc, { page: cover, font, bold }, identity, trip, receipts, sigBytes);

  for (let i = 0; i < receipts.length; i++) {
    const page = doc.addPage([PAGE_W, PAGE_H]);
    await drawReceiptPage(doc, { page, font, bold }, receipts[i], i, trip);
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

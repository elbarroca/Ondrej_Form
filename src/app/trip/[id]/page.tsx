import { Shell } from "@/components/Shell";
import { TripView } from "./TripView";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Shell>
      <TripView tripId={id} />
    </Shell>
  );
}

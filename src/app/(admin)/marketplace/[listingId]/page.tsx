export default async function ListingDetailPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = await params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground">Listing Detail</h1>
      <p className="text-foreground-secondary mt-1">Listing ID: {listingId} — coming in Phase 8</p>
    </div>
  );
}

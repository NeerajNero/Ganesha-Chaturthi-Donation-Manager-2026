import { VENUE, VENUE_COORDS } from "@/lib/config";
import { mapsDirectionsUrl, mapsViewUrl, osmEmbedUrl } from "@/lib/location";

// Renders nothing until VENUE_COORDS is set in lib/config.ts.
export function VenueMap() {
  if (!VENUE_COORDS) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-sm">
      <iframe
        src={osmEmbedUrl(VENUE_COORDS)}
        title={`Map — ${VENUE}`}
        loading="lazy"
        className="h-52 w-full border-0"
      />
      <div className="space-y-3 p-4">
        <p className="text-sm font-semibold">📍 {VENUE}</p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={mapsDirectionsUrl(VENUE_COORDS)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center rounded-xl bg-maroon text-sm font-semibold text-cream active:bg-maroon/90"
          >
            🧭 Get directions
          </a>
          <a
            href={mapsViewUrl(VENUE_COORDS)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center rounded-xl border border-maroon text-sm font-semibold text-maroon active:bg-maroon/5"
          >
            🗺️ Open in Maps
          </a>
        </div>
      </div>
    </section>
  );
}

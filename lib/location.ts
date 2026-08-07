type Coords = { lat: number; lng: number };

// Universal Google Maps links — open the native app on phones.
export function mapsViewUrl({ lat, lng }: Coords): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function mapsDirectionsUrl({ lat, lng }: Coords): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

// Keyless OpenStreetMap embed with a marker on the venue.
export function osmEmbedUrl({ lat, lng }: Coords): string {
  const d = 0.004;
  const bbox = [lng - d, lat - d, lng + d, lat + d].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

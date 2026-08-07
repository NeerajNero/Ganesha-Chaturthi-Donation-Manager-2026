import { GalleryManager } from "./_components/gallery-manager";

export default function AdminGalleryPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Gallery</h1>
      <p className="text-sm text-gray-600">
        Photos appear on the public <span className="font-mono">/gallery</span> page.
      </p>
      <GalleryManager />
    </main>
  );
}

import Link from "next/link";

interface HeaderSidebarProps {
  sidebarOpen: boolean;
  closeSidebar: () => void;
}

export default function HeaderSidebar({ sidebarOpen, closeSidebar }: HeaderSidebarProps) {
  if (!sidebarOpen) return null;
  return (
    <aside
      className="flex flex-col p-6 fixed top-0 right-0 w-64 h-full z-50
      bg-jet-black text-white shadow-lg">
      <button
        onClick={closeSidebar}
        className="mb-4 cursor-pointer hover:text-primary"
      >
        Close
      </button>
      <div className="flex flex-col gap-2 pb-2">
        <h5 className="font-bold">Services</h5>
        <Link href="/mixing-and-mastering"
          className="hover:text-primary">Mixing & Mastering</Link>
        <Link href="/education"
          className="hover:text-primary">Education</Link>
      </div>
      <div className="flex flex-col gap-2 pb-2">
        <h5 className="font-bold">Products</h5>
        <Link href="/plugins"
          className="hover:text-primary">Plugins</Link>
        <Link href="/audio-tools"
          className="hover:text-primary">Audio Tools</Link>
        <Link href="/samples-and-loops"
          className="hover:text-primary">Samples & Loops</Link>
      </div>
      <div className="flex flex-col gap-2 pb-2">
        <h5 className="font-bold">Other Links</h5>
        <Link href="/studio"
          className="hover:text-primary">Studio</Link>
        <Link href="/blog"
          className="hover:text-primary">Blog</Link>
        <Link href="/music"
          className="hover:text-primary">Music</Link>
        <Link href="/youtube"
          className="hover:text-primary">YouTube</Link>
        <Link href="/contact"
          className="hover:text-primary">Contact</Link>
      </div>
    </aside>
  );
}

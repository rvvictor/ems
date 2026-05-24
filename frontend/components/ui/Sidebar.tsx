import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Sparkles, Home } from "lucide-react";

const nav = [
  { href: "/home", label: "Intake", icon: Sparkles },
  { href: "/expediente", label: "Dossier", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex min-h-screen w-60 flex-col gap-2 bg-dark p-4 text-cream">
      <Link href="/" className="mb-6 flex items-center gap-3 px-2 text-lg font-semibold">
        <img src="/logo.jpeg" alt="EMS" className="h-8 w-8 rounded-lg object-cover" />
        EMS
      </Link>
      {nav.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
            ${pathname === href ? "bg-primary text-cream" : "text-cream/60 hover:bg-primary/30 hover:text-cream/90"}`}
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </aside>
  );
}

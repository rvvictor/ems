import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Sparkles } from "lucide-react";

const nav = [
  { href: "/home", label: "Intake", icon: Sparkles },
  { href: "/expediente", label: "Dossier", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 min-h-screen bg-emerald-950 text-white flex flex-col p-4 gap-2">
      <div className="text-lg font-bold mb-6 px-2">SGA</div>
      {nav.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${pathname === href ? "bg-emerald-700" : "hover:bg-emerald-800"}`}
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </aside>
  );
}

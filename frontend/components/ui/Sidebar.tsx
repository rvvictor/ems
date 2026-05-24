import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, Bell, FileText, Map } from "lucide-react";

const nav = [
  { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/indicadores",  label: "Indicadores",  icon: Activity },
  { href: "/alertas",      label: "Alertas",      icon: Bell },
  { href: "/reportes",     label: "Reportes",     icon: FileText },
  { href: "/mapa",         label: "Mapa",         icon: Map },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 min-h-screen bg-green-900 text-white flex flex-col p-4 gap-2">
      <div className="text-lg font-bold mb-6 px-2">🌿 SGA</div>
      {nav.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${pathname === href ? "bg-green-700" : "hover:bg-green-800"}`}
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </aside>
  );
}

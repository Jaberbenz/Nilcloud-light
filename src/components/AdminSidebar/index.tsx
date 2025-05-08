import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside>
      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/users">Utilisateurs</Link>
      <Link href="/admin/projects">Projets</Link>
    </aside>
  );
}

import Link from "next/link";

export function AdminFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row sm:px-6">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Unpeu Admin. Tous droits réservés.
        </p>
        <div className="flex gap-4 text-sm">
          <Link
            href="/help"
            className="text-gray-500 transition hover:text-orange-500"
          >
            Aide
          </Link>
          <Link
            href="/legal"
            className="text-gray-500 transition hover:text-orange-500"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}

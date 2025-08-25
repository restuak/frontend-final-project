import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A7F64] text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">RESTIFY</h3>
          <p className="text-sm">
            Compare and book the best stays for your perfect trip with ease and
            confidence.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">About</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                Company
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/press" className="hover:underline">
                Press
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Connect</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:underline">
                Facebook
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Twitter
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 text-center py-4 text-sm">
        © {new Date().getFullYear()} RESTIFY. All rights reserved.
      </div>
    </footer>
  );
}

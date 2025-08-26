import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter  } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="w-full bg-[#25171A] border-t border-[#ffffff] mt-0 relative"
      style={{
        borderTopLeftRadius: "30% 15%",
        borderTopRightRadius: "30% 15%",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6 flex flex-col items-center text-sm text-white">
        {/* Logo & tagline */}
        <div className="flex flex-col items-center text-center mb-10">
          <Image
            src="/restify_logo2.png"
            alt="Restify Logo"
            width={100}
            height={100}
            className="mb-3"
          />
          <p className="max-w-xs">
            Find and book your perfect stay at the best price.
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-center md:text-left">
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#">About Us</Link>
              </li>
              <li>
                <Link href="#">Careers</Link>
              </li>
              <li>
                <Link href="#">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#">Help Center</Link>
              </li>
              <li>
                <Link href="#">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <Link href="#">
                <FaFacebookF className="text-lg hover:text-gray-300" />
              </Link>
              <Link href="#">
                <FaInstagram className="text-lg hover:text-gray-300" />
              </Link>
              <Link href="#">
                <FaTwitter className="text-lg hover:text-gray-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center py-6 border-t border-[#ffffff] mt-8 w-full text-xs">
          © {new Date().getFullYear()} Restify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

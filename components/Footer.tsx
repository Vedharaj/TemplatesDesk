import Logo from "./Logo";
import { Youtube, Linkedin, Twitter } from "lucide-react";
import { CategoryList, StyleList, ColorList } from "@/app/store/storeData";
import Link from "next/link";

interface FooterGroup {
  title: string;
  routePrefix: string;
  links: string[];
}

const footerData: FooterGroup[] = [
  {
    title: "Categories",
    routePrefix: "/categories",
    links: CategoryList.slice(0, 10)
  },
  {
    title: "Colors",
    routePrefix: "/colors",
    links: ColorList.slice(0, 10)
  },
  {
    title: "Style",
    routePrefix: "/styles",
    links: StyleList.slice(0, 10)
  }
];

const Footer = () => {
  return (
    <footer className="w-full mt-4 border-t border-gray-100 bg-gray-100 px-6 py-12 md:px-12">
      <div className="mx-auto flex gap-10 md:flex-row justify-around">
        <div>
          <Logo />

          <div className="mt-4 flex gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <Youtube className="h-6 w-6" />
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>
        {footerData.map((group) => (
          <div key={group.title} className="flex flex-col space-y-4">
            <h3 className="font-medium text-primary text-sm tracking-wide">
              {group.title}
            </h3>
            <ul className="flex flex-col space-y-3">
              {group.links.map((link) => (
                <li key={link}>
                  <Link
                    href={`${group.routePrefix}/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-700 hover:text-primary hover:font-medium transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li> 
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Optional: Bottom Copyright bar */}
      <div className="mx-auto mt-10 max-w-7xl border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
        Copyright {new Date().getFullYear()} TemplatesDesk. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
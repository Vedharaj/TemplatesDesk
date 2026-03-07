import Logo from "./Logo";
import { ChevronDown, Heart, Menu } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="flex select-none items-center justify-between border-b-2 border-gray-200 bg-white px-4 py-3 shadow">
            <Logo />

            <div className="hidden items-center gap-4 text-black md:flex">
                <div className="cursor-pointer transition-colors hover:text-primary">
                    <span>Categories</span>
                    <ChevronDown size={16} className="ml-1 inline-block" />
                </div>
                <div className="cursor-pointer transition-colors hover:text-primary">
                    <span>Style</span>
                    <ChevronDown size={16} className="ml-1 inline-block" />
                </div>
                <div className="cursor-pointer transition-colors hover:text-primary">
                    <span>Color</span>
                    <ChevronDown size={16} className="ml-1 inline-block" />
                </div>
                <Heart size={32} className="cursor-pointer transition-colors hover:text-primary" />
                <div className="flex h-10 w-[274px] min-w-[120px] flex-none flex-row items-center gap-2 border border-primary bg-white px-4 py-3">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full border-none bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 text-black md:hidden">
                <div className="flex h-10 w-[120px] min-w-[80px] flex-none flex-row items-center gap-2 border border-primary bg-white px-4 py-3">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full border-none bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
                    />
                </div>
                <Heart size={24} className="cursor-pointer transition-colors hover:text-primary" />
                <button
                    type="button"
                    aria-label="Open menu"
                    className="cursor-pointer transition-colors hover:text-primary"
                >
                    <Menu size={26} />
                </button>
            </div>
        </nav>
    );
}
"use client";

import { useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { ChevronDown, Heart, Menu, Search } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Sheet, SheetTitle, SheetTrigger, SheetContent } from "@/components/ui/sheet";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export default function Navbar({data}:{data:{categories:string[], colors:string[], styles:string[]}}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toRoute = (basePath: string, value: string) =>
    `${basePath}/${value.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <nav className="flex select-none items-center justify-between border-b-2 border-gray-200 bg-white px-4 py-3 shadow">
      <Link href="/">
        <Logo />
      </Link>
      <div className="hidden items-center gap-4 md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {/* Categories Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="cursor-pointer hover:text-primary !bg-transparent hover:!bg-transparent focus:!bg-transparent">
                Categories
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="w-[200px] p-4 space-y-2">
                  {
                    data.categories.map((category) => (
                      <li key={category}>
                        <Link href={toRoute("/categories", category)} className="cursor-pointer hover:text-primary capitalize">
                          {category}
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Style Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="cursor-pointer hover:text-primary !bg-transparent hover:!bg-transparent focus:!bg-transparent">
                Style
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="w-[200px] p-4 space-y-2">
                  {
                    data.styles.map((style) => (
                      <li key={style}>
                        <Link href={toRoute("/styles", style)} className="cursor-pointer hover:text-primary capitalize">
                          {style}
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Color Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="cursor-pointer hover:text-primary !bg-transparent hover:!bg-transparent focus:!bg-transparent">
                Color
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="w-[200px] p-4 space-y-2">
                  {
                    data.colors.map((color) => (
                      <li key={color}>
                        <Link href={toRoute("/colors", color)} className="cursor-pointer hover:text-primary capitalize">
                          {color}
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Wishlist */}
        <Heart
          size={32}
          className="cursor-pointer transition-colors hover:text-primary"
        />

        {/* Search Box */}
        <div className="relative w-[274px] min-w-[200px]">
          <div className="border border-primary rounded-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search templates..."
              onFocus={() => setIsMenuOpen(true)}
              onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)}
              className="h-10 border-none shadow-none focus:outline-none w-full rounded-md pl-10 pr-4 text-sm"
            />
            {isMenuOpen && (
              <div className="absolute top-10 z-50 w-full bg-white border border-gray-200 shadow-md">
                <ul className="p-2">
                  <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                    Template 1
                  </li>
                  <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                    Template 2
                  </li>
                  <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                    Template 3
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-black md:hidden ">
        <div className="border border-primary rounded-md relative w-[120px] w-min-[100px]">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search templates..."
            onFocus={() => setIsMenuOpen(true)}
            onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)}
            className="h-10 border-none shadow-none focus:outline-none w-full rounded-md pl-10 pr-2 text-sm"
          />
          {isMenuOpen && (
            <div className="absolute top-10 z-50 w-full bg-white border border-gray-200 shadow-md">
              <ul className="p-2">
                <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                  Template 1
                </li>
                <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                  Template 2
                </li>
                <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                  Template 3
                </li>
              </ul>
            </div>
          )}
        </div>
        <Heart
          size={24}
          className="cursor-pointer transition-colors hover:text-primary"
        />
        <Sheet>
        <SheetTrigger asChild>
          <button className="cursor-pointer transition-colors hover:text-primary">
            <Menu size={26} />
          </button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col gap-4 mt-6 pl-8">
          <SheetTitle className="text-lg font-semibold">
            Menu
          </SheetTitle>
            {/* Categories */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between cursor-pointer hover:text-primary">
                Categories
                <ChevronDown size={16} />
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2 flex flex-col gap-2 pl-4 text-sm">
                {data.categories.map((category) => (
                  <Link key={category} href={toRoute("/categories", category)} className="cursor-pointer hover:text-primary capitalize">
                    {category}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Style */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between cursor-pointer hover:text-primary">
                Style
                <ChevronDown size={16} />
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2 flex flex-col gap-2 pl-4 text-sm">
                {data.styles.map((style) => (
                  <Link key={style} href={toRoute("/styles", style)} className="cursor-pointer hover:text-primary capitalize">
                    {style}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Color */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between cursor-pointer hover:text-primary">
                Color
                <ChevronDown size={16} />
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2 flex flex-col gap-2 pl-4 text-sm">
                {data.colors.map((color) => (
                  <Link key={color} href={toRoute("/colors", color)} className="cursor-pointer hover:text-primary capitalize">
                    {color}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

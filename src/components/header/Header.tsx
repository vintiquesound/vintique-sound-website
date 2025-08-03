"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ThemeSwitcherButton from "./ThemeSwitcherButton";
import ColorSwitcherButton from "./ColorSwitcherButton";
import HeaderSidebar from "./HeaderSidebar";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 p-2 bg-jet-black text-white border-b-1 border-b-neutral-700">
      <div className="flex max-w-[1080px] mx-auto items-center justify-evenly">
        {/* Logo */}
        <nav className="flex flex-shrink-0 pr-3 pl-3">
          <Link href="/">
            <Image
              className="w-24 h-10 hover:opacity-80"
              src="/images/logo/vintique_sound-logo_name_only(635x256).png"
              alt="Vintique Sound Logo (name only)"
              width={127}
              height={51}
            />
          </Link>
        </nav>
        {/* Desktop Nav */}
        <nav className="hidden lg:flex text-nowrap pr-3 pl-3">
          <div className="relative group gap-6 pr-3 pl-3">
            <button className="font-bold cursor-pointer">Services</button>
            <div className="absolute left-0 hidden group-hover:block pr-3 pl-3 bg-jet-black">
              <Link href="/mixing-and-mastering"
                className="block py-3 hover:text-primary">Mixing & Mastering</Link>
              <Link href="/education"
                className="block py-1 hover:text-primary">Education</Link>
            </div>
          </div>
          <div className="relative group gap-6 pr-3 pl-3">
            <button className="font-bold cursor-pointer">Products</button>
            <div className="absolute left-0 hidden group-hover:block pr-3 pl-3 bg-jet-black">
              <Link href="/plugins"
                className="block py-3 hover:text-primary">Plugins</Link>
              <Link href="/audio-tools"
                className="block py-1 hover:text-primary">Audio Tools</Link>
              <Link href="/samples-and-loops"
                className="block py-3 hover:text-primary">Samples & Loops</Link>
            </div>
          </div>
          <div className="flex gap-7 pr-3 pl-3">
            <Link href="/studio"
              className="hover:text-primary">Studio</Link>
            <Link href="/blog"
              className="hover:text-primary">Blog</Link>
            <Link href="/music"
              className="hover:text-primary">Music</Link>
            <Link href="/youtube"
              className="hover:text-primary">YouTube</Link>
            <Link href="/about"
              className="hover:text-primary">About</Link>
            <Link href="/contact"
              className="hover:text-primary">Contact</Link>
          </div>
        </nav>
        <div className="flex flex-row">
          <div>
            <ThemeSwitcherButton />
          </div>
          <div>
            <ColorSwitcherButton />
          </div>
        </div>
        {/* Hamburger Menu*/}
        <button
          className="flex lg:hidden items-center"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <nav id="hamburger-menu">
            <Image
              className="hamburger-menu-icon cursor-pointer hover:opacity-80"
              src="/images/icons/hamburger-menu-icon-white.jpg"
              alt="Hamburger Menu Icon"
              width={40}
              height={40}
            />
          </nav>
        </button>
      </div>
      <HeaderSidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
    </header>
  )
}

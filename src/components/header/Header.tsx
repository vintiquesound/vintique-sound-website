"use client";

import Image from "next/image";
import Link from "next/link";
import ThemeSwitcherButton from "./ThemeSwitcherButton";
import ColorSwitcherButton from "./ColorSwitcherButton";

export default function Header() {
  return (
    <header className="flex items-center justify-evenly p-2 bg-background text-foreground">
      <nav className="">
        <Link href="/">
          <Image
            className="h-10 w-auto"
            src="/images/logo/vintique_sound-logo_name_only(635x256).png"
            alt="Vintique Sound Logo (name only)"
            width={127}
            height={51}
          />
        </Link>
      </nav>
      <nav id="hamburger-menu">
        <Image
          className="hamburger-menu-icon"
          src="/images/icons/hamburger-menu-icon-white.jpg"
          alt="Hamburger Menu Icon"
          width={40}
          height={40}
        />
      </nav>
      <nav className="flex gap-6 text-nowrap">
        <Link href="/mixing-and-mastering"
          className="hover:text-primary">Mixing & Mastering</Link>
        <Link href="/education"
          className="hover:text-primary">Education</Link>
        <Link href="/plugins"
          className="hover:text-primary">Plugins</Link>
        <Link href="/audio-tools"
          className="hover:text-primary">Audio Tools</Link>
        <Link href="/samples-and-loops"
          className="hover:text-primary">Samples & Loops</Link>
        <Link href="/music"
          className="hover:text-primary">Music</Link>
        <Link href="/studio"
          className="hover:text-primary">Studio</Link>
        <Link href="/youtube"
          className="hover:text-primary">Youtube</Link>
        <Link href="/blog"
          className="hover:text-primary">Blog</Link>
        <Link href="/about"
          className="hover:text-primary">About</Link>
        <Link href="/contact"
          className="hover:text-primary">Contact</Link>
      </nav>
      <div className="flex flex-row">
        <div>
          <ThemeSwitcherButton />
        </div>
        <div>
          <ColorSwitcherButton />
        </div>
      </div>
    </header>
  )
}

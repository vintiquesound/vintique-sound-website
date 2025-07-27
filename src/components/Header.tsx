"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header>
      <nav id="header-home-button">
        <a href="page.tsx">
          <Image
            className="header-logo"
            src="/images/logo/vintique_sound-logo_name_only(635x256).png"
            alt="Vintique Sound Logo (name only)"
            width={127}
            height={51}
          />
        </a>
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
      <nav id="menu-items">
        <a href="/mixing-and-mastering/page.tsx">MIXING & MASTERING</a>
        <a href="pages/education.html">EDUCATION</a>
        <a href="pages/plugins.html">PLUGINS</a>
        <a href="pages/audio-tools.html">AUDIO TOOLS</a>
        <a href="pages/samples-and-loops.html">SAMPLES & LOOPS</a>
        <a href="pages/music.html">MUSIC</a>
        <a href="pages/studio.html">STUDIO</a>
        <a href="pages/youtube.html">YOUTUBE</a>
        <a href="pages/blog.html">BLOG</a>
        <a href="pages/about.html">ABOUT</a>
        <a href="pages/contact.html">CONTACT</a>
      </nav>
      <button id="theme-toggle" aria-label="Toggle theme">🌙</button>
    </header>
  )
}

"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center mt-8 pt-2 pb-2 bg-jet-black text-white">
      <nav className="flex gap-1.5 p-1">
        <a href="https://www.youtube.com/c/vintiquesound" target="_blank">
          <Image
            className="hover:invert"
            src="/images/icons/socials/socials-icon-youtube.png"
            alt="YouTube Icon"
            width={30}
            height={30}
          />
        </a>
        <a href="https://www.soundcloud.com/vintiquesound" target="_blank">
          <Image
            className="hover:invert"
            src="/images/icons/socials/socials-icon-soundcloud.png"
            alt="Soundcloud Icon"
            width={30}
            height={30}
          />
        </a>
        <a href="https://www.facebook.com/vintiquesound" target="_blank">
          <Image
            className="hover:invert"
            src="/images/icons/socials/socials-icon-facebook.png"
            alt="Facebook Icon"
            width={30}
            height={30}
          />
        </a>
        <a href="https://www.instagram.com/vintiquesound" target="_blank">
          <Image
            className="hover:invert"
            src="/images/icons/socials/socials-icon-instagram.png"
            alt="Instagram Icon"
            width={30}
            height={30}
          />
        </a>
        <a href="https://www.linkedin.com/in/kevinulliac" target="_blank">
          <Image
            className="hover:invert"
            src="/images/icons/socials/socials-icon-linkedin.png"
            alt="LinkedIn Icon"
            width={30}
            height={30}
          />
        </a>
      </nav>
      <p>
        Made with ❤️ by Kevin Ulliac
      </p>
      <p>
        Vintique Sound &copy; 2011 - 2025. All rights reserved.
      </p>
    </footer>
  )
}

"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <nav id="footer-socials">
        <a href="https://www.youtube.com/c/vintiquesound" target="_blank">
          <Image
            className="socials-icon-youtube"
            src="/images/icons/socials/socials-icon-youtube.png"
            alt="YouTube Icon"
            width={30}
            height={30}
          />
        </a>
        <a href="https://soundcloud.com/vintiquesound" target="_blank">
          <Image
            className="socials-icon-soundcloud"
            src="/images/icons/socials/socials-icon-soundcloud.png"
            alt="Soundcloud Icon"
            width={30}
            height={30}
          />
        </a>
        <a href="https://www.facebook.com/vintiquesound" target="_blank">
          <Image
            className="socials-icon-facebook"
            src="/images/icons/socials/socials-icon-facebook.png"
            alt="Facebook Icon"
            width={30}
            height={30}
          />
        </a>
        <a href="https://www.instagram.com/vintiquesound" target="_blank">
          <Image
            className="socials-icon-instagram"
            src="/images/icons/socials/socials-icon-instagram.png"
            alt="Instagram Icon"
            width={30}
            height={30}
          />
        </a>
        <a href="https://www.linkedin.com/in/kevinulliac" target="_blank">
          <Image
            className="socials-icon-linkedin"
            src="/images/icons/socials/socials-icon-linkedin.png"
            alt="LinkedIn Icon"
            width={30}
            height={30}
          />
        </a>
      </nav>
      <p id="footer-credits">
        Made with ❤️ by Kevin Ulliac
      </p>
      <p id="footer-copyright">
        Vintique Sound &copy; 2011 - 2025. All rights reserved.
      </p>
    </footer>
  )
}

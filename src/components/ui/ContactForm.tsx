"use client";

// import React from "react";

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = "" }: ContactFormProps) {
  return (
    <div className={`${className}`}>
      Contact Form goes here
    </div>
  )
}

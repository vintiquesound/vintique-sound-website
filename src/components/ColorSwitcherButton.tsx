"use client";

import React from "react";

const colorRoles = ["--color-primary", "--color-secondary", "--color-accent"];

export default function ColorSwitcherButton() {
  const handleRotate = () => {
    const root = document.documentElement;
    const currentColors = colorRoles.map(role =>
      getComputedStyle(root).getPropertyValue(role)
    );
    // Rotate array: accent → primary, primary → secondary, secondary → accent
    const rotated = [currentColors[2], currentColors[0], currentColors[1]];
    colorRoles.forEach((role, i) => root.style.setProperty(role, rotated[i]));
  };

  return (
    <button type="button" onClick={handleRotate}
        style={{ padding: "0.5rem 1rem", borderRadius: "0.25rem",
        background: "var(--color-primary)", color: "var(--foreground)",
        border: "none", cursor: "pointer" }}>
      Rotate Colors
    </button>
  );
}

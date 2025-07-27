"use client";

import React from "react";

const colorRoles = ["--color-primary", "--color-secondary", "--color-accent"];

export default function ColorSwitcherButton() {
  const handleRotate = () => {
    const root = document.documentElement;
    const currentColors = colorRoles.map(role =>
      getComputedStyle(root).getPropertyValue(role)
    );
    // Rotate array: secondary → primary, accent → secondary, primary → accent
    const rotated = [currentColors[1], currentColors[2], currentColors[0]];
    colorRoles.forEach((role, i) => root.style.setProperty(role, rotated[i]));
  };

  return (
    <button type="button" onClick={handleRotate}
        className="pt-1 pr-2 pb-1 pl-2 rounded-sm border-2 text-nowrap
        border-secondary bg-primary text-accent
          cursor-pointer hover:border-accent">
      Rotate Colors
    </button>
  );
}

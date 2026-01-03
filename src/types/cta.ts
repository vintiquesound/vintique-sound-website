import type { ButtonSize, ButtonVariant } from "@/components/ui/button";
import type React from "react";

export type CtaIcon = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { className?: string }
>;

export type CtaButton = {
  label: string;
  href: string;

  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;

  icon?: CtaIcon;
  iconPosition?: "left" | "right";
  iconClassName?: string;

  bgColor?: string;
  hoverBgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;

  borderMode?: "none" | "hover" | "always";
  borderNone?: boolean;
  borderHover?: boolean;
  borderAlways?: boolean;

  hoverScale?: boolean;
  pointerCursor?: boolean;

  className?: string;
};


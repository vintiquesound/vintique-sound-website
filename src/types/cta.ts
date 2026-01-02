import type { ButtonVariant } from "@/components/ui/button";
import type React from "react";

export type CtaIcon = React.ComponentType<{ className?: string }>;

export type CtaButton = {
	label: string;
	href: string;
	variant?: ButtonVariant;
	icon?: CtaIcon;
	iconPosition?: "left" | "right";
};

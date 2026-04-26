import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

const variants = {
  primary: "bg-cocoa text-white hover:bg-berry",
  accent: "bg-honey text-cocoa hover:bg-caramel hover:text-white",
  ghost: "border border-cocoa/15 bg-white/70 text-cocoa hover:bg-white"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={clsx("focus-ring inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition", variants[variant], className)} {...props} />;
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: keyof typeof variants;
};

export function LinkButton({ className, variant = "primary", href, ...props }: LinkButtonProps) {
  return <Link href={href} className={clsx("focus-ring inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition", variants[variant], className)} {...props} />;
}


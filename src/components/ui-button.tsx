import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function UIButton({ variant = "primary", className = "", ...props }: Props) {
  const css = variant === "primary" ? "ui-button" : `ui-button ${variant}`;
  return <button className={`${css} ${className}`.trim()} {...props} />;
}

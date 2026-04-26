import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function UIInput({ label, id, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} {...props} />
    </>
  );
}

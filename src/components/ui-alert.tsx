export function UIAlert({ message, variant = "error" }: { message: string; variant?: "error" | "success" | "info" }) {
  if (!message) return null;
  return <p className={`form-message ${variant}`}>{message}</p>;
}

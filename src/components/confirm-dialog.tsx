import { UIButton } from "./ui-button";

type Props = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title, description, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="card modal-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="actions">
          <UIButton variant="danger" onClick={onConfirm}>
            Sí, eliminar
          </UIButton>
          <UIButton variant="secondary" onClick={onCancel}>
            Cancelar
          </UIButton>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import type { FormEvent } from "react";
import type { VisitRecord, VisitRecordPayload } from "../types/visit-record";
import { visitRecordService } from "../services/visit-record.service";
import { visitRecordSchema } from "../utils/validation";
import { getErrorMessage } from "../utils/error-message";
import { UIButton } from "./ui-button";
import { UIInput } from "./ui-input";
import { UIAlert } from "./ui-alert";

type Props = {
  initialValue?: VisitRecord;
  onSubmit: (payload: VisitRecordPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

const defaultForm: VisitRecordPayload = {
  identificationNumber: "",
  firstName: "",
  middleName: "",
  firstLastName: "",
  secondLastName: "",
  fullName: "",
  visitReason: "",
};

export function VisitRecordForm({ initialValue, onSubmit, onCancel, isSubmitting = false }: Props) {
  const [form, setForm] = useState<VisitRecordPayload>(
    initialValue
      ? {
          identificationNumber: initialValue.identificationNumber,
          firstName: initialValue.firstName,
          middleName: initialValue.middleName ?? "",
          firstLastName: initialValue.firstLastName,
          secondLastName: initialValue.secondLastName ?? "",
          fullName: initialValue.fullName ?? "",
          visitReason: initialValue.visitReason,
        }
      : defaultForm,
  );
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState<"error" | "success" | "info">("info");
  const [loadingLookup, setLoadingLookup] = useState(false);

  const handleLookup = async () => {
    if (!form.identificationNumber.trim()) {
      setMessage("El número de identificación es obligatorio.");
      setMessageVariant("error");
      return;
    }

    setLoadingLookup(true);
    setMessage("Buscando información...");
    setMessageVariant("info");
    try {
      const response = await visitRecordService.lookup(form.identificationNumber.trim());
      const data = response.data;
      setForm((prev) => ({
        ...prev,
        firstName: data.firstName ?? prev.firstName,
        middleName: data.middleName ?? prev.middleName,
        firstLastName: data.firstLastName ?? prev.firstLastName,
        secondLastName: data.secondLastName ?? prev.secondLastName,
        fullName: data.fullName ?? prev.fullName,
      }));
      setMessage("Persona encontrada correctamente.");
      setMessageVariant("success");
    } catch (error) {
      setMessage(
        getErrorMessage(
          error,
          "No se encontró información para esta identificación. Debe ingresar el nombre manualmente.",
        ),
      );
      setMessageVariant("error");
    } finally {
      setLoadingLookup(false);
    }
  };

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedPayload = {
      ...form,
      identificationNumber: form.identificationNumber.trim(),
      firstName: form.firstName.trim(),
      firstLastName: form.firstLastName.trim(),
      visitReason: form.visitReason.trim(),
    };
    const parsed = visitRecordSchema.safeParse(normalizedPayload);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Debe completar los campos requeridos.");
      setMessageVariant("error");
      return;
    }

    setMessage("");
    setMessageVariant("info");
    await onSubmit(parsed.data);
  };

  return (
    <form onSubmit={submitForm} className="card form-grid">
      <h3>{initialValue ? "Editar visita" : "Nueva visita"}</h3>

      <div className="inline-group">
        <UIInput
          label="Número de identificación"
          value={form.identificationNumber}
          onChange={(event) => setForm({ ...form, identificationNumber: event.target.value })}
          placeholder="Número de identificación"
        />
        <UIButton type="button" variant="secondary" onClick={handleLookup} disabled={loadingLookup || isSubmitting}>
          {loadingLookup ? "Buscando información..." : "Buscar identificación"}
        </UIButton>
      </div>

      <UIInput
        label="Primer nombre"
        placeholder="Ingrese el primer nombre"
        value={form.firstName}
        onChange={(event) => setForm({ ...form, firstName: event.target.value })}
      />
      <UIInput
        label="Segundo nombre"
        placeholder="Ingrese el segundo nombre"
        value={form.middleName}
        onChange={(event) => setForm({ ...form, middleName: event.target.value })}
      />
      <UIInput
        label="Primer apellido"
        placeholder="Ingrese el primer apellido"
        value={form.firstLastName}
        onChange={(event) => setForm({ ...form, firstLastName: event.target.value })}
      />
      <UIInput
        label="Segundo apellido"
        placeholder="Ingrese el segundo apellido"
        value={form.secondLastName}
        onChange={(event) => setForm({ ...form, secondLastName: event.target.value })}
      />

      <label>Motivo de la visita</label>
      <textarea
        placeholder="Describa el motivo de la visita"
        value={form.visitReason}
        onChange={(event) => setForm({ ...form, visitReason: event.target.value })}
      />

      <UIAlert message={message} variant={messageVariant} />

      <div className="actions">
        <UIButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : initialValue ? "Actualizar registro" : "Guardar registro"}
        </UIButton>
        <UIButton type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </UIButton>
      </div>
    </form>
  );
}

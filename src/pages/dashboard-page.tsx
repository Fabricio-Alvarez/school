import { useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import type { VisitRecord } from "../types/visit-record";
import { visitRecordService } from "../services/visit-record.service";
import { VisitRecordForm } from "../components/visit-record-form";
import { UIButton } from "../components/ui-button";
import { UIAlert } from "../components/ui-alert";
import { ConfirmDialog } from "../components/confirm-dialog";
import { getErrorMessage } from "../utils/error-message";

export function DashboardPage() {
  const { logout } = useAuth();
  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState<"error" | "success" | "info">("info");
  const [editing, setEditing] = useState<VisitRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<VisitRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await visitRecordService.list(order);
      setRecords(data);
    } catch (error) {
      setMessage(getErrorMessage(error, "Ocurrió un error. Intente nuevamente."));
      setMessageVariant("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRecords();
  }, [order]);

  useEffect(() => {
    if (!message) return;
    const timeoutId = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <h1>Registro de Visitas Escolares</h1>
        <UIButton
          variant="secondary"
          onClick={() => {
            logout();
            setMessage("Sesión cerrada correctamente.");
            setMessageVariant("success");
          }}
        >
          Cerrar sesión
        </UIButton>
      </header>

      <section className="card">
        <div className="toolbar">
          <h2>Listado de visitas</h2>
          <div className="inline-group">
            <UIButton onClick={() => setShowForm(true)}>Registrar nueva visita</UIButton>
            <UIButton variant="secondary" onClick={() => visitRecordService.exportExcel(order)}>
              Exportar a Excel
            </UIButton>
            <UIButton variant="secondary" onClick={() => visitRecordService.exportPdf(order)}>
              Exportar a PDF
            </UIButton>
            <select value={order} onChange={(event) => setOrder(event.target.value as "asc" | "desc")}>
              <option value="desc">Más recientes primero</option>
              <option value="asc">Más antiguos primero</option>
            </select>
          </div>
        </div>

        {showForm ? (
          <VisitRecordForm
            initialValue={editing ?? undefined}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
            onSubmit={async (payload) => {
              try {
                setIsSubmitting(true);
                if (editing) {
                  await visitRecordService.update(editing.id, payload);
                  setMessage("Registro actualizado correctamente.");
                  setMessageVariant("success");
                } else {
                  await visitRecordService.create(payload);
                  setMessage("Registro guardado correctamente.");
                  setMessageVariant("success");
                }
                setEditing(null);
                setShowForm(false);
                await loadRecords();
              } catch (error) {
                setMessage(
                  getErrorMessage(
                    error,
                    editing ? "No se pudo actualizar el registro." : "Ocurrió un error. Intente nuevamente.",
                  ),
                );
                setMessageVariant("error");
              } finally {
                setIsSubmitting(false);
              }
            }}
            isSubmitting={isSubmitting}
          />
        ) : null}

        <UIAlert message={message} variant={messageVariant} />

        {loading ? (
          <p className="empty-state">Cargando registros...</p>
        ) : records.length === 0 ? (
          <p className="empty-state">No hay registros disponibles.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Número de identificación</th>
                  <th>Primer nombre</th>
                  <th>Segundo nombre</th>
                  <th>Primer apellido</th>
                  <th>Segundo apellido</th>
                  <th>Motivo de la visita</th>
                  <th>Fecha y hora de ingreso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.identificationNumber}</td>
                    <td>{record.firstName}</td>
                    <td>{record.middleName || "-"}</td>
                    <td>{record.firstLastName}</td>
                    <td>{record.secondLastName || "-"}</td>
                    <td>{record.visitReason}</td>
                    <td>{new Date(record.entryDateTime).toLocaleString("es-CR")}</td>
                    <td>
                      <div className="inline-group">
                        <UIButton
                          variant="secondary"
                          onClick={() => {
                            setEditing(record);
                            setShowForm(true);
                          }}
                        >
                          Editar
                        </UIButton>
                        <UIButton variant="danger" onClick={() => setRecordToDelete(record)}>
                          Eliminar
                        </UIButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(recordToDelete)}
        title="Eliminar registro"
        description="¿Está seguro de que desea eliminar este registro de visita? Esta acción no se puede deshacer."
        onCancel={() => setRecordToDelete(null)}
        onConfirm={async () => {
          if (!recordToDelete) return;
          try {
            await visitRecordService.remove(recordToDelete.id);
            setMessage("Registro eliminado correctamente.");
            setMessageVariant("success");
            setRecordToDelete(null);
            await loadRecords();
          } catch (error) {
            setMessage(getErrorMessage(error, "No se pudo eliminar el registro."));
            setMessageVariant("error");
          }
        }}
      />
    </div>
  );
}

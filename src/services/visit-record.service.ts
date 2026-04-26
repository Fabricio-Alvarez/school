import { saveAs } from "file-saver";
import { http } from "../api/http";
import type { LookupPersonResponse, VisitRecord, VisitRecordPayload } from "../types/visit-record";

export const visitRecordService = {
  async list(order: "asc" | "desc") {
    const { data } = await http.get<VisitRecord[]>("/visit-records", { params: { order } });
    return data;
  },
  async create(payload: VisitRecordPayload) {
    const { data } = await http.post("/visit-records", payload);
    return data;
  },
  async update(id: string, payload: VisitRecordPayload) {
    const { data } = await http.put(`/visit-records/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    const { data } = await http.delete(`/visit-records/${id}`);
    return data;
  },
  async lookup(identificationNumber: string) {
    const { data } = await http.get<LookupPersonResponse>(`/people/lookup/${identificationNumber}`);
    return data;
  },
  async exportExcel(order: "asc" | "desc") {
    const { data } = await http.get("/visit-records/export/excel", {
      params: { order },
      responseType: "blob",
    });
    saveAs(data, "informe-visitas.xlsx");
  },
  async exportPdf(order: "asc" | "desc") {
    const { data } = await http.get("/visit-records/export/pdf", {
      params: { order },
      responseType: "blob",
    });
    saveAs(data, "informe-visitas.pdf");
  },
};

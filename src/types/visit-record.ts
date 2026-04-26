export type VisitRecord = {
  id: string;
  identificationNumber: string;
  firstName: string;
  middleName?: string;
  firstLastName: string;
  secondLastName?: string;
  fullName?: string;
  visitReason: string;
  entryDateTime: string;
  createdAt: string;
  updatedAt: string;
};

export type VisitRecordPayload = {
  identificationNumber: string;
  firstName: string;
  middleName?: string;
  firstLastName: string;
  secondLastName?: string;
  fullName?: string;
  visitReason: string;
};

export type LookupPersonResponse = {
  message: string;
  data: {
    found: boolean;
    firstName?: string;
    middleName?: string;
    firstLastName?: string;
    secondLastName?: string;
    fullName?: string;
  };
};

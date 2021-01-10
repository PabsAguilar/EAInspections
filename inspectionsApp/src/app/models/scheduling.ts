import { IStorageModel } from "../interfaces/Istorage-model";

export class Scheduling implements IStorageModel {
  id: number;
  fistName: string;
  lastName: string;
  serviceAddress: string;
  contactPhone: string;
  contactEmail: string;
  insuranceCompany: string;
  notes: string;
  openClaims: boolean;
  inspectorName: string;
  inspectorUserId: number;
  serviceType: string;
  scheduleDateTime: Date;
}

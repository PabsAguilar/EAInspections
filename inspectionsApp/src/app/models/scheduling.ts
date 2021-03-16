import { IStorageModel } from "../interfaces/Istorage-model";
import { Company } from "./company";
import { Contact } from "./contact";
import { SyncInfo } from "./sync-info";

export class Scheduling implements IStorageModel {
  id: number;
  contact: Contact;
  serviceAddress: string;
  insuranceCompanyContact: Contact;
  insuranceCompany: Company;
  notes: string;
  openClaims: boolean;
  inspectorName: string;
  inspectorUserId: number;
  serviceType: string;
  scheduleDateTime: any;
  scheduleDateString: string;
  typeOfLoss: string;
  dateOfLoss: Date;
  referalPartner: Contact;
  referalPartnerCompany: Company;
  inspectionTypes: string[];
  inspectionInstructions: string;

  internalStatus: string;
  syncInfo: SyncInfo;
  constructor() {
    this.syncInfo = new SyncInfo();
    this.contact = new Contact();
  }
}

import { IStorageModel } from "../interfaces/Istorage-model";
import { Contact } from "./contact";

export class Scheduling implements IStorageModel {
  id: number;
  contact: Contact;
  newContact: Contact;
  insuranceCompany: string;
  notes: string;
  openClaims: boolean;
  inspectorName: string;
  inspectorUserId: number;
  serviceType: string;
  scheduleDateTime: Date;
  internalStatus: string;
  constructor() {
    this.contact = new Contact();
    this.newContact = new Contact();
  }
}

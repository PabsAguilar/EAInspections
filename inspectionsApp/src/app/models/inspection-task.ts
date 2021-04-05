import { stringify } from "@angular/compiler/src/util";
import { IStorageModel } from "../interfaces/Istorage-model";
import { Agreements } from "./agreements";
import { Company } from "./company";
import { Area } from "./comprehensive-form/area";
import { ComprehensiveForm } from "./comprehensive-form/comprehensive-form";
import { GeneralInfoInspection } from "./comprehensive-form/general-info-inspection";
import { Contact } from "./contact";
import { EnvironmentalForm } from "./environmental-form";
import { SyncInfo } from "./sync-info";
import { TaskSubtype } from "./task-subtype";

export class InspectionTask implements IStorageModel {
  id: number;
  title: string;
  scheduleDateTime: Date;
  scheduleDay: Date;
  contactName: string;
  contactId: number;
  serviceAddress: string;
  geoPointText: string;
  phone: string;
  email: string;
  referalPartnerContact: Contact;
  referalPartnerCompany: Company;
  inspectorName: string;
  inspectorUserId: number;
  inspectionType: string;
  inspectionSubTypes: TaskSubtype[];
  inspectionSubTypesString: string;
  inspectionsInstructions: string;
  internalStatus: string;
  comprehesiveForm: ComprehensiveForm;
  environmentalForm: EnvironmentalForm;
  iTestAgreements: Agreements;
  expertNetworkAgreements: Agreements;
  bitrixFolder: BitrixFolder;
  constructor() {
    this.iTestAgreements = new Agreements();
    this.expertNetworkAgreements = new Agreements();
    this.bitrixFolder = new BitrixFolder();
    this.referalPartnerContact = new Contact();
    this.referalPartnerCompany = new Company();
  }
}

export class BitrixFolder {
  name: string;
  syncInfo: SyncInfo;
  constructor() {
    this.syncInfo = new SyncInfo();
  }
}

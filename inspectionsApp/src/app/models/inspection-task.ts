import { stringify } from "@angular/compiler/src/util";
import { IonDatetime } from "@ionic/angular";
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
  insuranceContact: Contact;
  insuranceCompany: Company;
  inspectorName: string;
  inspectorUserId: number;
  inspectionType: string;
  enterprise: string;
  inspectionSubTypes: TaskSubtype[];
  inspectionSubTypesString: string;
  inspectionsInstructions: string;
  //new
  typeOfLossDesc: string;
  affectedArea: string;
  waterDamageCategory: string;
  waterDamageClass: string;
  //..new

  startedSync: boolean;
  syncStartDate: Date;

  wasRejected: boolean;

  internalStatus: string;
  comprehesiveForm: ComprehensiveForm;
  environmentalForm: EnvironmentalForm;
  iTestAgreements: Agreements;
  expertNetworkAgreements: Agreements;
  bitrixFolder: BitrixFolder;
  constructor() {
    this.wasRejected = false;
    this.startedSync = false;
    this.iTestAgreements = new Agreements();
    this.expertNetworkAgreements = new Agreements();
    this.bitrixFolder = new BitrixFolder();
    this.referalPartnerContact = new Contact();
    this.referalPartnerCompany = new Company();
    this.insuranceContact = new Contact();
    this.insuranceCompany = new Company();
  }
}

export class BitrixFolder {
  name: string;
  syncInfo: SyncInfo;
  constructor() {
    this.syncInfo = new SyncInfo();
  }
}

import { IStorageModel } from "../interfaces/Istorage-model";
import { Agreements } from "./agreements";
import { Area } from "./comprehensive-form/area";
import { ComprehensiveForm } from "./comprehensive-form/comprehensive-form";
import { GeneralInfoInspection } from "./comprehensive-form/general-info-inspection";
import { EnvironmentalForm } from "./environmental-form";
import { TaskSubtype } from "./task-subtype";

export class InspectionTask implements IStorageModel {
  id: number;
  scheduleDateTime: Date;
  contactName: string;
  serviceAddress: string;
  geoPointText: string;
  contactPhone: string;
  contactEmail: string;
  referalPartnerContact: string;
  referalPartnerCompany: string;
  inspectorName: string;
  inspectorUserId: number;
  inspectionType: string;
  inspectionSubTypes: TaskSubtype[];
  inspectionSubTypesString: string;
  inspectionsInstructions: string;
  internalStatus: string;
  comprehesiveForm: ComprehensiveForm;
  environmentalForm: EnvironmentalForm;
  agreements: Agreements;
  constructor() {
    this.agreements = new Agreements();
  }
}

/*
[
  {
    'repeat(5, 30)': {
      id: '{{index()}}',
      scheduleDateTime:
      '{{moment(this.date( new Date(), new Date(2021, 1, 6))).format("LLLL")}}',
      name: {
        first: '{{firstName()}}',
        last: '{{surname()}}'
      },     
      contactName(tags) {
        return `${this.name.first} ${this.name.last}`;
      },
      
      serviceAddress:
      '{{integer(100, 999)}} {{street()}}, {{random("Orlando", "Miami","Daytona Beach","Melbourne")}}, FL, {{integer(100, 10000)}}',
      contactPhone: '+1 {{phone()}}',
      company: '{{company().toUpperCase()}}',
      contactEmail(tags) {
        return `${this.name.first}.${this.name.last}@${
          this.company
        }${tags.domainZone()}`.toLowerCase();
      },
      
      referalPartnerContact: '{{firstName()}} {{surname()}}',
      referalPartnerCompany: '{{company().toUpperCase()}}',
      inspectorName: 'Inspector A',
      inspectorUserId: 25,      
      inspectionsInstructions: '{{lorem(1, "paragraphs")}}',
      inspectionType: '{{random("Environmental Inspection", "Comprehensive Inspection")}}'
       
    },
  },
]

*/

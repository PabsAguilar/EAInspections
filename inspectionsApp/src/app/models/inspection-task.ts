import { IStorageModel } from "../interfaces/Istorage-model";

export class InspectionTask implements IStorageModel {
  id: number;
  scheduleDateTime: Date;
  contactName: string;
  serviceAddress: string;
  contactPhone: string;
  contactEmail: string;
  referalPartnerContact: string;
  referalPartnerCompany: string;
  inspectorName: string;
  inspectorUserId: number;
  inspectionType: string;
  inspectionsInstructions: string;
}

/*
[
  {
    'repeat(5, 10)': {
      id: '{{index()}}',
      scheduleDateTime:
      '{{moment(this.date( new Date(), new Date(2021, 1, 6))).format("LLLL")}}',
      contactName: '{{firstName()}} {{surname()}}',
      name: {
        first: '{{firstName()}}',
        last: '{{surname()}}'
      },
      serviceAddress:
      '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
      contactPhone: '+1 {{phone()}}',
      company: '{{company().toUpperCase()}}',
      contactEmail(tags) {
        return `${this.name.first}.${this.name.last}@${
          this.company
        }${tags.domainZone()}`.toLowerCase();
      },
      
      //contactEmail: string,
      referalPartnerContact: '{{firstName()}} {{surname()}}',
      referalPartnerCompany(tags) {return  `${this.company}`},
      inspectorName: 'Inspector A',
      inspectorUserId: 25,      
      inspectionsInstructions: '{{lorem(1, "paragraphs")}}',
      inspectionType: '{{random("Environmental Inspection", "Comprehensive Inspection")}}'
       ,
    },
  },
]

*/

import { bitrixMapping } from "../enums";

export class Lead {
  sample: string;
  cardinalDirection: string;
  dimensionCm2: string;
  material: string;
  typeOfSample: string;
  labResults: string;
  observations: string;
  bitrixMappingLead: BitrixMappingLead;
  constructor() {
    this.bitrixMappingLead = new BitrixMappingLead();
  }
}

export class BitrixMappingLead {
  sampleCode: string;
  cardinalDirectionCode: string;
  dimensionCm2Code: string;
  materialCode: string;
  typeOfSampleCode: string;
  labResultsCode: string;
  observationsCode: string;
}

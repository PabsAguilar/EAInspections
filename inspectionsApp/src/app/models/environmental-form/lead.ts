import { bitrixMapping } from "../enums";
import { SyncInfo } from "../sync-info";

export class Lead {
  sample: string;
  cardinalDirection: string;
  dimensionCm2: string;
  material: string;
  typeOfSample: string;
  labResults: string;
  observations: string;
  bitrixMappingLead: BitrixMappingLead;
  syncInfo: SyncInfo;
  constructor() {
    this.syncInfo = new SyncInfo();
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

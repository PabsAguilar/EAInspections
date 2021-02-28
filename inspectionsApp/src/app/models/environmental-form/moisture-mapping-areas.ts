import { SyncInfo } from "../sync-info";
import { MoistureMapping } from "./moisture-mapping";

export class MoistureMappingAreas {
  contact: string;
  dateTesed: Date;
  inspectionType: string;
  dateTesedString: string;
  areamoistureMapping: MoistureMapping[];
  moistureMappingAreasBitrixMapping: MoistureMappingAreasBitrixMapping;
  syncInfo: SyncInfo;
  constructor() {
    this.areamoistureMapping = [];
    this.dateTesed = new Date();
    this.dateTesedString = new Date().toISOString();
    this.areamoistureMapping = [];
    this.moistureMappingAreasBitrixMapping = new MoistureMappingAreasBitrixMapping();
    this.syncInfo = new SyncInfo();
  }
}

export class MoistureMappingAreasBitrixMapping {
  dateTesedCode: string;
  inspectionTypeCode: string;
  contactCode: string;
}

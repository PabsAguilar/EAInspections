import { SyncInfo } from "../sync-info";
import { MoistureMapping } from "./moisture-mapping";

export class MoistureMappingAreas {
  contact: string;
  dateTesed: any;
  inspectionType: string;
  dateTesedString: any;
  areamoistureMapping: MoistureMapping[];
  syncInfo: SyncInfo;
  constructor() {
    this.areamoistureMapping = [];
    this.dateTesed = new Date();
    this.areamoistureMapping = [];

    this.syncInfo = new SyncInfo();
  }
}

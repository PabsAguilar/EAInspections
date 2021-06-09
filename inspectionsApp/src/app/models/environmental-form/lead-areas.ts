import { SyncInfo } from "../sync-info";
import { Lead } from "./lead";

export class LeadAreas {
  leadAreas: Lead[];
  inspectionDate: any;
  contact: string;
  inspectionType: string;
  inspectionDateString: string;
  //leadAreasBitrixMapping: LeadAreasBitrixMapping;
  syncInfo: SyncInfo;
  constructor() {
    this.syncInfo = new SyncInfo();
    this.leadAreas = [];
    //    this.leadAreasBitrixMapping = new LeadAreasBitrixMapping();
  }
}

// export class LeadAreasBitrixMapping {
//   inspectionDateCode: string;
//   contactCode: string;
//   inspectionTypeCode: string;
// }

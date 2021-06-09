import { SyncInfo } from "../sync-info";
import { Asbesto } from "./asbesto";

export class AsbestoAreas {
  inspectionDate: any;
  contact: string;
  inspectionType: string;
  asbestosAreas: Asbesto[];
  inspectionDateString: string;
  //asbestoAreasBitrixMapping: AsbestoAreasBitrixMapping;
  syncInfo: SyncInfo;
  constructor() {
    this.asbestosAreas = [];
    //this.asbestoAreasBitrixMapping = new AsbestoAreasBitrixMapping();
    this.syncInfo = new SyncInfo();
  }
}

// export class AsbestoAreasBitrixMapping {
//   inspectionDateCode: string;
//   contactCode: string;
//   inspectionTypeCode: string;
// }

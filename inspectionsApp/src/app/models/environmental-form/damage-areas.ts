import { DamageInspection } from "../damage-inspection";
//import { DamageInspectionBitrixMapping } from "../damage-inspection-bitrix-mapping";
import { SyncInfo } from "../sync-info";

export class DamageAreas {
  syncInfo: SyncInfo;
  areasInspection: DamageInspection[];
  moldInspectionType: string;
  type: string;
  constructor(type: string) {
    this.areasInspection = [];
    this.type = type;
    this.syncInfo = new SyncInfo();
  }
}

// export class DamageAreasBitrixMapping {
//   contactIdCode: string;
//   startDateCode: string;
//   dealIdCode: string;
//   inspectionType: string;
// }

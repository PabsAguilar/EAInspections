import { SyncInfo } from "../sync-info";

export class Asbesto {
  materialLocation: string;
  materialLocationOther: string;
  materialDescription: string;
  totalQuantity: number;
  F_NF: string;
  condition: string;
  labResults: string;
  observations: string;
  asbestoBitrixMaping: AsbestoBitrixMaping;
  syncInfo: SyncInfo;
  constructor() {
    this.syncInfo = new SyncInfo();
    this.asbestoBitrixMaping = new AsbestoBitrixMaping();
  }
}

export class AsbestoBitrixMaping {
  materialLocationCode: string;
  materialLocationOtherCode: string;
  materialDescriptionCode: string;
  totalQuantityCode: string;
  F_NFCode: string;
  conditionCode: string;
  labResultsCode: string;
  observationsCode: string;
}

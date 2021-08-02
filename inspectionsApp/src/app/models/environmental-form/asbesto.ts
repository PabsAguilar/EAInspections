import { BitrixPictureList } from "../bitrix-picture";
import { SyncInfo } from "../sync-info";

export class Asbesto {
  materialLocation: string;
  areaPictures: BitrixPictureList;
  materialLocationOther: string;
  materialDescription: string;
  totalQuantity: number;
  F_NF: string;
  condition: string;
  labResults: string;
  observations: string;

  syncInfo: SyncInfo;
  constructor() {
    this.syncInfo = new SyncInfo();
    this.areaPictures = new BitrixPictureList();
  }
}

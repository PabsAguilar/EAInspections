import { BitrixPictureList } from "../bitrix-picture";
import { SyncInfo } from "../sync-info";

export class Lead {
  sample: string;
  areaPictures: BitrixPictureList;
  sampleOther: string;
  cardinalDirection: string;
  dimensionCm2: string;
  material: string;
  typeOfSample: string;
  labResults: string;
  observations: string;
  syncInfo: SyncInfo;
  constructor() {
    this.syncInfo = new SyncInfo();
    this.areaPictures = new BitrixPictureList();
  }
}

import { SyncInfo } from "./sync-info";

export class BitrixPictureList {
  images: BitrixPicture[];
  bitrixTargeCode: string;
  syncInfo: SyncInfo;
  maxPictures: number;

  imagesCodesSync: any[];

  constructor() {
    this.syncInfo = new SyncInfo();
    this.images = [];
    this.imagesCodesSync = [];
    this.maxPictures = 5;
  }
}

export class BitrixPicture {
  base64Image: string;
  isSync: boolean;
  syncCode: string;

  constructor() {}
}

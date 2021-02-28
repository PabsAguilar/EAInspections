import { BitrixPictureList } from "./bitrix-picture";

export class Agreements {
  signature: BitrixPictureList;
  hasOpen: boolean;
  constructor() {
    this.hasOpen = false;
    this.signature = new BitrixPictureList();
  }
}

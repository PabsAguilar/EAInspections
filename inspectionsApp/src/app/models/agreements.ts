import { BitrixPictureList } from "./bitrix-picture";

export class Agreements {
  signature: BitrixPictureList;
  hasOpen: boolean;
  isSigned: boolean;
  constructor() {
    this.hasOpen = false;
    this.isSigned = false;

    this.signature = new BitrixPictureList();
  }
}

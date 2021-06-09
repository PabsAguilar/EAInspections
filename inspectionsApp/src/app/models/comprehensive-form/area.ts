import { BitrixPictureList } from "../bitrix-picture";

export class Area {
  name: string;
  condition: string[];
  moistureLevel: number;
  pictures: BitrixPictureList;
  notes: string;
  //areaBitrixMapping: AreaBitrixMapping;
  constructor() {
   // this.areaBitrixMapping = new AreaBitrixMapping();
    this.name = "";
    this.condition = [];
    this.moistureLevel = null;
    this.pictures = new BitrixPictureList();
    this.notes = "";
  }
}

// export class AreaBitrixMapping {
//   nameCode: string;
//   conditionCode: string;
//   moistureLevelCode: string;
//   picturesCode: string;
//   notesCode: string;
// }

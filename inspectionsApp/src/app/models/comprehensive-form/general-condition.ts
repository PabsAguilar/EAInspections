import { BitrixPictureList } from "../bitrix-picture";

export class GeneralCondition {
  condition: string[];
  moistureLevel: number;
  pictures: BitrixPictureList;
  notes: string;
  //generalConditionBitrixMapping: GeneralConditionBitrixMapping;
  constructor() {
    this.pictures = new BitrixPictureList();
    this.moistureLevel = null;
    this.notes = null;
    this.condition = [];
    //this.generalConditionBitrixMapping = new GeneralConditionBitrixMapping();
  }
}

// export class GeneralConditionBitrixMapping {
//   conditionCode: string;
//   moistureLevelCode: string;
//   picturesCode: string;
//   notesCode: string;
//   waterQualityTestCode: string;
//   otherCode: string;
// }

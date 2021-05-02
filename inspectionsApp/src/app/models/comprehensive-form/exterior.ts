import { BitrixPictureList } from "../bitrix-picture";
import { GeneralConditionBitrixMapping } from "./general-condition";

export class Exterior {
  condition: string[];
  conditionOther: string;
  pictures: BitrixPictureList;
  notes: string;
  generalConditionBitrixMapping: GeneralConditionBitrixMapping;
  constructor() {
    this.condition = [];
    this.conditionOther = "";
    this.pictures = new BitrixPictureList();
    this.notes = "";
    this.generalConditionBitrixMapping = new GeneralConditionBitrixMapping();
  }
}

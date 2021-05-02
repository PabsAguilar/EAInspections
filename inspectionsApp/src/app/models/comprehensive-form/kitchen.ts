import { BitrixPictureList } from "../bitrix-picture";
import {
  GeneralCondition,
  GeneralConditionBitrixMapping,
} from "./general-condition";

export class Kitchen implements GeneralCondition {
  condition: string[];
  moistureLevel: number;
  pictures: BitrixPictureList;
  notes: string;
  waterQualityTest: string;
  generalConditionBitrixMapping: GeneralConditionBitrixMapping;
  constructor() {
    this.condition = [];
    this.moistureLevel = null;
    this.pictures = new BitrixPictureList();
    this.notes = "";
    this.generalConditionBitrixMapping = new GeneralConditionBitrixMapping();
  }
}

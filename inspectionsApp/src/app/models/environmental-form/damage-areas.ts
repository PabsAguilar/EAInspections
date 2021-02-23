import { DamageInspection } from "../damage-inspection";
import { DamageInspectionBitrixMapping } from "../damage-inspection-bitrix-mapping";

export class DamageAreas {
  sync: boolean;
  areasInspection: DamageInspection[];
  moldInspectionType: string;
  type: string;
  damageAreasBitrixMapping: DamageAreasBitrixMapping;
  constructor(type: string) {
    this.areasInspection = [];
    this.type = type;
    this.sync = false;
    this.damageAreasBitrixMapping = new DamageAreasBitrixMapping();
  }
}

export class DamageAreasBitrixMapping {
  contactIdCode: string;
  startDateCode: string;
  dealIdCode: string;
  inspectionType: string;
}

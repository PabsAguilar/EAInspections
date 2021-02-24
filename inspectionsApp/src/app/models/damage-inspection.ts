import { BitrixPictureList } from "./bitrix-picture";
import { DamageInspectionBitrixMapping } from "./damage-inspection-bitrix-mapping";
import { Sample } from "./environmental-form/sample";

export class DamageInspection {
  areaName: string;
  areaCondition: string[];
  areaRH: number;
  areaPictures: BitrixPictureList;
  areaNotes: string;
  removeCeiling: boolean;
  removeCeilingValue: string;
  ceilingNotes: string;
  removeDrywall: boolean;
  removeDrywallValue: string;
  drywallNotes: string;
  removeBaseboards: boolean;
  removeBaseboardsValue: string;
  baseboardsNotes: string;
  removeFlooring: boolean;
  removeFlooringValue: string;
  flooringNotes: string;
  decontamination: string[];
  furnitureOption: string;
  beddingsOption: string;
  observations: string;
  samples: Sample[];
  recomendations: string;
  type: string;
  damageInspectionBitrixMapping: DamageInspectionBitrixMapping;

  constructor(type: string) {
    this.damageInspectionBitrixMapping = new DamageInspectionBitrixMapping(
      type
    );
    this.decontamination = [];
    this.areaPictures = new BitrixPictureList();
    this.areaCondition = [];
    this.samples = [];
    this.type = type;
  }
}

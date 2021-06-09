import { BitrixPictureList } from "./bitrix-picture";
//import { DamageInspectionBitrixMapping } from "./damage-inspection-bitrix-mapping";
import { Sample } from "./environmental-form/sample";
import { SyncInfo } from "./sync-info";

export class DamageInspection {
  areaName: string;
  areaNameOther: string;
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
  waterDamageCategory: string;
  waterDamageClass: string;
  type: string;
  //damageInspectionBitrixMapping: DamageInspectionBitrixMapping;
  syncInfo: SyncInfo;

  constructor(type: string) {
    // this.damageInspectionBitrixMapping = new DamageInspectionBitrixMapping(
    //   type
    // );
    this.decontamination = [];
    this.syncInfo = new SyncInfo();
    this.areaPictures = new BitrixPictureList();
    this.areaCondition = [];
    this.samples = [];
    this.type = type;
  }
}

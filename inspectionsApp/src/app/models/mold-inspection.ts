export class MoldInspection {
  areaName: string;
  areaCondition: string[];
  areaRH: number;
  areaPictures: string[];
  areaNotes: string;
  removeCeiling: boolean;
  ceilingNotes: string;
  removeDrywall: boolean;
  drywallNotes: string;
  removeBaseboards: boolean;
  baseboardsNotes: string;
  removeFlooring: boolean;
  flooringNotes: string;
  decontamination: string[];
  furnitureOption: string;
  beddingsOption: string;
  observations: string;
  constructor() {
    this.decontamination = [];
    this.areaPictures = [];
    this.areaCondition = [];
  }
}

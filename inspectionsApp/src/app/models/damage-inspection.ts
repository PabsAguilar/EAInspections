import { Sample } from "./environmental-form/sample";

export class DamageInspection {
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
  samples: Sample[];
  recomendations: string;
  type: string;

  constructor(type: string) {
    this.decontamination = [];
    this.areaPictures = [];
    this.areaCondition = [];
    this.samples = [];
    this.type = type;
    for (let index = 0; index < 3; index++) {
      this.samples.push(new Sample(type));
    }
  }
}

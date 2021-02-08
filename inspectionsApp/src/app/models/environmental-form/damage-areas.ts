import { DamageInspection } from "../damage-inspection";

export class DamageAreas {
  areasMold: DamageInspection[];
  moldInspectionType: string;
  type: string;
  constructor(type: string) {
    this.areasMold = [];
    this.type = type;
    for (let index = 0; index < 8; index++) {
      this.areasMold.push(new DamageInspection(type));
    }
  }
}

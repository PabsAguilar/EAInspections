import { DamageInspection } from "../damage-inspection";

export class DamageAreas {
  sync: boolean;
  areasInspection: DamageInspection[];
  moldInspectionType: string;
  type: string;
  constructor(type: string) {
    this.areasInspection = [];
    this.type = type;
    this.sync = false;
  }
}

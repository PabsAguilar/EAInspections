import { MoldInspection } from "../mold-inspection";

export class MoldAreas {
  areasMold: MoldInspection[];
  moldInspectionType: string;
  constructor() {
    this.areasMold = [];
    for (let index = 0; index < 8; index++) {
      this.areasMold.push(new MoldInspection());
    }
  }
}

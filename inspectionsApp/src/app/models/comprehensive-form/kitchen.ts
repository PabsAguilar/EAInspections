import { GeneralCondition } from "./general-condition";

export class Kitchen implements GeneralCondition {
  condition: string[];
  moistureLevel: number;
  pictures: string[];
  notes: string;
  waterQualityTest: boolean;
  constructor() {
    this.condition = [];
    this.moistureLevel = null;
    this.pictures = [];
    this.notes = "";
  }
}

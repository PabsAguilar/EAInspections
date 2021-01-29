export class GeneralCondition {
  condition: string[];
  moistureLevel: number;
  pictures: string[];
  notes: string;
  constructor() {
    this.pictures = [];
    this.moistureLevel = null;
    this.notes = null;
    this.condition = [];
  }
}

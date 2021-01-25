export class Area {
  name: string;
  condition: string[];
  moistureLevel: number;
  picture: string;
  notes: string;
  constructor() {
    this.name = "";
    this.condition = [];
    this.moistureLevel = null;
    this.picture = "";
    this.notes = "";
  }
}

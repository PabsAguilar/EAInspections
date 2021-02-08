import { MoistureMapping } from "./moisture-mapping";

export class MoistureMappingAreas {
  dateTesed: Date;
  dateTesedString: string;
  areamoistureMapping: MoistureMapping[];
  constructor() {
    this.areamoistureMapping = [];
    this.dateTesed = new Date();
    this.dateTesedString = new Date().toISOString();
    for (let index = 0; index < 20; index++) {
      this.areamoistureMapping.push(new MoistureMapping());
    }
  }
}

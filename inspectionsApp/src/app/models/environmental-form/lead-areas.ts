import { Lead } from "./lead";

export class LeadAreas {
  leadAreas: Lead[];
  inspectionType: string;

  constructor() {
    this.leadAreas = [];

    for (let index = 0; index < 20; index++) {
      this.leadAreas.push(new Lead());
    }
  }
}

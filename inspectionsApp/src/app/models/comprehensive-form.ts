import { Area } from "./area";
import { GeneralCondition } from "./general-condition";
import { GeneralInfoInspection } from "./general-info-inspection";
import { Kitchen } from "./kitchen";

export class ComprehensiveForm {
  startDate: Date;
  generalInfoInspection: GeneralInfoInspection;
  areas: Area[];
  bathrooms: GeneralCondition[];
  kitchen: Kitchen;
  constructor() {
    this.generalInfoInspection = new GeneralInfoInspection();
    this.startDate = new Date();
    this.kitchen = new Kitchen();
    this.areas = [];
    this.bathrooms = [];
    for (let index = 0; index < 8; index++) {
      this.areas.push(new Area());
    }

    for (let index = 0; index < 3; index++) {
      this.bathrooms.push(new GeneralCondition());
    }
  }
}

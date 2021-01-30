import { Area } from "./area";
import { ComprehensiveEnvironmentalSection } from "./comprehensive-environmental-section";
import { GeneralCondition } from "./general-condition";
import { GeneralInfoInspection } from "./general-info-inspection";
import { Kitchen } from "./kitchen";

export class ComprehensiveForm {
  startDate: Date;
  generalInfoInspection: GeneralInfoInspection;
  areas: Area[];
  bathrooms: GeneralCondition[];
  kitchen: Kitchen;
  HVAC_AC: GeneralCondition;
  utilityRoom: GeneralCondition;
  atic: GeneralCondition;
  enviromentalSection: ComprehensiveEnvironmentalSection;

  constructor() {
    this.generalInfoInspection = new GeneralInfoInspection();
    this.startDate = new Date();
    this.kitchen = new Kitchen();
    this.areas = [];
    this.bathrooms = [];
    this.HVAC_AC = new GeneralCondition();
    this.utilityRoom = new GeneralCondition();
    this.atic = new GeneralCondition();
    this.enviromentalSection = new ComprehensiveEnvironmentalSection();
    for (let index = 0; index < 8; index++) {
      this.areas.push(new Area());
    }
    for (let index = 0; index < 3; index++) {
      this.bathrooms.push(new GeneralCondition());
    }
  }
}

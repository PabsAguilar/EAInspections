import { Area } from "./area";
import { ComprehensiveEnvironmentalSection } from "./comprehensive-environmental-section";
import { Exterior } from "./exterior";
import { GeneralCondition } from "./general-condition";
import { GeneralInfoInspection } from "./general-info-inspection";
import { Insurance } from "./insurance";
import { Kitchen } from "./kitchen";
import { Recomendations } from "./recomendations";
import { Reminders } from "./reminders";

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
  exterior: Exterior;
  recomendations: Recomendations;
  insurance: Insurance;
  reminders: Reminders;

  constructor() {
    this.generalInfoInspection = new GeneralInfoInspection();
    this.generalInfoInspection.environmentalInspection = false;
    this.startDate = new Date();
    this.kitchen = new Kitchen();
    this.areas = [];
    this.bathrooms = [];
    this.HVAC_AC = new GeneralCondition();
    this.utilityRoom = new GeneralCondition();
    this.atic = new GeneralCondition();
    this.enviromentalSection = new ComprehensiveEnvironmentalSection();
    this.exterior = new Exterior();
    this.recomendations = new Recomendations();
    this.insurance = new Insurance();
    this.reminders = new Reminders();
    // for (let index = 0; index < 8; index++) {
    //   this.areas.push(new Area());
    // }
    // for (let index = 0; index < 3; index++) {
    //   this.bathrooms.push(new GeneralCondition());
    // }
  }
}

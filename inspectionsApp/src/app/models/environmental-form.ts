import { GeneralInfoInspection } from "./comprehensive-form/general-info-inspection";
import { MoldAreas } from "./environmental-form/mold-areas";
import { MoldInspection } from "./mold-inspection";

export class EnvironmentalForm {
  startDate: Date;
  generalInfoInspection: GeneralInfoInspection;
  moldAreas: MoldAreas;

  constructor() {
    this.generalInfoInspection = new GeneralInfoInspection();
    this.generalInfoInspection.environmentalInspection = true;
    this.startDate = new Date();
    this.moldAreas = new MoldAreas();
  }
}

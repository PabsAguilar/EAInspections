import { GeneralInfoInspection } from "./comprehensive-form/general-info-inspection";
import { DamageAreas } from "./environmental-form/damage-areas";
import { DamageAreaType } from "./enums";
import { MoistureMappingAreas } from "./environmental-form/moisture-mapping-areas";
import { AsbestoAreas } from "./environmental-form/asbesto-areas";
import { LeadAreas } from "./environmental-form/lead-areas";

export class EnvironmentalForm {
  startDate: Date;
  generalInfoInspection: GeneralInfoInspection;
  moldAreas: DamageAreas;
  sootAreas: DamageAreas;
  bacteriasAreas: DamageAreas;
  moistureMappingAreas: MoistureMappingAreas;
  asbestosAreas: AsbestoAreas;
  leadAreas: LeadAreas;

  constructor() {
    this.generalInfoInspection = new GeneralInfoInspection();
    this.generalInfoInspection.environmentalInspection = true;
    this.startDate = new Date();
    this.moldAreas = new DamageAreas(DamageAreaType.Mold);
    this.sootAreas = new DamageAreas(DamageAreaType.Soot);
    this.bacteriasAreas = new DamageAreas(DamageAreaType.Bacteria);
    this.moistureMappingAreas = new MoistureMappingAreas();
    this.asbestosAreas = new AsbestoAreas();
    this.leadAreas = new LeadAreas();
  }
}

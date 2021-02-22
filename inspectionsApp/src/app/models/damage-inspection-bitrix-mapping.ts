export class DamageInspectionBitrixMapping {
   areaNameCode: string;
  conditionCode: string;
  areaRHCode: string;
  areaPicturesCode: string;
  areaNotesCode: string;
  removeCeilingCode: string;
  ceilingNotesCode: string;
  removeDrywallCode: string;
  drywallNotesCode: string;
  removeBaseboardsCode: string;
  baseboardsNotesCode: string;
  removeFlooringCode: string;
  flooringNotesCode: string;
  decontaminationCode: string;
  furnitureOptionCode: string;
  beddingsOptionCode: string;
  observationsCode: string;
  recomendationsCode: string;
  type: string;
  constructor(type: string) {
    this.type = type;
  }
}

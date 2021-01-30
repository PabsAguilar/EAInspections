export class GeneralInfoInspection {
  propertyYear: number;
  pictureHouseNumbers: string;
  picturesFrontHouse: string[];
  propertyType: string;

  constructor() {
    this.picturesFrontHouse = [];
    this.propertyYear = null;
    this.pictureHouseNumbers = "";
    this.propertyType = "";
  }
}

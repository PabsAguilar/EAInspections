export class GeneralInfoInspection {
  propertyYear: number;
  pictureHouseNumbers: string;
  picturesFrontHouse: string[];
  propertyType: string;

  constructor() {
    this.picturesFrontHouse = [];
    this.propertyYear = new Date().getFullYear();
    this.pictureHouseNumbers = "";
    this.propertyType = "";
  }
}

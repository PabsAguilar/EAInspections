import { BooleanValueAccessor } from "@ionic/angular";

export class GeneralInfoInspection {
  propertyYear: number;
  pictureHouseNumbers: string;
  picturesFrontHouse: string[];
  propertyType: string;

  environmentalInspection: boolean;
  interiorTemperature: number;
  exteriorRelativeHumidity: number;
  HVACSystemCondition: string[];
  ductsCondition: string[];
  atticCondition: string[];

  constructor() {
    this.picturesFrontHouse = [];
    this.propertyYear = null;
    this.pictureHouseNumbers = "";
    this.propertyType = "";

    this.HVACSystemCondition = [];
    this.ductsCondition = [];
    this.atticCondition = [];
  }
}

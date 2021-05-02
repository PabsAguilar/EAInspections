import { BooleanValueAccessor } from "@ionic/angular";
import { BitrixPicture, BitrixPictureList } from "../bitrix-picture";
import { SyncInfo } from "../sync-info";

export class GeneralInfoInspection {
  propertyYear: number;
  pictureHouseNumbers: BitrixPictureList;
  picturesFrontHouse: BitrixPictureList;
  propertyType: string;
  environmentalInspection: boolean;
  interiorTemperature: number;
  exteriorRelativeHumidity: number;
  HVACSystemCondition: string;
  ductsCondition: string;
  atticCondition: string;
  syncInfo: SyncInfo;
  agreementSignedYesNo: string;
  generalInfoInspectionBitrixMapping: GeneralInfoInspectionBitrixMapping;
  typeOfLossDesc: string;
  affectedArea: string;
  waterDamageCategory: string;
  waterDamageClass: string;


  constructor() {
    this.syncInfo = new SyncInfo();
    this.picturesFrontHouse = new BitrixPictureList();
    this.propertyYear = null;
    this.pictureHouseNumbers = new BitrixPictureList();
    this.pictureHouseNumbers.maxPictures = 1;
    this.propertyType = "";
    this.generalInfoInspectionBitrixMapping = new GeneralInfoInspectionBitrixMapping();
  }
}
export class GeneralInfoInspectionBitrixMapping {
  agreementSignedYesNoCode: string;
  propertyYearCode: string;
  propertyTypeCode: string;
  environmentalInspectionCode: string;
  interiorTemperatureCode: string;
  exteriorRelativeHumidityCode: string;
  HVACSystemConditionCode: string;
  ductsConditionCode: string;
  atticConditionCode: string;
  typeOfLossDescCode: string;
  affectedAreaCode: string;
  waterDamageCategoryCode: string;
  waterDamageClassCode: string;

}

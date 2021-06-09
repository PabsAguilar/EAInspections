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
  typeOfLossDesc: string;
  affectedArea: string;

  constructor() {
    this.syncInfo = new SyncInfo();
    this.picturesFrontHouse = new BitrixPictureList();
    this.propertyYear = null;
    this.pictureHouseNumbers = new BitrixPictureList();
    this.pictureHouseNumbers.maxPictures = 1;
    this.propertyType = "";
  }
}

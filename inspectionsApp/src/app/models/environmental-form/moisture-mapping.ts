import { BitrixPictureList } from "../bitrix-picture";
import { SyncInfo } from "../sync-info";

export class MoistureMapping {
  area: string;
  areaOther: string;
  roomTemp: number;
  relativeHumidity: number;
  dewPoint: number;
  standardTemperatureNorth: number;
  standardTemperatureWest: number;
  standardTemperatureSouth: number;
  standardTemperatureEast: number;
  standardTemperatureCeiling: number;
  standardTemperatureFloor: number;
  areaPictures: BitrixPictureList;
  syncInfo: SyncInfo;
  constructor() {
    this.syncInfo = new SyncInfo();
    this.areaPictures = new BitrixPictureList();
  }
}

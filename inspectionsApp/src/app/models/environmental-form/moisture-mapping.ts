export class MoistureMapping {
  area: string;
  roomTemp: number;
  relativeHumidity: number;
  dewPoint: number;
  standardTemperatureNorth: number;
  standardTemperatureWest: number;
  standardTemperatureSouth: number;
  standardTemperatureEast: number;
  standardTemperatureCeiling: number;
  standardTemperatureFloor: number;
  moistureMappingBitrixMap: MoistureMappingBitrixMap;
  constructor() {
    this.moistureMappingBitrixMap = new MoistureMappingBitrixMap();
  }
}

export class MoistureMappingBitrixMap {
  areaCode: string;
  roomTempCode: string;
  relativeHumidityCode: string;
  dewPointCode: string;
  standardTemperatureNorthCode: string;
  standardTemperatureWestCode: string;
  standardTemperatureSouthCode: string;
  standardTemperatureEastCode: string;
  standardTemperatureCeilingCode: string;
  standardTemperatureFloorCode: string;
}

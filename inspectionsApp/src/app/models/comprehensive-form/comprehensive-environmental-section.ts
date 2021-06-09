import { BitrixPictureList } from "../bitrix-picture";

export class ComprehensiveEnvironmentalSection {
  MoldSampleTaken: boolean;
  MoldSampleLocation: string;
  MoldLocationPicture: BitrixPictureList;
  WaterSampleTaken: boolean;
  WaterSamplelocation: string;
  MajorReconstruction: string;
  //environmentalSectionBitrixMapping: EnvironmentalSectionBitrixMapping;

  constructor() {
    this.MoldLocationPicture = new BitrixPictureList();
    // this.environmentalSectionBitrixMapping = new EnvironmentalSectionBitrixMapping();
  }
}
// export class EnvironmentalSectionBitrixMapping {
//   MoldSampleTakenCode: string;
//   MoldSampleLocationCode: string;
//   MoldLocationPictureCode: string;
//   WaterSampleTakenCode: string;
//   WaterSamplelocationCode: string;
//   MajorReconstructionCode: string;
// }

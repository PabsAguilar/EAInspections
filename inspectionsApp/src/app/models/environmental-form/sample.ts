import { SampleBitrixMapping } from "../sample-bitrix-mapping";

export class Sample {
  sampleType: string;
  type: string;
  labResult: string;
  volume: number;
  cassetteNumber: string;
  toxicMoldboolean: boolean;
  toxicMold: string;
  sampleBitrixMapping: SampleBitrixMapping;
  constructor(type: string) {
    this.sampleType = type;
    this.sampleBitrixMapping = new SampleBitrixMapping();
  }
}

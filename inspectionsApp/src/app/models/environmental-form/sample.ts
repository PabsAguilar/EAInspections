export class Sample {
  sampleType: string;
  type: string;
  labResult: string;
  volume: number;
  cassetteNumber: string;
  toxicMold: boolean;
  constructor(type: string) {
    this.sampleType = type;
  }
}

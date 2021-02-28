export class Asbesto {
  materialLocation: string;
  materialDescription: string;
  totalQuantity: number;
  F_NF: string;
  condition: string;
  labResults: string;
  observations: string;
  asbestoBitrixMaping: AsbestoBitrixMaping;
  constructor() {
    this.asbestoBitrixMaping = new AsbestoBitrixMaping();
  }
}

export class AsbestoBitrixMaping {
  materialLocationCode: string;
  materialDescriptionCode: string;
  totalQuantityCode: string;
  F_NFCode: string;
  conditionCode: string;
  labResultsCode: string;
  observationsCode: string;
}

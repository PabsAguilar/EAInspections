export class Insurance {
  haveInsurance: boolean;
  insuranceCarrier: boolean;
  picturesPolicy: string[];
  claimForDamageBefore: boolean;
  claimInLast5Years: boolean;
  reasonForClaim: string;
  usePublicAdjuster: boolean;
  adjusterName: string;
  quantityOfChecks: number;
  notes: string;
  assignPAorAttorney: string;
  constructor() {
    this.haveInsurance = false;
    this.insuranceCarrier = false;
    this.picturesPolicy = [];
    this.claimForDamageBefore = false;
    this.claimInLast5Years = false;
    this.reasonForClaim = "";
    this.usePublicAdjuster = false;
    this.adjusterName = "";
    this.quantityOfChecks = null;
    this.notes = "";
    this.assignPAorAttorney = "";
  }
}

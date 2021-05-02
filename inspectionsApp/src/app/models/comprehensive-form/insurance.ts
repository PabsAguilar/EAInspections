import { BitrixPictureList } from "../bitrix-picture";

export class Insurance {
  picturesPolicy: BitrixPictureList;
  insuranceCarrier: string;
  haveInsurance: string;
  claimForDamageBefore: string;
  claimInLast5Years: string;
  usePublicAdjuster: string;
  assignPAorAttorney: string;
  reasonForClaim: string;
  adjusterName: string;
  quantityOfChecks: number;
  notes: string;
  insuranceBitrixMapping: InsuranceBitrixMapping;

  constructor() {
    this.picturesPolicy = new BitrixPictureList();

    this.reasonForClaim = "";

    this.adjusterName = "";
    this.quantityOfChecks = null;
    this.notes = "";

    this.insuranceBitrixMapping = new InsuranceBitrixMapping();
  }
}

export class InsuranceBitrixMapping {
  haveInsuranceCode: string;
  insuranceCarrierCode: string;
  picturesPolicyCode: string;
  claimForDamageBeforeCode: string;
  claimInLast5YearsCode: string;
  reasonForClaimCode: string;
  usePublicAdjusterCode: string;
  adjusterNameCode: string;
  quantityOfChecksCode: string;
  notesCode: string;
  assignPAorAttorneyCode: string;
}

export class Recomendations {
  damagesFound: boolean;
  inspectionRecomendation: string[];
  recomendation: string;
  recomendationsBitrixMapping: RecomendationsBitrixMapping;

  constructor() {
    this.damagesFound = false;
    this.inspectionRecomendation = [];
    this.recomendation = "";
    this.recomendationsBitrixMapping = new RecomendationsBitrixMapping();
  }
}

export class RecomendationsBitrixMapping {
  damagesFoundCode: string;
  inspectionRecomendationCode: string;
  recomendationCode: string;
}

export class Recomendations {
  damagesFound: boolean;
  inspectionRecomendation: string[];
  recomendation: string;
  constructor() {
    this.damagesFound = false;
    this.inspectionRecomendation = [];
    this.recomendation = "";
  }
}

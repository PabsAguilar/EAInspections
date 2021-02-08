import { Asbesto } from "./asbesto";

export class AsbestoAreas {
  asbestosAreas: Asbesto[];
  inspectionType: string;
  constructor() {
    this.asbestosAreas = [];

    for (let index = 0; index < 20; index++) {
      this.asbestosAreas.push(new Asbesto());
    }
  }
}

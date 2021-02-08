import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DamageAreas } from "src/app/models/environmental-form/damage-areas";
import { DamageInspection } from "src/app/models/damage-inspection";
import { DamageAreaType } from "src/app/models/enums";

@Component({
  selector: "app-areas-mold",
  templateUrl: "./areas-mold.component.html",
  styleUrls: ["./areas-mold.component.scss"],
})
export class AreasMoldComponent implements OnInit {
  filledAreas: number = 0;
  isMenuOpen: boolean = false;
  progressColor: string = "danger";
  progressPercentage: number = 0;
  toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @Input() title: string = "";
  @Input()
  get model(): DamageAreas {
    return this._model;
  }
  set model(value: DamageAreas) {
    this._model = value;
    if (value) {
      this._model = value;
      switch (value.type) {
        case DamageAreaType.Bacteria:
          this.damageInspectionType = [
            "Pre Bacteria (CAT3) Inspection",
            "Post Bacteria (CAT3) Inspection (Clearance)",
          ];
          break;
        case DamageAreaType.Mold:
          this.damageInspectionType = [
            "Pre Mold Inspection",
            "Mold Samples Only",
            "Post Mold Inspection (Clearance)",
          ];
          break;

        case DamageAreaType.Soot:
          this.damageInspectionType = [
            "Pre Soot Inspection",
            "Post Soot Inspection (Clearance)",
          ];
          break;
      }
      this.AreaUpdated(null);
    }
  }
  _model: DamageAreas = new DamageAreas("");
  damageInspectionType: any[] = [];
  @Output() modelChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  AreaUpdated($event) {
    this.filledAreas = !this.model.areasMold
      ? 0
      : this.model.areasMold.filter((y) => y.areaName).length;

    if (this.filledAreas >= 1 && this.model.moldInspectionType) {
      this.progressColor = "success";
      this.progressPercentage = 1;
      console.log(this.model);
      this.modelChanged.emit(this.model);
    }
  }
}

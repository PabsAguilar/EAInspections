import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { DamageInspection } from "src/app/models/damage-inspection";
import { DamageAreaType } from "src/app/models/enums";

@Component({
  selector: "app-area-mold",
  templateUrl: "./area-mold.component.html",
  styleUrls: ["./area-mold.component.scss"],
})
export class AreaMoldComponent implements OnInit {
  public totalProperties: number = 21;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";
  conditions: any[] = [];
  decontaminationOptions: any[] = [];
  @Input()
  get model(): DamageInspection {
    return this._model;
  }
  set model(value: DamageInspection) {
    this._model = value;

    if (value.type == DamageAreaType.Mold) {
      this.conditions = [
        { name: "Visible Mold-Like Substance", checked: false },
        { name: "Moisture Stains Present", checked: false },
        { name: "Mold Odor", checked: false },
        { name: "Remove Insulation", checked: false },
      ];

      this.decontaminationOptions = [
        { name: "Micro-clean Surfaces", checkde: false },
        { name: "Horizontal Surface Cleaning", checkde: false },
        { name: "Discard Carpets", checkde: false },
        { name: "Content Cleaning", checkde: false },
        { name: "Fog Area with anti-microbial", checkde: false },
      ];
    } else if (value.type == DamageAreaType.Soot) {
      this.conditions = [
        { name: "Visible Mold-Like Substance", checked: false },
        { name: "Moisture Stains Present", checked: false },
        { name: "Mold Odor", checked: false },
        { name: "Remove Insulation", checked: false },
      ];

      this.decontaminationOptions = [
        { name: "Micro-clean Surfaces", checked: false },
        { name: "Horizontal Surface Cleaning", checked: false },
        { name: "Discard Carpets", checked: false },
        { name: "Content Cleaning", checked: false },
        { name: "Fog Area with anti-microbial", checked: false },
      ];
    } else if (value.type == DamageAreaType.Bacteria) {
      this.conditions = [
        { name: "Visible Mold-Like Substance", checked: false },
        { name: "Moisture Stains Present", checked: false },
        { name: "Mold Odor", checked: false },
        { name: "Remove Insulation", checked: false },
      ];

      this.decontaminationOptions = [
        { name: "Micro-clean Surfaces", checked: false },
        { name: "Horizontal Surface Cleaning", checked: false },
        { name: "Discard Carpets", checked: false },
        { name: "Content Cleaning", checked: false },
        { name: "Fog Area with anti-microbial", checked: false },
      ];
    }
    this.changeModel(null);
  }
  _model: DamageInspection = new DamageInspection("");
  @Input() title: string = "";

  @Output() modelChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    console.log(this.model);
    console.log($event);

    this.filledProperties = 0;
    if (this._model.areaPictures.length > 0) {
      this.filledProperties++;
    }
    if (this._model.areaCondition.length > 0) {
      this.filledProperties++;
    }
    if (this._model.areaName) {
      this.filledProperties++;
    }
    if (this._model.areaRH) {
      this.filledProperties++;
    }
    if (this._model.beddingsOption) {
      this.filledProperties++;
    }
    if (this._model.ceilingNotes) {
      this.filledProperties++;
    }
    if (this._model.decontamination.length > 0) {
      this.filledProperties++;
    }
    if (this._model.drywallNotes) {
      this.filledProperties++;
    }
    if (this._model.areaNotes) {
      this.filledProperties++;
    }

    if (this._model.flooringNotes) {
      this.filledProperties++;
    }
    if (this._model.furnitureOption) {
      this.filledProperties++;
    }
    if (this._model.observations) {
      this.filledProperties++;
    }
    if (this._model.baseboardsNotes) {
      this.filledProperties++;
    }
    if (this._model.removeBaseboards) {
      this.filledProperties++;
    }
    if (this._model.removeCeiling) {
      this.filledProperties++;
    }
    if (this._model.recomendations) {
      this.filledProperties++;
    }

    this.filledProperties =
      this.filledProperties +
      this._model.samples.filter((x) => x.type && x.labResult).length;

    if (this._model.removeDrywall) {
      this.filledProperties++;
    }
    if (this._model.removeFlooring) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    this.modelChanged.emit(this._model);

    switch (true) {
      case this.progressPercentage < 0.5:
        this.progressColor = "danger";
        break;
      case this.progressPercentage < 1:
        this.progressColor = "warning";
        break;
      case this.progressPercentage >= 1:
        this.progressColor = "success";
        break;
      default:
        this.progressColor = "danger";
        break;
    }
  }
}

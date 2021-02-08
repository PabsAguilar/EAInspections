import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Asbesto } from "src/app/models/environmental-form/asbesto";

@Component({
  selector: "app-asbestos",
  templateUrl: "./asbestos.component.html",
  styleUrls: ["./asbestos.component.scss"],
})
export class AsbestosComponent implements OnInit {
  public totalProperties: number = 7;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";
  conditions: any[] = [];
  decontaminationOptions: any[] = [];
  @Input()
  get model(): Asbesto {
    return this._model;
  }
  set model(value: Asbesto) {
    this._model = value;

    this.changeModel(null);
  }
  _model: Asbesto = new Asbesto();
  @Input() title: string = "";

  @Output() modelChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;
    if (this._model.F_NF) {
      this.filledProperties++;
    }

    if (this._model.condition) {
      this.filledProperties++;
    }
    if (this._model.labResults) {
      this.filledProperties++;
    }
    if (this._model.materialDescription) {
      this.filledProperties++;
    }
    if (this._model.materialLocation) {
      this.filledProperties++;
    }
    if (this._model.observations) {
      this.filledProperties++;
    }
    if (this._model.totalQuantity) {
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

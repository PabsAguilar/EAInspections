import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Lead } from "src/app/models/environmental-form/lead";

@Component({
  selector: "app-lead",
  templateUrl: "./lead.component.html",
  styleUrls: ["./lead.component.scss"],
})
export class LeadComponent implements OnInit {
  public totalProperties: number = 7;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";
  conditions: any[] = [];
  decontaminationOptions: any[] = [];
  @Input()
  get model(): Lead {
    return this._model;
  }
  set model(value: Lead) {
    this._model = value;

    this.changeModel(null);
  }
  _model: Lead = new Lead();
  @Input() title: string = "";

  @Output() modelChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;
    if (this._model.cardinalDirection) {
      this.filledProperties++;
    }

    if (this._model.dimensionCm2) {
      this.filledProperties++;
    }
    if (this._model.labResults) {
      this.filledProperties++;
    }
    if (this._model.material) {
      this.filledProperties++;
    }
    if (this._model.observations) {
      this.filledProperties++;
    }
    if (this._model.sample) {
      this.filledProperties++;
    }
    if (this._model.typeOfSample) {
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

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Recomendations } from "src/app/models/comprehensive-form/recomendations";
import { AreaConditionType } from "src/app/models/enums";

@Component({
  selector: "app-recomendations",
  templateUrl: "./recomendations.component.html",
  styleUrls: ["./recomendations.component.scss"],
})
export class RecomendationsComponent implements OnInit {
  totalProperties: number = 1;
  filledProperties: number = 0;
  isMenuOpen: boolean = false;
  progressPercentage: number = 0;
  progressColor: string = "danger";
  _conditions: any[];

  @Input()
  set data(value: Recomendations) {
    if (!value.inspectionRecomendation) {
      value.inspectionRecomendation = [];
    }
    for (let index = 0; index < this._conditions.length; index++) {
      const element = this._conditions[index];
      this._conditions[index].checked = value.inspectionRecomendation.includes(
        element.name
      );
    }
    this._data = value;

    this.changeModel(null);
  }
  @Output() dataChanged: any = new EventEmitter();
  _data: Recomendations = new Recomendations();

  @Input() get type() {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
    switch (this.type) {
      case AreaConditionType.InspectionRecommendations.toString():
        this._conditions = [
          { name: "Roof Tarp / Wrap", checked: false },
          { name: "Dryout", checked: false },
          { name: "Environmental Inspection(s)", checked: false },
          { name: "Content Cleaning", checked: false },
          { name: "Asbestos Inspection", checked: false },
          { name: "Mold Remediation", checked: false },
          { name: "Roofer", checked: false },
          { name: "Plumber", checked: false },
          { name: "HVAC Tech", checked: false },
          { name: "General Contractor", checked: false },
          { name: "Electrician", checked: false },
          { name: "Public Adjuster / Attorney", checked: false },
          { name: "Handyman", checked: false },
          { name: "Water Quality Specialist", checked: false },
          { name: "AC Filter", checked: false },
          { name: "Other", checked: false },
        ];
        break;

      default:
        break;
    }
  }
  _type: string = "";

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;

    if (
      this._data.inspectionRecomendation.length > 0 ||
      this._data.recomendation
    ) {
      this.filledProperties++;
    }

    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    this.dataChanged.emit(this._data);

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
  onConditionChange($event, index: number) {
    var x = this._conditions.reduce(
      (result, { name, checked }) => [...result, ...(checked ? [name] : [])],
      []
    );
    this._data.inspectionRecomendation = x;
    this.changeModel(null);
  }
}

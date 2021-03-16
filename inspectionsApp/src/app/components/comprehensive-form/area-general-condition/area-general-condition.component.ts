import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Area } from "src/app/models/comprehensive-form/area";
import { AreaConditionType, BathroomConditions } from "src/app/models/enums";
import { GeneralCondition } from "src/app/models/comprehensive-form/general-condition";

@Component({
  selector: "app-area-general-condition",
  templateUrl: "./area-general-condition.component.html",
  styleUrls: ["./area-general-condition.component.scss"],
})
export class AreaGeneralConditionComponent implements OnInit {
  totalProperties: number = 4;
  filledProperties: number = 0;
  isMenuOpen: boolean = false;
  showSuccess: boolean = false;
  progressPercentage: number = 0;
  progressColor: string = "danger";
  _conditions: any[];
  titleColor = "primary";
  @Input()
  set InspectionArea(value: GeneralCondition) {
    if (!value.condition) {
      value.condition = [];
    }
    for (let index = 0; index < this._conditions.length; index++) {
      const element = this._conditions[index];
      this._conditions[index].checked = value.condition.includes(element.name);
    }
    this.generalCondition = value;

    this.changeModel(null);
  }
  generalCondition: GeneralCondition = new GeneralCondition();
  @Input() title: string = "";
  @Input() readonly: boolean = false;
  @Input() get type() {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
    switch (this.type) {
      case AreaConditionType.Bathroom.toString():
        this._conditions = [
          { name: "Shower pan", checked: false },
          { name: "Loose tiles", checked: false },
          { name: "Leak behind walls", checked: false },
          { name: "Shower head / Faucet", checked: false },
          { name: "Damaged Flooring", checked: false },
          { name: "Visible Mold", checked: false },
        ];
        break;
      case AreaConditionType.HVAC_AC.toString():
        this.titleColor = "";
        this.showSuccess = true;
        this._conditions = [
          { name: "AC Leak", checked: false },
          { name: "Drain pipe leak", checked: false },
          { name: "Damaged baseboards / Drywall / Flooring", checked: false },
          { name: "Dirty Filter", checked: false },
          { name: "Dirty Coil", checked: false },
          { name: "Visible Mold", checked: false },
        ];
        break;
      case AreaConditionType.Atic.toString():
        this.titleColor = "";
        this.showSuccess = true;
        this._conditions = [
          { name: "Visible water stains", checked: false },
          { name: "Mold Smell", checked: false },
          { name: "Wet insulation", checked: false },
          { name: "Visible Mold", checked: false },
        ];
        break;
      case AreaConditionType.UtilityRoom.toString():
        this.titleColor = "";
        this.showSuccess = true;
        this._conditions = [
          { name: "Washer Leak", checked: false },
          { name: "Drain Pipe Leak", checked: false },
          { name: "Leak Under Sink", checked: false },
          { name: "Supply Line Leak", checked: false },
          { name: "Drain Line Leak", checked: false },
          { name: "Damaged Baseboards / Flooring", checked: false },
          { name: "Visible Mold", checked: false },
        ];
        break;

      default:
        break;
    }
  }
  _type: string = "";
  @Output() InspectionAreaGeneralChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;

    if (this.generalCondition.condition.length > 0) {
      this.filledProperties++;
    }
    if (this.generalCondition.moistureLevel) {
      this.filledProperties++;
    }
    if (this.generalCondition.pictures.length > 0) {
      this.filledProperties++;
    }
    if (this.generalCondition.notes) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    this.InspectionAreaGeneralChanged.emit(this.generalCondition);

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
    this.generalCondition.condition = x;
    this.changeModel(null);
  }
}

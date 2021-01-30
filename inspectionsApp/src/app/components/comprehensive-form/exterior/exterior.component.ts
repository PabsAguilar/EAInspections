import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Exterior } from "src/app/models/comprehensive-form/exterior";
import { AreaConditionType } from "src/app/models/enums";

@Component({
  selector: "app-exterior",
  templateUrl: "./exterior.component.html",
  styleUrls: ["./exterior.component.scss"],
})
export class ExteriorComponent implements OnInit {
  totalProperties: number = 3;
  filledProperties: number = 0;
  isMenuOpen: boolean = false;
  progressPercentage: number = 0;
  progressColor: string = "danger";
  _conditions: any[];

  @Input()
  set data(value: Exterior) {
    if (!value.condition) {
      value.condition = [];
    }
    for (let index = 0; index < this._conditions.length; index++) {
      const element = this._conditions[index];
      this._conditions[index].checked = value.condition.includes(element.name);
    }
    this._data = value;

    this.changeModel(null);
  }
  @Output() dataChanged: any = new EventEmitter();
  _data: Exterior = new Exterior();

  @Input() get type() {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
    switch (this.type) {
      case AreaConditionType.Exterior.toString():
        this._conditions = [
          { name: "Blue Tarp", checked: false },
          { name: "Loose roof tiles / shingles", checked: false },
          { name: "Damaged window seals", checked: false },
          { name: "Cracks in walls or foundation", checked: false },
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

    if (this._data.condition.length > 0 || this._data.conditionOther) {
      this.filledProperties++;
    }

    if (this._data.pictures.length > 0) {
      this.filledProperties++;
    }
    if (this._data.notes) {
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
    this._data.condition = x;
    this.changeModel(null);
  }
}

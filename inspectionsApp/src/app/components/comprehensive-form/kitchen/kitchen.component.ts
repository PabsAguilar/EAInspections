import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AreaConditionType } from "src/app/models/enums";
import { Kitchen } from "src/app/models/kitchen";

@Component({
  selector: "app-kitchen",
  templateUrl: "./kitchen.component.html",
  styleUrls: ["./kitchen.component.scss"],
})
export class KitchenComponent implements OnInit {
  totalProperties: number = 4;
  filledProperties: number = 0;
  isMenuOpen: boolean = false;
  progressPercentage: number = 0;
  progressColor: string = "danger";
  _conditions: any[];

  @Input()
  set Kitchen(value: Kitchen) {
    if (!value.condition) {
      value.condition = [];
    }
    for (let index = 0; index < this._conditions.length; index++) {
      const element = this._conditions[index];
      this._conditions[index].checked = value.condition.includes(element.name);
    }
    this.kitchen = value;

    this.changeModel(null);
  }
  @Output() KitchenChanged: any = new EventEmitter();
  kitchen: Kitchen = new Kitchen();
  @Input() title: string = "";
  @Input() get type() {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
    switch (this.type) {
      case AreaConditionType.Kitchen.toString():
        this._conditions = [
          { name: "Leak under sink", checked: false },
          { name: "Damaged cabinets", checked: false },
          { name: "Broken Supply line", checked: false },
          { name: "Broken Drain line", checked: false },
          { name: "Damaged Flooring", checked: false },
          { name: "Dishwasher leak", checked: false },
          { name: "Visible Mold", checked: false },
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

    if (this.kitchen.condition.length > 0) {
      this.filledProperties++;
    }
    if (this.kitchen.moistureLevel) {
      this.filledProperties++;
    }
    if (this.kitchen.pictures.length > 0) {
      this.filledProperties++;
    }
    if (this.kitchen.notes) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    this.KitchenChanged.emit(this.kitchen);

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
    this.kitchen.condition = x;
    this.changeModel(null);
  }
}

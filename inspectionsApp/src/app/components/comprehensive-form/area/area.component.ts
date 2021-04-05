import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Area } from "src/app/models/comprehensive-form/area";

@Component({
  selector: "app-area",
  templateUrl: "./area.component.html",
  styleUrls: ["./area.component.scss"],
})
export class AreaComponent implements OnInit {
  public totalProperties: number = 5;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";

  @Input()
  get InspectionArea(): Area {
    return this.area;
  }
  set InspectionArea(value: Area) {
    if (!value.condition) {
      value.condition = [];
    }
    for (let index = 0; index < this.conditions.length; index++) {
      const element = this.conditions[index];
      this.conditions[index].checked = value.condition.includes(element.name);
    }
    this.area = value;
    this.changeModel(null);
  }
  area: Area = new Area();
  @Input() readonly: boolean = false;
  @Input() title: string = "";
  @Output() InspectionAreaChanged: any = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;
    if (this.area.name) {
      this.filledProperties++;
    }
    if (this.area.condition.length > 0) {
      this.filledProperties++;
    }
    if (this.area.moistureLevel) {
      this.filledProperties++;
    }
    if (this.area.pictures.length > 0) {
      this.filledProperties++;
    }
    if (this.area.notes) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    

    this.InspectionAreaChanged.emit(this.area);

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
    var x = this.conditions.reduce(
      (result, { name, checked }) => [...result, ...(checked ? [name] : [])],
      []
    );
    this.area.condition = x;
    this.changeModel(null);
  }

  conditions: any[] = [
    { name: "Ceiling stains", checked: false },
    { name: "Visible mold", checked: false },
    { name: "Damaged baseboards / Flooring", checked: false },
    { name: "Window / Door leak", checked: false },
    { name: "Cracked walls / ceilings", checked: false },
    { name: "Dirty AC ducts", checked: false },
  ];
}

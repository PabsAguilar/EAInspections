import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  AreaConditionType,
  bitrixMappingComprehensive,
} from "src/app/models/enums";
import { Kitchen } from "src/app/models/comprehensive-form/kitchen";
import { ItestDealService } from "src/app/services/itest-deal.service";

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
  waterQualityList: any[];
  fields: any[];

  @Input()
  set Kitchen(value: Kitchen) {
    this.kitchen = value;
    this.inspectionService.getDealsFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this._conditions = this.fields[
          bitrixMappingComprehensive.Kitchen.conditionCode
        ].items
          .filter((x) => x.ID != "1893" && x.ID != "1899")
          .map((y) => ({ name: y.VALUE, value: y.ID, checked: false }));

        this.waterQualityList = this.fields[
          bitrixMappingComprehensive.Kitchen.waterQualityTestCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
      }
    });
    this.changeModel("init");
  }
  @Output() KitchenChanged: any = new EventEmitter();
  kitchen: Kitchen = new Kitchen();
  @Input() readonly: boolean = false;
  @Input() title: string = "";
  @Input() get type() {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
  }
  _type: string = "";

  constructor(private inspectionService: ItestDealService) {}

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
    if (this.kitchen.pictures.images.length > 0) {
      this.filledProperties++;
    }
    if (this.kitchen.notes) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    if ($event != "init") {
      this.KitchenChanged.emit(this.kitchen);
    }

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

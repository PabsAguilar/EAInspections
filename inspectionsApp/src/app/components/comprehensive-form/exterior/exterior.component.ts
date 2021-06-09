import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Exterior } from "src/app/models/comprehensive-form/exterior";
import {
  AreaConditionType,
  bitrixMappingComprehensive,
} from "src/app/models/enums";
import { ItestDealService } from "src/app/services/itest-deal.service";

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
  fields: any[];

  @Input()
  set data(value: Exterior) {
    this._data = value;

    this.inspectionService.getDealsFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this._conditions = this.fields[
          bitrixMappingComprehensive.Exterior.conditionCode
        ].items
          .filter((x) => x.ID != "1893" && x.ID != "1899")
          .map((y) => ({ name: y.VALUE, value: y.ID, checked: false }));
      }
    });
    this.changeModel("init");
  }
  @Output() dataChanged: any = new EventEmitter();
  _data: Exterior = new Exterior();

  @Input() get type() {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
  }
  _type: string = "";

  @Input() readonly: boolean = false;
  constructor(private inspectionService: ItestDealService) {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;

    if (this._data.condition.length > 0 || this._data.conditionOther) {
      this.filledProperties++;
    }

    if (this._data.pictures.images.length > 0) {
      this.filledProperties++;
    }
    if (this._data.notes) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    if ($event != "init") {
      this.dataChanged.emit(this._data);
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
}

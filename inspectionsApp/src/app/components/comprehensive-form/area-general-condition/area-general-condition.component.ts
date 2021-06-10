import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Area } from "src/app/models/comprehensive-form/area";
import {
  AreaConditionType,
  BathroomConditions,
  bitrixMappingComprehensive,
  ENDealMapping,
} from "src/app/models/enums";
import { GeneralCondition } from "src/app/models/comprehensive-form/general-condition";
import { ItestDealService } from "src/app/services/itest-deal.service";

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
  fields: any[];
  titleColor = "primary";
  @Input()
  set InspectionArea(value: GeneralCondition) {
    this.generalCondition = value;

    this.changeModel("init");
  }
  generalCondition: GeneralCondition = new GeneralCondition();
  @Input() title: string = "";
  @Input() index: number = 0;
  @Input() readonly: boolean = false;
  @Input() get type() {
    return this._type;
  }
  set type(value: string) {
    this._type = value;

    this.inspectionService.getDealsFields().then((x) => {
      this.fields = x[0];
      if (value) {
        switch (this.type) {
          case AreaConditionType.Bathroom.toString():
            this._conditions = this.fields[
              bitrixMappingComprehensive.Bathrooms.conditionCode[this.index]
            ].items
              .filter((x) => x.ID != "1893" && x.ID != "1899")
              .map((y) => ({ name: y.VALUE, value: y.ID, checked: false }));

            break;
          case AreaConditionType.HVAC_AC.toString():
            this.titleColor = "";
            this.showSuccess = true;

            this._conditions = this.fields[
              bitrixMappingComprehensive.HVAC_AC.conditionCode
            ].items
              .filter((x) => x.ID != "1893" && x.ID != "1899")
              .map((y) => ({ name: y.VALUE, value: y.ID, checked: false }));

            break;
          case AreaConditionType.Atic.toString():
            this.titleColor = "";
            this.showSuccess = true;
            this._conditions = this.fields[
              bitrixMappingComprehensive.Attic.conditionCode
            ].items
              .filter((x) => x.ID != "1893" && x.ID != "1899")
              .map((y) => ({ name: y.VALUE, value: y.ID, checked: false }));
            break;
          case AreaConditionType.UtilityRoom.toString():
            this.titleColor = "";
            this.showSuccess = true;
            this._conditions = this.fields[
              bitrixMappingComprehensive.UtilityRoom.conditionCode
            ].items
              .filter((x) => x.ID != "1893" && x.ID != "1899")
              .map((y) => ({ name: y.VALUE, value: y.ID, checked: false }));

            break;

          default:
            break;
        }

        this.changeModel("init");
      }
    });
  }
  _type: string = "";
  @Output() InspectionAreaGeneralChanged: any = new EventEmitter();

  constructor(private inspectionService: ItestDealService) {}

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
    if (this.generalCondition.pictures.images.length > 0) {
      this.filledProperties++;
    }
    if (this.generalCondition.notes) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    if ($event != "init") {
      this.InspectionAreaGeneralChanged.emit(this.generalCondition);
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
    this.generalCondition.condition = x;
    this.changeModel(null);
  }
}

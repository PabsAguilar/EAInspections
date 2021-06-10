import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Area } from "src/app/models/comprehensive-form/area";
import { bitrixMappingComprehensive } from "src/app/models/enums";
import { ItestDealService } from "src/app/services/itest-deal.service";

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
  fields: any[];
  conditions: any[];
  areaNameList: any[];
  selectAreaName: string = "";
  @Input() index: number;
  @Input()
  get InspectionArea(): Area {
    return this.area;
  }
  set InspectionArea(value: Area) {
    this.area = value;
    this.inspectionService.getDealsFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this.conditions = this.fields[
          bitrixMappingComprehensive.Area.conditionCode[this.index]
        ].items
          .filter((x) => x.ID != "1893" && x.ID != "1899")
          .map((y) => ({ name: y.VALUE, value: y.ID, checked: false }));

        this.areaNameList = this.fields[
          bitrixMappingComprehensive.Area.nameCode[this.index]
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
        this.changeModel("init");
      }
    });
  }
  area: Area = new Area();

  @Input() title: string = "";
  @Output() InspectionAreaChanged: any = new EventEmitter();
  @Input() readonly: boolean = false;
  constructor(private inspectionService: ItestDealService) {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;
    if (this.area.name) {
      this.selectAreaName = !this.areaNameList
        ? ""
        : this.areaNameList.find((x) => x.value == this.area.name)?.name;
      this.filledProperties++;
    }
    if (this.area.condition.length > 0) {
      this.filledProperties++;
    }
    if (this.area.moistureLevel) {
      this.filledProperties++;
    }
    if (this.area.pictures.images.length > 0) {
      this.filledProperties++;
    }
    if (this.area.notes) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    if ($event != "init") {
      this.InspectionAreaChanged.emit(this.area);
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
  // onConditionChange($event, index: number) {
  //   var x = this.conditions.reduce(
  //     (result, { name, checked }) => [...result, ...(checked ? [name] : [])],
  //     []
  //   );
  //   this.area.condition = x;
  //   this.changeModel(null);
  // }
}

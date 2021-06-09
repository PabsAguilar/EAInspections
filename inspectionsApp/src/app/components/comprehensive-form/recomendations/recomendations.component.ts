import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Recomendations } from "src/app/models/comprehensive-form/recomendations";
import {
  AreaConditionType,
  bitrixMappingComprehensive,
} from "src/app/models/enums";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-recomendations",
  templateUrl: "./recomendations.component.html",
  styleUrls: ["./recomendations.component.scss"],
})
export class RecomendationsComponent implements OnInit {
  totalProperties: number = 2;
  filledProperties: number = 0;
  isMenuOpen: boolean = false;
  progressPercentage: number = 0;
  progressColor: string = "danger";
  recomendationsList: any[];
  damageFoundList: any[];
  fields = [];
  @Input()
  set data(value: Recomendations) {
    this._data = value;

    this.inspectionService.getDealsFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this.recomendationsList = this.fields[
          bitrixMappingComprehensive.Recomendations.inspectionRecomendationCode
        ].items
          .filter((x) => x.ID != "1893" && x.ID != "1899")
          .map((y) => ({ name: y.VALUE, value: y.ID, checked: false }));
        this.damageFoundList = this.fields[
          bitrixMappingComprehensive.Recomendations.damagesFoundCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
      }
    });
    this.changeModel("init");
  }
  @Output() dataChanged: any = new EventEmitter();
  _data: Recomendations = new Recomendations();

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

    if (
      this._data.inspectionRecomendation.length > 0 ||
      this._data.recomendation
    ) {
      this.filledProperties++;
    }
    if (this._data.damagesFound) {
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

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ComprehensiveEnvironmentalSection } from "src/app/models/comprehensive-form/comprehensive-environmental-section";
import { bitrixMappingComprehensive } from "src/app/models/enums";
import { ItestDealService } from "src/app/services/itest-deal.service";

@Component({
  selector: "app-enviromental-section",
  templateUrl: "./enviromental-section.component.html",
  styleUrls: ["./enviromental-section.component.scss"],
})
export class EnviromentalSectionComponent implements OnInit {
  totalProperties: number = 3;
  filledProperties: number = 0;
  isMenuOpen: boolean = false;
  progressPercentage: number = 0;
  progressColor: string = "danger";
  moldSampleTakenList: any[];
  waterSampleTakenList: any[];
  waterSampleLocationList: any[];
  majorReconstructionList: any[];
  fields = [];
  @Input()
  get data(): ComprehensiveEnvironmentalSection {
    return this._data;
  }
  set data(value: ComprehensiveEnvironmentalSection) {
    this._data = value;
    this.inspectionService.getDealsFields().then((x) => {
      this.fields = x[0];
      if (value) {
        this.moldSampleTakenList = this.fields[
          bitrixMappingComprehensive.EnvironmentalSection.MoldSampleTakenCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
        this.waterSampleLocationList = this.fields[
          bitrixMappingComprehensive.EnvironmentalSection
            .WaterSamplelocationCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
        this.waterSampleTakenList = this.fields[
          bitrixMappingComprehensive.EnvironmentalSection.WaterSampleTakenCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });

        this.majorReconstructionList = this.fields[
          bitrixMappingComprehensive.EnvironmentalSection
            .MajorReconstructionCode
        ].items.map((y) => {
          return { name: y.VALUE, value: y.ID };
        });
      }
    });
    this.changeModel("init");
  }
  @Output() dataChanged: any = new EventEmitter();
  _data: ComprehensiveEnvironmentalSection =
    new ComprehensiveEnvironmentalSection();

  @Input() readonly: boolean = false;

  constructor(private inspectionService: ItestDealService) {}
  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;

    if (this._data.MoldLocationPicture.images.length > 0) {
      this.filledProperties++;
    }
    if (this._data.MoldSampleLocation) {
      this.filledProperties++;
    }
    if (this._data.WaterSamplelocation) {
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

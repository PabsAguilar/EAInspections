import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ComprehensiveEnvironmentalSection } from "src/app/models/comprehensive-form/comprehensive-environmental-section";

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

  @Input()
  get data(): ComprehensiveEnvironmentalSection {
    return this._data;
  }
  set data(value: ComprehensiveEnvironmentalSection) {
    this._data = value;
    this.changeModel(null);
  }
  @Output() dataChanged: any = new EventEmitter();
  _data: ComprehensiveEnvironmentalSection = new ComprehensiveEnvironmentalSection();

  constructor() {}

  ngOnInit() {}

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  changeModel($event) {
    this.filledProperties = 0;

    if (this._data.MoldLocationPicture.length > 0) {
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
}

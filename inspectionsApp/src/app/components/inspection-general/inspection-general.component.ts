import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { GeneralInfoInspection } from "src/app/models/general-info-inspection";
import { PhotoService } from "src/app/services/photo.service";
import { ImageModalPage } from "../image-modal/image-modal.page";

@Component({
  selector: "app-inspection-general",
  templateUrl: "./inspection-general.component.html",
  styleUrls: ["./inspection-general.component.scss"],
})
export class InspectionGeneralComponent implements OnInit {
  public totalProperties: number = 4;
  public filledProperties: number = 0;
  public isMenuOpen: boolean = false;
  public progressPercentage: number = 0;
  public progressColor: string = "danger";
  public today: Date = new Date();
  maxDate: number = this.today.getFullYear();
  minDate: number = this.today.setFullYear(this.today.getFullYear() - 100);

  generalInfoInspection: GeneralInfoInspection = new GeneralInfoInspection();
  formatDate(date) {
    let d = new Date(date),
      day = "" + d.getDate(),
      month = "" + (d.getMonth() + 1),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }

  @Input()
  get generalInfo(): GeneralInfoInspection {
    return this.generalInfoInspection;
  }
  set generalInfo(value: GeneralInfoInspection) {
    this.generalInfoInspection = value;
    this.changeModel(null);
  }

  @Output() generalInfoChanged: any = new EventEmitter();

  constructor(public photoService: PhotoService) {}

  ngOnInit() {}
  changeModel($event) {
    this.filledProperties = 0;
    if (
      this.generalInfoInspection.propertyYear &&
      this.generalInfoInspection.propertyYear > 0
    ) {
      this.filledProperties++;
    }
    if (this.generalInfoInspection.propertyType) {
      this.filledProperties++;
    }
    if (this.generalInfoInspection.pictureHouseNumbers) {
      this.filledProperties++;
    }
    if (
      this.generalInfoInspection.picturesFrontHouse &&
      this.generalInfoInspection.picturesFrontHouse.length > 0
    ) {
      this.filledProperties++;
    }
    this.progressPercentage =
      this.filledProperties == 0
        ? 0
        : this.filledProperties / this.totalProperties;

    this.generalInfoChanged.emit(this.generalInfoInspection);

    switch (true) {
      case this.progressPercentage < 0.5:
        this.progressColor = "danger";
        break;
      case this.progressPercentage <= 0.75:
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

  onChangeYear(event: any, value: number) {
    this.generalInfoInspection.propertyYear = value;
    this.changeModel(event);
  }

  public async takePictureHouseNumbers() {
    this.generalInfoInspection.pictureHouseNumbers = await this.photoService.takePhoto();
    this.changeModel(null);
  }
  public photoEvent(): void {
    console.log("event!!!!");
  }
  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

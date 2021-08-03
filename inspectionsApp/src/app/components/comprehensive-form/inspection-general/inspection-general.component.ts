import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { GeneralInfoInspection } from "src/app/models/comprehensive-form/general-info-inspection";
import {
  ENDealMapping,
  InspectionType,
  ITestDealMapping,
} from "src/app/models/enums";
import { InspectionTask } from "src/app/models/inspection-task";
import { ItestDealService } from "src/app/services/itest-deal.service";
import { PhotoService } from "src/app/services/photo.service";

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
  @Input() readonly: boolean = false;

  propertyTypeList = [];
  HHVACConditions = [];
  DuctConditions = [];
  AticConditions = [];
  fields: any[];

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
  @Input() task = new InspectionTask();

  @Input()
  get generalInfo(): GeneralInfoInspection {
    return this.generalInfoInspection;
  }
  set generalInfo(value: GeneralInfoInspection) {
    if (value.environmentalInspection) {
      this.totalProperties = 7;
    }
    this.generalInfoInspection = value;

    try {
      this.inspectionService.getDealsFields().then((x) => {
        this.fields = x[0];
        if (value) {
          if (this.generalInfoInspection.environmentalInspection == true) {
            this.propertyTypeList = this.fields[
              ITestDealMapping.propertyTypeCode
            ].items.map((y) => {
              return { name: y.VALUE, value: y.ID };
            });

            if (value.environmentalInspection) {
              this.fields[ITestDealMapping.agreementSignedYesNoCode].items.map(
                (y) => {
                  if (y.VALUE == "Yes") {
                    this.generalInfoInspection.agreementSignedYesNo = y.ID;
                  }
                }
              );

              this.HHVACConditions = this.fields[
                ITestDealMapping.HVACSystemConditionCode
              ].items.map((y) => {
                return { name: y.VALUE, value: y.ID };
              });

              this.DuctConditions = this.fields[
                ITestDealMapping.ductsConditionCode
              ].items.map((y) => {
                return { name: y.VALUE, value: y.ID };
              });

              this.AticConditions = this.fields[
                ITestDealMapping.atticConditionCode
              ].items.map((y) => {
                return { name: y.VALUE, value: y.ID };
              });
            }
          } else {
            this.propertyTypeList = this.fields[
              ENDealMapping.propertyTypeCode
            ].items.map((y) => {
              return { name: y.VALUE, value: y.ID };
            });
          }
        }
      });

      this.changeModel(null);
    } catch (error) {
      console.log("Unspected error changing model.");
      console.log(error);
    }
  }

  @Output() generalInfoChanged: any = new EventEmitter();

  constructor(
    public photoService: PhotoService,
    private inspectionService: ItestDealService
  ) {}

  ngOnInit() {}
  changeModel($event) {
    try {
      //console.log(this.generalInfoInspection);
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
      if (this.generalInfoInspection.pictureHouseNumbers.images.length > 0) {
        this.filledProperties++;
      }
      if (
        this.generalInfoInspection.picturesFrontHouse &&
        this.generalInfoInspection.picturesFrontHouse.images.length > 0
      ) {
        this.filledProperties++;
      }
      if (this.generalInfoInspection.environmentalInspection) {
        if (this.generalInfoInspection.interiorTemperature) {
          this.filledProperties++;
        }
        if (this.generalInfoInspection.exteriorRelativeHumidity) {
          this.filledProperties++;
        }
        if (this.generalInfoInspection.HVACSystemCondition) {
          this.filledProperties++;
        }
        if (this.generalInfoInspection.atticCondition) {
          this.filledProperties++;
        }
        if (this.generalInfoInspection.ductsCondition) {
          this.filledProperties++;
        }
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
    } catch (error) {
      console.log(error);
    }
  }

  onChangeYear(event: any, value: number) {
    this.generalInfoInspection.propertyYear = value;
    this.changeModel(event);
  }

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

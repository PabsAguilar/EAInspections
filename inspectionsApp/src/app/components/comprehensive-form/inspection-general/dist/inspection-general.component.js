"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InspectionGeneralComponent = void 0;
var core_1 = require("@angular/core");
var general_info_inspection_1 = require("src/app/models/comprehensive-form/general-info-inspection");
var enums_1 = require("src/app/models/enums");
var inspection_task_1 = require("src/app/models/inspection-task");
var InspectionGeneralComponent = /** @class */ (function () {
    function InspectionGeneralComponent(photoService, inspectionService) {
        this.photoService = photoService;
        this.inspectionService = inspectionService;
        this.totalProperties = 4;
        this.filledProperties = 0;
        this.isMenuOpen = false;
        this.progressPercentage = 0;
        this.progressColor = "danger";
        this.today = new Date();
        this.maxDate = this.today.getFullYear();
        this.minDate = this.today.setFullYear(this.today.getFullYear() - 100);
        this.readonly = false;
        this.propertyTypeList = [];
        this.HHVACConditions = [];
        this.DuctConditions = [];
        this.AticConditions = [];
        this.generalInfoInspection = new general_info_inspection_1.GeneralInfoInspection();
        this.task = new inspection_task_1.InspectionTask();
        this.generalInfoChanged = new core_1.EventEmitter();
    }
    InspectionGeneralComponent.prototype.formatDate = function (date) {
        var d = new Date(date), day = "" + d.getDate(), month = "" + (d.getMonth() + 1), year = d.getFullYear();
        if (month.length < 2)
            month = "0" + month;
        if (day.length < 2)
            day = "0" + day;
        return [year, month, day].join("-");
    };
    Object.defineProperty(InspectionGeneralComponent.prototype, "generalInfo", {
        get: function () {
            return this.generalInfoInspection;
        },
        set: function (value) {
            var _this = this;
            if (value.environmentalInspection) {
                this.totalProperties = 7;
            }
            this.generalInfoInspection = value;
            try {
                this.inspectionService.getDealsFields().then(function (x) {
                    _this.fields = x[0];
                    if (value) {
                        if (_this.generalInfoInspection.environmentalInspection == true) {
                            _this.propertyTypeList = _this.fields[enums_1.ITestDealMapping.propertyTypeCode].items.map(function (y) {
                                return { name: y.VALUE, value: y.ID };
                            });
                            if (value.environmentalInspection) {
                                _this.fields[enums_1.ITestDealMapping.agreementSignedYesNoCode].items.map(function (y) {
                                    if (y.VALUE == "Yes") {
                                        _this.generalInfoInspection.agreementSignedYesNo = y.ID;
                                    }
                                });
                                _this.HHVACConditions = _this.fields[enums_1.ITestDealMapping.HVACSystemConditionCode].items.map(function (y) {
                                    return { name: y.VALUE, value: y.ID };
                                });
                                _this.DuctConditions = _this.fields[enums_1.ITestDealMapping.ductsConditionCode].items.map(function (y) {
                                    return { name: y.VALUE, value: y.ID };
                                });
                                _this.AticConditions = _this.fields[enums_1.ITestDealMapping.atticConditionCode].items.map(function (y) {
                                    return { name: y.VALUE, value: y.ID };
                                });
                            }
                        }
                        else {
                            _this.propertyTypeList = _this.fields[enums_1.ENDealMapping.propertyTypeCode].items.map(function (y) {
                                return { name: y.VALUE, value: y.ID };
                            });
                        }
                    }
                });
                this.changeModel("init");
            }
            catch (error) {
                console.log("Unspected error changing model.");
                console.log(error);
            }
        },
        enumerable: false,
        configurable: true
    });
    InspectionGeneralComponent.prototype.ngOnInit = function () { };
    InspectionGeneralComponent.prototype.changeModel = function ($event) {
        try {
            this.filledProperties = 0;
            if (this.generalInfoInspection.propertyYear &&
                this.generalInfoInspection.propertyYear > 0) {
                this.filledProperties++;
            }
            if (this.generalInfoInspection.propertyType) {
                this.filledProperties++;
            }
            if (this.generalInfoInspection.pictureHouseNumbers.images.length > 0) {
                this.filledProperties++;
            }
            if (this.generalInfoInspection.picturesFrontHouse &&
                this.generalInfoInspection.picturesFrontHouse.images.length > 0) {
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
            if ($event != "init") {
                this.generalInfoInspection.syncInfo.updated = true;
            }
            this.progressPercentage =
                this.filledProperties == 0
                    ? 0
                    : this.filledProperties / this.totalProperties;
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
        catch (error) {
            console.log(error);
        }
    };
    InspectionGeneralComponent.prototype.onChangeYear = function (event, value) {
        this.generalInfoInspection.propertyYear = value;
        this.changeModel(event);
    };
    InspectionGeneralComponent.prototype.toggleAccordion = function () {
        this.isMenuOpen = !this.isMenuOpen;
        this.generalInfoChanged.emit("save");
    };
    __decorate([
        core_1.Input()
    ], InspectionGeneralComponent.prototype, "readonly");
    __decorate([
        core_1.Input()
    ], InspectionGeneralComponent.prototype, "task");
    __decorate([
        core_1.Input()
    ], InspectionGeneralComponent.prototype, "generalInfo");
    __decorate([
        core_1.Output()
    ], InspectionGeneralComponent.prototype, "generalInfoChanged");
    InspectionGeneralComponent = __decorate([
        core_1.Component({
            selector: "app-inspection-general",
            templateUrl: "./inspection-general.component.html",
            styleUrls: ["./inspection-general.component.scss"]
        })
    ], InspectionGeneralComponent);
    return InspectionGeneralComponent;
}());
exports.InspectionGeneralComponent = InspectionGeneralComponent;

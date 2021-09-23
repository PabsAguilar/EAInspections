"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MoistureMappingComponent = void 0;
var core_1 = require("@angular/core");
var bitrix_picture_1 = require("src/app/models/bitrix-picture");
var enums_1 = require("src/app/models/enums");
var moisture_mapping_1 = require("src/app/models/environmental-form/moisture-mapping");
var MoistureMappingComponent = /** @class */ (function () {
    function MoistureMappingComponent(inspectionStorage) {
        this.inspectionStorage = inspectionStorage;
        this.totalProperties = 9;
        this.filledProperties = 0;
        this.isMenuOpen = false;
        this.progressPercentage = 0;
        this.progressColor = "danger";
        this.listArea = [];
        this.other = "";
        this.conditions = [];
        this.decontaminationOptions = [];
        this.fields = [];
        this._model = new moisture_mapping_1.MoistureMapping();
        this.title = "";
        this.readonly = false;
        this.modelChanged = new core_1.EventEmitter();
    }
    Object.defineProperty(MoistureMappingComponent.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (value) {
            var _this = this;
            this._model = value;
            if (!this._model.areaPictures) {
                this._model.areaPictures = new bitrix_picture_1.BitrixPictureList();
            }
            this.inspectionStorage.getEnvironmentalInspectionFields().then(function (x) {
                _this.fields = x[0];
                if (value) {
                    _this.listArea = Object.entries(_this.fields[enums_1.bitrixMappingEnvironmental.Moisture.areaCode[_this.index]]
                        .DISPLAY_VALUES_FORM)
                        .sort(function (a, b) {
                        if (a[1].toLowerCase().includes("control") &&
                            !b[1].toLowerCase().includes("control")) {
                            return -1;
                        }
                        else if (!a[1].toLowerCase().includes("control") &&
                            b[1].toLowerCase().includes("control")) {
                            return 1;
                        }
                        else
                            return 0;
                    })
                        .map(function (_a) {
                        var k = _a[0], v = _a[1];
                        if (v.toLowerCase().includes("other")) {
                            _this.other = k;
                        }
                        return { name: v, value: k };
                    });
                    _this.changeModel("init");
                }
            });
            //this.changeModel("init");
        },
        enumerable: false,
        configurable: true
    });
    MoistureMappingComponent.prototype.ngOnInit = function () { };
    MoistureMappingComponent.prototype.toggleAccordion = function () {
        this.isMenuOpen = !this.isMenuOpen;
        this.modelChanged.emit("refresh");
        this.changeModel("init");
    };
    MoistureMappingComponent.prototype.changeModel = function ($event) {
        var _this = this;
        var _a;
        if ($event != "init") {
            this._model.syncInfo.updated = true;
        }
        try {
            var progress = 0;
            this.filledProperties = 0;
            if (this._model.area) {
                progress++;
                this.selectAreaName = (_a = this.listArea.find(function (x) { return x.value == _this._model.area; })) === null || _a === void 0 ? void 0 : _a.name;
                if (this.selectAreaName &&
                    this.selectAreaName.toLowerCase().includes("other") &&
                    this._model.areaOther) {
                    this.selectAreaName = this._model.areaOther;
                }
            }
            if (this._model.dewPoint) {
                progress++;
            }
            if (this._model.relativeHumidity) {
                progress++;
            }
            if (this._model.roomTemp) {
                progress++;
            }
            if (this._model.standardTemperatureCeiling) {
                progress++;
            }
            if (this._model.standardTemperatureEast) {
                progress++;
            }
            if (this._model.standardTemperatureFloor) {
                progress++;
            }
            if (this._model.standardTemperatureNorth) {
                progress++;
            }
            if (this._model.standardTemperatureSouth) {
                progress++;
            }
            if (this._model.standardTemperatureWest) {
                progress++;
            }
            this.progressPercentage =
                progress == 0 ? 0 : progress / this.totalProperties;
            this.filledProperties = progress;
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
            console.log("Unspected error changing model.");
            console.log(error);
        }
    };
    __decorate([
        core_1.Input()
    ], MoistureMappingComponent.prototype, "model");
    __decorate([
        core_1.Input()
    ], MoistureMappingComponent.prototype, "title");
    __decorate([
        core_1.Input()
    ], MoistureMappingComponent.prototype, "index");
    __decorate([
        core_1.Input()
    ], MoistureMappingComponent.prototype, "readonly");
    __decorate([
        core_1.Output()
    ], MoistureMappingComponent.prototype, "modelChanged");
    MoistureMappingComponent = __decorate([
        core_1.Component({
            selector: "app-moisture-mapping",
            templateUrl: "./moisture-mapping.component.html",
            styleUrls: ["./moisture-mapping.component.scss"]
        })
    ], MoistureMappingComponent);
    return MoistureMappingComponent;
}());
exports.MoistureMappingComponent = MoistureMappingComponent;

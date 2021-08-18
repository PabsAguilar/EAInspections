"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.AreaGeneralConditionComponent = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/models/enums");
var general_condition_1 = require("src/app/models/comprehensive-form/general-condition");
var AreaGeneralConditionComponent = /** @class */ (function () {
    function AreaGeneralConditionComponent(inspectionService) {
        this.inspectionService = inspectionService;
        this.totalProperties = 4;
        this.filledProperties = 0;
        this.isMenuOpen = false;
        this.showSuccess = false;
        this.progressPercentage = 0;
        this.progressColor = "danger";
        this.titleColor = "primary";
        this.generalCondition = new general_condition_1.GeneralCondition();
        this.title = "";
        this.index = 0;
        this.readonly = false;
        this._type = "";
        this.InspectionAreaGeneralChanged = new core_1.EventEmitter();
    }
    Object.defineProperty(AreaGeneralConditionComponent.prototype, "InspectionArea", {
        set: function (value) {
            this.generalCondition = value;
            this.changeModel("init");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AreaGeneralConditionComponent.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            var _this = this;
            this._type = value;
            this.inspectionService.getDealsFields().then(function (x) {
                _this.fields = x[0];
                if (value) {
                    switch (_this.type) {
                        case enums_1.AreaConditionType.Bathroom.toString():
                            _this._conditions = _this.fields[enums_1.bitrixMappingComprehensive.Bathrooms.conditionCode[_this.index]].items
                                .filter(function (x) { return x.ID != "1893" && x.ID != "1899"; })
                                .map(function (y) { return ({ name: y.VALUE, value: y.ID, checked: false }); });
                            break;
                        case enums_1.AreaConditionType.HVAC_AC.toString():
                            _this.titleColor = "";
                            _this.showSuccess = true;
                            _this._conditions = _this.fields[enums_1.bitrixMappingComprehensive.HVAC_AC.conditionCode].items
                                .filter(function (x) { return x.ID != "1893" && x.ID != "1899"; })
                                .map(function (y) { return ({ name: y.VALUE, value: y.ID, checked: false }); });
                            break;
                        case enums_1.AreaConditionType.Atic.toString():
                            _this.titleColor = "";
                            _this.showSuccess = true;
                            _this._conditions = _this.fields[enums_1.bitrixMappingComprehensive.Attic.conditionCode].items
                                .filter(function (x) { return x.ID != "1893" && x.ID != "1899"; })
                                .map(function (y) { return ({ name: y.VALUE, value: y.ID, checked: false }); });
                            break;
                        case enums_1.AreaConditionType.UtilityRoom.toString():
                            _this.titleColor = "";
                            _this.showSuccess = true;
                            _this._conditions = _this.fields[enums_1.bitrixMappingComprehensive.UtilityRoom.conditionCode].items
                                .filter(function (x) { return x.ID != "1893" && x.ID != "1899"; })
                                .map(function (y) { return ({ name: y.VALUE, value: y.ID, checked: false }); });
                            break;
                        default:
                            break;
                    }
                    _this.changeModel("init");
                }
            });
        },
        enumerable: false,
        configurable: true
    });
    AreaGeneralConditionComponent.prototype.ngOnInit = function () { };
    AreaGeneralConditionComponent.prototype.toggleAccordion = function () {
        this.isMenuOpen = !this.isMenuOpen;
        this.InspectionAreaGeneralChanged.emit(this.generalCondition);
    };
    AreaGeneralConditionComponent.prototype.changeModel = function ($event) {
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
            //this.InspectionAreaGeneralChanged.emit(this.generalCondition);
            this.generalCondition.updated = true;
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
    };
    AreaGeneralConditionComponent.prototype.onConditionChange = function ($event, index) {
        var x = this._conditions.reduce(function (result, _a) {
            var name = _a.name, checked = _a.checked;
            return __spreadArrays(result, (checked ? [name] : []));
        }, []);
        this.generalCondition.condition = x;
        this.changeModel(null);
    };
    __decorate([
        core_1.Input()
    ], AreaGeneralConditionComponent.prototype, "InspectionArea");
    __decorate([
        core_1.Input()
    ], AreaGeneralConditionComponent.prototype, "title");
    __decorate([
        core_1.Input()
    ], AreaGeneralConditionComponent.prototype, "index");
    __decorate([
        core_1.Input()
    ], AreaGeneralConditionComponent.prototype, "readonly");
    __decorate([
        core_1.Input()
    ], AreaGeneralConditionComponent.prototype, "type");
    __decorate([
        core_1.Output()
    ], AreaGeneralConditionComponent.prototype, "InspectionAreaGeneralChanged");
    AreaGeneralConditionComponent = __decorate([
        core_1.Component({
            selector: "app-area-general-condition",
            templateUrl: "./area-general-condition.component.html",
            styleUrls: ["./area-general-condition.component.scss"]
        })
    ], AreaGeneralConditionComponent);
    return AreaGeneralConditionComponent;
}());
exports.AreaGeneralConditionComponent = AreaGeneralConditionComponent;

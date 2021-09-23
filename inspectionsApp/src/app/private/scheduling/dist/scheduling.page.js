"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SchedulingPage = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("src/app/models/enums");
var scheduling_1 = require("src/app/models/scheduling");
var user_1 = require("src/app/models/user");
var company_search_page_1 = require("../company-search/company-search.page");
var contact_search_page_1 = require("../contact-search/contact-search.page");
var SchedulingPage = /** @class */ (function () {
    function SchedulingPage(schedulingStorageService, modalController, authenticationService, navigateService, inspectionService, alertController, syncInspectionService, toast, route, router) {
        var _this = this;
        this.schedulingStorageService = schedulingStorageService;
        this.modalController = modalController;
        this.authenticationService = authenticationService;
        this.navigateService = navigateService;
        this.inspectionService = inspectionService;
        this.alertController = alertController;
        this.syncInspectionService = syncInspectionService;
        this.toast = toast;
        this.route = route;
        this.router = router;
        this.today = new Date();
        this.minDate = this.formatDate(this.today);
        this.maxDate = this.formatDate(this.today.setFullYear(this.today.getFullYear() + 1));
        this.scheduling = new scheduling_1.Scheduling();
        this.inspectionTypes = [];
        this.inspectorsList = [];
        this.user = new user_1.User();
        this.scheduling = new scheduling_1.Scheduling();
        this.route.queryParams.subscribe(function (params) {
            if (_this.router.getCurrentNavigation().extras.state) {
                _this.scheduling =
                    _this.router.getCurrentNavigation().extras.state.scheduling;
                _this.scheduling.scheduleDateTime = new Date(_this.scheduling.scheduleDateTime).toISOString();
            }
        });
        authenticationService.getUser().then(function (x) {
            _this.user = x;
        });
    }
    SchedulingPage.prototype.ngOnInit = function () {
        console.log(this.minDate);
        console.log(this.maxDate);
    };
    SchedulingPage.prototype.ionViewDidEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var types, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.inspectionService.getInspectionTasksTypesList()];
                    case 1:
                        types = _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.inspectionService.getInspectors(false)];
                    case 2:
                        _a.inspectorsList = _b.sent();
                        this.scheduling.inspectorUserId = this.user.userId;
                        this.scheduling.enterprise = this.user.enterprise;
                        this.scheduling.serviceType = this.user.enterprise;
                        this.inspectionTypes = types.map(function (x) {
                            return { name: x.name, value: x.id, selected: false };
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    SchedulingPage.prototype.contactIsSync = function () {
        return this.scheduling.contact.syncInfo.isSync;
    };
    SchedulingPage.prototype.formatDate = function (date) {
        var d = new Date(date), day = "" + d.getDate(), month = "" + (d.getMonth() + 1), year = d.getFullYear();
        if (month.length < 2)
            month = "0" + month;
        if (day.length < 2)
            day = "0" + day;
        return [year, month, day].join("-");
    };
    SchedulingPage.prototype.searchContact = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: contact_search_page_1.ContactSearchPage,
                            cssClass: "my-custom-class",
                            componentProps: {
                                enterprise: this.scheduling.serviceType,
                                target: type
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.onDidDismiss().then(function (data) {
                            var contact = data["data"]; // Here's your selected user!
                            if (contact != null && contact.firstName) {
                                switch (type) {
                                    case "contact":
                                        _this.scheduling.contact = contact;
                                        break;
                                    case "insurance":
                                        _this.scheduling.insuranceCompanyContact = contact;
                                        break;
                                    case "referal":
                                        _this.scheduling.referalPartner = contact;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        });
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SchedulingPage.prototype.clearSelectedContact = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (type) {
                    case "contact":
                        this.scheduling.contact = null;
                        break;
                    case "insurance":
                        this.scheduling.insuranceCompanyContact = null;
                        break;
                    case "referal":
                        this.scheduling.referalPartner = null;
                        break;
                    default:
                        break;
                }
                return [2 /*return*/];
            });
        });
    };
    SchedulingPage.prototype.clearSelectedCompany = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (type) {
                    case "insurance":
                        this.scheduling.insuranceCompany = null;
                        break;
                    case "referal":
                        this.scheduling.referalPartnerCompany = null;
                        break;
                    default:
                        break;
                }
                return [2 /*return*/];
            });
        });
    };
    SchedulingPage.prototype.searchCompany = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: company_search_page_1.CompanySearchPage,
                            cssClass: "my-custom-class",
                            componentProps: {
                                enterprise: this.scheduling.serviceType,
                                target: type
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.onDidDismiss().then(function (data) {
                            var company = data["data"]; // Here's your selected user!
                            if (company != null && company.title) {
                                switch (type) {
                                    case "insurance":
                                        _this.scheduling.insuranceCompany = company;
                                        break;
                                    case "referal":
                                        _this.scheduling.referalPartnerCompany = company;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        });
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SchedulingPage.prototype.hourChanged = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hours, dateSel;
            return __generator(this, function (_a) {
                try {
                    if (!this.selectedDate) {
                        return [2 /*return*/];
                    }
                    console.log(this.scheduling.scheduleDateTime);
                    hours = new Date(this.selectedDate);
                    dateSel = new Date(this.scheduling.scheduleDateTime);
                    this.scheduling.scheduleDateTime = new Date(dateSel.getFullYear(), dateSel.getMonth(), dateSel.getDate(), hours.getHours(), hours.getMinutes(), 0).toISOString();
                    console.log(this.scheduling.scheduleDateTime);
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    SchedulingPage.prototype.onSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert, error_1, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 5]);
                        return [4 /*yield*/, this.alertController.create({
                                header: "Confirm Inspection",
                                message: "Are you sure you want to submit the deal?",
                                buttons: [
                                    {
                                        text: "Cancel",
                                        role: "cancel",
                                        cssClass: "secondary",
                                        handler: function () {
                                            console.log("Cancel action");
                                        }
                                    },
                                    {
                                        text: "Ok",
                                        handler: function () { return __awaiter(_this, void 0, void 0, function () {
                                            var list, alert2, deal;
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        console.log("Task Completed" + this.scheduling.id);
                                                        console.log(this.scheduling);
                                                        this.scheduling.enterprise = this.scheduling.serviceType;
                                                        this.scheduling.internalStatus = enums_1.SchedulingStatus.Pending;
                                                        console.log(this.scheduling);
                                                        this.scheduling.scheduleDateTime = new Date(this.scheduling.scheduleDateTime);
                                                        return [4 /*yield*/, this.schedulingStorageService.getAll()];
                                                    case 1:
                                                        list = _a.sent();
                                                        this.scheduling.id = ((list ? list.length : 0) + 1) * -1;
                                                        this.schedulingStorageService.add(this.scheduling);
                                                        return [4 /*yield*/, this.alertController.create({
                                                                header: "Scheduling form",
                                                                message: "Form is succesfully saved on the device.",
                                                                buttons: [
                                                                    {
                                                                        text: "Ok",
                                                                        cssClass: "primary",
                                                                        handler: function () {
                                                                            _this.navigateService.moveToPendingInspection("New");
                                                                        }
                                                                    },
                                                                ]
                                                            })];
                                                    case 2:
                                                        alert2 = _a.sent();
                                                        return [4 /*yield*/, alert2.present()];
                                                    case 3:
                                                        _a.sent();
                                                        deal = this.scheduling;
                                                        this.selectedDate = null;
                                                        this.scheduling = new scheduling_1.Scheduling();
                                                        return [4 /*yield*/, this.syncInspectionService.syncSchedulingInspection(deal, this.user)];
                                                    case 4:
                                                        (_a.sent()).subscribe(function (x) { return __awaiter(_this, void 0, void 0, function () {
                                                            var message, message;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        if (!x) return [3 /*break*/, 2];
                                                                        message = this.toast.create({
                                                                            message: "Deal is synched.",
                                                                            color: "success",
                                                                            duration: 5000
                                                                        });
                                                                        return [4 /*yield*/, message];
                                                                    case 1:
                                                                        (_a.sent()).present();
                                                                        this.syncInspectionService.publishSomeData({
                                                                            syncItem: "deal",
                                                                            refreshFromServer: false
                                                                        });
                                                                        return [3 /*break*/, 4];
                                                                    case 2:
                                                                        message = this.toast.create({
                                                                            message: "Sync failed, please start a manual sync.",
                                                                            color: "warning",
                                                                            duration: 5000
                                                                        });
                                                                        return [4 /*yield*/, message];
                                                                    case 3:
                                                                        (_a.sent()).present();
                                                                        _a.label = 4;
                                                                    case 4: return [2 /*return*/];
                                                                }
                                                            });
                                                        }); });
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }
                                    },
                                ]
                            })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        message = this.toast.create({
                            message: error_1,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 4:
                        (_a.sent()).present();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SchedulingPage = __decorate([
        core_1.Component({
            selector: "app-scheduling",
            templateUrl: "./scheduling.page.html",
            styleUrls: ["./scheduling.page.scss"]
        })
    ], SchedulingPage);
    return SchedulingPage;
}());
exports.SchedulingPage = SchedulingPage;

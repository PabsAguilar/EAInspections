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
exports.ComprehensiveInspectionPage = void 0;
var core_1 = require("@angular/core");
var generic_list_pop_over_component_1 = require("src/app/components/generic-list-pop-over/generic-list-pop-over.component");
var enums_1 = require("src/app/models/enums");
var ComprehensiveInspectionPage = /** @class */ (function () {
    function ComprehensiveInspectionPage(toast, route, router, alertController, loadingController, inspectionStorageService, inspectionNavigate, navController, inspectionService, syncInspectionService, popoverController, emailComposer, file) {
        var _this = this;
        this.toast = toast;
        this.route = route;
        this.router = router;
        this.alertController = alertController;
        this.loadingController = loadingController;
        this.inspectionStorageService = inspectionStorageService;
        this.inspectionNavigate = inspectionNavigate;
        this.navController = navController;
        this.inspectionService = inspectionService;
        this.syncInspectionService = syncInspectionService;
        this.popoverController = popoverController;
        this.emailComposer = emailComposer;
        this.file = file;
        this.readonly = false;
        if (this.router.getCurrentNavigation().extras.state) {
            this.task = this.router.getCurrentNavigation().extras.state.task;
            this.readonly = this.task.internalStatus == enums_1.InspectionStatus.Completed;
            if (!this.task.comprehesiveForm) {
                inspectionService
                    .initializeENTask(this.task)
                    .then(function (x) {
                    _this.task = x;
                })["catch"](function (error) { return __awaiter(_this, void 0, void 0, function () {
                    var message;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log(error);
                                message = this.toast.create({
                                    message: "environmental-constructor " + error,
                                    color: "danger",
                                    duration: 2000
                                });
                                return [4 /*yield*/, message];
                            case 1:
                                (_a.sent()).present();
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
        }
    }
    ComprehensiveInspectionPage.prototype.ionViewDidEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var top, error_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 7]);
                        return [4 /*yield*/, this.loadingController.getTop()];
                    case 1:
                        top = _a.sent();
                        if (!top) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.loadingController.dismiss()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.validateAgreements()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        message = this.toast.create({
                            message: "environmental-ionViewDidEnter" + error_1,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 6:
                        (_a.sent()).present();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ComprehensiveInspectionPage.prototype.validateAgreements = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.task.iTestAgreements ||
                            (this.task.iTestAgreements.signature.images.length <= 0 &&
                                !this.task.iTestAgreements.hasOpen))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.inspectionNavigate.openItestAgreementsPage(this.task)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!(!this.task.expertNetworkAgreements ||
                            (this.task.expertNetworkAgreements.signature.images.length <= 0 &&
                                !this.task.expertNetworkAgreements.hasOpen))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.inspectionNavigate.openExpertNetworkAgreementsPage(this.task)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ComprehensiveInspectionPage.prototype.openOption = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_2, message, error_3, message, jFile, alert, error_4, message;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = type;
                        switch (_a) {
                            case "ITestAgreements": return [3 /*break*/, 1];
                            case "ENAgreements": return [3 /*break*/, 6];
                            case "ReportIssue": return [3 /*break*/, 11];
                            case "Delete": return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 18];
                    case 1:
                        _b.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, this.inspectionNavigate.openItestAgreementsPage(this.task)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_2 = _b.sent();
                        console.log(error_2);
                        message = this.toast.create({
                            message: "environmental-popover.onDidDismiss" + error_2,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 4:
                        (_b.sent()).present();
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 19];
                    case 6:
                        _b.trys.push([6, 8, , 10]);
                        return [4 /*yield*/, this.inspectionNavigate.openExpertNetworkAgreementsPage(this.task)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        error_3 = _b.sent();
                        console.log(error_3);
                        message = this.toast.create({
                            message: "popover.onDidDismiss.ENAgreements" + error_3,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 9:
                        (_b.sent()).present();
                        return [3 /*break*/, 10];
                    case 10: return [3 /*break*/, 19];
                    case 11:
                        jFile = JSON.stringify(this.task);
                        this.file
                            .writeFile(this.file.dataDirectory, "dealIssue.json", jFile, {
                            replace: true
                        })
                            .then(function (x) {
                            console.log("Directory exists");
                            console.log(x);
                            var email = {
                                to: "pabs.aguilar2806@gmail.com",
                                //cc: "max@mustermann.de",
                                attachments: [_this.file.dataDirectory + "/dealIssue.json"],
                                subject: "Issue Inspection " + _this.task.id,
                                body: "Having issues with " + _this.task.enterprise + " inspection. ",
                                isHtml: true
                            };
                            _this.emailComposer.open(email);
                        })["catch"](function (err) { return console.log("Directory doesn't exist"); });
                        return [3 /*break*/, 19];
                    case 12:
                        _b.trys.push([12, 15, , 17]);
                        return [4 /*yield*/, this.alertController.create({
                                header: "Confirm Delete",
                                cssClass: "alertcss",
                                message: "Are you sure you want to delete the inspection? All the progress will be clear and deleted from the device.",
                                buttons: [
                                    {
                                        text: "Cancel",
                                        role: "cancel",
                                        handler: function () {
                                            console.log("Cancel action");
                                        }
                                    },
                                    {
                                        text: "Ok",
                                        cssClass: "buttoncss",
                                        handler: function () { return __awaiter(_this, void 0, void 0, function () {
                                            var random, message;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        random = Math.floor(Math.random() * 100) + 2;
                                                        return [4 /*yield*/, this.inspectionService["delete"](this.task)];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, this.navController.navigateRoot("menu/tabs/tabs/pending-inspections/" + random)];
                                                    case 2:
                                                        _a.sent();
                                                        message = this.toast.create({
                                                            message: "Inspection is deleted.",
                                                            color: "warning",
                                                            duration: 3000
                                                        });
                                                        return [4 /*yield*/, message];
                                                    case 3:
                                                        (_a.sent()).present();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }
                                    },
                                ]
                            })];
                    case 13:
                        alert = _b.sent();
                        return [4 /*yield*/, alert.present()];
                    case 14:
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 15:
                        error_4 = _b.sent();
                        console.log(error_4);
                        message = this.toast.create({
                            message: "Delete: " + error_4,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 16:
                        (_b.sent()).present();
                        return [3 /*break*/, 17];
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        console.log("Unknow event for generic list");
                        return [3 /*break*/, 19];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    ComprehensiveInspectionPage.prototype.presentPopover = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, popover, error_5, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 5]);
                        settings = [
                            {
                                name: "ITest Agreements",
                                color: "success",
                                event: "ITestAgreements",
                                iconName: "reader-outline"
                            },
                            {
                                name: "Expert Network Agreements",
                                color: "secondary",
                                event: "ENAgreements",
                                iconName: "reader-outline"
                            },
                            {
                                name: "Delete Inspection from device",
                                color: "danger",
                                event: "Delete",
                                iconName: "trash-outline"
                            },
                            {
                                name: "Report an issue with this Inspection",
                                color: "medium",
                                event: "ReportIssue",
                                iconName: "bug-outline"
                            },
                        ];
                        return [4 /*yield*/, this.popoverController.create({
                                component: generic_list_pop_over_component_1.GenericListPopOverComponent,
                                componentProps: {
                                    items: settings
                                },
                                event: ev,
                                translucent: true
                            })];
                    case 1:
                        popover = _a.sent();
                        popover.onDidDismiss().then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (!result.data) {
                                    return [2 /*return*/];
                                }
                                this.openOption(result.data.event);
                                return [2 /*return*/];
                            });
                        }); });
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_5 = _a.sent();
                        console.log(error_5);
                        message = this.toast.create({
                            message: error_5,
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
    ComprehensiveInspectionPage.prototype.ngOnInit = function () { };
    ComprehensiveInspectionPage.prototype.syncTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loading, x, top, message, message, error_6, message, top;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, 13, 17]);
                        return [4 /*yield*/, this.loadingController.create({
                                message: "Uploading to Bitrix..."
                            })];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        this.task.startedSync = false;
                        return [4 /*yield*/, this.syncInspectionService.syncENTask(this.task)];
                    case 3:
                        x = _a.sent();
                        if (!x) return [3 /*break*/, 8];
                        this.syncInspectionService.publishSomeData({
                            syncItem: "deal"
                        });
                        return [4 /*yield*/, this.loadingController.getTop()];
                    case 4:
                        top = _a.sent();
                        if (!top) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.loadingController.dismiss()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        message = this.toast.create({
                            message: "Deal is synched.",
                            color: "success",
                            duration: 5000
                        });
                        return [4 /*yield*/, message];
                    case 7:
                        (_a.sent()).present();
                        return [3 /*break*/, 10];
                    case 8:
                        message = this.toast.create({
                            message: "Sync failed, please start a manual sync.",
                            color: "warning",
                            duration: 5000
                        });
                        return [4 /*yield*/, message];
                    case 9:
                        (_a.sent()).present();
                        _a.label = 10;
                    case 10: return [4 /*yield*/, message];
                    case 11:
                        (_a.sent()).present();
                        return [3 /*break*/, 17];
                    case 12:
                        error_6 = _a.sent();
                        message = this.toast.create({
                            message: error_6,
                            color: "danger",
                            duration: 5000
                        });
                        return [3 /*break*/, 17];
                    case 13: return [4 /*yield*/, this.loadingController.getTop()];
                    case 14:
                        top = _a.sent();
                        if (!top) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.loadingController.dismiss()];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16: return [7 /*endfinally*/];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    ComprehensiveInspectionPage.prototype.completeTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert, error_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.alertController.create({
                                header: "Confirm Inspection",
                                message: "Are you sure you want to complete the inspection?",
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
                                            var loading, random, message, x, error_8, message;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, this.loadingController.create({
                                                            message: "Please wait..."
                                                        })];
                                                    case 1:
                                                        loading = _a.sent();
                                                        return [4 /*yield*/, loading.present()];
                                                    case 2:
                                                        _a.sent();
                                                        _a.label = 3;
                                                    case 3:
                                                        _a.trys.push([3, 8, 10, 12]);
                                                        this.task.internalStatus = enums_1.InspectionStatus.PendingToComplete;
                                                        random = Math.floor(Math.random() * 10) + 2;
                                                        return [4 /*yield*/, this.inspectionStorageService.update(this.task)];
                                                    case 4:
                                                        _a.sent();
                                                        return [4 /*yield*/, this.navController.navigateRoot("menu/tabs/tabs/pending-inspections/" + random)];
                                                    case 5:
                                                        _a.sent();
                                                        message = this.toast.create({
                                                            message: "Inspection is completed.",
                                                            color: "success",
                                                            duration: 3000
                                                        });
                                                        return [4 /*yield*/, message];
                                                    case 6:
                                                        (_a.sent()).present();
                                                        return [4 /*yield*/, this.syncTask()];
                                                    case 7:
                                                        x = _a.sent();
                                                        return [3 /*break*/, 12];
                                                    case 8:
                                                        error_8 = _a.sent();
                                                        message = this.toast.create({
                                                            message: "Sync failed, " + error_8,
                                                            color: "warning",
                                                            duration: 7000
                                                        });
                                                        return [4 /*yield*/, message];
                                                    case 9:
                                                        (_a.sent()).present();
                                                        return [3 /*break*/, 12];
                                                    case 10: return [4 /*yield*/, loading.dismiss()];
                                                    case 11:
                                                        _a.sent();
                                                        return [7 /*endfinally*/];
                                                    case 12: return [2 /*return*/];
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
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        console.log(error_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ComprehensiveInspectionPage.prototype.UpdateEntity = function ($event) {
        return __awaiter(this, void 0, Promise, function () {
            var error_9, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        console.log($event);
                        if (this.task.internalStatus == enums_1.InspectionStatus.New) {
                            this.task.internalStatus = "In Progress";
                        }
                        return [4 /*yield*/, this.inspectionStorageService.update(this.task)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        error_9 = _a.sent();
                        console.log(error_9);
                        message = this.toast.create({
                            message: error_9,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 3:
                        (_a.sent()).present();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ComprehensiveInspectionPage = __decorate([
        core_1.Component({
            selector: "app-comprehensive-inspection",
            templateUrl: "./comprehensive-inspection.page.html",
            styleUrls: ["./comprehensive-inspection.page.scss"]
        })
    ], ComprehensiveInspectionPage);
    return ComprehensiveInspectionPage;
}());
exports.ComprehensiveInspectionPage = ComprehensiveInspectionPage;

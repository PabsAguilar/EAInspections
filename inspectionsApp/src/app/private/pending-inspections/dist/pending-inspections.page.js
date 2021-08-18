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
exports.PendingInspectionsPage = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var generic_list_pop_over_component_1 = require("src/app/components/generic-list-pop-over/generic-list-pop-over.component");
var enums_1 = require("src/app/models/enums");
var inspection_task_1 = require("src/app/models/inspection-task");
var user_1 = require("src/app/models/user");
var PendingInspectionsPage = /** @class */ (function () {
    function PendingInspectionsPage(callNumber, actionSheetController, router, inspectionService, loadingController, popoverController, toast, launchNavigator, inspectionNavigate, autenticateService, syncInspection) {
        this.callNumber = callNumber;
        this.actionSheetController = actionSheetController;
        this.router = router;
        this.inspectionService = inspectionService;
        this.loadingController = loadingController;
        this.popoverController = popoverController;
        this.toast = toast;
        this.launchNavigator = launchNavigator;
        this.inspectionNavigate = inspectionNavigate;
        this.autenticateService = autenticateService;
        this.syncInspection = syncInspection;
        this.today = Date.now();
        this.lastSync = Date.now();
        this.inspectionTasks = Array();
        this.segmentOption = "All";
        this.searching = false;
        this.user = new user_1.User();
        this.searchControl = new forms_1.FormControl();
    }
    PendingInspectionsPage.prototype.ngOnDestroy = function () { };
    PendingInspectionsPage.prototype.ionViewWillLeave = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.subscription.unsubscribe();
                return [2 /*return*/];
            });
        });
    };
    PendingInspectionsPage.prototype.ionViewWillEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var top, error_1, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 8]);
                        this.subscription = this.syncInspection
                            .getObservable()
                            .subscribe(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var fromServer, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        fromServer = true;
                                        if (data && data.refreshFromServer != null) {
                                            fromServer = data.refreshFromServer;
                                        }
                                        return [4 /*yield*/, this.loadData(fromServer)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_2 = _a.sent();
                                        console.log(error_2);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        //TODO: Validate connection to internet
                        return [4 /*yield*/, this.autenticateService.getUser().then(function (x) {
                                _this.user = x;
                            })];
                    case 1:
                        //TODO: Validate connection to internet
                        _a.sent();
                        return [4 /*yield*/, this.loadData(false)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.loadingController.getTop()];
                    case 3:
                        top = _a.sent();
                        if (!top) return [3 /*break*/, 5];
                        return [4 /*yield*/, top.dismiss()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_1 = _a.sent();
                        console.log(error_1);
                        message = this.toast.create({
                            message: error_1,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 7:
                        (_a.sent()).present();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    PendingInspectionsPage.prototype.onSearchTerm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.searching = true;
                return [2 /*return*/];
            });
        });
    };
    PendingInspectionsPage.prototype.onSearch = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                event.target.blur();
                return [2 /*return*/];
            });
        });
    };
    PendingInspectionsPage.prototype.search = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.inspectionService.getPendingInspections(this.user)];
                    case 1:
                        _a.inspectionTasks = _b.sent();
                        if (searchTerm && searchTerm.trim() !== "") {
                            this.inspectionTasks = this.inspectionTasks.filter(function (term) {
                                return (term.title.toLowerCase().indexOf(searchTerm.trim().toLowerCase()) >
                                    -1 ||
                                    term.serviceAddress
                                        .toLowerCase()
                                        .indexOf(searchTerm.trim().toLowerCase()) > -1 ||
                                    term.contactName
                                        .toLowerCase()
                                        .indexOf(searchTerm.trim().toLowerCase()) > -1 ||
                                    term.id
                                        .toString()
                                        .toLowerCase()
                                        .indexOf(searchTerm.trim().toLowerCase()) > -1);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PendingInspectionsPage.prototype.segmentChanged = function ($event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData(false)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PendingInspectionsPage.prototype.ionViewDidEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 1, , 3]);
                        return [3 /*break*/, 3];
                    case 1:
                        error_3 = _a.sent();
                        console.log(error_3);
                        message = this.toast.create({
                            message: error_3,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 2:
                        (_a.sent()).present();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PendingInspectionsPage.prototype.loadData = function (forceFromServer) {
        return __awaiter(this, void 0, void 0, function () {
            var loading, tempInspectionTasks, _a, error_4, top;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, 12, 16]);
                        return [4 /*yield*/, this.loadingController.create({
                                message: "Loading..."
                            })];
                    case 1:
                        loading = _b.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _b.sent();
                        tempInspectionTasks = [];
                        if (!(forceFromServer || this.inspectionTasks == null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.inspectionService.getExternal(this.user)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.inspectionService.refreshFieldsFromServer(this.user)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.inspectionService.getPendingInspections(this.user)];
                    case 5:
                        tempInspectionTasks =
                            _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.inspectionService.getPendingInspections(this.user)];
                    case 7:
                        tempInspectionTasks =
                            _b.sent();
                        _b.label = 8;
                    case 8: return [4 /*yield*/, Promise.all(tempInspectionTasks.map(function (x) {
                            var result = new inspection_task_1.InspectionTask();
                            result.id = x.id;
                            result.title = x.title;
                            result.scheduleDateTime = x.scheduleDateTime;
                            result.scheduleDay = x.scheduleDay;
                            result.contactName = x.contactName;
                            result.contactId = x.contactId;
                            result.serviceAddress = x.serviceAddress;
                            result.phone = x.phone;
                            result.email = x.email;
                            result.inspectorUserId = x.inspectorUserId;
                            result.inspectionType = x.inspectionType;
                            result.enterprise = x.enterprise;
                            result.internalStatus = x.internalStatus;
                            result.wasRejected = x.wasRejected;
                            return result;
                        }))];
                    case 9:
                        tempInspectionTasks = _b.sent();
                        this.inspectionTasks = tempInspectionTasks.filter(function (task) {
                            return _this.segmentOption == "All" ||
                                (_this.segmentOption == "Pending" &&
                                    (task.internalStatus == enums_1.InspectionStatus.New ||
                                        task.internalStatus == enums_1.InspectionStatus.InProgress)) ||
                                (_this.segmentOption == "Saved" &&
                                    (task.internalStatus == enums_1.InspectionStatus.Saved ||
                                        task.internalStatus == enums_1.InspectionStatus.LabsSent ||
                                        task.internalStatus == enums_1.InspectionStatus.PendingSaved ||
                                        task.internalStatus == enums_1.InspectionStatus.PendingSentLab)) ||
                                task.internalStatus == _this.segmentOption;
                        });
                        _a = this;
                        return [4 /*yield*/, this.inspectionService.getSyncStamp()];
                    case 10:
                        _a.lastSync = _b.sent();
                        return [3 /*break*/, 16];
                    case 11:
                        error_4 = _b.sent();
                        console.log(error_4);
                        return [3 /*break*/, 16];
                    case 12: return [4 /*yield*/, this.loadingController.getTop()];
                    case 13:
                        top = _b.sent();
                        if (!top) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.loadingController.dismiss()];
                    case 14:
                        _b.sent();
                        _b.label = 15;
                    case 15: return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    PendingInspectionsPage.prototype.doRefresh = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        console.log("Pull Event Triggered!");
                        return [4 /*yield*/, this.loadData(false)];
                    case 1:
                        _a.sent();
                        event.target.complete();
                        return [3 /*break*/, 4];
                    case 2:
                        error_5 = _a.sent();
                        console.log(error_5);
                        message = this.toast.create({
                            message: error_5,
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
    PendingInspectionsPage.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.searchControl.valueChanges
                    .pipe(operators_1.debounceTime(700))
                    .subscribe(function (search) {
                    _this.search(search);
                    _this.searching = false;
                });
                return [2 /*return*/];
            });
        });
    };
    PendingInspectionsPage.prototype.call = function (item) {
        console.log("call " + item.phone);
        this.callNumber
            .callNumber(item.phone, true)
            .then(function (res) { return console.log("Launched dialer!", res); })["catch"](function (err) { return console.log("Error launching dialer", err); });
    };
    PendingInspectionsPage.prototype.seeDetails = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var completeTask, navigationExtras, error_6, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.inspectionService.getInspectionTask(task.id, task.enterprise)];
                    case 1:
                        completeTask = _a.sent();
                        console.log("Details clicked");
                        navigationExtras = {
                            state: {
                                task: completeTask
                            }
                        };
                        this.router.navigate(["menu/details"], navigationExtras);
                        return [3 /*break*/, 4];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        message = this.toast.create({
                            message: error_6,
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
    PendingInspectionsPage.prototype.gpsNavigate = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                options = {};
                this.launchNavigator.navigate(task.serviceAddress, options).then(function (success) { return console.log("Launched navigator"); }, function (error) { return console.log("Error launching navigator", error); });
                return [2 /*return*/];
            });
        });
    };
    PendingInspectionsPage.prototype.startInspection = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var completeTask, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Start clicked");
                        return [4 /*yield*/, this.inspectionService.getInspectionTask(task.id, task.enterprise)];
                    case 1:
                        completeTask = _a.sent();
                        this.inspectionNavigate.startInspection(completeTask);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PendingInspectionsPage.prototype.presentPopover = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, popover, error_8, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 5]);
                        settings = [
                            {
                                name: "Get Deals from Bitrix24",
                                color: "primary",
                                event: "getFromServer",
                                iconName: "cloud-download-outline"
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
                            var _a, loading, response, _b, _c, error_9;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!result.data) {
                                            return [2 /*return*/];
                                        }
                                        _a = result.data.event;
                                        switch (_a) {
                                            case "getFromServer": return [3 /*break*/, 1];
                                        }
                                        return [3 /*break*/, 14];
                                    case 1:
                                        console.log("getFromServer");
                                        return [4 /*yield*/, this.loadingController.create({
                                                message: "Loading Inspection Deals"
                                            })];
                                    case 2:
                                        loading = _d.sent();
                                        return [4 /*yield*/, loading.present()];
                                    case 3:
                                        _d.sent();
                                        _d.label = 4;
                                    case 4:
                                        _d.trys.push([4, 10, , 11]);
                                        return [4 /*yield*/, this.syncInspection.syncAllPending()];
                                    case 5:
                                        response = _d.sent();
                                        return [4 /*yield*/, this.inspectionService.getExternal(this.user)];
                                    case 6:
                                        _d.sent();
                                        return [4 /*yield*/, this.inspectionService.refreshFieldsFromServer(this.user)];
                                    case 7:
                                        _d.sent();
                                        _b = this;
                                        return [4 /*yield*/, this.inspectionService.getSyncStamp()];
                                    case 8:
                                        _b.lastSync = _d.sent();
                                        _c = this;
                                        return [4 /*yield*/, this.inspectionService.getPendingInspections(this.user)];
                                    case 9:
                                        _c.inspectionTasks =
                                            _d.sent();
                                        return [3 /*break*/, 11];
                                    case 10:
                                        error_9 = _d.sent();
                                        console.log(error_9);
                                        return [3 /*break*/, 11];
                                    case 11:
                                        if (!loading) return [3 /*break*/, 13];
                                        return [4 /*yield*/, this.loadingController.dismiss()];
                                    case 12:
                                        _d.sent();
                                        _d.label = 13;
                                    case 13: return [3 /*break*/, 15];
                                    case 14:
                                        console.log("Unknow event for generic list");
                                        return [3 /*break*/, 15];
                                    case 15: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_8 = _a.sent();
                        message = this.toast.create({
                            message: error_8,
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
    PendingInspectionsPage.prototype.presentActionSheet = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var actionSheet, error_10, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 5]);
                        return [4 /*yield*/, this.actionSheetController.create({
                                header: "Inspection Options",
                                cssClass: "my-custom-class",
                                buttons: [
                                    {
                                        text: "Process",
                                        icon: "arrow-forward-circle-outline",
                                        handler: function () {
                                            _this.startInspection(task);
                                        }
                                    },
                                    {
                                        text: "Details",
                                        icon: "book-outline",
                                        handler: function () {
                                            _this.seeDetails(task);
                                        }
                                    },
                                    {
                                        text: "Call",
                                        icon: "call-outline",
                                        handler: function () {
                                            console.log("Call clicked");
                                            _this.call(task);
                                        }
                                    },
                                    {
                                        text: "Navigate",
                                        icon: "navigate-outline",
                                        handler: function () {
                                            console.log("Navigate clicked");
                                            _this.gpsNavigate(task);
                                        }
                                    },
                                    {
                                        text: "Cancel",
                                        icon: "close",
                                        role: "cancel",
                                        handler: function () {
                                            console.log("Cancel clicked");
                                        }
                                    },
                                ]
                            })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_10 = _a.sent();
                        message = this.toast.create({
                            message: error_10,
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
    PendingInspectionsPage = __decorate([
        core_1.Component({
            selector: "app-pending-inspections",
            templateUrl: "./pending-inspections.page.html",
            styleUrls: ["./pending-inspections.page.scss"]
        })
    ], PendingInspectionsPage);
    return PendingInspectionsPage;
}());
exports.PendingInspectionsPage = PendingInspectionsPage;

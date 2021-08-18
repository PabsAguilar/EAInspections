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
exports.entries = exports.SyncInspectionService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var enums_1 = require("../models/enums");
var ItestImageMainFolder = 100;
var ENImageMainFolder = 75763;
var SyncInspectionService = /** @class */ (function () {
    function SyncInspectionService(bitrix, inspectionStorage, schedulingStorageService, toast, itestDealService, autenticateService) {
        this.bitrix = bitrix;
        this.inspectionStorage = inspectionStorage;
        this.schedulingStorageService = schedulingStorageService;
        this.toast = toast;
        this.itestDealService = itestDealService;
        this.autenticateService = autenticateService;
        this.syncEvent = new rxjs_1.Subject();
    }
    SyncInspectionService.prototype.publishSomeData = function (data) {
        this.syncEvent.next(data);
    };
    SyncInspectionService.prototype.getObservable = function () {
        return this.syncEvent;
    };
    SyncInspectionService.prototype.syncSubfolder = function (task) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var idFolder, d, dateString, postData, response, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        idFolder = ItestImageMainFolder;
                        if (task.inspectionType == enums_1.InspectionType.Comprehensive) {
                            idFolder = ENImageMainFolder;
                        }
                        d = new Date();
                        dateString = d.getFullYear().toString() +
                            d.getMonth().toString() +
                            d.getDay().toString() +
                            d.getHours().toString() +
                            d.getHours().toString() +
                            d.getMinutes().toString() +
                            d.getMilliseconds().toString();
                        postData = {
                            id: idFolder,
                            data: {
                                NAME: task.id + "-" + task.title + "-" + dateString
                            }
                        };
                        return [4 /*yield*/, this.bitrix.createSubfolder(postData).toPromise()];
                    case 1:
                        response = _b.sent();
                        if (((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.ID) > 0) {
                            return [2 /*return*/, response.result.ID];
                        }
                        else
                            return [2 /*return*/, -1];
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, -1];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncListImages = function (pictures, folder, name) {
        return __awaiter(this, void 0, Promise, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(folder.syncInfo.isSync &&
                            pictures.images.find(function (x) { return !x.isSync; }) != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(pictures.images.map(function (item, index) { return __awaiter(_this, void 0, void 0, function () {
                                var postData, response;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!!item.isSync) return [3 /*break*/, 2];
                                            postData = {
                                                id: folder.syncInfo.syncCode,
                                                data: {
                                                    NAME: name + "-" + (index + 1) + "-" + Math.floor(Math.random() * 1000) + ".png"
                                                },
                                                fileContent: item.base64Image.replace("data:image/png;base64,", "")
                                            };
                                            return [4 /*yield*/, this.bitrix.addFile(postData)];
                                        case 1:
                                            response = _b.sent();
                                            if (((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.FILE_ID) > 0) {
                                                pictures.images[index].isSync = true;
                                                pictures.images[index].syncList = false;
                                                pictures.images[index].syncCode =
                                                    response.result.FILE_ID.toString();
                                            }
                                            else {
                                                pictures.images[index].isSync = false;
                                            }
                                            return [2 /*return*/, response];
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (pictures.images.length > 0 &&
                            pictures.images.find(function (x) { return !x.isSync; }) != null) {
                            pictures.syncInfo.isSync = false;
                        }
                        else {
                            pictures.syncInfo.isSync = true;
                        }
                        return [2 /*return*/, pictures];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncENTaskImages = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var _this = this;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, Promise.all(task.comprehesiveForm.areas
                            .filter(function (x) {
                            return x.pictures.images.length > 0 &&
                                x.pictures.images.find(function (y) { return !y.isSync; }) != null;
                        })
                            .map(function (item, index) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = task.comprehesiveForm.areas[index];
                                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.areas[index].pictures, task.bitrixFolder, "AreaInsp-" + (index + 1))];
                                    case 1:
                                        _a.pictures =
                                            _b.sent();
                                        //await this.inspectionStorage.update(task);
                                        return [2 /*return*/, Promise.resolve(true)];
                                }
                            });
                        }); }))];
                    case 1:
                        _k.sent();
                        return [4 /*yield*/, Promise.all(task.comprehesiveForm.bathrooms
                                .filter(function (x) { return x.pictures.images.length > 0 && !x.pictures.syncInfo.isSync; })
                                .map(function (item, index) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = task.comprehesiveForm.bathrooms[index];
                                            return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.bathrooms[index].pictures, task.bitrixFolder, "Bathroom-Area" + (index + 1))];
                                        case 1:
                                            _a.pictures =
                                                _b.sent();
                                            //await this.inspectionStorage.update(task);
                                            return [2 /*return*/, Promise.resolve(true)];
                                    }
                                });
                            }); }))];
                    case 2:
                        _k.sent();
                        _a = task.comprehesiveForm.generalInfoInspection;
                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers, task.bitrixFolder, "General-HouseNumber")];
                    case 3:
                        _a.pictureHouseNumbers =
                            _k.sent();
                        //await this.inspectionStorage.update(task);
                        _b = task.comprehesiveForm.generalInfoInspection;
                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.generalInfoInspection.picturesFrontHouse, task.bitrixFolder, "General-FrontHouse")];
                    case 4:
                        //await this.inspectionStorage.update(task);
                        _b.picturesFrontHouse =
                            _k.sent();
                        //  await this.inspectionStorage.update(task);
                        _c = task.comprehesiveForm.kitchen;
                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.kitchen.pictures, task.bitrixFolder, "Kitchen")];
                    case 5:
                        //  await this.inspectionStorage.update(task);
                        _c.pictures = _k.sent();
                        // await this.inspectionStorage.update(task);
                        _d = task.comprehesiveForm.HVAC_AC;
                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.HVAC_AC.pictures, task.bitrixFolder, "HVAC_AC")];
                    case 6:
                        // await this.inspectionStorage.update(task);
                        _d.pictures = _k.sent();
                        //await this.inspectionStorage.update(task);
                        _e = task.comprehesiveForm.utilityRoom;
                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.utilityRoom.pictures, task.bitrixFolder, "UtilityRoom")];
                    case 7:
                        //await this.inspectionStorage.update(task);
                        _e.pictures = _k.sent();
                        //await this.inspectionStorage.update(task);
                        _f = task.comprehesiveForm.atic;
                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.atic.pictures, task.bitrixFolder, "Attic")];
                    case 8:
                        //await this.inspectionStorage.update(task);
                        _f.pictures = _k.sent();
                        // await this.inspectionStorage.update(task);
                        _g = task.comprehesiveForm.enviromentalSection;
                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.enviromentalSection.MoldLocationPicture, task.bitrixFolder, "MoldLocation")];
                    case 9:
                        // await this.inspectionStorage.update(task);
                        _g.MoldLocationPicture =
                            _k.sent();
                        //await this.inspectionStorage.update(task);
                        _h = task.comprehesiveForm.exterior;
                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.exterior.pictures, task.bitrixFolder, "Exterior")];
                    case 10:
                        //await this.inspectionStorage.update(task);
                        _h.pictures = _k.sent();
                        //await this.inspectionStorage.update(task);
                        _j = task.comprehesiveForm.insurance;
                        return [4 /*yield*/, this.syncListImages(task.comprehesiveForm.insurance.picturesPolicy, task.bitrixFolder, "Policy")];
                    case 11:
                        //await this.inspectionStorage.update(task);
                        _j.picturesPolicy = _k.sent();
                        return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 12:
                        _k.sent();
                        return [2 /*return*/, task];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncTaskImages = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var index, item, _a, error_2, index, item, _b, error_3, index, item, _c, error_4, index, item, _d, error_5, index, item, _e, error_6, index, item, _f, error_7, _g, _h, _j, _k, error_8;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        index = 0;
                        _l.label = 1;
                    case 1:
                        if (!(index < task.environmentalForm.moldAreas.areasInspection.length)) return [3 /*break*/, 7];
                        _l.label = 2;
                    case 2:
                        _l.trys.push([2, 5, , 6]);
                        item = task.environmentalForm.moldAreas.areasInspection[index];
                        if (!(item.areaPictures.images.length > 0 &&
                            item.areaPictures.images.find(function (y) { return !y.isSync; }) != null)) return [3 /*break*/, 4];
                        _a = task.environmentalForm.moldAreas.areasInspection[index];
                        return [4 /*yield*/, this.syncListImages(task.environmentalForm.moldAreas.areasInspection[index]
                                .areaPictures, task.bitrixFolder, "MoldIns-Area" + (index + 1))];
                    case 3:
                        _a.areaPictures =
                            _l.sent();
                        _l.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _l.sent();
                        console.log(error_2);
                        return [3 /*break*/, 6];
                    case 6:
                        index++;
                        return [3 /*break*/, 1];
                    case 7:
                        index = 0;
                        _l.label = 8;
                    case 8:
                        if (!(index < task.environmentalForm.bacteriasAreas.areasInspection.length)) return [3 /*break*/, 14];
                        _l.label = 9;
                    case 9:
                        _l.trys.push([9, 12, , 13]);
                        item = task.environmentalForm.bacteriasAreas.areasInspection[index];
                        if (!(item.areaPictures.images.length > 0 &&
                            item.areaPictures.images.find(function (y) { return !y.isSync; }) != null)) return [3 /*break*/, 11];
                        _b = task.environmentalForm.bacteriasAreas.areasInspection[index];
                        return [4 /*yield*/, this.syncListImages(task.environmentalForm.bacteriasAreas.areasInspection[index]
                                .areaPictures, task.bitrixFolder, "BactIns-Area" + (index + 1))];
                    case 10:
                        _b.areaPictures = _l.sent();
                        _l.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_3 = _l.sent();
                        console.log(error_3);
                        return [3 /*break*/, 13];
                    case 13:
                        index++;
                        return [3 /*break*/, 8];
                    case 14:
                        index = 0;
                        _l.label = 15;
                    case 15:
                        if (!(index <
                            task.environmentalForm.moistureMappingAreas.areamoistureMapping.length)) return [3 /*break*/, 21];
                        _l.label = 16;
                    case 16:
                        _l.trys.push([16, 19, , 20]);
                        item = task.environmentalForm.moistureMappingAreas.areamoistureMapping[index];
                        if (!(item.areaPictures.images.length > 0 &&
                            item.areaPictures.images.find(function (y) { return !y.isSync; }) != null)) return [3 /*break*/, 18];
                        _c = task.environmentalForm.moistureMappingAreas.areamoistureMapping[index];
                        return [4 /*yield*/, this.syncListImages(task.environmentalForm.moistureMappingAreas.areamoistureMapping[index].areaPictures, task.bitrixFolder, "Moist-Area" + (index + 1))];
                    case 17:
                        _c.areaPictures = _l.sent();
                        _l.label = 18;
                    case 18: return [3 /*break*/, 20];
                    case 19:
                        error_4 = _l.sent();
                        console.log(error_4);
                        return [3 /*break*/, 20];
                    case 20:
                        index++;
                        return [3 /*break*/, 15];
                    case 21:
                        index = 0;
                        _l.label = 22;
                    case 22:
                        if (!(index < task.environmentalForm.asbestosAreas.asbestosAreas.length)) return [3 /*break*/, 28];
                        _l.label = 23;
                    case 23:
                        _l.trys.push([23, 26, , 27]);
                        item = task.environmentalForm.asbestosAreas.asbestosAreas[index];
                        if (!(item.areaPictures.images.length > 0 &&
                            item.areaPictures.images.find(function (y) { return !y.isSync; }) != null)) return [3 /*break*/, 25];
                        _d = task.environmentalForm.asbestosAreas.asbestosAreas[index];
                        return [4 /*yield*/, this.syncListImages(task.environmentalForm.asbestosAreas.asbestosAreas[index]
                                .areaPictures, task.bitrixFolder, "Asbe-Area" + (index + 1))];
                    case 24:
                        _d.areaPictures = _l.sent();
                        _l.label = 25;
                    case 25: return [3 /*break*/, 27];
                    case 26:
                        error_5 = _l.sent();
                        console.log(error_5);
                        return [3 /*break*/, 27];
                    case 27:
                        index++;
                        return [3 /*break*/, 22];
                    case 28: return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 29:
                        _l.sent();
                        index = 0;
                        _l.label = 30;
                    case 30:
                        if (!(index < task.environmentalForm.leadAreas.leadAreas.length)) return [3 /*break*/, 36];
                        _l.label = 31;
                    case 31:
                        _l.trys.push([31, 34, , 35]);
                        item = task.environmentalForm.leadAreas.leadAreas[index];
                        if (!(item.areaPictures.images.length > 0 &&
                            item.areaPictures.images.find(function (y) { return !y.isSync; }) != null)) return [3 /*break*/, 33];
                        _e = task.environmentalForm.leadAreas.leadAreas[index];
                        return [4 /*yield*/, this.syncListImages(task.environmentalForm.leadAreas.leadAreas[index].areaPictures, task.bitrixFolder, "Lead-Area" + (index + 1))];
                    case 32:
                        _e.areaPictures =
                            _l.sent();
                        _l.label = 33;
                    case 33: return [3 /*break*/, 35];
                    case 34:
                        error_6 = _l.sent();
                        console.log(error_6);
                        return [3 /*break*/, 35];
                    case 35:
                        index++;
                        return [3 /*break*/, 30];
                    case 36:
                        index = 0;
                        _l.label = 37;
                    case 37:
                        if (!(index < task.environmentalForm.sootAreas.areasInspection.length)) return [3 /*break*/, 43];
                        _l.label = 38;
                    case 38:
                        _l.trys.push([38, 41, , 42]);
                        item = task.environmentalForm.sootAreas.areasInspection[index];
                        if (!(item.areaPictures.images.length > 0 &&
                            item.areaPictures.images.find(function (y) { return !y.isSync; }) != null)) return [3 /*break*/, 40];
                        _f = task.environmentalForm.sootAreas.areasInspection[index];
                        return [4 /*yield*/, this.syncListImages(task.environmentalForm.sootAreas.areasInspection[index]
                                .areaPictures, task.bitrixFolder, "Soot-Area" + (index + 1))];
                    case 39:
                        _f.areaPictures =
                            _l.sent();
                        _l.label = 40;
                    case 40: return [3 /*break*/, 42];
                    case 41:
                        error_7 = _l.sent();
                        console.log(error_7);
                        return [3 /*break*/, 42];
                    case 42:
                        index++;
                        return [3 /*break*/, 37];
                    case 43:
                        _l.trys.push([43, 49, , 50]);
                        return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 44:
                        _l.sent();
                        _g = task.environmentalForm.generalInfoInspection;
                        return [4 /*yield*/, this.syncListImages(task.environmentalForm.generalInfoInspection.pictureHouseNumbers, task.bitrixFolder, "General-HouseNumber")];
                    case 45:
                        _g.pictureHouseNumbers =
                            _l.sent();
                        //await this.inspectionStorage.update(task);
                        _h = task.environmentalForm.generalInfoInspection;
                        return [4 /*yield*/, this.syncListImages(task.environmentalForm.generalInfoInspection.picturesFrontHouse, task.bitrixFolder, "General-FrontHouse")];
                    case 46:
                        //await this.inspectionStorage.update(task);
                        _h.picturesFrontHouse =
                            _l.sent();
                        //await this.inspectionStorage.update(task);
                        _j = task.iTestAgreements;
                        return [4 /*yield*/, this.syncListImages(task.iTestAgreements.signature, task.bitrixFolder, "ItestAgreementSignature")];
                    case 47:
                        //await this.inspectionStorage.update(task);
                        _j.signature = _l.sent();
                        //await this.inspectionStorage.update(task);
                        _k = task.expertNetworkAgreements;
                        return [4 /*yield*/, this.syncListImages(task.expertNetworkAgreements.signature, task.bitrixFolder, "ENAgreementSignature")];
                    case 48:
                        //await this.inspectionStorage.update(task);
                        _k.signature = _l.sent();
                        return [3 /*break*/, 50];
                    case 49:
                        error_8 = _l.sent();
                        console.log(error_8);
                        return [3 /*break*/, 50];
                    case 50: return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 51:
                        _l.sent();
                        return [2 /*return*/, task];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncGeneralInformation = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var postData, x, itestSignature, expertNSignature, signatures, response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        postData = {
                            id: task.id,
                            fields: { STAGE_ID: "EXECUTING" }
                        };
                        switch (task.internalStatus) {
                            case enums_1.InspectionStatus.PendingSaved:
                                postData.fields[enums_1.ITestDealMapping.reportStatus] =
                                    enums_1.ReportStatusDeal.Saved;
                                break;
                            case enums_1.InspectionStatus.PendingSentLab:
                                postData.fields[enums_1.ITestDealMapping.reportStatus] =
                                    enums_1.ReportStatusDeal.Labs;
                                break;
                            case enums_1.InspectionStatus.PendingToComplete:
                                postData.fields[enums_1.ITestDealMapping.reportStatus] =
                                    enums_1.ReportStatusDeal.Submitted;
                                break;
                            default:
                                postData.fields[enums_1.ITestDealMapping.reportStatus] =
                                    enums_1.ReportStatusDeal.Saved;
                                break;
                        }
                        if (task.environmentalForm.generalInfoInspection.propertyYear)
                            postData.fields[enums_1.ITestDealMapping.propertyYearCode] =
                                task.environmentalForm.generalInfoInspection.propertyYear;
                        if (task.environmentalForm.generalInfoInspection.propertyType)
                            postData.fields[enums_1.ITestDealMapping.propertyTypeCode] =
                                task.environmentalForm.generalInfoInspection.propertyType;
                        if (task.environmentalForm.generalInfoInspection.interiorTemperature)
                            postData.fields[enums_1.ITestDealMapping.interiorTemperatureCode] =
                                task.environmentalForm.generalInfoInspection.interiorTemperature;
                        if (task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity)
                            postData.fields[enums_1.ITestDealMapping.exteriorRelativeHumidityCode] =
                                task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity;
                        if (task.environmentalForm.generalInfoInspection.HVACSystemCondition)
                            postData.fields[enums_1.ITestDealMapping.HVACSystemConditionCode] =
                                task.environmentalForm.generalInfoInspection.HVACSystemCondition;
                        if (task.environmentalForm.generalInfoInspection.ductsCondition)
                            postData.fields[enums_1.ITestDealMapping.ductsConditionCode] =
                                task.environmentalForm.generalInfoInspection.ductsCondition;
                        if (task.environmentalForm.generalInfoInspection.atticCondition)
                            postData.fields[enums_1.ITestDealMapping.atticConditionCode] =
                                task.environmentalForm.generalInfoInspection.atticCondition;
                        if (task.environmentalForm.generalInfoInspection.typeOfLossDesc) {
                            postData.fields[enums_1.ITestDealMapping.typesOfLoss] =
                                task.environmentalForm.generalInfoInspection.typeOfLossDesc;
                        }
                        if (task.environmentalForm.generalInfoInspection.affectedArea) {
                            postData.fields[enums_1.ITestDealMapping.affectedArea] =
                                task.environmentalForm.generalInfoInspection.affectedArea;
                        }
                        if (task.environmentalForm.generalInfoInspection.picturesFrontHouse.images
                            .length > 0) {
                            x = task.environmentalForm.generalInfoInspection.picturesFrontHouse.images.map(function (x, index) {
                                return {
                                    fileData: [
                                        "FrontHouse-" + index + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                        x.base64Image.replace("data:image/png;base64,", ""),
                                    ]
                                };
                            });
                            postData.fields[enums_1.ITestDealMapping.picturesFrontHouseCode] = x;
                        }
                        if (task.environmentalForm.generalInfoInspection.pictureHouseNumbers.images
                            .length > 0) {
                            postData.fields[enums_1.ITestDealMapping.pictureHouseNumbersCode] = {
                                fileData: [
                                    "HouseNumber-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                    task.environmentalForm.generalInfoInspection.pictureHouseNumbers.images[0].base64Image.replace("data:image/png;base64,", ""),
                                ]
                            };
                        }
                        if (task.iTestAgreements.signature.images.length > 0) {
                            postData.fields[enums_1.ITestDealMapping.agreementSignedYesNoCode] =
                                task.environmentalForm.generalInfoInspection.agreementSignedYesNo;
                            itestSignature = task.iTestAgreements.signature.images.map(function (x, index) {
                                return {
                                    fileData: [
                                        "ITestSig-" + x.name + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                        x.base64Image.replace("data:image/png;base64,", ""),
                                    ]
                                };
                            });
                            expertNSignature = task.expertNetworkAgreements.signature.images.map(function (x, index) {
                                return {
                                    fileData: [
                                        "ENSignature-" + x.name + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                        x.base64Image.replace("data:image/png;base64,", ""),
                                    ]
                                };
                            });
                            signatures = itestSignature.concat(expertNSignature);
                            postData.fields[enums_1.ITestDealMapping.signature] = signatures;
                        }
                        return [4 /*yield*/, this.bitrix.updateDeal(postData).toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response && response.result > 0) {
                            return [2 /*return*/, response.result];
                        }
                        else
                            return [2 /*return*/, -1];
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.log(error_9);
                        return [2 /*return*/, -1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncContact = function (contact, enterprise, type) {
        if (type === void 0) { type = null; }
        return __awaiter(this, void 0, Promise, function () {
            var postData, response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        postData = {
                            FIELDS: {
                                NAME: contact.firstName,
                                SECOND_NAME: "",
                                LAST_NAME: contact.lastName,
                                PHONE: [{ VALUE: contact.phone }],
                                EMAIL: [{ VALUE: contact.email }]
                            }
                        };
                        if (enterprise === enums_1.EnumEnterprise.expertNetworks) {
                            postData.FIELDS[enums_1.ENDealMapping.contactSegments] = [type];
                        }
                        return [4 /*yield*/, this.bitrix.createContact(postData, enterprise)];
                    case 1:
                        response = _a.sent();
                        if ((response === null || response === void 0 ? void 0 : response.result) > 0) {
                            contact.syncInfo.isSync = true;
                            contact.syncInfo.syncCode = response.result;
                            contact.idContact = response.result;
                            return [2 /*return*/, contact];
                        }
                        else {
                            contact.syncInfo.isSync = false;
                            return [2 /*return*/, contact];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.log(error_10);
                        return [3 /*break*/, 3];
                    case 3:
                        contact.syncInfo.isSync = false;
                        return [2 /*return*/, contact];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncCompany = function (company, enterprise) {
        return __awaiter(this, void 0, Promise, function () {
            var postData, response, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        postData = {
                            fields: {
                                TITLE: company.title,
                                COMPANY_TYPE: "CUSTOMER",
                                COMMENTS: "Created by Inspection MobileApp",
                                CURRENCY_ID: "USD",
                                IS_MY_COMPANY: "N",
                                PHONE: [{ VALUE: company.phone }],
                                EMAIL: [{ VALUE: company.email }]
                            }
                        };
                        return [4 /*yield*/, this.bitrix.createCompany(postData, enterprise)];
                    case 1:
                        response = _a.sent();
                        if ((response === null || response === void 0 ? void 0 : response.result) > 0) {
                            company.syncInfo.isSync = true;
                            company.syncInfo.syncCode = response.result;
                            company.id = response.result;
                            return [2 /*return*/, company];
                        }
                        else {
                            company.syncInfo.isSync = false;
                            return [2 /*return*/, company];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        console.log(error_11);
                        return [3 /*break*/, 3];
                    case 3:
                        company.syncInfo.isSync = false;
                        return [2 /*return*/, company];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncAllPending = function () {
        return __awaiter(this, void 0, Promise, function () {
            var user, schedulingList, _a, _b, inspectionList, index, x, y, message, message;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.autenticateService.getUser()];
                    case 1:
                        user = _c.sent();
                        return [4 /*yield*/, this.schedulingStorageService.getPendingToSync(user)];
                    case 2:
                        schedulingList = _c.sent();
                        _b = (_a = Promise).all;
                        return [4 /*yield*/, schedulingList];
                    case 3: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(function (x) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.syncSchedulingInspection(x, user)];
                                        case 1:
                                            (_a.sent()).subscribe(function (y) { return __awaiter(_this, void 0, void 0, function () {
                                                var message;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!y) return [3 /*break*/, 1];
                                                            return [3 /*break*/, 3];
                                                        case 1:
                                                            message = this.toast.create({
                                                                message: "Sync failed, please try again later.",
                                                                color: "warning",
                                                                duration: 2000
                                                            });
                                                            return [4 /*yield*/, message];
                                                        case 2:
                                                            (_a.sent()).present();
                                                            _a.label = 3;
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })])];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, this.inspectionStorage.getPendingToSync(user)];
                    case 5:
                        inspectionList = _c.sent();
                        index = 0;
                        _c.label = 6;
                    case 6:
                        if (!(index < inspectionList.length)) return [3 /*break*/, 11];
                        x = inspectionList[index];
                        return [4 /*yield*/, this.syncTask(x)];
                    case 7:
                        y = _c.sent();
                        if (!y) return [3 /*break*/, 8];
                        return [3 /*break*/, 10];
                    case 8:
                        message = this.toast.create({
                            message: "Sync failed for deal " + x.id + ", please try again later.",
                            color: "warning",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 9:
                        (_c.sent()).present();
                        _c.label = 10;
                    case 10:
                        index++;
                        return [3 /*break*/, 6];
                    case 11:
                        if (!(schedulingList.length == 0 && inspectionList.length == 0)) return [3 /*break*/, 13];
                        message = this.toast.create({
                            message: "There is no pending items to sync.",
                            color: "primary",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 12:
                        (_c.sent()).present();
                        _c.label = 13;
                    case 13: return [2 /*return*/, true];
                }
            });
        });
    };
    SyncInspectionService.prototype.pad = function (number, length) {
        var str = "" + number;
        while (str.length < length) {
            str = "0" + str;
        }
        return str;
    };
    SyncInspectionService.prototype.getBitrixDateTime = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, paddatepart, dateStr;
            return __generator(this, function (_a) {
                date = new Date(date);
                offset = date.getTimezoneOffset();
                offset =
                    (offset < 0 ? "+" : "-") + // Note the reversed sign!
                        this.pad(parseInt(Math.abs(offset / 60).toString()), 2) +
                        ":" +
                        this.pad(Math.abs(offset % 60), 2);
                paddatepart = function (part) {
                    return part >= 10 ? part.toString() : "0" + part.toString();
                };
                dateStr = date.getFullYear() +
                    "-" +
                    paddatepart(1 + date.getMonth()) +
                    "-" +
                    paddatepart(date.getDate()) +
                    "T" +
                    paddatepart(date.getHours()) +
                    ":" +
                    paddatepart(date.getMinutes()) +
                    ":" +
                    paddatepart(date.getSeconds()) +
                    "-06:00";
                return [2 /*return*/, dateStr];
            });
        });
    };
    SyncInspectionService.prototype.getBitrixDateTime1 = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, paddatepart, dateStr;
            return __generator(this, function (_a) {
                date = new Date(date);
                offset = date.getTimezoneOffset();
                offset =
                    (offset < 0 ? "+" : "-") + // Note the reversed sign!
                        this.pad(parseInt(Math.abs(offset / 60).toString()), 2) +
                        ":" +
                        this.pad(Math.abs(offset % 60), 2);
                paddatepart = function (part) {
                    return part >= 10 ? part.toString() : "0" + part.toString();
                };
                dateStr = date.getFullYear() +
                    "-" +
                    paddatepart(1 + date.getMonth()) +
                    "-" +
                    paddatepart(date.getDate()) +
                    "T" +
                    paddatepart(date.getHours()) +
                    ":" +
                    paddatepart(date.getMinutes()) +
                    ":" +
                    paddatepart(date.getSeconds()) +
                    offset;
                return [2 /*return*/, dateStr];
            });
        });
    };
    SyncInspectionService.prototype.syncSchedulingInspection = function (scheduling, user) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var _b, _c, _d, _e, _f, _g, insuranceCompany, referalContact, postData, response, error_12;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 23, , 24]);
                        if (!(!scheduling.contact.syncInfo.isSync ||
                            !scheduling.contact.syncInfo.syncCode)) return [3 /*break*/, 3];
                        _b = scheduling;
                        return [4 /*yield*/, this.syncContact(scheduling.contact, scheduling.serviceType, enums_1.ENContactSegments.Client)];
                    case 1:
                        _b.contact = _h.sent();
                        if (!scheduling.contact.syncInfo.isSync) {
                            return [2 /*return*/, rxjs_1.of(false)];
                        }
                        return [4 /*yield*/, this.schedulingStorageService.update(scheduling)];
                    case 2:
                        _h.sent();
                        _h.label = 3;
                    case 3:
                        _c = scheduling;
                        return [4 /*yield*/, this.getBitrixDateTime(scheduling.scheduleDateTime)];
                    case 4:
                        _c.scheduleDateString = _h.sent();
                        if (!(scheduling.insuranceCompanyContact &&
                            (!scheduling.insuranceCompanyContact.syncInfo.isSync ||
                                !scheduling.insuranceCompanyContact.syncInfo.syncCode))) return [3 /*break*/, 7];
                        _d = scheduling;
                        return [4 /*yield*/, this.syncContact(scheduling.insuranceCompanyContact, scheduling.serviceType, enums_1.ENContactSegments.Public_Adjuster)];
                    case 5:
                        _d.insuranceCompanyContact = _h.sent();
                        if (!scheduling.insuranceCompanyContact.syncInfo.isSync) {
                            return [2 /*return*/, rxjs_1.of(false)];
                        }
                        return [4 /*yield*/, this.schedulingStorageService.update(scheduling)];
                    case 6:
                        _h.sent();
                        _h.label = 7;
                    case 7:
                        if (!(scheduling.referalPartner &&
                            (!scheduling.referalPartner.syncInfo.isSync ||
                                !scheduling.referalPartner.syncInfo.syncCode))) return [3 /*break*/, 10];
                        _e = scheduling;
                        return [4 /*yield*/, this.syncContact(scheduling.referalPartner, scheduling.serviceType, enums_1.ENContactSegments.Referral_Partner)];
                    case 8:
                        _e.referalPartner = _h.sent();
                        if (!scheduling.referalPartner.syncInfo.isSync) {
                            return [2 /*return*/, rxjs_1.of(false)];
                        }
                        return [4 /*yield*/, this.schedulingStorageService.update(scheduling)];
                    case 9:
                        _h.sent();
                        _h.label = 10;
                    case 10:
                        if (!(scheduling.referalPartnerCompany &&
                            !scheduling.referalPartnerCompany.syncInfo.isSync)) return [3 /*break*/, 13];
                        _f = scheduling;
                        return [4 /*yield*/, this.syncCompany(scheduling.referalPartnerCompany, scheduling.serviceType)];
                    case 11:
                        _f.referalPartnerCompany = _h.sent();
                        if (!scheduling.referalPartnerCompany.syncInfo.isSync) {
                            return [2 /*return*/, rxjs_1.of(false)];
                        }
                        return [4 /*yield*/, this.schedulingStorageService.update(scheduling)];
                    case 12:
                        _h.sent();
                        _h.label = 13;
                    case 13:
                        if (!(scheduling.insuranceCompany &&
                            !scheduling.insuranceCompany.syncInfo.isSync)) return [3 /*break*/, 16];
                        _g = scheduling;
                        return [4 /*yield*/, this.syncCompany(scheduling.insuranceCompany, scheduling.serviceType)];
                    case 14:
                        _g.insuranceCompany = _h.sent();
                        if (!scheduling.insuranceCompany.syncInfo.isSync) {
                            return [2 /*return*/, rxjs_1.of(false)];
                        }
                        return [4 /*yield*/, this.schedulingStorageService.update(scheduling)];
                    case 15:
                        _h.sent();
                        _h.label = 16;
                    case 16:
                        insuranceCompany = [];
                        if (scheduling.insuranceCompanyContact) {
                            insuranceCompany.push("C_" + scheduling.insuranceCompanyContact.idContact);
                        }
                        if (scheduling.insuranceCompany) {
                            insuranceCompany.push("CO_" + scheduling.insuranceCompany.id);
                        }
                        referalContact = [];
                        if (scheduling.referalPartner) {
                            referalContact.push("C_" + scheduling.referalPartner.idContact);
                        }
                        if (scheduling.referalPartnerCompany) {
                            referalContact.push("CO_" + scheduling.referalPartnerCompany.id);
                        }
                        postData = {
                            fields: {
                                TITLE: "Form " +
                                    scheduling.contact.firstName +
                                    " " +
                                    scheduling.contact.lastName +
                                    " - EnApp",
                                TYPE_ID: "",
                                STAGE_ID: scheduling.serviceType == enums_1.EnumEnterprise.itest
                                    ? "PREPAYMENT_INVOICE"
                                    : "NEW",
                                COMPANY_ID: "",
                                CONTACT_ID: scheduling.contact.idContact,
                                OPENED: "N",
                                CLOSED: "N",
                                ASSIGNED_BY_ID: scheduling.inspectorUserId,
                                CREATED_BY_ID: scheduling.inspectorUserId,
                                COMMENTS: "Created with Scheduling form within EN Mobile APP.",
                                PROBABILITY: null,
                                CURRENCY_ID: "USD",
                                OPPORTUNITY: 0,
                                BEGINDATE: "",
                                CLOSEDATE: ""
                            }
                        };
                        if (scheduling.serviceType == enums_1.EnumEnterprise.itest) {
                            postData.fields[enums_1.ITestDealMapping.instructions] = scheduling.notes; //UF_CRM_1612683023
                            postData.fields[enums_1.ITestDealMapping.dealDateTime] =
                                scheduling.scheduleDateString; //this.date2str(scheduling.scheduleDateTime),  //UF_CRM_1612683055
                            postData.fields[enums_1.ITestDealMapping.serviceAddress] =
                                scheduling.serviceAddress; //UF_CRM_1606466289
                            postData.fields[enums_1.ITestDealMapping.inspector] =
                                scheduling.inspectorUserId; //UF_CRM_1612682994
                            postData.fields[enums_1.ITestDealMapping.user] = user.userId; //UF_CRM_1612686317
                            postData.fields[enums_1.ITestDealMapping.insuranceCompany] = insuranceCompany; //UF_CRM_1612691342
                            postData.fields[enums_1.ITestDealMapping.inspectionTypes] =
                                scheduling.inspectionTypes; //UF_CRM_1612433280
                            // postData[ITestDealMapping.typesOfLoss] = scheduling.typeOfLossDesc; //UF_CRM_1618512396
                            // postData[ITestDealMapping.affectedArea] = scheduling.affectedArea; //UF_CRM_1618512421
                            // postData[ITestDealMapping.waterDamageCategory] =
                            //   scheduling.waterDamageCategory; //UF_CRM_1618512488
                            // postData[ITestDealMapping.waterDamageClass] = scheduling.waterDamageClass; //UF_CRM_1618512548
                            postData[enums_1.ITestDealMapping.referenceContact] = referalContact; //UF_CRM_1612691326
                        }
                        else {
                            //postData.fields[ENDealMapping.segments] = [4315];
                            postData.fields[enums_1.ENDealMapping.instructions] = scheduling.notes;
                            postData.fields[enums_1.ENDealMapping.dealDateTime] =
                                scheduling.scheduleDateString;
                            postData.fields[enums_1.ENDealMapping.serviceAddress] =
                                scheduling.serviceAddress;
                            postData.fields[enums_1.ENDealMapping.inspector] = scheduling.inspectorUserId;
                            postData.fields[enums_1.ENDealMapping.user] = user.userId; //scheduler
                            postData.fields[enums_1.ENDealMapping.insuranceCompany] = insuranceCompany;
                            postData.fields[enums_1.ENDealMapping.referenceContact] =
                                scheduling.serviceType == enums_1.EnumEnterprise.itest
                                    ? referalContact
                                    : (_a = scheduling.referalPartner) === null || _a === void 0 ? void 0 : _a.idContact;
                        }
                        return [4 /*yield*/, this.bitrix.createDeal(postData, scheduling.serviceType)];
                    case 17:
                        response = _h.sent();
                        if (!(response && response.result > 0)) return [3 /*break*/, 21];
                        scheduling.syncInfo.isSync = true;
                        scheduling.syncInfo.syncCode = response.result;
                        scheduling.internalStatus = enums_1.InspectionStatus.Completed;
                        return [4 /*yield*/, this.schedulingStorageService.update(scheduling)];
                    case 18:
                        _h.sent();
                        return [4 /*yield*/, this.itestDealService.getExternal(user)];
                    case 19:
                        _h.sent();
                        return [4 /*yield*/, this.itestDealService.refreshFieldsFromServer(user)];
                    case 20:
                        _h.sent();
                        return [2 /*return*/, rxjs_1.of(true)];
                    case 21: return [2 /*return*/, rxjs_1.of(false)];
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        error_12 = _h.sent();
                        console.log(error_12);
                        return [2 /*return*/, rxjs_1.of(false)];
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.preprareImages = function (imagesList, taskId, fieldName) {
        var image = imagesList.images.map(function (s, imageIndex) {
            return {
                fileData: [
                    fieldName + "-" + imageIndex + "-" + taskId + "-" + Math.floor(Math.random() * 1000) + ".png",
                    s.base64Image.replace("data:image/png;base64,", ""),
                ]
            };
        });
        return image;
    };
    SyncInspectionService.prototype.syncENTask = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var result, postData_1, x, x, list, response, error_13, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 13]);
                        if (!!task.bitrixFolder.syncInfo.isSync) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.syncSubfolder(task)];
                    case 1:
                        result = _a.sent();
                        task.bitrixFolder.syncInfo.isSync = result > 0;
                        task.bitrixFolder.syncInfo.syncCode = result.toString();
                        return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.syncENTaskImages(task)];
                    case 4:
                        task = _a.sent();
                        postData_1 = {
                            id: task.id,
                            fields: { STAGE_ID: "1" }
                        };
                        if (task.comprehesiveForm.generalInfoInspection.propertyYear)
                            postData_1.fields[enums_1.ENDealMapping.propertyYearCode] =
                                task.comprehesiveForm.generalInfoInspection.propertyYear;
                        if (task.comprehesiveForm.generalInfoInspection.propertyType)
                            postData_1.fields[enums_1.ENDealMapping.propertyTypeCode] =
                                task.comprehesiveForm.generalInfoInspection.propertyType;
                        if (!(task.comprehesiveForm.generalInfoInspection.picturesFrontHouse.images
                            .length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.preprareImages(task.comprehesiveForm.generalInfoInspection.picturesFrontHouse, task.id, "FrontHouse")];
                    case 5:
                        x = _a.sent();
                        postData_1.fields[enums_1.ENDealMapping.picturesFrontHouseCode] = x;
                        _a.label = 6;
                    case 6:
                        if (!(task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers.images
                            .length > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.preprareImages(task.comprehesiveForm.generalInfoInspection.pictureHouseNumbers, task.id, "HouseNumber")];
                    case 7:
                        x = _a.sent();
                        postData_1.fields[enums_1.ENDealMapping.pictureHouseNumbersCode] = x;
                        _a.label = 8;
                    case 8:
                        list = entries(enums_1.bitrixMappingComprehensive.Area);
                        task.comprehesiveForm.areas.map(function (x, index) {
                            //Object.entries(x.areaBitrixMapping)
                            list.map(function (y) {
                                var item = x[y[0].replace("Code", "")];
                                if (item) {
                                    if (item.images) {
                                        var image = item.images.map(function (s, imageIndex) {
                                            return {
                                                fileData: [
                                                    "Area" + (index + 1) + "-" + imageIndex + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                                    s.base64Image.replace("data:image/png;base64,", ""),
                                                ]
                                            };
                                        });
                                        if (image.length > 0) {
                                            postData_1.fields[y[1][index]] = image;
                                        }
                                    }
                                    else {
                                        postData_1.fields[y[1][index]] = item;
                                    }
                                }
                            });
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.Bathrooms);
                        task.comprehesiveForm.bathrooms.map(function (x, index) {
                            list.map(function (y) {
                                var item = x[y[0].replace("Code", "")];
                                if (item) {
                                    if (item.images) {
                                        var image = item.images.map(function (s, imageIndex) {
                                            return {
                                                fileData: [
                                                    "Bathroom-" + (index + 1) + "-" + imageIndex + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                                    s.base64Image.replace("data:image/png;base64,", ""),
                                                ]
                                            };
                                        });
                                        if (image.length > 0) {
                                            postData_1.fields[y[1][index]] = image;
                                        }
                                    }
                                    else {
                                        postData_1.fields[y[1][index]] = item;
                                    }
                                }
                            });
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.Kitchen);
                        list.map(function (y) {
                            var item = task.comprehesiveForm.kitchen[y[0].replace("Code", "")];
                            if (item) {
                                if (item.images) {
                                    var image = item.images.map(function (s, imageIndex) {
                                        return {
                                            fileData: [
                                                "Kitchen-" + imageIndex + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                                s.base64Image.replace("data:image/png;base64,", ""),
                                            ]
                                        };
                                    });
                                    if (image.length > 0) {
                                        postData_1.fields[y[1]] = image;
                                    }
                                }
                                else {
                                    postData_1.fields[y[1]] = item;
                                }
                            }
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.HVAC_AC);
                        list.map(function (y) {
                            var item = task.comprehesiveForm.HVAC_AC[y[0].replace("Code", "")];
                            if (item) {
                                if (item.images) {
                                    var image = item.images.map(function (s, imageIndex) {
                                        return {
                                            fileData: [
                                                "HVAC_AC-" + imageIndex + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                                s.base64Image.replace("data:image/png;base64,", ""),
                                            ]
                                        };
                                    });
                                    if (image.length > 0) {
                                        postData_1.fields[y[1]] = image;
                                    }
                                }
                                else {
                                    postData_1.fields[y[1]] = item;
                                }
                            }
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.UtilityRoom);
                        list.map(function (y) {
                            var item = task.comprehesiveForm.utilityRoom[y[0].replace("Code", "")];
                            if (item) {
                                if (item.images) {
                                    var image = item.images.map(function (s, imageIndex) {
                                        return {
                                            fileData: [
                                                "UtilityRoom-" + imageIndex + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                                s.base64Image.replace("data:image/png;base64,", ""),
                                            ]
                                        };
                                    });
                                    if (image.length > 0) {
                                        postData_1.fields[y[1]] = image;
                                    }
                                }
                                else {
                                    postData_1.fields[y[1]] = item;
                                }
                            }
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.Attic);
                        list.map(function (y) {
                            var item = task.comprehesiveForm.atic[y[0].replace("Code", "")];
                            if (item) {
                                if (item.images) {
                                    var image = item.images.map(function (s, imageIndex) {
                                        return {
                                            fileData: [
                                                "Atic-" + imageIndex + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                                s.base64Image.replace("data:image/png;base64,", ""),
                                            ]
                                        };
                                    });
                                    if (image.length > 0) {
                                        postData_1.fields[y[1]] = image;
                                    }
                                }
                                else {
                                    postData_1.fields[y[1]] = item;
                                }
                            }
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.EnvironmentalSection);
                        list.map(function (y) {
                            var item = task.comprehesiveForm.enviromentalSection[y[0].replace("Code", "")];
                            if (item) {
                                if (item.images) {
                                    var image = item.images.map(function (s, imageIndex) {
                                        return {
                                            fileData: [
                                                "environmental-" + imageIndex + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                                s.base64Image.replace("data:image/png;base64,", ""),
                                            ]
                                        };
                                    });
                                    if (image.length > 0) {
                                        postData_1.fields[y[1]] = image;
                                    }
                                }
                                else {
                                    postData_1.fields[y[1]] = item;
                                }
                            }
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.Exterior);
                        list.map(function (y) {
                            var item = task.comprehesiveForm.exterior[y[0].replace("Code", "")];
                            if (item) {
                                if (item.images) {
                                    var image = item.images.map(function (s, imageIndex) {
                                        return {
                                            fileData: [
                                                "exterior-" + imageIndex + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                                s.base64Image.replace("data:image/png;base64,", ""),
                                            ]
                                        };
                                    });
                                    if (image.length > 0) {
                                        postData_1.fields[y[1]] = image;
                                    }
                                }
                                else {
                                    postData_1.fields[y[1]] = item;
                                }
                            }
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.Recomendations);
                        list.map(function (y) {
                            var item = task.comprehesiveForm.recomendations[y[0].replace("Code", "")];
                            if (item) {
                                postData_1.fields[y[1]] = item;
                            }
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.Insurance);
                        list.map(function (y) {
                            var item = task.comprehesiveForm.insurance[y[0].replace("Code", "")];
                            if (item) {
                                if (item.images) {
                                    var image = item.images.map(function (s, imageIndex) {
                                        return {
                                            fileData: [
                                                "insurance-" + imageIndex + "-" + task.id + "-" + Math.floor(Math.random() * 1000) + ".png",
                                                s.base64Image.replace("data:image/png;base64,", ""),
                                            ]
                                        };
                                    });
                                    if (image.length > 0) {
                                        postData_1.fields[y[1]] = image;
                                    }
                                }
                                else {
                                    postData_1.fields[y[1]] = item;
                                }
                            }
                        });
                        list = entries(enums_1.bitrixMappingComprehensive.Reminders);
                        list.map(function (y) {
                            var item = task.comprehesiveForm.reminders[y[0].replace("Code", "")];
                            if (item) {
                                postData_1.fields[y[1]] = item;
                            }
                        });
                        return [4 /*yield*/, this.bitrix.updateDeal(postData_1).toPromise()];
                    case 9:
                        response = _a.sent();
                        if (response && response.result > 0) {
                            task.internalStatus = enums_1.InspectionStatus.Completed;
                        }
                        return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 11:
                        error_13 = _a.sent();
                        console.log(error_13);
                        message = this.toast.create({
                            message: error_13,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 12:
                        (_a.sent()).present();
                        console.log(error_13);
                        return [2 /*return*/, false];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncTask = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var result, result, _a, _b, _c, _d, _e, _f, error_14, message;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 41, , 43]);
                        // if (task.startedSync) {
                        //   var today = new Date();
                        //   var lastSync = new Date(task.syncStartDate);
                        //   var difference = today.getTime() - lastSync.getTime();
                        //   var minutes = Math.round(difference / 60000);
                        //   if (minutes <= 2) {
                        //     return true;
                        //   }
                        // }
                        task.startedSync = true;
                        task.syncStartDate = new Date();
                        if (task.inspectionType == enums_1.InspectionType.Comprehensive) {
                            return [2 /*return*/, this.syncENTask(task)];
                        }
                        if (!!task.bitrixFolder.syncInfo.isSync) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.syncSubfolder(task)];
                    case 1:
                        result = _g.sent();
                        task.bitrixFolder.syncInfo.isSync = result > 0;
                        task.bitrixFolder.syncInfo.syncCode = result.toString();
                        return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 2:
                        _g.sent();
                        _g.label = 3;
                    case 3: return [4 /*yield*/, this.syncTaskImages(task)];
                    case 4:
                        task = _g.sent();
                        if (!(!task.environmentalForm.generalInfoInspection.syncInfo.isSync ||
                            task.environmentalForm.generalInfoInspection.syncInfo.updated)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.syncGeneralInformation(task)];
                    case 5:
                        result = _g.sent();
                        if (result > 0) {
                            task.environmentalForm.generalInfoInspection.syncInfo.updated = false;
                            task.environmentalForm.generalInfoInspection.syncInfo.isSync = true;
                            task.environmentalForm.generalInfoInspection.syncInfo.syncCode =
                                result.toString();
                        }
                        _g.label = 6;
                    case 6:
                        if (!(!task.environmentalForm.moldAreas.syncInfo.isSync ||
                            task.environmentalForm.moldAreas.syncInfo.updated)) return [3 /*break*/, 11];
                        if (!task.environmentalForm.moldAreas.areasInspection.find(function (x) { return x.areaName; })) return [3 /*break*/, 8];
                        _a = task.environmentalForm;
                        return [4 /*yield*/, this.sendDamageInspection(task.environmentalForm.moldAreas, task, enums_1.DamageAreaType.Mold, 48, "Mold Inspection - " + task.title)];
                    case 7:
                        _a.moldAreas = _g.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        task.environmentalForm.moldAreas.syncInfo.isSync = true;
                        task.environmentalForm.moldAreas.syncInfo.updated = false;
                        _g.label = 9;
                    case 9: return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 10:
                        _g.sent();
                        _g.label = 11;
                    case 11:
                        if (!(!task.environmentalForm.bacteriasAreas.syncInfo.isSync ||
                            task.environmentalForm.bacteriasAreas.syncInfo.updated)) return [3 /*break*/, 16];
                        if (!task.environmentalForm.bacteriasAreas.areasInspection.find(function (x) { return x.areaName; })) return [3 /*break*/, 13];
                        _b = task.environmentalForm;
                        return [4 /*yield*/, this.sendDamageInspection(task.environmentalForm.bacteriasAreas, task, enums_1.DamageAreaType.Bacteria, 50, "Bacteria Inspection - " + task.title)];
                    case 12:
                        _b.bacteriasAreas =
                            _g.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        task.environmentalForm.bacteriasAreas.syncInfo.isSync = true;
                        task.environmentalForm.bacteriasAreas.syncInfo.updated = false;
                        _g.label = 14;
                    case 14: return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 15:
                        _g.sent();
                        _g.label = 16;
                    case 16:
                        if (!(!task.environmentalForm.sootAreas.syncInfo.isSync ||
                            task.environmentalForm.sootAreas.syncInfo.updated)) return [3 /*break*/, 21];
                        if (!task.environmentalForm.sootAreas.areasInspection.find(function (x) { return x.areaName; })) return [3 /*break*/, 18];
                        _c = task.environmentalForm;
                        return [4 /*yield*/, this.sendDamageInspection(task.environmentalForm.sootAreas, task, enums_1.DamageAreaType.Soot, 52, "Soot Inspection - " + task.title)];
                    case 17:
                        _c.sootAreas = _g.sent();
                        return [3 /*break*/, 19];
                    case 18:
                        task.environmentalForm.sootAreas.syncInfo.isSync = true;
                        task.environmentalForm.sootAreas.syncInfo.updated = false;
                        _g.label = 19;
                    case 19: return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 20:
                        _g.sent();
                        _g.label = 21;
                    case 21:
                        if (!(!task.environmentalForm.moistureMappingAreas.syncInfo.isSync ||
                            task.environmentalForm.moistureMappingAreas.syncInfo.updated)) return [3 /*break*/, 26];
                        if (!task.environmentalForm.moistureMappingAreas.areamoistureMapping.find(function (x) { return x.area; })) return [3 /*break*/, 23];
                        _d = task.environmentalForm;
                        return [4 /*yield*/, this.sendMoistureMapping(task)];
                    case 22:
                        _d.moistureMappingAreas =
                            _g.sent();
                        return [3 /*break*/, 24];
                    case 23:
                        task.environmentalForm.moistureMappingAreas.syncInfo.isSync = true;
                        task.environmentalForm.moistureMappingAreas.syncInfo.updated = false;
                        _g.label = 24;
                    case 24: return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 25:
                        _g.sent();
                        _g.label = 26;
                    case 26:
                        if (!(!task.environmentalForm.asbestosAreas.syncInfo.isSync ||
                            task.environmentalForm.asbestosAreas.syncInfo.updated)) return [3 /*break*/, 31];
                        if (!task.environmentalForm.asbestosAreas.asbestosAreas.find(function (x) { return x.materialLocation; })) return [3 /*break*/, 28];
                        _e = task.environmentalForm;
                        return [4 /*yield*/, this.sendAsbestos(task)];
                    case 27:
                        _e.asbestosAreas = _g.sent();
                        return [3 /*break*/, 29];
                    case 28:
                        task.environmentalForm.asbestosAreas.syncInfo.isSync = true;
                        task.environmentalForm.asbestosAreas.syncInfo.updated = false;
                        _g.label = 29;
                    case 29: return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 30:
                        _g.sent();
                        _g.label = 31;
                    case 31:
                        if (!(!task.environmentalForm.leadAreas.syncInfo.isSync ||
                            task.environmentalForm.leadAreas.syncInfo.updated)) return [3 /*break*/, 36];
                        if (!task.environmentalForm.leadAreas.leadAreas.find(function (x) { return x.sample; })) return [3 /*break*/, 33];
                        _f = task.environmentalForm;
                        return [4 /*yield*/, this.sendLead(task)];
                    case 32:
                        _f.leadAreas = _g.sent();
                        task.environmentalForm.leadAreas.syncInfo.updated = false;
                        return [3 /*break*/, 34];
                    case 33:
                        task.environmentalForm.leadAreas.syncInfo.isSync = true;
                        task.environmentalForm.leadAreas.syncInfo.updated = false;
                        _g.label = 34;
                    case 34: return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 35:
                        _g.sent();
                        _g.label = 36;
                    case 36:
                        if (!(task.environmentalForm.moldAreas.syncInfo.isSync &&
                            task.environmentalForm.bacteriasAreas.syncInfo.isSync &&
                            task.environmentalForm.sootAreas.syncInfo.isSync &&
                            task.environmentalForm.generalInfoInspection.syncInfo.isSync &&
                            task.environmentalForm.moistureMappingAreas.syncInfo.isSync &&
                            task.environmentalForm.leadAreas.syncInfo.isSync &&
                            task.environmentalForm.asbestosAreas.syncInfo.isSync)) return [3 /*break*/, 38];
                        if (task.internalStatus == enums_1.InspectionStatus.PendingSaved) {
                            task.internalStatus = enums_1.InspectionStatus.Saved;
                            task.wasRejected = false;
                        }
                        if (task.internalStatus == enums_1.InspectionStatus.PendingSentLab) {
                            task.internalStatus = enums_1.InspectionStatus.LabsSent;
                            task.wasRejected = false;
                        }
                        if (task.internalStatus == enums_1.InspectionStatus.PendingToComplete) {
                            task.wasRejected = false;
                            task.internalStatus = enums_1.InspectionStatus.Completed;
                        }
                        return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 37:
                        _g.sent();
                        return [2 /*return*/, true];
                    case 38: return [4 /*yield*/, this.inspectionStorage.update(task)];
                    case 39:
                        _g.sent();
                        return [2 /*return*/, false];
                    case 40: return [3 /*break*/, 43];
                    case 41:
                        error_14 = _g.sent();
                        console.log(error_14);
                        message = this.toast.create({
                            message: error_14,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 42:
                        (_g.sent()).present();
                        console.log(error_14);
                        return [2 /*return*/, false];
                    case 43: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.sendLead = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var postData_2, areas, _a, _b, loadFirstImage, bitrixFields, response, result, error_15;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 12, , 13]);
                        postData_2 = {
                            //ID: "126",
                            IBLOCK_ID: enums_1.BitrixListsITest.Leads,
                            IBLOCK_TYPE_ID: "lists",
                            FIELDS: {
                                NAME: "Lead - " + task.id + " - " + task.title,
                                PROPERTY_3526: task.id
                            }
                        };
                        areas = task.environmentalForm.leadAreas;
                        if (areas.leadAreas.find(function (x) {
                            return x.areaPictures.images.length > 0 &&
                                x.areaPictures.images.find(function (i) { return i.isSync == false; });
                        })) {
                            areas.syncInfo.isSync = false;
                            areas.syncInfo.updated = false;
                            return [2 /*return*/, areas];
                        }
                        if (task.environmentalForm.leadAreas.syncInfo.syncCode &&
                            parseInt(task.environmentalForm.leadAreas.syncInfo.syncCode) > 0) {
                            postData_2["ELEMENT_ID"] =
                                task.environmentalForm.leadAreas.syncInfo.syncCode;
                        }
                        else {
                            postData_2["ELEMENT_CODE"] =
                                30 + "-" + task.id + "-" + (Math.random() * 100).toString();
                        }
                        postData_2.FIELDS[enums_1.bitrixMappingEnvironmental.Lead.leadHeader.contactCode] =
                            task.contactId;
                        if (!task.environmentalForm.leadAreas.inspectionDate) return [3 /*break*/, 2];
                        _a = postData_2.FIELDS;
                        _b = enums_1.bitrixMappingEnvironmental.Lead.leadHeader.inspectionDateCode;
                        return [4 /*yield*/, this.getBitrixDateTime1(task.environmentalForm.leadAreas.inspectionDate)];
                    case 1:
                        _a[_b] = _c.sent();
                        _c.label = 2;
                    case 2:
                        if (task.environmentalForm.leadAreas.inspectionType) {
                            postData_2.FIELDS[enums_1.bitrixMappingEnvironmental.Lead.leadHeader.inspectionTypeCode] = task.environmentalForm.leadAreas.inspectionType;
                        }
                        loadFirstImage = false;
                        bitrixFields = enums_1.bitrixMappingEnvironmental.Lead;
                        return [4 /*yield*/, Promise.all(task.environmentalForm.leadAreas.leadAreas.map(function (area, index) { return __awaiter(_this, void 0, void 0, function () {
                                var imageIndex;
                                return __generator(this, function (_a) {
                                    if (area.sample) {
                                        postData_2.FIELDS[bitrixFields.sampleCode[index]] = area.sample;
                                    }
                                    if (area.sampleOther) {
                                        postData_2.FIELDS[bitrixFields.sampleOtherCode[index]] =
                                            area.sampleOther;
                                    }
                                    if (area.areaPictures.images.length > 0 &&
                                        area.areaPictures.images.find(function (x) { return !x.syncList; })) {
                                        imageIndex = area.areaPictures.images.findIndex(function (x) { return !x.syncList; });
                                        loadFirstImage = true;
                                        area.areaPictures.images[imageIndex].flag = 1;
                                        postData_2.FIELDS[bitrixFields.areaPicturesCode[index]] = [
                                            area.areaPictures.images[imageIndex].syncCode,
                                        ];
                                    }
                                    if (area.cardinalDirection) {
                                        postData_2.FIELDS[bitrixFields.cardinalDirectionCode[index]] =
                                            area.cardinalDirection;
                                    }
                                    if (area.dimensionCm2) {
                                        postData_2.FIELDS[bitrixFields.dimensionCm2Code[index]] =
                                            area.dimensionCm2;
                                    }
                                    if (area.material) {
                                        postData_2.FIELDS[bitrixFields.materialCode[index]] = area.material;
                                    }
                                    if (area.typeOfSample) {
                                        postData_2.FIELDS[bitrixFields.typeOfSampleCode[index]] =
                                            area.typeOfSample;
                                    }
                                    if (area.labResults) {
                                        postData_2.FIELDS[bitrixFields.labResultsCode[index]] =
                                            area.labResults;
                                    }
                                    if (area.observations) {
                                        postData_2.FIELDS[bitrixFields.observationsCode[index]] =
                                            area.observations;
                                    }
                                    return [2 /*return*/];
                                });
                            }); }))];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this.bitrix
                                .syncDamageAreaInspection(postData_2, enums_1.BitrixListsITest.Leads)
                                .toPromise()];
                    case 4:
                        response = _c.sent();
                        if (!(response && response.result > 0)) return [3 /*break*/, 10];
                        result = response.result;
                        if (!(result > 0)) return [3 /*break*/, 8];
                        if (!loadFirstImage) return [3 /*break*/, 6];
                        return [4 /*yield*/, Promise.all(areas.leadAreas.map(function (x, index) {
                                var imageIndex = x.areaPictures.images.findIndex(function (x) { return x.flag == 1; });
                                if (imageIndex >= 0) {
                                    x.areaPictures.images[imageIndex].syncList = true;
                                    x.areaPictures.images[imageIndex].flag = null;
                                    delete postData_2.FIELDS[bitrixFields.areaPicturesCode[index]];
                                }
                            }))];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        areas.syncInfo.syncCode = areas.syncInfo.syncCode
                            ? areas.syncInfo.syncCode
                            : result.toString();
                        postData_2["ELEMENT_ID"] = areas.syncInfo.syncCode;
                        areas.syncInfo.isSync = result > 0;
                        areas.syncInfo.updated = false;
                        return [4 /*yield*/, this.syncLeadAreaImages(areas, postData_2, enums_1.BitrixListsITest.Leads, "Lead")];
                    case 7:
                        areas = _c.sent();
                        if (areas.leadAreas.find(function (area) {
                            return area.areaPictures.images.find(function (x) { return x.syncList && x.syncList == false; });
                        })) {
                            areas.syncInfo.isSync = false;
                            areas.syncInfo.updated = false;
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        _c.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        _c.label = 11;
                    case 11: return [2 /*return*/, areas];
                    case 12:
                        error_15 = _c.sent();
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        console.log(error_15);
                        return [2 /*return*/, areas];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.sendAsbestos = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var postData_3, areas, _a, _b, loadFirstImage, response, result, error_16;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 12, , 13]);
                        postData_3 = {
                            //ID: "126",
                            IBLOCK_ID: enums_1.BitrixListsITest.Asbestos,
                            IBLOCK_TYPE_ID: "lists",
                            FIELDS: {
                                NAME: "Asbestos - " + task.id + " - " + task.title,
                                PROPERTY_3522: task.id
                            }
                        };
                        areas = task.environmentalForm.asbestosAreas;
                        if (areas.asbestosAreas.find(function (x) {
                            return x.areaPictures.images.length > 0 &&
                                x.areaPictures.images.find(function (i) { return i.isSync == false; });
                        })) {
                            areas.syncInfo.isSync = false;
                            areas.syncInfo.updated = false;
                            return [2 /*return*/, areas];
                        }
                        if (task.environmentalForm.asbestosAreas.syncInfo.syncCode &&
                            parseInt(task.environmentalForm.asbestosAreas.syncInfo.syncCode) > 0) {
                            postData_3["ELEMENT_ID"] =
                                task.environmentalForm.asbestosAreas.syncInfo.syncCode;
                        }
                        else {
                            postData_3["ELEMENT_CODE"] =
                                32 + "-" + task.id + "-" + (Math.random() * 100).toString();
                        }
                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.asbestosHeader.contactCode] = task.contactId;
                        if (!task.environmentalForm.asbestosAreas.inspectionDate) return [3 /*break*/, 2];
                        //TODO fix date
                        _a = postData_3.FIELDS;
                        _b = enums_1.bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionDateCode;
                        return [4 /*yield*/, this.getBitrixDateTime1(task.environmentalForm.asbestosAreas.inspectionDate)];
                    case 1:
                        //TODO fix date
                        _a[_b] = _c.sent();
                        _c.label = 2;
                    case 2:
                        if (task.environmentalForm.asbestosAreas.inspectionType) {
                            postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionTypeCode] = task.environmentalForm.asbestosAreas.inspectionType;
                        }
                        loadFirstImage = false;
                        return [4 /*yield*/, Promise.all(areas.asbestosAreas.map(function (area, index) { return __awaiter(_this, void 0, void 0, function () {
                                var imageIndex;
                                return __generator(this, function (_a) {
                                    if (area.materialLocation) {
                                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.materialLocationCode[index]] = area.materialLocation;
                                    }
                                    if (area.areaPictures.images.length > 0 &&
                                        area.areaPictures.images.find(function (x) { return !x.syncList; })) {
                                        imageIndex = area.areaPictures.images.findIndex(function (x) { return !x.syncList; });
                                        loadFirstImage = true;
                                        area.areaPictures.images[imageIndex].flag = 1;
                                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.areaPicturesCode[index]] = [area.areaPictures.images[imageIndex].syncCode];
                                    }
                                    if (area.materialLocationOther) {
                                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.materialLocationOtherCode[index]] = area.materialLocationOther;
                                    }
                                    if (area.materialDescription) {
                                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.materialDescriptionCode[index]] = area.materialDescription;
                                    }
                                    if (area.totalQuantity) {
                                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.totalQuantityCode[index]] = area.totalQuantity;
                                    }
                                    if (area.F_NF) {
                                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.F_NFCode[index]] = area.F_NF;
                                    }
                                    if (area.condition) {
                                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.areaConditionCode[index]] = area.condition;
                                    }
                                    if (area.labResults) {
                                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.labResultsCode[index]] = area.labResults;
                                    }
                                    if (area.observations) {
                                        postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.observationsCode[index]] = area.observations;
                                    }
                                    return [2 /*return*/];
                                });
                            }); }))];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this.bitrix
                                .syncDamageAreaInspection(postData_3, enums_1.BitrixListsITest.Asbestos)
                                .toPromise()];
                    case 4:
                        response = _c.sent();
                        if (!(response && response.result > 0)) return [3 /*break*/, 10];
                        result = response.result;
                        if (!(result > 0)) return [3 /*break*/, 8];
                        if (!loadFirstImage) return [3 /*break*/, 6];
                        return [4 /*yield*/, Promise.all(areas.asbestosAreas.map(function (x, index) {
                                var imageIndex = x.areaPictures.images.findIndex(function (x) { return x.flag == 1; });
                                if (imageIndex >= 0) {
                                    x.areaPictures.images[imageIndex].syncList = true;
                                    x.areaPictures.images[imageIndex].flag = null;
                                    delete postData_3.FIELDS[enums_1.bitrixMappingEnvironmental.Asbestos.areaPicturesCode[index]];
                                }
                            }))];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        areas.syncInfo.syncCode = areas.syncInfo.syncCode
                            ? areas.syncInfo.syncCode
                            : result.toString();
                        postData_3["ELEMENT_ID"] = areas.syncInfo.syncCode;
                        areas.syncInfo.isSync = result > 0;
                        areas.syncInfo.updated = false;
                        return [4 /*yield*/, this.syncAsbestosAreaImages(areas, postData_3, enums_1.BitrixListsITest.Leads, "Asbestos")];
                    case 7:
                        areas = _c.sent();
                        if (areas.asbestosAreas.find(function (area) {
                            return area.areaPictures.images.find(function (x) { return x && x.syncList == false; });
                        })) {
                            areas.syncInfo.isSync = false;
                            areas.syncInfo.updated = false;
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        _c.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        _c.label = 11;
                    case 11: return [2 /*return*/, areas];
                    case 12:
                        error_16 = _c.sent();
                        console.log(error_16);
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        return [2 /*return*/, areas];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.sendMoistureMapping = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var postData_4, areas, _a, _b, loadFirstImage, response, result, error_17;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 12, , 13]);
                        postData_4 = {
                            //ID: "126",
                            IBLOCK_ID: enums_1.BitrixListsITest.Moisture,
                            IBLOCK_TYPE_ID: "lists",
                            FIELDS: {
                                NAME: "Moisture Mapping - " + task.id + " - " + task.title,
                                PROPERTY_3528: task.id
                            }
                        };
                        areas = task.environmentalForm.moistureMappingAreas;
                        if (areas.areamoistureMapping.find(function (x) {
                            return x.areaPictures.images.length > 0 &&
                                x.areaPictures.images.find(function (i) { return i.isSync == false; });
                        })) {
                            areas.syncInfo.isSync = false;
                            areas.syncInfo.updated = false;
                            return [2 /*return*/, areas];
                        }
                        if (task.environmentalForm.moistureMappingAreas.syncInfo.syncCode &&
                            parseInt(task.environmentalForm.moistureMappingAreas.syncInfo.syncCode) > 0) {
                            postData_4["ELEMENT_ID"] =
                                task.environmentalForm.moistureMappingAreas.syncInfo.syncCode;
                        }
                        else {
                            postData_4["ELEMENT_CODE"] =
                                34 + "-" + task.id + "-" + (Math.random() * 100).toString();
                        }
                        if (task.contactId) {
                            postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.moistureHeader.contactCode] = task.contactId;
                        }
                        if (!task.environmentalForm.moistureMappingAreas.dateTesed) return [3 /*break*/, 2];
                        //TODO: fix
                        _a = postData_4.FIELDS;
                        _b = enums_1.bitrixMappingEnvironmental.Moisture.moistureHeader.dateTesedCode;
                        return [4 /*yield*/, this.getBitrixDateTime1(task.environmentalForm.moistureMappingAreas.dateTesed)];
                    case 1:
                        //TODO: fix
                        _a[_b] = _c.sent();
                        _c.label = 2;
                    case 2:
                        if (task.environmentalForm.moistureMappingAreas.inspectionType) {
                            postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.moistureHeader.inspectionTypeCode] = task.environmentalForm.moistureMappingAreas.inspectionType;
                        }
                        loadFirstImage = false;
                        return [4 /*yield*/, Promise.all(task.environmentalForm.moistureMappingAreas.areamoistureMapping.map(function (area, index) { return __awaiter(_this, void 0, void 0, function () {
                                var imageIndex;
                                return __generator(this, function (_a) {
                                    if (area.area) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.areaCode[index]] = area.area;
                                    }
                                    if (area.areaOther) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.areaOtherCode[index]] = area.areaOther;
                                    }
                                    if (area.roomTemp) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.roomTempCode[index]] = area.roomTemp;
                                    }
                                    if (area.relativeHumidity) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.relativeHumidityCode[index]] = area.relativeHumidity;
                                    }
                                    if (area.dewPoint) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.dewPointCode[index]] = area.dewPoint;
                                    }
                                    if (area.standardTemperatureNorth) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.standardTemperatureNorthCode[index]] = area.standardTemperatureNorth;
                                    }
                                    if (area.standardTemperatureWest) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.standardTemperatureWestCode[index]] = area.standardTemperatureWest;
                                    }
                                    if (area.standardTemperatureSouth) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.standardTemperatureSouthCode[index]] = area.standardTemperatureSouth;
                                    }
                                    if (area.standardTemperatureEast) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.standardTemperatureEastCode[index]] = area.standardTemperatureEast;
                                    }
                                    if (area.standardTemperatureCeiling) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.standardTemperatureCeilingCode[index]] = area.standardTemperatureCeiling;
                                    }
                                    if (area.areaPictures.images.length > 0 &&
                                        area.areaPictures.images.find(function (x) { return !x.syncList; })) {
                                        imageIndex = area.areaPictures.images.findIndex(function (x) { return !x.syncList; });
                                        loadFirstImage = true;
                                        area.areaPictures.images[imageIndex].flag = 1;
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.areaPicturesCode[index]] = [area.areaPictures.images[imageIndex].syncCode];
                                    }
                                    if (area.standardTemperatureFloor) {
                                        postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.standardTemperatureFloorCode[index]] = area.standardTemperatureFloor;
                                    }
                                    return [2 /*return*/];
                                });
                            }); }))];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this.bitrix
                                .syncDamageAreaInspection(postData_4, enums_1.BitrixListsITest.Moisture)
                                .toPromise()];
                    case 4:
                        response = _c.sent();
                        if (!(response && response.result > 0)) return [3 /*break*/, 10];
                        result = response.result;
                        if (!(result > 0)) return [3 /*break*/, 8];
                        if (!loadFirstImage) return [3 /*break*/, 6];
                        return [4 /*yield*/, Promise.all(areas.areamoistureMapping.map(function (x, index) {
                                var imageIndex = x.areaPictures.images.findIndex(function (x) { return x.flag == 1; });
                                if (imageIndex >= 0) {
                                    x.areaPictures.images[imageIndex].syncList = true;
                                    x.areaPictures.images[imageIndex].flag = null;
                                    delete postData_4.FIELDS[enums_1.bitrixMappingEnvironmental.Moisture.areaPicturesCode[index]];
                                }
                            }))];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        areas.syncInfo.syncCode = areas.syncInfo.syncCode
                            ? areas.syncInfo.syncCode
                            : result.toString();
                        postData_4["ELEMENT_ID"] = areas.syncInfo.syncCode;
                        areas.syncInfo.isSync = result > 0;
                        areas.syncInfo.updated = false;
                        return [4 /*yield*/, this.syncMoistureAreaImages(areas, postData_4, enums_1.BitrixListsITest.Moisture, "Moisture")];
                    case 7:
                        areas = _c.sent();
                        if (areas.areamoistureMapping.find(function (area) {
                            return area.areaPictures.images.find(function (x) { return x && x.syncList == false; });
                        })) {
                            areas.syncInfo.isSync = false;
                            areas.syncInfo.updated = false;
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        _c.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        _c.label = 11;
                    case 11: return [2 /*return*/, areas];
                    case 12:
                        error_17 = _c.sent();
                        console.log(error_17);
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        return [2 /*return*/, areas];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncDamageAreaImages = function (areas, postData, list, type) {
        return __awaiter(this, void 0, void 0, function () {
            var bitrixFields, _loop_1, this_1, send, response, index, response, error_18;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        bitrixFields = enums_1.bitrixMappingEnvironmental[type];
                        _loop_1 = function (index) {
                            var cleanPostData_1, error_19;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 5, , 6]);
                                        cleanPostData_1 = JSON.parse(JSON.stringify(postData));
                                        send = false;
                                        return [4 /*yield*/, Promise.all(areas.areasInspection.map(function (area, indexArea) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    if (area.areaPictures.images[index] &&
                                                        area.areaPictures.images[index].syncList == false &&
                                                        area.areaPictures.images[index].syncCode) {
                                                        area.areaPictures.images[index].flag = 1;
                                                        cleanPostData_1.FIELDS[bitrixFields.areaPicturesCode[indexArea]] =
                                                            [area.areaPictures.images[index].syncCode];
                                                        send = true;
                                                    }
                                                    return [2 /*return*/];
                                                });
                                            }); }))];
                                    case 1:
                                        _a.sent();
                                        if (!send) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this_1.bitrix
                                                .syncDamageAreaInspection(cleanPostData_1, list)
                                                .toPromise()];
                                    case 2:
                                        response = _a.sent();
                                        if (!(response && response.result > 0)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, Promise.all(areas.areasInspection.map(function (x, index) {
                                                var imageIndex = x.areaPictures.images.findIndex(function (x) { return x.flag == 1; });
                                                if (imageIndex >= 0) {
                                                    x.areaPictures.images[imageIndex].syncList = true;
                                                    x.areaPictures.images[imageIndex].flag = null;
                                                }
                                            }))];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        error_19 = _a.sent();
                                        console.log(error_19);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < areas.areasInspection[0].areaPictures.images.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(index)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.bitrix
                            .syncDamageAreaInspection(postData, list)
                            .toPromise()];
                    case 5:
                        response = _a.sent();
                        return [2 /*return*/, areas];
                    case 6:
                        error_18 = _a.sent();
                        console.log(error_18);
                        return [2 /*return*/, areas];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncLeadAreaImages = function (areas, postData, list, type) {
        return __awaiter(this, void 0, void 0, function () {
            var bitrixFields, _loop_2, this_2, send, response, index, response, error_20;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        bitrixFields = enums_1.bitrixMappingEnvironmental[type];
                        _loop_2 = function (index) {
                            var cleanPostData_2, error_21;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 5, , 6]);
                                        cleanPostData_2 = JSON.parse(JSON.stringify(postData));
                                        send = false;
                                        return [4 /*yield*/, Promise.all(areas.leadAreas.map(function (area, indexArea) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    if (area.areaPictures.images[index] &&
                                                        area.areaPictures.images[index].syncList == false &&
                                                        area.areaPictures.images[index].syncCode) {
                                                        area.areaPictures.images[index].flag = 1;
                                                        cleanPostData_2.FIELDS[bitrixFields.areaPicturesCode[indexArea]] =
                                                            [area.areaPictures.images[index].syncCode];
                                                        send = true;
                                                    }
                                                    return [2 /*return*/];
                                                });
                                            }); }))];
                                    case 1:
                                        _a.sent();
                                        if (!send) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this_2.bitrix
                                                .syncDamageAreaInspection(cleanPostData_2, list)
                                                .toPromise()];
                                    case 2:
                                        response = _a.sent();
                                        if (!(response && response.result > 0)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, Promise.all(areas.leadAreas.map(function (x, index) {
                                                var imageIndex = x.areaPictures.images.findIndex(function (x) { return x.flag == 1; });
                                                if (imageIndex >= 0) {
                                                    x.areaPictures.images[imageIndex].syncList = true;
                                                    x.areaPictures.images[imageIndex].flag = null;
                                                }
                                            }))];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        error_21 = _a.sent();
                                        console.log(error_21);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < areas.leadAreas[0].areaPictures.images.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_2(index)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.bitrix
                            .syncDamageAreaInspection(postData, list)
                            .toPromise()];
                    case 5:
                        response = _a.sent();
                        return [2 /*return*/, areas];
                    case 6:
                        error_20 = _a.sent();
                        console.log(error_20);
                        return [2 /*return*/, areas];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncMoistureAreaImages = function (areas, postData, list, type) {
        return __awaiter(this, void 0, void 0, function () {
            var bitrixFields, _loop_3, this_3, send, response, index, response, error_22;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        bitrixFields = enums_1.bitrixMappingEnvironmental[type];
                        _loop_3 = function (index) {
                            var cleanPostData_3, error_23;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 5, , 6]);
                                        cleanPostData_3 = JSON.parse(JSON.stringify(postData));
                                        send = false;
                                        return [4 /*yield*/, Promise.all(areas.areamoistureMapping.map(function (area, indexArea) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    if (area.areaPictures.images[index] &&
                                                        area.areaPictures.images[index].syncList == false &&
                                                        area.areaPictures.images[index].syncCode) {
                                                        area.areaPictures.images[index].flag = 1;
                                                        cleanPostData_3.FIELDS[bitrixFields.areaPicturesCode[indexArea]] =
                                                            [area.areaPictures.images[index].syncCode];
                                                        send = true;
                                                    }
                                                    return [2 /*return*/];
                                                });
                                            }); }))];
                                    case 1:
                                        _a.sent();
                                        if (!send) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this_3.bitrix
                                                .syncDamageAreaInspection(cleanPostData_3, list)
                                                .toPromise()];
                                    case 2:
                                        response = _a.sent();
                                        if (!(response && response.result > 0)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, Promise.all(areas.areamoistureMapping.map(function (x, index) {
                                                var imageIndex = x.areaPictures.images.findIndex(function (x) { return x.flag == 1; });
                                                if (imageIndex >= 0) {
                                                    x.areaPictures.images[imageIndex].syncList = true;
                                                    x.areaPictures.images[imageIndex].flag = null;
                                                }
                                            }))];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        error_23 = _a.sent();
                                        console.log(error_23);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        };
                        this_3 = this;
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < areas.areamoistureMapping[0].areaPictures.images.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_3(index)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.bitrix
                            .syncDamageAreaInspection(postData, list)
                            .toPromise()];
                    case 5:
                        response = _a.sent();
                        return [2 /*return*/, areas];
                    case 6:
                        error_22 = _a.sent();
                        console.log(error_22);
                        return [2 /*return*/, areas];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.syncAsbestosAreaImages = function (areas, postData, list, type) {
        return __awaiter(this, void 0, void 0, function () {
            var bitrixFields, _loop_4, this_4, send, response, index, response, error_24;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        bitrixFields = enums_1.bitrixMappingEnvironmental[type];
                        _loop_4 = function (index) {
                            var cleanPostData_4, error_25;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 5, , 6]);
                                        cleanPostData_4 = JSON.parse(JSON.stringify(postData));
                                        send = false;
                                        return [4 /*yield*/, Promise.all(areas.asbestosAreas.map(function (area, indexArea) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    if (area.areaPictures.images[index] &&
                                                        area.areaPictures.images[index].syncList == false &&
                                                        area.areaPictures.images[index].syncCode) {
                                                        area.areaPictures.images[index].flag = 1;
                                                        cleanPostData_4.FIELDS[bitrixFields.areaPicturesCode[indexArea]] =
                                                            [area.areaPictures.images[index].syncCode];
                                                        send = true;
                                                    }
                                                    return [2 /*return*/];
                                                });
                                            }); }))];
                                    case 1:
                                        _a.sent();
                                        if (!send) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this_4.bitrix
                                                .syncDamageAreaInspection(cleanPostData_4, list)
                                                .toPromise()];
                                    case 2:
                                        response = _a.sent();
                                        if (!(response && response.result > 0)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, Promise.all(areas.asbestosAreas.map(function (x, index) {
                                                var imageIndex = x.areaPictures.images.findIndex(function (x) { return x.flag == 1; });
                                                if (imageIndex >= 0) {
                                                    x.areaPictures.images[imageIndex].syncList = true;
                                                    x.areaPictures.images[imageIndex].flag = null;
                                                }
                                            }))];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        error_25 = _a.sent();
                                        console.log(error_25);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        };
                        this_4 = this;
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < areas.asbestosAreas[0].areaPictures.images.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_4(index)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.bitrix
                            .syncDamageAreaInspection(postData, list)
                            .toPromise()];
                    case 5:
                        response = _a.sent();
                        return [2 /*return*/, areas];
                    case 6:
                        error_24 = _a.sent();
                        console.log(error_24);
                        return [2 /*return*/, areas];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService.prototype.sendDamageInspection = function (areas, task, type, list, name) {
        return __awaiter(this, void 0, Promise, function () {
            var postData_5, damageInspectionList, _a, _b, bitrixFields, loadFirstImage, response, result, error_26;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 11, , 12]);
                        if (areas.areasInspection.find(function (x) {
                            return x.areaPictures.images.length > 0 &&
                                x.areaPictures.images.find(function (i) { return i.isSync == false; });
                        })) {
                            areas.syncInfo.isSync = false;
                            areas.syncInfo.updated = false;
                            return [2 /*return*/, areas];
                        }
                        postData_5 = {
                            //ID: "126",
                            IBLOCK_ID: list,
                            IBLOCK_TYPE_ID: "lists",
                            FIELDS: {
                                NAME: name
                            }
                        };
                        damageInspectionList = [];
                        if (areas.syncInfo.syncCode && areas.syncInfo.syncCode != "") {
                            postData_5["ELEMENT_ID"] = areas.syncInfo.syncCode;
                        }
                        else {
                            postData_5["ELEMENT_CODE"] =
                                list + "-" + task.id + "-" + (Math.random() * 100).toString();
                        }
                        damageInspectionList = areas.areasInspection;
                        postData_5.FIELDS[enums_1.bitrixMappingEnvironmental[type].inspectionHeader.contactIdCode] = task.contactId;
                        _a = postData_5.FIELDS;
                        _b = enums_1.bitrixMappingEnvironmental[type].inspectionHeader.startDateCode;
                        return [4 /*yield*/, this.getBitrixDateTime(task.environmentalForm.startDate)];
                    case 1:
                        _a[_b] = _c.sent();
                        postData_5.FIELDS[enums_1.bitrixMappingEnvironmental[type].inspectionHeader.dealIdCode] = task.id;
                        postData_5.FIELDS[enums_1.bitrixMappingEnvironmental[type].inspectionHeader.inspectionType] = areas.moldInspectionType;
                        bitrixFields = enums_1.bitrixMappingEnvironmental[type];
                        loadFirstImage = false;
                        return [4 /*yield*/, Promise.all(areas.areasInspection.map(function (area, index) { return __awaiter(_this, void 0, void 0, function () {
                                var imageIndex;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (area.areaName) {
                                                postData_5.FIELDS[bitrixFields.areaNameCode[index]] = area.areaName;
                                            }
                                            if (area.areaNameOther) {
                                                postData_5.FIELDS[bitrixFields.areaNameOtherCode[index]] =
                                                    area.areaNameOther;
                                            }
                                            if (area.areaRH) {
                                                postData_5.FIELDS[bitrixFields.areaRHCode[index]] = area.areaRH;
                                            }
                                            if (area.areaCondition && area.areaCondition.length > 0) {
                                                postData_5.FIELDS[bitrixFields.areaConditionCode[index]] =
                                                    area.areaCondition;
                                            }
                                            if (area.areaNotes) {
                                                postData_5.FIELDS[bitrixFields.areaNotesCode[index]] =
                                                    area.areaNotes;
                                            }
                                            if (area.removeCeiling) {
                                                postData_5.FIELDS[bitrixFields.removeCeilingCode[index]] =
                                                    area.removeCeiling;
                                            }
                                            if (area.ceilingNotes) {
                                                postData_5.FIELDS[bitrixFields.ceilingNotesCode[index]] =
                                                    area.ceilingNotes;
                                            }
                                            if (area.removeDrywall) {
                                                postData_5.FIELDS[bitrixFields.removeDrywallCode[index]] =
                                                    area.removeDrywall;
                                            }
                                            if (area.drywallNotes) {
                                                postData_5.FIELDS[bitrixFields.drywallNotesCode[index]] =
                                                    area.drywallNotes;
                                            }
                                            if (area.removeBaseboards) {
                                                postData_5.FIELDS[bitrixFields.removeBaseboardsCode[index]] =
                                                    area.removeBaseboards;
                                            }
                                            if (area.baseboardsNotes) {
                                                postData_5.FIELDS[bitrixFields.baseboardsNotesCode[index]] =
                                                    area.baseboardsNotes;
                                            }
                                            if (area.removeFlooring) {
                                                postData_5.FIELDS[bitrixFields.removeFlooringCode[index]] =
                                                    area.removeFlooring;
                                            }
                                            if (area.flooringNotes) {
                                                postData_5.FIELDS[bitrixFields.flooringNotesCode[index]] =
                                                    area.flooringNotes;
                                            }
                                            if (area.decontamination) {
                                                postData_5.FIELDS[bitrixFields.decontaminationCode[index]] =
                                                    area.decontamination;
                                            }
                                            if (area.furnitureOption) {
                                                postData_5.FIELDS[bitrixFields.furnitureOptionCode[index]] =
                                                    area.furnitureOption;
                                            }
                                            if (area.beddingsOption) {
                                                postData_5.FIELDS[bitrixFields.beddingsOptionCode[index]] =
                                                    area.beddingsOption;
                                            }
                                            if (area.observations) {
                                                postData_5.FIELDS[bitrixFields.observationsCode[index]] =
                                                    area.observations;
                                            }
                                            if (area.waterDamageCategory) {
                                                postData_5.FIELDS[bitrixFields.waterDamageCategoryCode[index]] =
                                                    area.waterDamageCategory;
                                            }
                                            if (area.waterDamageClass) {
                                                postData_5.FIELDS[bitrixFields.waterDamageClassCode[index]] =
                                                    area.waterDamageClass;
                                            }
                                            if (area.areaPictures.images.length > 0 &&
                                                area.areaPictures.images.find(function (x) { return !x.syncList; })) {
                                                imageIndex = area.areaPictures.images.findIndex(function (x) { return !x.syncList; });
                                                loadFirstImage = true;
                                                area.areaPictures.images[imageIndex].flag = 1;
                                                postData_5.FIELDS[bitrixFields.areaPicturesCode[index]] = [
                                                    area.areaPictures.images[imageIndex].syncCode,
                                                ];
                                            }
                                            if (!area.samples) return [3 /*break*/, 2];
                                            return [4 /*yield*/, Promise.all(area.samples.map(function (element, sampleIndex) {
                                                    var varient = "Sample" + (sampleIndex + 1);
                                                    if (element.type) {
                                                        postData_5.FIELDS[bitrixFields["typeCode" + varient][index]] =
                                                            element.type;
                                                    }
                                                    if (element.labResult) {
                                                        postData_5.FIELDS[bitrixFields["labResultCode" + varient][index]] = element.labResult;
                                                    }
                                                    if (type == enums_1.DamageAreaType.Mold) {
                                                        if (element.volume) {
                                                            postData_5.FIELDS[bitrixFields["volumeCode" + varient][index]] = element.volume;
                                                        }
                                                        if (element.cassetteNumber) {
                                                            postData_5.FIELDS[bitrixFields["cassetteNumberCode" + varient][index]] = element.cassetteNumber;
                                                        }
                                                        if (element.toxicMold) {
                                                            postData_5.FIELDS[bitrixFields["toxicMoldCode" + varient][index]] = element.toxicMold;
                                                        }
                                                        if (element.areaSwab) {
                                                            postData_5.FIELDS[bitrixFields["areaSwabCode" + varient][index]] = element.areaSwab;
                                                        }
                                                    }
                                                }))];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            if (area.recomendations) {
                                                postData_5.FIELDS[bitrixFields.recomendationsCode[index]] =
                                                    area.recomendations;
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.bitrix
                                .syncDamageAreaInspection(postData_5, list)
                                .toPromise()];
                    case 3:
                        response = _c.sent();
                        if (!(response && response.result > 0)) return [3 /*break*/, 9];
                        result = response.result;
                        if (!(result > 0)) return [3 /*break*/, 7];
                        if (!loadFirstImage) return [3 /*break*/, 5];
                        return [4 /*yield*/, Promise.all(areas.areasInspection.map(function (x, index) {
                                var imageIndex = x.areaPictures.images.findIndex(function (x) { return x.flag == 1; });
                                if (imageIndex >= 0) {
                                    x.areaPictures.images[imageIndex].syncList = true;
                                    x.areaPictures.images[imageIndex].flag = null;
                                    delete postData_5.FIELDS[bitrixFields.areaPicturesCode[index]];
                                }
                            }))];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        areas.syncInfo.syncCode = areas.syncInfo.syncCode
                            ? areas.syncInfo.syncCode
                            : result.toString();
                        postData_5["ELEMENT_ID"] = areas.syncInfo.syncCode;
                        areas.syncInfo.isSync = result > 0;
                        areas.syncInfo.updated = false;
                        return [4 /*yield*/, this.syncDamageAreaImages(areas, postData_5, list, type)];
                    case 6:
                        areas = _c.sent();
                        if (areas.areasInspection.find(function (area) {
                            return area.areaPictures.images.find(function (x) { return x && x.syncList == false; });
                        })) {
                            areas.syncInfo.isSync = false;
                            areas.syncInfo.updated = false;
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        _c.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        _c.label = 10;
                    case 10: return [2 /*return*/, areas];
                    case 11:
                        error_26 = _c.sent();
                        console.log(error_26);
                        areas.syncInfo.isSync = false;
                        areas.syncInfo.updated = false;
                        return [2 /*return*/, areas];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SyncInspectionService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], SyncInspectionService);
    return SyncInspectionService;
}());
exports.SyncInspectionService = SyncInspectionService;
function entries(obj) {
    return Object.entries(obj);
}
exports.entries = entries;

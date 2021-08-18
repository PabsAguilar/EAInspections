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
exports.entries = exports.ItestDealService = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("../models/enums");
var environmental_form_1 = require("../models/environmental-form");
var task_subtype_1 = require("../models/task-subtype");
var generic_storage_service_1 = require("./generic-storage.service");
var inspection_task_1 = require("../models/inspection-task");
var damage_inspection_1 = require("../models/damage-inspection");
var sample_1 = require("../models/environmental-form/sample");
var moisture_mapping_areas_1 = require("../models/environmental-form/moisture-mapping-areas");
var moisture_mapping_1 = require("../models/environmental-form/moisture-mapping");
var asbesto_1 = require("../models/environmental-form/asbesto");
var lead_1 = require("../models/environmental-form/lead");
var contact_1 = require("../models/contact");
var company_1 = require("../models/company");
var sync_info_1 = require("../models/sync-info");
var user_1 = require("../models/user");
var comprehensive_form_1 = require("../models/comprehensive-form/comprehensive-form");
var area_1 = require("../models/comprehensive-form/area");
var general_condition_1 = require("../models/comprehensive-form/general-condition");
var damage_areas_1 = require("../models/environmental-form/damage-areas");
var asbesto_areas_1 = require("../models/environmental-form/asbesto-areas");
var lead_areas_1 = require("../models/environmental-form/lead-areas");
var SYNCSTAMPKEY = "inspection-stamp-key";
var ItestDealService = /** @class */ (function () {
    function ItestDealService(inspectionStorage, bitrixITest, storage, toast) {
        this.inspectionStorage = inspectionStorage;
        this.bitrixITest = bitrixITest;
        this.storage = storage;
        this.toast = toast;
        this.environmentalInspectionFieldsName = "environmental-inspection-fields";
        this.dealFieldName = "deals-fields";
        this.collectionTaskSubTypesName = "task-itest-subtypes-list";
        this.collectionInspectors = "inspectors";
        this.inspectionTypesListService = new generic_storage_service_1.GenericStorageService(this.collectionTaskSubTypesName, this.storage);
        this.environmentalInspectionFieldsListService = new generic_storage_service_1.GenericStorageService(this.environmentalInspectionFieldsName, this.storage);
        this.inspectorsService = new generic_storage_service_1.GenericStorageService(this.collectionInspectors, this.storage);
        this.dealsFieldsListService = new generic_storage_service_1.GenericStorageService(this.dealFieldName, this.storage);
    }
    ItestDealService.prototype.setEnterprise = function (enterprise) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.setUrlandKey(enterprise)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.update = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.inspectionStorage.update(task)];
            });
        });
    };
    ItestDealService.prototype.getInspectionTask = function (id, enterprise) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.inspectionStorage.get(id, enterprise)];
            });
        });
    };
    ItestDealService.prototype["delete"] = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.inspectionStorage["delete"](task)];
            });
        });
    };
    ItestDealService.prototype.getPendingToSyncCount = function (user) {
        return __awaiter(this, void 0, Promise, function () {
            var pending;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.inspectionStorage.getPendingToSync(user)];
                    case 1:
                        pending = _a.sent();
                        return [2 /*return*/, pending.length];
                }
            });
        });
    };
    ItestDealService.prototype.getContactPhone = function (phone) {
        return __awaiter(this, void 0, Promise, function () {
            var result, contact;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.getContactByPhone(phone)];
                    case 1:
                        result = _a.sent();
                        if (result.length > 0) {
                            contact = new contact_1.Contact();
                            contact.firstName = result[0].NAME;
                            contact.idContact = result[0].ID;
                            contact.lastName = result[0].LAST_NAME;
                            contact.email = result[0].EMAIL;
                            contact.email = result[0].PHONE;
                            contact.syncInfo.isSync = true;
                            return [2 /*return*/, contact];
                        }
                        else {
                            return [2 /*return*/, new contact_1.Contact()];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.getCompaniesByName = function (name, enterprise) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.getCompaniesByNameAndEnterprise(name, enterprise)];
                    case 1:
                        response = _a.sent();
                        if (response && response.result && response.result.length > 0) {
                            return [2 /*return*/, Promise.all(response.result.map(function (item) { return __awaiter(_this, void 0, Promise, function () {
                                    var company;
                                    return __generator(this, function (_a) {
                                        company = new company_1.Company();
                                        company.title = item.TITLE;
                                        company.type = item.COMPANY_TYPE;
                                        company.id = item.ID;
                                        if (item.EMAIL && item.EMAIL.length > 0) {
                                            company.email = item.EMAIL[0].VALUE;
                                        }
                                        if (item.PHONE && item.PHONE.length > 0) {
                                            company.phone = item.PHONE[0].VALUE;
                                        }
                                        company.syncInfo.isSync = true;
                                        company.syncInfo.syncCode = item.ID;
                                        return [2 /*return*/, company];
                                    });
                                }); }))];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.getContactsByEmail = function (email, enterpise) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.getContactByEmailByEnterprise(email, enterpise)];
                    case 1:
                        response = _a.sent();
                        if (response && response.result && response.result.length > 0) {
                            return [2 /*return*/, Promise.all(response.result.map(function (item) { return __awaiter(_this, void 0, Promise, function () {
                                    var contact;
                                    return __generator(this, function (_a) {
                                        contact = new contact_1.Contact();
                                        contact.firstName = item.NAME;
                                        contact.idContact = item.ID;
                                        contact.lastName = item.LAST_NAME;
                                        if (item.EMAIL && item.EMAIL.length > 0) {
                                            contact.email = item.EMAIL[0].VALUE;
                                        }
                                        if (item.PHONE && item.PHONE.length > 0) {
                                            contact.phone = item.PHONE[0].VALUE;
                                        }
                                        contact.syncInfo.isSync = true;
                                        contact.syncInfo.syncCode = item.ID;
                                        return [2 /*return*/, contact];
                                    });
                                }); }))];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.getPendingInspections = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var list, pending;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.inspectionStorage.getAll()];
                    case 1:
                        list = _a.sent();
                        if (list != null) {
                            pending = list
                                .filter(function (item) {
                                return (item.inspectorUserId == user.userId &&
                                    item.internalStatus !== enums_1.InspectionStatus.Completed &&
                                    item.enterprise == user.enterprise);
                            })
                                .sort(function (a, b) {
                                return _this.getTime(a.scheduleDateTime) - _this.getTime(b.scheduleDateTime);
                            });
                        }
                        return [2 /*return*/, pending];
                }
            });
        });
    };
    ItestDealService.prototype.login = function (url, token, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.getUserByEmail(url, token, email)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ItestDealService.prototype.getCompletedInspections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, completed;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.inspectionStorage.getAll()];
                    case 1:
                        list = _a.sent();
                        if (list != null) {
                            completed = list
                                .filter(function (item) {
                                return item.internalStatus == enums_1.InspectionStatus.Completed;
                            })
                                .sort(function (a, b) {
                                return _this.getTime(a.scheduleDateTime) - _this.getTime(b.scheduleDateTime);
                            });
                            return [2 /*return*/, completed];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    ItestDealService.prototype.getStartedInspections = function (enterprise) {
        return __awaiter(this, void 0, void 0, function () {
            var list, completed;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.inspectionStorage.getAll()];
                    case 1:
                        list = _a.sent();
                        if (list != null) {
                            completed = list
                                .filter(function (item) {
                                return (item.internalStatus !== enums_1.InspectionStatus.New &&
                                    item.enterprise == enterprise);
                            })
                                .sort(function (a, b) {
                                return _this.getTime(a.scheduleDateTime) - _this.getTime(b.scheduleDateTime);
                            });
                            return [2 /*return*/, completed];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    ItestDealService.prototype.getTime = function (date) {
        return date != null ? new Date(date).getTime() : 0;
    };
    ItestDealService.prototype.getInspectionTasksTypesList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.inspectionTypesListService.getAll()];
                    case 1:
                        list = _a.sent();
                        if (list != null && list.length > 0) {
                            return [2 /*return*/, list];
                        }
                        return [4 /*yield*/, this.getInspectionTasksTypesListFromServer()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ItestDealService.prototype.getInspectionTasksTypesListFromServer = function () {
        return __awaiter(this, void 0, Promise, function () {
            var result, list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.getInspectionTypesITest(enums_1.ITestDealMapping.serviceTypeList)];
                    case 1:
                        result = _a.sent();
                        list = result.result.map(function (x) {
                            var subType = new task_subtype_1.TaskSubtype();
                            subType.id = x.ID;
                            subType.blockId = x.IBLOCK_ID;
                            subType.name = x.NAME;
                            return subType;
                        });
                        this.inspectionTypesListService.addItems(list);
                        return [2 /*return*/, list];
                }
            });
        });
    };
    ItestDealService.prototype.initializeAsbestosMapping = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                task.environmentalForm.asbestosAreas.inspectionDate = new Date();
                task.environmentalForm.asbestosAreas.inspectionDateString =
                    new Date().toISOString();
                Promise.all(enums_1.bitrixMappingEnvironmental.Asbestos.materialLocationCode.map(function (t, index) {
                    var x = new asbesto_1.Asbesto();
                    task.environmentalForm.asbestosAreas.asbestosAreas.push(x);
                }));
                return [2 /*return*/, task];
            });
        });
    };
    ItestDealService.prototype.initializeLead = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                task.environmentalForm.leadAreas.inspectionDate = new Date();
                task.environmentalForm.leadAreas.inspectionDateString =
                    new Date().toISOString();
                Promise.all(enums_1.bitrixMappingEnvironmental.Lead.sampleCode.map(function (t, index) {
                    var x = new lead_1.Lead();
                    task.environmentalForm.leadAreas.leadAreas.push(x);
                }));
                return [2 /*return*/, task];
            });
        });
    };
    ItestDealService.prototype.initializeComprehensiveArea = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                Promise.all([
                    enums_1.bitrixMappingComprehensive.Area.nameCode.map(function (t, index) {
                        var x = new area_1.Area();
                        task.comprehesiveForm.areas.push(x);
                    }),
                    enums_1.bitrixMappingComprehensive.Bathrooms.conditionCode.map(function (x, index) {
                        var area = new general_condition_1.GeneralCondition();
                        task.comprehesiveForm.bathrooms.push(area);
                    }),
                ]);
                return [2 /*return*/, task];
            });
        });
    };
    ItestDealService.prototype.initializeMoistureMapping = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                task.environmentalForm.moistureMappingAreas.dateTesed = new Date();
                task.environmentalForm.moistureMappingAreas.dateTesedString =
                    new Date().toISOString();
                Promise.all(enums_1.bitrixMappingEnvironmental.Moisture.areaCode.map(function (t, index) {
                    var x = new moisture_mapping_1.MoistureMapping();
                    task.environmentalForm.moistureMappingAreas.areamoistureMapping.push(x);
                }));
                return [2 /*return*/, task];
            });
        });
    };
    ItestDealService.prototype.initializeDamageMapping = function (damageType, task) {
        return __awaiter(this, void 0, Promise, function () {
            var listDamageInspection, index, x, s, s2, s3;
            return __generator(this, function (_a) {
                listDamageInspection = [];
                for (index = 0; index < enums_1.bitrixMappingEnvironmental[damageType].areaNameCode.length; index++) {
                    x = new damage_inspection_1.DamageInspection(damageType);
                    s = new sample_1.Sample(damageType);
                    s2 = new sample_1.Sample(damageType);
                    s3 = new sample_1.Sample(damageType);
                    x.samples.push(s);
                    x.samples.push(s2);
                    x.samples.push(s3);
                    listDamageInspection.push(x);
                }
                switch (damageType) {
                    case enums_1.DamageAreaType.Mold:
                        task.environmentalForm.moldAreas.areasInspection = listDamageInspection;
                        break;
                    case enums_1.DamageAreaType.Bacteria:
                        task.environmentalForm.bacteriasAreas.areasInspection =
                            listDamageInspection;
                        break;
                    case enums_1.DamageAreaType.Soot:
                        task.environmentalForm.sootAreas.areasInspection = listDamageInspection;
                        break;
                }
                return [2 /*return*/, task];
            });
        });
    };
    ItestDealService.prototype.initializeEnvironmentalTask = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!task.environmentalForm) {
                            task.environmentalForm = new environmental_form_1.EnvironmentalForm();
                        }
                        return [4 /*yield*/, this.initializeDamageMapping(enums_1.DamageAreaType.Mold, task)];
                    case 1:
                        //initialize mold Areas
                        task = _a.sent();
                        return [4 /*yield*/, this.initializeDamageMapping(enums_1.DamageAreaType.Soot, task)];
                    case 2:
                        task = _a.sent();
                        return [4 /*yield*/, this.initializeDamageMapping(enums_1.DamageAreaType.Bacteria, task)];
                    case 3:
                        task = _a.sent();
                        return [4 /*yield*/, this.initializeMoistureMapping(task)];
                    case 4:
                        task = _a.sent();
                        return [4 /*yield*/, this.initializeAsbestosMapping(task)];
                    case 5:
                        task = _a.sent();
                        return [4 /*yield*/, this.initializeLead(task)];
                    case 6:
                        task = _a.sent();
                        return [2 /*return*/, task];
                }
            });
        });
    };
    ItestDealService.prototype.initializeENTask = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!task.comprehesiveForm) {
                            task.comprehesiveForm = new comprehensive_form_1.ComprehensiveForm();
                        }
                        return [4 /*yield*/, this.initializeComprehensiveArea(task)];
                    case 1:
                        //initialize mold Areas
                        task = _a.sent();
                        return [2 /*return*/, task];
                }
            });
        });
    };
    ItestDealService.prototype.getEnvironmentalInspectionFields = function () {
        return __awaiter(this, void 0, Promise, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.environmentalInspectionFieldsListService.getAll()];
                    case 1:
                        list = _a.sent();
                        if (list != null) {
                            return [2 /*return*/, list];
                        }
                        return [4 /*yield*/, this.getEnvironmentalFromServerInspectionFields()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.environmentalInspectionFieldsListService.getAll()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ItestDealService.prototype.getInspectors = function (server) {
        return __awaiter(this, void 0, Promise, function () {
            var list, usersList, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.inspectorsService.getAll()];
                    case 1:
                        list = _a.sent();
                        usersList = [];
                        if (!server && list != null) {
                            return [2 /*return*/, list];
                        }
                        return [4 /*yield*/, this.bitrixITest.getInspectors()];
                    case 2:
                        result = _a.sent();
                        if (!result.result) return [3 /*break*/, 6];
                        usersList = result.result.map(function (x) {
                            return new user_1.User(x);
                        });
                        if (!(usersList && usersList.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.inspectorsService.clear()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.inspectorsService.addItems(usersList)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        console.log(result);
                        _a.label = 7;
                    case 7: return [2 /*return*/, usersList];
                }
            });
        });
    };
    ItestDealService.prototype.getEnvironmentalFromServerInspectionFields = function () {
        return __awaiter(this, void 0, Promise, function () {
            var responseMold, responseBacteria, responseSoot, responseMoisture, responseAsbestos, responseLeads, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsFields(enums_1.BitrixListsITest.Mold)];
                    case 1:
                        responseMold = _a.sent();
                        return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsFields(enums_1.BitrixListsITest.Bacteria)];
                    case 2:
                        responseBacteria = _a.sent();
                        return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsFields(enums_1.BitrixListsITest.Soot)];
                    case 3:
                        responseSoot = _a.sent();
                        return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsFields(enums_1.BitrixListsITest.Moisture)];
                    case 4:
                        responseMoisture = _a.sent();
                        return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsFields(enums_1.BitrixListsITest.Asbestos)];
                    case 5:
                        responseAsbestos = _a.sent();
                        return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsFields(enums_1.BitrixListsITest.Leads)];
                    case 6:
                        responseLeads = _a.sent();
                        obj = Object.assign(responseMold.result, responseBacteria.result, responseSoot.result, responseMoisture.result, responseAsbestos.result, responseLeads.result);
                        if (!obj) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.environmentalInspectionFieldsListService.clear()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.environmentalInspectionFieldsListService.add(obj)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [4 /*yield*/, this.environmentalInspectionFieldsListService.getAll()];
                    case 10: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ItestDealService.prototype.getDealsFields = function () {
        return __awaiter(this, void 0, Promise, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dealsFieldsListService.getAll()];
                    case 1:
                        list = _a.sent();
                        if (list != null) {
                            return [2 /*return*/, list];
                        }
                        return [2 /*return*/, this.getDealsFieldsFromServer()];
                }
            });
        });
    };
    ItestDealService.prototype.getDealsFieldsFromServer = function () {
        return __awaiter(this, void 0, Promise, function () {
            var reponseFields;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.getDealFields()];
                    case 1:
                        reponseFields = _a.sent();
                        if (!(reponseFields && reponseFields.result)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.dealsFieldsListService.clear()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.dealsFieldsListService.add(reponseFields.result)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.dealsFieldsListService.getAll()];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ItestDealService.prototype.getExternal = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var startedList, list, index, item, itemStarted, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 24, , 25]);
                        this.storage.set(SYNCSTAMPKEY, new Date());
                        if (!(user.enterprise == enums_1.EnumEnterprise.itest)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.RejectedInspection(user)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.ArchiveInspection(user)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getStartedInspections(user.enterprise)];
                    case 4:
                        startedList = _a.sent();
                        list = [];
                        if (!(user.enterprise == enums_1.EnumEnterprise.itest)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getInspectionITestJson(user)];
                    case 5:
                        list = _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.getInspectionENJson(user)];
                    case 7:
                        list = _a.sent();
                        _a.label = 8;
                    case 8:
                        index = 0;
                        _a.label = 9;
                    case 9:
                        if (!(index < list.length)) return [3 /*break*/, 20];
                        item = list[index];
                        itemStarted = null;
                        if (startedList != null && startedList.length > 0) {
                            itemStarted = startedList.find(function (x) {
                                return x.id === item.id;
                            });
                        }
                        if (!itemStarted) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.MergeStartedInspection(item, itemStarted)];
                    case 10:
                        item = _a.sent();
                        return [3 /*break*/, 18];
                    case 11:
                        if (!(user.enterprise == enums_1.EnumEnterprise.itest)) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.getListAsbestos(item)];
                    case 12:
                        item = _a.sent();
                        return [4 /*yield*/, this.getListMoisture(item)];
                    case 13:
                        item = _a.sent();
                        return [4 /*yield*/, this.getListLead(item)];
                    case 14:
                        item = _a.sent();
                        return [4 /*yield*/, this.getListDamage(item, item.environmentalForm.moldAreas.syncInfo.syncCode, enums_1.DamageAreaType.Mold, enums_1.BitrixListsITest.Mold)];
                    case 15:
                        item = _a.sent();
                        return [4 /*yield*/, this.getListDamage(item, item.environmentalForm.sootAreas.syncInfo.syncCode, enums_1.DamageAreaType.Soot, enums_1.BitrixListsITest.Soot)];
                    case 16:
                        item = _a.sent();
                        return [4 /*yield*/, this.getListDamage(item, item.environmentalForm.bacteriasAreas.syncInfo.syncCode, enums_1.DamageAreaType.Bacteria, enums_1.BitrixListsITest.Bacteria)];
                    case 17:
                        item = _a.sent();
                        _a.label = 18;
                    case 18:
                        list[index] = item;
                        _a.label = 19;
                    case 19:
                        index++;
                        return [3 /*break*/, 9];
                    case 20: return [4 /*yield*/, Promise.all(startedList.map(function (element) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (!list.find(function (x) { return x.id == element.id && x.enterprise == element.enterprise; })) {
                                    list.push(element);
                                }
                                return [2 /*return*/];
                            });
                        }); }))];
                    case 21:
                        _a.sent();
                        if (!(list && list.length > 0)) return [3 /*break*/, 23];
                        return [4 /*yield*/, this.inspectionStorage.clear()];
                    case 22:
                        _a.sent();
                        _a.label = 23;
                    case 23: return [2 /*return*/, this.inspectionStorage.addItems(list)];
                    case 24:
                        error_1 = _a.sent();
                        this.showError(error_1);
                        return [3 /*break*/, 25];
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.showError = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            var message, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(error.status && error.status == 401)) return [3 /*break*/, 2];
                        message = this.toast.create({
                            message: "Invalid Credential, please log out and update credentials.",
                            color: "danger",
                            duration: 5000
                        });
                        return [4 /*yield*/, message];
                    case 1:
                        (_a.sent()).present();
                        return [3 /*break*/, 4];
                    case 2:
                        message = this.toast.create({
                            message: error.message ? error.message : error.toString(),
                            color: "danger",
                            duration: 5000
                        });
                        return [4 /*yield*/, message];
                    case 3:
                        (_a.sent()).present();
                        console.log(error);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.MergeStartedInspection = function (item, itemStarted) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                item.iTestAgreements = itemStarted.iTestAgreements;
                item.expertNetworkAgreements = itemStarted.expertNetworkAgreements;
                if (itemStarted.internalStatus != enums_1.InspectionStatus.New) {
                    item.internalStatus = itemStarted.internalStatus;
                }
                item.bitrixFolder = itemStarted.bitrixFolder;
                item.comprehesiveForm = itemStarted.comprehesiveForm;
                if (item.inspectionType == enums_1.InspectionType.Environmental) {
                    itemStarted.environmentalForm.generalInfoInspection.propertyYear =
                        itemStarted.environmentalForm.generalInfoInspection.propertyYear
                            ? itemStarted.environmentalForm.generalInfoInspection.propertyYear
                            : item.environmentalForm.generalInfoInspection.propertyYear;
                    itemStarted.environmentalForm.generalInfoInspection.propertyType =
                        itemStarted.environmentalForm.generalInfoInspection.propertyType
                            ? itemStarted.environmentalForm.generalInfoInspection.propertyType
                            : item.environmentalForm.generalInfoInspection.propertyType;
                    itemStarted.environmentalForm.generalInfoInspection.environmentalInspection =
                        itemStarted.environmentalForm.generalInfoInspection
                            .environmentalInspection
                            ? itemStarted.environmentalForm.generalInfoInspection
                                .environmentalInspection
                            : item.environmentalForm.generalInfoInspection
                                .environmentalInspection;
                    itemStarted.environmentalForm.generalInfoInspection.interiorTemperature =
                        itemStarted.environmentalForm.generalInfoInspection.interiorTemperature
                            ? itemStarted.environmentalForm.generalInfoInspection
                                .interiorTemperature
                            : item.environmentalForm.generalInfoInspection.interiorTemperature;
                    itemStarted.environmentalForm.generalInfoInspection.exteriorRelativeHumidity =
                        itemStarted.environmentalForm.generalInfoInspection
                            .exteriorRelativeHumidity
                            ? itemStarted.environmentalForm.generalInfoInspection
                                .exteriorRelativeHumidity
                            : item.environmentalForm.generalInfoInspection
                                .exteriorRelativeHumidity;
                    itemStarted.environmentalForm.generalInfoInspection.HVACSystemCondition =
                        itemStarted.environmentalForm.generalInfoInspection.HVACSystemCondition
                            ? itemStarted.environmentalForm.generalInfoInspection
                                .HVACSystemCondition
                            : item.environmentalForm.generalInfoInspection.HVACSystemCondition;
                    itemStarted.environmentalForm.generalInfoInspection.ductsCondition =
                        itemStarted.environmentalForm.generalInfoInspection.ductsCondition
                            ? itemStarted.environmentalForm.generalInfoInspection.ductsCondition
                            : item.environmentalForm.generalInfoInspection.ductsCondition;
                    itemStarted.environmentalForm.generalInfoInspection.atticCondition =
                        itemStarted.environmentalForm.generalInfoInspection.atticCondition
                            ? itemStarted.environmentalForm.generalInfoInspection.atticCondition
                            : item.environmentalForm.generalInfoInspection.atticCondition;
                    itemStarted.environmentalForm.generalInfoInspection.affectedArea =
                        itemStarted.environmentalForm.generalInfoInspection.affectedArea
                            ? itemStarted.environmentalForm.generalInfoInspection.affectedArea
                            : item.environmentalForm.generalInfoInspection.affectedArea;
                    item.environmentalForm = itemStarted.environmentalForm;
                }
                else {
                    itemStarted.comprehesiveForm.generalInfoInspection.propertyYear =
                        itemStarted.comprehesiveForm.generalInfoInspection.propertyYear
                            ? itemStarted.comprehesiveForm.generalInfoInspection.propertyYear
                            : item.comprehesiveForm.generalInfoInspection.propertyYear;
                    itemStarted.comprehesiveForm.generalInfoInspection.propertyType =
                        itemStarted.comprehesiveForm.generalInfoInspection.propertyType
                            ? itemStarted.comprehesiveForm.generalInfoInspection.propertyType
                            : item.comprehesiveForm.generalInfoInspection.propertyType;
                    itemStarted.comprehesiveForm.generalInfoInspection.environmentalInspection =
                        false;
                    item.comprehesiveForm = itemStarted.comprehesiveForm;
                }
                return [2 /*return*/, item];
            });
        });
    };
    ItestDealService.prototype.refreshFieldsFromServer = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(user.enterprise == enums_1.EnumEnterprise.itest)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getEnvironmentalFromServerInspectionFields()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.getDealsFieldsFromServer()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getInspectors(true)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        this.showError(error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.getSyncStamp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get(SYNCSTAMPKEY)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ItestDealService.prototype.getBitrixContact = function (contactId) {
        return __awaiter(this, void 0, Promise, function () {
            var bitrixContact, contact, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bitrixContact = new contact_1.Contact();
                        if (!contactId) {
                            return [2 /*return*/, new contact_1.Contact()];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.bitrixITest.getContact(contactId)];
                    case 2:
                        contact = _a.sent();
                        contact = contact.result;
                        bitrixContact.firstName = contact.NAME;
                        bitrixContact.lastName = contact.LAST_NAME;
                        bitrixContact.idContact = contactId;
                        bitrixContact.phone =
                            Array.isArray(contact.PHONE) && contact.PHONE.length
                                ? contact.PHONE[0].VALUE
                                : null;
                        bitrixContact.email =
                            Array.isArray(contact.EMAIL) && contact.EMAIL.length
                                ? contact.EMAIL[0].VALUE
                                : null;
                        bitrixContact.syncInfo = new sync_info_1.SyncInfo();
                        bitrixContact.syncInfo.isSync = true;
                        bitrixContact.syncInfo.syncCode = contactId;
                        return [2 /*return*/, bitrixContact];
                    case 3:
                        error_3 = _a.sent();
                        this.showError(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, new contact_1.Contact()];
                }
            });
        });
    };
    ItestDealService.prototype.getBitrixCompany = function (companyId) {
        return __awaiter(this, void 0, Promise, function () {
            var bitrixCompany, company, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bitrixCompany = new company_1.Company();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.bitrixITest.getCompanyContact(companyId)];
                    case 2:
                        company = _a.sent();
                        company = company.result;
                        bitrixCompany.title = company.TITLE;
                        bitrixCompany.type = company.COMPANY_TYPE;
                        bitrixCompany.id = companyId;
                        bitrixCompany.phone =
                            Array.isArray(company.PHONE) && company.PHONE.length
                                ? company.PHONE[0].VALUE
                                : null;
                        bitrixCompany.email =
                            Array.isArray(company.EMAIL) && company.EMAIL.length
                                ? company.EMAIL[0].VALUE
                                : null;
                        bitrixCompany.syncInfo = new sync_info_1.SyncInfo();
                        bitrixCompany.syncInfo.isSync = true;
                        bitrixCompany.syncInfo.syncCode = companyId;
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        this.showError(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, bitrixCompany];
                }
            });
        });
    };
    ItestDealService.prototype.RejectedInspection = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.getDealsIdByStatus(user, enums_1.ReportStatusDeal.Rejected)];
                    case 1:
                        data = _a.sent();
                        if (data.result.length > 0) {
                            return [2 /*return*/, Promise.all(data.result.map(function (x) { return __awaiter(_this, void 0, void 0, function () {
                                    var item;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.inspectionStorage.get(x.ID, user.enterprise)];
                                            case 1:
                                                item = _a.sent();
                                                if (item &&
                                                    item.wasRejected &&
                                                    (item.internalStatus == enums_1.InspectionStatus.Saved ||
                                                        item.internalStatus == enums_1.InspectionStatus.LabsSent ||
                                                        item.internalStatus.indexOf("Pending") > 0)) {
                                                    return [2 /*return*/];
                                                }
                                                if (item) {
                                                    item.internalStatus = enums_1.InspectionStatus.Saved;
                                                    item.wasRejected = true;
                                                    return [2 /*return*/, this.inspectionStorage.update(item)];
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.ArchiveInspection = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixITest.getDealsIdByStatus(user, enums_1.ReportStatusDeal.Archived)];
                    case 1:
                        data = _a.sent();
                        if (data.result.length > 0) {
                            return [2 /*return*/, Promise.all(data.result.map(function (x) { return __awaiter(_this, void 0, void 0, function () {
                                    var item;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.inspectionStorage.get(x.ID, user.enterprise)];
                                            case 1:
                                                item = _a.sent();
                                                if (!(item && item.internalStatus.indexOf("Pending") <= 0)) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.inspectionStorage["delete"](item)];
                                            case 2: return [2 /*return*/, _a.sent()];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.isString = function (x) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Object.prototype.toString.call(x) === "[object String]"];
            });
        });
    };
    ItestDealService.prototype.getListDamage = function (task, id, type, list) {
        return __awaiter(this, void 0, Promise, function () {
            var data, damageAreas, damageInspectionList, sync, _loop_1, fields, damageItem, typeValue, index;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) {
                            return [2 /*return*/, task];
                        }
                        return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsById(id, list)];
                    case 1:
                        data = _a.sent();
                        if (!data || data.result.length <= 0) {
                            return [2 /*return*/, task];
                        }
                        data = data.result[0];
                        damageAreas = new damage_areas_1.DamageAreas(type);
                        damageInspectionList = [];
                        sync = new sync_info_1.SyncInfo();
                        sync.isSync = true;
                        sync.syncCode = id;
                        damageAreas.syncInfo = sync;
                        _loop_1 = function (index) {
                            fields = Object.entries(enums_1.bitrixMappingEnvironmental[type]);
                            damageItem = new damage_inspection_1.DamageInspection(type);
                            damageItem.samples.push(new sample_1.Sample(type));
                            damageItem.samples.push(new sample_1.Sample(type));
                            damageItem.samples.push(new sample_1.Sample(type));
                            typeValue = data[enums_1.bitrixMappingEnvironmental[type].inspectionHeader.inspectionType];
                            if (typeValue && Object.values(typeValue)) {
                                damageAreas.moldInspectionType = Object.values(typeValue)[0];
                            }
                            Promise.all(fields.map(function (y) {
                                if (y[0] == "inspectionHeader" || y[0].includes("Pictures")) {
                                    return;
                                }
                                if (y[0].includes("Sample1")) {
                                    var field = y[0].replace("CodeSample1", "");
                                    var value = data[y[1][index]];
                                    if (value &&
                                        typeof Object.values(value)[0] === "object" &&
                                        Object.values(value)[0] !== null &&
                                        Object.values(value)[0]["TEXT"]) {
                                        value = Object.values(value)[0]["TEXT"];
                                    }
                                    else if (value && _this.isString(Object.values(value)[1])) {
                                        value = Object.values(value)[0];
                                    }
                                    damageItem.samples[0][field] = value == 0 ? null : value;
                                    return;
                                }
                                if (y[0].includes("Sample2")) {
                                    var field = y[0].replace("CodeSample2", "");
                                    var value = data[y[1][index]];
                                    if (value &&
                                        typeof Object.values(value)[0] === "object" &&
                                        Object.values(value)[0] !== null &&
                                        Object.values(value)[0]["TEXT"]) {
                                        value = Object.values(value)[0]["TEXT"];
                                    }
                                    else if (value && _this.isString(Object.values(value)[1])) {
                                        value = Object.values(value)[0];
                                    }
                                    damageItem.samples[1][field] = value == 0 ? null : value;
                                    return;
                                }
                                if (y[0].includes("Sample3")) {
                                    var field = y[0].replace("CodeSample3", "");
                                    var value = data[y[1][index]];
                                    if (value &&
                                        typeof Object.values(value)[0] === "object" &&
                                        Object.values(value)[0] !== null &&
                                        Object.values(value)[0]["TEXT"]) {
                                        value = Object.values(value)[0]["TEXT"];
                                    }
                                    else if (value && _this.isString(Object.values(value)[1])) {
                                        value = Object.values(value)[0];
                                    }
                                    damageItem.samples[2][field] = value == 0 ? null : value;
                                    return;
                                }
                                var field = y[0].replace("Code", "");
                                var value = data[y[1][index]];
                                if (value &&
                                    typeof Object.values(value)[0] === "object" &&
                                    Object.values(value)[0] !== null &&
                                    Object.values(value)[0]["TEXT"]) {
                                    value = Object.values(value)[0]["TEXT"];
                                }
                                else if (value && _this.isString(Object.values(value)[1])) {
                                    value = Object.values(value)[0];
                                }
                                damageItem[field] = value == 0 ? null : value;
                            }));
                            damageAreas.areasInspection.push(damageItem);
                        };
                        for (index = 0; index < 10; index++) {
                            _loop_1(index);
                        }
                        if (type == enums_1.DamageAreaType.Mold) {
                            task.environmentalForm.moldAreas = damageAreas;
                        }
                        if (type == enums_1.DamageAreaType.Soot) {
                            task.environmentalForm.sootAreas = damageAreas;
                        }
                        if (type == enums_1.DamageAreaType.Bacteria) {
                            task.environmentalForm.bacteriasAreas = damageAreas;
                        }
                        return [2 /*return*/, task];
                }
            });
        });
    };
    ItestDealService.prototype.getListAsbestos = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var id, data, asbestosAreas, sync, typeValue, _loop_2, fields, asbestoAreaItem, index;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = task.environmentalForm.asbestosAreas.syncInfo.syncCode;
                        if (!id) {
                            return [2 /*return*/, task];
                        }
                        return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsById(id, enums_1.BitrixListsITest.Asbestos)];
                    case 1:
                        data = _a.sent();
                        if (!data || data.result.length <= 0) {
                            return [2 /*return*/, task];
                        }
                        data = data.result[0];
                        asbestosAreas = new asbesto_areas_1.AsbestoAreas();
                        sync = new sync_info_1.SyncInfo();
                        sync.isSync = true;
                        sync.syncCode = id;
                        asbestosAreas.syncInfo = sync;
                        typeValue = data[enums_1.bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionTypeCode];
                        if (typeValue && Object.values(typeValue)) {
                            asbestosAreas.inspectionType = Object.values(typeValue)[0];
                        }
                        typeValue =
                            data[enums_1.bitrixMappingEnvironmental.Asbestos.asbestosHeader.inspectionDateCode];
                        if (typeValue && Object.values(typeValue)) {
                            asbestosAreas.inspectionDate = new Date(Object.values(typeValue)[0]);
                        }
                        _loop_2 = function (index) {
                            fields = Object.entries(enums_1.bitrixMappingEnvironmental.Asbestos);
                            asbestoAreaItem = new asbesto_1.Asbesto();
                            Promise.all(fields.map(function (y) {
                                if (y[0] == "asbestosHeader" || y[0].includes("Pictures")) {
                                    return;
                                }
                                var field = y[0].replace("Code", "");
                                var value = data[y[1][index]];
                                if (value &&
                                    typeof Object.values(value)[0] === "object" &&
                                    Object.values(value)[0] !== null &&
                                    Object.values(value)[0]["TEXT"]) {
                                    value = Object.values(value)[0]["TEXT"];
                                }
                                else if (value && _this.isString(Object.values(value)[1])) {
                                    value = Object.values(value)[0];
                                }
                                asbestoAreaItem[field] = value == 0 ? null : value;
                            }));
                            asbestosAreas.asbestosAreas.push(asbestoAreaItem);
                        };
                        for (index = 0; index < 20; index++) {
                            _loop_2(index);
                        }
                        task.environmentalForm.asbestosAreas = asbestosAreas;
                        return [2 /*return*/, task];
                }
            });
        });
    };
    ItestDealService.prototype.getListMoisture = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var id, data, moistureAreas, sync, typeValue, _loop_3, fields, moistureAreaItem, index;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = task.environmentalForm.moistureMappingAreas.syncInfo.syncCode;
                        if (!id) {
                            return [2 /*return*/, task];
                        }
                        return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsById(id, enums_1.BitrixListsITest.Moisture)];
                    case 1:
                        data = _a.sent();
                        if (!data || data.result.length <= 0) {
                            return [2 /*return*/, task];
                        }
                        data = data.result[0];
                        moistureAreas = new moisture_mapping_areas_1.MoistureMappingAreas();
                        sync = new sync_info_1.SyncInfo();
                        sync.isSync = true;
                        sync.syncCode = id;
                        moistureAreas.syncInfo = sync;
                        typeValue = data[enums_1.bitrixMappingEnvironmental.Moisture.moistureHeader.inspectionTypeCode];
                        if (typeValue && Object.values(typeValue)) {
                            moistureAreas.inspectionType = Object.values(typeValue)[0];
                        }
                        typeValue =
                            data[enums_1.bitrixMappingEnvironmental.Moisture.moistureHeader.dateTesedCode];
                        if (typeValue && Object.values(typeValue)) {
                            moistureAreas.dateTesed = new Date(Object.values(typeValue)[0]);
                        }
                        _loop_3 = function (index) {
                            fields = Object.entries(enums_1.bitrixMappingEnvironmental.Moisture);
                            moistureAreaItem = new moisture_mapping_1.MoistureMapping();
                            Promise.all(fields.map(function (y) {
                                if (y[0] == "moistureHeader" || y[0].includes("Pictures")) {
                                    return;
                                }
                                var field = y[0].replace("Code", "");
                                var value = data[y[1][index]];
                                if (value &&
                                    typeof Object.values(value)[0] === "object" &&
                                    Object.values(value)[0] !== null &&
                                    Object.values(value)[0]["TEXT"]) {
                                    value = Object.values(value)[0]["TEXT"];
                                }
                                else if (value && _this.isString(Object.values(value)[1])) {
                                    value = Object.values(value)[0];
                                }
                                moistureAreaItem[field] = value == 0 ? null : value;
                            }));
                            moistureAreas.areamoistureMapping.push(moistureAreaItem);
                        };
                        for (index = 0; index < 20; index++) {
                            _loop_3(index);
                        }
                        task.environmentalForm.moistureMappingAreas = moistureAreas;
                        return [2 /*return*/, task];
                }
            });
        });
    };
    ItestDealService.prototype.getListLead = function (task) {
        return __awaiter(this, void 0, Promise, function () {
            var id, data, leadAreas, sync, typeValue, _loop_4, fields, leadAreaItem, index;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = task.environmentalForm.leadAreas.syncInfo.syncCode;
                        if (!id) {
                            return [2 /*return*/, task];
                        }
                        return [4 /*yield*/, this.bitrixITest.getEnvironmentalInspectionListsById(id, enums_1.BitrixListsITest.Leads)];
                    case 1:
                        data = _a.sent();
                        if (!data || data.result.length <= 0) {
                            return [2 /*return*/, task];
                        }
                        data = data.result[0];
                        leadAreas = new lead_areas_1.LeadAreas();
                        sync = new sync_info_1.SyncInfo();
                        sync.isSync = true;
                        sync.syncCode = id;
                        leadAreas.syncInfo = sync;
                        typeValue = data[enums_1.bitrixMappingEnvironmental.Lead.leadHeader.inspectionTypeCode];
                        if (typeValue && Object.values(typeValue)) {
                            leadAreas.inspectionType = Object.values(typeValue)[0];
                        }
                        typeValue =
                            data[enums_1.bitrixMappingEnvironmental.Lead.leadHeader.inspectionDateCode];
                        if (typeValue && Object.values(typeValue)) {
                            leadAreas.inspectionDate = new Date(Object.values(typeValue)[0]);
                        }
                        _loop_4 = function (index) {
                            fields = Object.entries(enums_1.bitrixMappingEnvironmental.Lead);
                            leadAreaItem = new lead_1.Lead();
                            Promise.all(fields.map(function (y) {
                                if (y[0] == "leadHeader" || y[0].includes("Pictures")) {
                                    return;
                                }
                                var field = y[0].replace("Code", "");
                                var value = data[y[1][index]];
                                if (value &&
                                    typeof Object.values(value)[0] === "object" &&
                                    Object.values(value)[0] !== null &&
                                    Object.values(value)[0]["TEXT"]) {
                                    value = Object.values(value)[0]["TEXT"];
                                }
                                else if (value && _this.isString(Object.values(value)[1])) {
                                    value = Object.values(value)[0];
                                }
                                leadAreaItem[field] = value == 0 ? null : value;
                            }));
                            leadAreas.leadAreas.push(leadAreaItem);
                        };
                        for (index = 0; index < 20; index++) {
                            _loop_4(index);
                        }
                        task.environmentalForm.leadAreas = leadAreas;
                        return [2 /*return*/, task];
                }
            });
        });
    };
    ItestDealService.prototype.getInspectionITestJson = function (user) {
        return __awaiter(this, void 0, Promise, function () {
            var subtypes, data, list, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getInspectionTasksTypesList()];
                    case 1:
                        subtypes = _a.sent();
                        return [4 /*yield*/, this.bitrixITest.getInspectionsDeals(user)];
                    case 2:
                        data = _a.sent();
                        if (!(data.result.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.all(data.result
                                .filter(function (z) {
                                return z[enums_1.BitrixCodeDeals.ReportStatus] != enums_1.ReportStatusDeal.Archived;
                            })
                                .map(function (x) { return __awaiter(_this, void 0, Promise, function () {
                                var taskContact, task, reportStatusBitrix, address;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getBitrixContact(x.CONTACT_ID)];
                                        case 1:
                                            taskContact = _a.sent();
                                            return [4 /*yield*/, this.initializeEnvironmentalTask(new inspection_task_1.InspectionTask())];
                                        case 2:
                                            task = _a.sent();
                                            reportStatusBitrix = x[enums_1.BitrixCodeDeals.ReportStatus];
                                            switch (+reportStatusBitrix) {
                                                case enums_1.ReportStatusDeal.Saved:
                                                    task.internalStatus = enums_1.InspectionStatus.Saved;
                                                    break;
                                                case enums_1.ReportStatusDeal.Labs:
                                                    task.internalStatus = enums_1.InspectionStatus.LabsSent;
                                                    break;
                                                case enums_1.ReportStatusDeal.Submitted:
                                                    task.internalStatus = enums_1.InspectionStatus.Completed;
                                                    break;
                                                case enums_1.ReportStatusDeal.Rejected:
                                                    task.internalStatus = enums_1.InspectionStatus.Saved;
                                                    task.wasRejected = true;
                                                    break;
                                                default:
                                                    task.internalStatus = enums_1.InspectionStatus.New;
                                                    break;
                                            }
                                            task.id = x.ID;
                                            task.contactId = x.CONTACT_ID;
                                            task.contactName =
                                                ((taskContact === null || taskContact === void 0 ? void 0 : taskContact.firstName) ? taskContact.firstName : "") +
                                                    " " +
                                                    ((taskContact === null || taskContact === void 0 ? void 0 : taskContact.lastName) ? taskContact.lastName : "");
                                            task.title = x.TITLE;
                                            task.scheduleDateTime = new Date(x[enums_1.ITestDealMapping.dealDateTime]);
                                            task.scheduleDay = new Date(task.scheduleDateTime.getFullYear(), task.scheduleDateTime.getMonth(), task.scheduleDateTime.getDate());
                                            if (x[enums_1.ITestDealMapping.agreementSignedYesNoCode] == 5204) {
                                                task.iTestAgreements.hasOpen = true;
                                                task.expertNetworkAgreements.hasOpen = true;
                                                task.iTestAgreements.isSigned = true;
                                                task.expertNetworkAgreements.isSigned = true;
                                            }
                                            task.serviceAddress = x[enums_1.ITestDealMapping.serviceAddress];
                                            task.environmentalForm.generalInfoInspection.environmentalInspection =
                                                true;
                                            task.environmentalForm.generalInfoInspection.propertyYear =
                                                x[enums_1.ITestDealMapping.propertyYearCode];
                                            task.environmentalForm.generalInfoInspection.propertyType =
                                                x[enums_1.ITestDealMapping.propertyTypeCode];
                                            task.environmentalForm.generalInfoInspection.interiorTemperature =
                                                x[enums_1.ITestDealMapping.interiorTemperatureCode];
                                            task.environmentalForm.generalInfoInspection.exteriorRelativeHumidity =
                                                x[enums_1.ITestDealMapping.exteriorRelativeHumidityCode];
                                            task.environmentalForm.generalInfoInspection.HVACSystemCondition =
                                                x[enums_1.ITestDealMapping.HVACSystemConditionCode];
                                            task.environmentalForm.generalInfoInspection.ductsCondition =
                                                x[enums_1.ITestDealMapping.ductsConditionCode];
                                            task.environmentalForm.generalInfoInspection.atticCondition =
                                                x[enums_1.ITestDealMapping.atticConditionCode];
                                            task.environmentalForm.generalInfoInspection.atticCondition =
                                                x[enums_1.ITestDealMapping.atticConditionCode];
                                            task.environmentalForm.generalInfoInspection.typeOfLossDesc =
                                                x[enums_1.ITestDealMapping.typesOfLoss];
                                            task.environmentalForm.generalInfoInspection.affectedArea =
                                                x[enums_1.ITestDealMapping.affectedArea];
                                            // task.waterDamageCategory =
                                            //   x[ITestDealMapping.waterDamageCategory];
                                            // task.waterDamageClass = x[ITestDealMapping.waterDamageClass];
                                            task.environmentalForm.moldAreas.syncInfo.syncCode =
                                                x[enums_1.ITestDealMapping.moldListIdCode];
                                            task.environmentalForm.bacteriasAreas.syncInfo.syncCode =
                                                x[enums_1.ITestDealMapping.bacteriaListIdCode];
                                            task.environmentalForm.sootAreas.syncInfo.syncCode =
                                                x[enums_1.ITestDealMapping.sootListIdCode];
                                            task.environmentalForm.moistureMappingAreas.syncInfo.syncCode =
                                                x[enums_1.ITestDealMapping.moistureListIdCode];
                                            task.environmentalForm.asbestosAreas.syncInfo.syncCode =
                                                x[enums_1.ITestDealMapping.asbestosListIdCode];
                                            task.environmentalForm.leadAreas.syncInfo.syncCode =
                                                x[enums_1.ITestDealMapping.leadListIdCode];
                                            address = task.serviceAddress.split("|");
                                            if (address.length > 1) {
                                                task.serviceAddress = address[0];
                                                task.geoPointText = address[1].replace(";", ",");
                                            }
                                            task.phone = taskContact.phone;
                                            task.email = taskContact.email;
                                            if (!(Array.isArray(x[enums_1.ITestDealMapping.insuranceCompany]) &&
                                                x[enums_1.ITestDealMapping.insuranceCompany].length > 0)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, Promise.all(x[enums_1.ITestDealMapping.insuranceCompany].map(function (element) { return __awaiter(_this, void 0, void 0, function () {
                                                    var insuranceContact, insuranceCompany;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                if (!element.includes("C_")) return [3 /*break*/, 2];
                                                                return [4 /*yield*/, this.getBitrixContact(element.split("C_")[1])];
                                                            case 1:
                                                                insuranceContact = _a.sent();
                                                                task.insuranceContact = insuranceContact;
                                                                _a.label = 2;
                                                            case 2:
                                                                if (!element.includes("CO_")) return [3 /*break*/, 4];
                                                                return [4 /*yield*/, this.getBitrixCompany(element.split("CO_")[1])];
                                                            case 3:
                                                                insuranceCompany = _a.sent();
                                                                if (insuranceCompany) {
                                                                    task.insuranceCompany = insuranceCompany;
                                                                }
                                                                _a.label = 4;
                                                            case 4: return [2 /*return*/];
                                                        }
                                                    });
                                                }); }))];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4:
                                            if (!(Array.isArray(x[enums_1.ITestDealMapping.referenceContact]) &&
                                                x[enums_1.ITestDealMapping.referenceContact].length > 0)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, Promise.all(x[enums_1.ITestDealMapping.referenceContact].map(function (element) { return __awaiter(_this, void 0, void 0, function () {
                                                    var contactReference, companyReference;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                if (!element.includes("C_")) return [3 /*break*/, 2];
                                                                return [4 /*yield*/, this.getBitrixContact(element.split("C_")[1])];
                                                            case 1:
                                                                contactReference = _a.sent();
                                                                task.referalPartnerContact = contactReference;
                                                                _a.label = 2;
                                                            case 2:
                                                                if (!element.includes("CO_")) return [3 /*break*/, 4];
                                                                return [4 /*yield*/, this.getBitrixCompany(element.split("CO_")[1])];
                                                            case 3:
                                                                companyReference = _a.sent();
                                                                if (companyReference) {
                                                                    task.referalPartnerCompany = companyReference;
                                                                }
                                                                _a.label = 4;
                                                            case 4: return [2 /*return*/];
                                                        }
                                                    });
                                                }); }))];
                                        case 5:
                                            _a.sent();
                                            _a.label = 6;
                                        case 6:
                                            task.inspectorUserId = x[enums_1.ITestDealMapping.inspector];
                                            task.inspectionType = enums_1.InspectionType.Environmental;
                                            task.enterprise = enums_1.EnumEnterprise.itest;
                                            task.inspectionSubTypes = x[enums_1.ITestDealMapping.inspectionTypes].map(function (m) {
                                                if (m != 120) {
                                                    return subtypes.find(function (y) { return y.id == m; });
                                                }
                                            });
                                            if (task.inspectionSubTypes.length == 1 &&
                                                !task.inspectionSubTypes[0]) {
                                                task.inspectionSubTypes = [];
                                            }
                                            task.inspectionSubTypesString = task.inspectionSubTypes
                                                .map(function (type) {
                                                return type === null || type === void 0 ? void 0 : type.name;
                                                x;
                                            })
                                                .join(",");
                                            task.inspectionsInstructions = x[enums_1.ITestDealMapping.instructions];
                                            task.policyNumber = x[enums_1.ITestDealMapping.policyNumberCode];
                                            task.claimNumber = x[enums_1.ITestDealMapping.claimNumberCode];
                                            task.dateOfLoss = x[enums_1.ITestDealMapping.dateOfLossCode];
                                            //  task.internalStatus = InspectionStatus.New;
                                            return [2 /*return*/, Promise.resolve(task)];
                                    }
                                });
                            }); }))];
                    case 3:
                        list = _a.sent();
                        return [2 /*return*/, list];
                    case 4: return [2 /*return*/, []];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_5 = _a.sent();
                        this.showError(error_5);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService.prototype.getInspectionENJson = function (user) {
        return __awaiter(this, void 0, Promise, function () {
            var data, list, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.bitrixITest.getInspectionsDeals(user)];
                    case 1:
                        data = _a.sent();
                        if (!(data.result.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(data.result.map(function (x) { return __awaiter(_this, void 0, Promise, function () {
                                var taskContact, task, address;
                                var _this = this;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this.getBitrixContact(x.CONTACT_ID)];
                                        case 1:
                                            taskContact = _b.sent();
                                            return [4 /*yield*/, this.initializeENTask(new inspection_task_1.InspectionTask())];
                                        case 2:
                                            task = _b.sent();
                                            task.id = x.ID;
                                            task.contactId = x.CONTACT_ID;
                                            task.contactName =
                                                taskContact.firstName + " " + taskContact.lastName;
                                            task.title = x.TITLE;
                                            task.scheduleDateTime = new Date(x[enums_1.ENDealMapping.dealDateTime]);
                                            task.scheduleDay = new Date(task.scheduleDateTime.getFullYear(), task.scheduleDateTime.getMonth(), task.scheduleDateTime.getDate());
                                            task.serviceAddress = x[enums_1.ENDealMapping.serviceAddress];
                                            task.comprehesiveForm.generalInfoInspection.propertyYear =
                                                x[enums_1.ENDealMapping.propertyYearCode];
                                            task.comprehesiveForm.generalInfoInspection.propertyType =
                                                x[enums_1.ENDealMapping.propertyTypeCode];
                                            task.comprehesiveForm.generalInfoInspection.environmentalInspection =
                                                false;
                                            address = (_a = task.serviceAddress) === null || _a === void 0 ? void 0 : _a.split("|");
                                            if ((address === null || address === void 0 ? void 0 : address.length) > 1) {
                                                task.serviceAddress = address[0];
                                                task.geoPointText = address[1].replace(";", ",");
                                            }
                                            task.phone = taskContact.phone;
                                            task.email = taskContact.email;
                                            if (!(Array.isArray(x[enums_1.ENDealMapping.insuranceCompany]) &&
                                                x[enums_1.ENDealMapping.insuranceCompany].length > 0)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, Promise.all(x[enums_1.ENDealMapping.insuranceCompany].map(function (element) { return __awaiter(_this, void 0, void 0, function () {
                                                    var insuranceContact, insuranceCompany;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                if (!element.includes("C_")) return [3 /*break*/, 2];
                                                                return [4 /*yield*/, this.getBitrixContact(element.split("C_")[1])];
                                                            case 1:
                                                                insuranceContact = _a.sent();
                                                                task.insuranceContact = insuranceContact;
                                                                _a.label = 2;
                                                            case 2:
                                                                if (!element.includes("CO_")) return [3 /*break*/, 4];
                                                                return [4 /*yield*/, this.getBitrixCompany(element.split("CO_")[1])];
                                                            case 3:
                                                                insuranceCompany = _a.sent();
                                                                if (insuranceCompany) {
                                                                    task.insuranceCompany = insuranceCompany;
                                                                }
                                                                _a.label = 4;
                                                            case 4: return [2 /*return*/];
                                                        }
                                                    });
                                                }); }))];
                                        case 3:
                                            _b.sent();
                                            _b.label = 4;
                                        case 4:
                                            if (!(Array.isArray(x[enums_1.ENDealMapping.referenceContact]) &&
                                                x[enums_1.ENDealMapping.referenceContact].length > 0)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, Promise.all(x[enums_1.ENDealMapping.referenceContact].map(function (element) { return __awaiter(_this, void 0, void 0, function () {
                                                    var contactReference, companyReference;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                if (!element.includes("C_")) return [3 /*break*/, 2];
                                                                return [4 /*yield*/, this.getBitrixContact(element.split("C_")[1])];
                                                            case 1:
                                                                contactReference = _a.sent();
                                                                task.referalPartnerContact = contactReference;
                                                                _a.label = 2;
                                                            case 2:
                                                                if (!element.includes("CO_")) return [3 /*break*/, 4];
                                                                return [4 /*yield*/, this.getBitrixCompany(element.split("CO_")[1])];
                                                            case 3:
                                                                companyReference = _a.sent();
                                                                if (companyReference) {
                                                                    task.referalPartnerCompany = companyReference;
                                                                }
                                                                _a.label = 4;
                                                            case 4: return [2 /*return*/];
                                                        }
                                                    });
                                                }); }))];
                                        case 5:
                                            _b.sent();
                                            _b.label = 6;
                                        case 6:
                                            task.inspectorUserId = x[enums_1.ENDealMapping.inspector];
                                            task.inspectionType = enums_1.InspectionType.Comprehensive;
                                            task.enterprise = enums_1.EnumEnterprise.expertNetworks;
                                            // task.inspectionSubTypes = x[ENDealMapping.inspectionTypes].map(
                                            //   (m) => {
                                            //     if (m != 120) {
                                            //       return subtypes.find((y) => y.id == m);
                                            //     }
                                            //   }
                                            // );
                                            // if (
                                            //   task.inspectionSubTypes.length == 1 &&
                                            //   !task.inspectionSubTypes[0]
                                            // ) {
                                            //   task.inspectionSubTypes = [];
                                            // }
                                            task.inspectionSubTypes = [];
                                            task.inspectionSubTypesString = task.inspectionSubTypes
                                                .map(function (type) {
                                                return type === null || type === void 0 ? void 0 : type.name;
                                                x;
                                            })
                                                .join(",");
                                            task.inspectionsInstructions = x[enums_1.ENDealMapping.instructions];
                                            task.internalStatus = enums_1.InspectionStatus.New;
                                            return [2 /*return*/, Promise.resolve(task)];
                                    }
                                });
                            }); }))];
                    case 2:
                        list = _a.sent();
                        return [2 /*return*/, list];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_6 = _a.sent();
                        this.showError(error_6);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ItestDealService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], ItestDealService);
    return ItestDealService;
}());
exports.ItestDealService = ItestDealService;
function entries(obj) {
    return Object.entries(obj);
}
exports.entries = entries;

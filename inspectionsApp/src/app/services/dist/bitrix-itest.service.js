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
exports.BitrixItestService = void 0;
var core_1 = require("@angular/core");
var enums_1 = require("../models/enums");
var BitrixItestService = /** @class */ (function () {
    function BitrixItestService(http, authService, bitrixTokenService) {
        var _this = this;
        this.http = http;
        this.bitrixTokenService = bitrixTokenService;
        this.url = ""; //url = "https://itest.bitrix24.com/rest/6";
        this.key = ""; //key = "rf1a6ygkrbdsho5t";
        bitrixTokenService.getBitrixSetup().then(function (y) {
            authService.getUser().then(function (x) {
                if (!x) {
                    return;
                }
                if (x.enterprise === enums_1.EnumEnterprise.itest) {
                    _this.url = y.itestURL;
                    _this.key = y.itestToken;
                }
                else {
                    _this.url = y.expertNetworksURL;
                    _this.key = y.expertNetworksToken;
                }
            });
        });
    }
    BitrixItestService.prototype.setUrlandKey = function (enterprise) {
        return __awaiter(this, void 0, void 0, function () {
            var y;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixTokenService.getBitrixSetup()];
                    case 1:
                        y = _a.sent();
                        if (enterprise === enums_1.EnumEnterprise.itest) {
                            this.url = y.itestURL;
                            this.key = y.itestToken;
                        }
                        else {
                            this.url = y.expertNetworksURL;
                            this.key = y.expertNetworksToken;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BitrixItestService.prototype.getUserByEmail = function (url, key, email) {
        return this.http
            .get(url + "/" + key + "/user.get.json?email=" + email)
            .toPromise();
    };
    BitrixItestService.prototype.getInspectionTypesITest = function (list) {
        return this.http
            .get(this.url + "/" + this.key + "/lists.element.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=" + list)
            .toPromise();
    };
    BitrixItestService.prototype.testSetup = function (url, key) {
        return __awaiter(this, void 0, Promise, function () {
            var x, res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.http.get(url + "/" + key + "/crm.deal.fields.json")];
                    case 1:
                        x = _b.sent();
                        return [4 /*yield*/, x.toPromise()];
                    case 2:
                        res = _b.sent();
                        if (res && res.result && res.result.ID) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/lists.field.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=48
    BitrixItestService.prototype.getEnvironmentalInspectionListsFields = function (list) {
        return this.http
            .get(this.url + "/" + this.key + "/lists.field.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=" + list)
            .toPromise();
    };
    BitrixItestService.prototype.getEnvironmentalInspectionListsById = function (id, list) {
        return this.http
            .get(this.url + "/" + this.key + "/lists.element.get.json?IBLOCK_TYPE_ID=lists&IBLOCK_ID=" + list + "&FILTER[ID]=" + id)
            .toPromise();
    };
    //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/user.search.json?USER_TYPE=employee
    BitrixItestService.prototype.getInspectors = function () {
        return this.http
            .get(this.url + "/" + this.key + "/user.search.json?USER_TYPE=employee")
            .toPromise();
    };
    //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.deal.fields.json
    BitrixItestService.prototype.getDealFields = function () {
        return this.http
            .get(this.url + "/" + this.key + "/crm.deal.fields.json")
            .toPromise();
    };
    BitrixItestService.prototype.getContact = function (id) {
        //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
        return this.http
            .get(this.url + "/" + this.key + "/crm.contact.get.json?ID=" + id)
            .toPromise();
    };
    BitrixItestService.prototype.getAllContacts = function () {
        //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
        return this.http
            .get(this.url + "/" + this.key + "/crm.contact.list.json")
            .toPromise();
    };
    BitrixItestService.prototype.getCompanyContact = function (id) {
        //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
        return this.http
            .get(this.url + "/" + this.key + "/crm.company.get.json?ID=" + id)
            .toPromise();
    };
    BitrixItestService.prototype.getAllCompanyContact = function () {
        //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
        return this.http
            .get(this.url + "/" + this.key + "/crm.company.list.json")
            .toPromise();
    };
    //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.list.json?SELECT[]=EMAIL&SELECT[]=NAME&SELECT[]=LAST_NAME&SELECT[]=PHONE&FILTER[EMAIL]=pabs.aguilar2806
    BitrixItestService.prototype.getContactByPhone = function (phone) {
        //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
        return this.http
            .get(this.url + "/" + this.key + "/crm.contact.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[PHONE]=" + phone)
            .toPromise();
    };
    BitrixItestService.prototype.getContactByEmail = function (email) {
        //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
        return this.http
            .get(this.url + "/" + this.key + "/crm.contact.list.json?SELECT[]=EMAIL&SELECT[]=NAME&SELECT[]=LAST_NAME&SELECT[]=PHONE&FILTER[EMAIL]=" + email)
            .toPromise();
    };
    BitrixItestService.prototype.getContactByEmailByEnterprise = function (email, enterprise) {
        return __awaiter(this, void 0, Promise, function () {
            var y, tempUrl, tempKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixTokenService.getBitrixSetup()];
                    case 1:
                        y = _a.sent();
                        tempUrl = this.url;
                        tempKey = this.key;
                        if (enterprise === enums_1.EnumEnterprise.itest) {
                            tempUrl = y.itestURL;
                            tempKey = y.itestToken;
                        }
                        else {
                            tempUrl = y.expertNetworksURL;
                            tempKey = y.expertNetworksToken;
                        }
                        return [2 /*return*/, this.http
                                .get(tempUrl + "/" + tempKey + "/crm.contact.list.json?SELECT[]=EMAIL&SELECT[]=NAME&SELECT[]=LAST_NAME&SELECT[]=PHONE&FILTER[EMAIL]=" + email)
                                .toPromise()];
                }
            });
        });
    };
    BitrixItestService.prototype.getCompaniesByName = function (name) {
        //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.company.list.json?SELECT[]=*&FILTER[%TITLE]=Test
        https: return this.http
            .get(this.url + "/" + this.key + "/crm.company.list.json?SELECT[]=TITLE&SELECT[]=EMAIL&SELECT[]=PHONE&SELECT[]=COMPANY_TYPE&FILTER[%TITLE]=" + name)
            .toPromise();
    };
    BitrixItestService.prototype.getCompaniesByNameAndEnterprise = function (name, enterprise) {
        return __awaiter(this, void 0, Promise, function () {
            var y, tempUrl, tempKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixTokenService.getBitrixSetup()];
                    case 1:
                        y = _a.sent();
                        tempUrl = this.url;
                        tempKey = this.key;
                        if (enterprise === enums_1.EnumEnterprise.itest) {
                            tempUrl = y.itestURL;
                            tempKey = y.itestToken;
                        }
                        else {
                            tempUrl = y.expertNetworksURL;
                            tempKey = y.expertNetworksToken;
                        }
                        https: return [2 /*return*/, this.http
                                .get(tempUrl + "/" + tempKey + "/crm.company.list.json?SELECT[]=TITLE&SELECT[]=EMAIL&SELECT[]=PHONE&SELECT[]=COMPANY_TYPE&FILTER[%TITLE]=" + name)
                                .toPromise()];
                        return [2 /*return*/];
                }
            });
        });
    };
    //https://itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE&FILTER[UF_CRM_1612682994]=6
    BitrixItestService.prototype.getInspectionsDeals = function (user) {
        return __awaiter(this, void 0, Promise, function () {
            var inspectorField, newDeals, inProgress;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        inspectorField = user.enterprise == enums_1.EnumEnterprise.itest
                            ? enums_1.ITestDealMapping.inspector
                            : enums_1.ENDealMapping.inspector;
                        if (!(user.enterprise == enums_1.EnumEnterprise.itest)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.http
                                .get(this.url + "/" + this.key + "/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=PREPAYMENT_INVOICE&FILTER[" + inspectorField + "]=" + user.userId)
                                .toPromise()];
                    case 1:
                        newDeals = _b.sent();
                        if (!newDeals) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.http
                                .get(this.url + "/" + this.key + "/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=EXECUTING&FILTER[" + inspectorField + "]=" + user.userId)
                                .toPromise()];
                    case 2:
                        inProgress = _b.sent();
                        (_a = newDeals.result).push.apply(_a, inProgress.result);
                        return [2 /*return*/, newDeals];
                    case 3: return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, this.http
                            .get(this.url + "/" + this.key + "/crm.deal.list.json?SELECT[]=UF_*&SELECT[]=*&FILTER[STAGE_ID]=C15:FINAL_INVOICE&FILTER[" + inspectorField + "]=" + user.userId)
                            .toPromise()];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BitrixItestService.prototype.getDealsIdByStatus = function (user, dealStatus) {
        //itest.bitrix24.com/rest/6/rf1a6ygkrbdsho5t/crm.contact.get.json?ID=6
        var inspectorField = user.enterprise == enums_1.EnumEnterprise.itest
            ? enums_1.ITestDealMapping.inspector
            : enums_1.ENDealMapping.inspector;
        if (user.enterprise == enums_1.EnumEnterprise.itest) {
            return this.http
                .get(this.url + "/" + this.key + "/crm.deal.list.json?SELECT[]=ID&FILTER[UF_CRM_1613380179]=" + dealStatus + "&FILTER[" + inspectorField + "]=" + user.userId)
                .toPromise();
        }
        else {
            return Promise.resolve([]);
        }
    };
    BitrixItestService.prototype.syncDamageAreaInspection = function (postData, list) {
        var random = Math.floor(Math.random() * 100) + 2;
        if (postData.ELEMENT_ID) {
            return this.http.post(
            //`${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=48`,
            this.url + "/" + this.key + "/lists.element.update?random=" + random, postData, {
                headers: { "Content-Type": "application/json" }
            });
        }
        else {
            return this.http.post(
            //`${this.url}/${this.key}/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=48`,
            this.url + "/" + this.key + "/lists.element.add?IBLOCK_TYPE_ID=lists&IBLOCK_ID=" + list + "&random=" + random, postData, {
                headers: { "Content-Type": "application/json" }
            });
        }
    };
    BitrixItestService.prototype.createSubfolder = function (postData) {
        return this.http.post(this.url + "/" + this.key + "/disk.folder.addsubfolder", postData, {
            headers: { "Content-Type": "application/json" }
        });
    };
    BitrixItestService.prototype.updateDeal = function (postData) {
        return this.http.post(this.url + "/" + this.key + "/crm.deal.update", postData, {
            headers: { "Content-Type": "application/json" }
        });
    };
    BitrixItestService.prototype.createDeal = function (postData, enterprise) {
        return __awaiter(this, void 0, Promise, function () {
            var y, tempUrl, tempKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixTokenService.getBitrixSetup()];
                    case 1:
                        y = _a.sent();
                        tempUrl = this.url;
                        tempKey = this.key;
                        if (enterprise === enums_1.EnumEnterprise.itest) {
                            tempUrl = y.itestURL;
                            tempKey = y.itestToken;
                        }
                        else {
                            tempUrl = y.expertNetworksURL;
                            tempKey = y.expertNetworksToken;
                        }
                        return [2 /*return*/, this.http
                                .post(tempUrl + "/" + tempKey + "/crm.deal.add", postData, {
                                headers: { "Content-Type": "application/json" }
                            })
                                .toPromise()];
                }
            });
        });
    };
    BitrixItestService.prototype.createContact = function (postData, enterprise) {
        return __awaiter(this, void 0, Promise, function () {
            var y, tempUrl, tempKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixTokenService.getBitrixSetup()];
                    case 1:
                        y = _a.sent();
                        tempUrl = this.url;
                        tempKey = this.key;
                        if (enterprise === enums_1.EnumEnterprise.itest) {
                            tempUrl = y.itestURL;
                            tempKey = y.itestToken;
                        }
                        else {
                            tempUrl = y.expertNetworksURL;
                            tempKey = y.expertNetworksToken;
                        }
                        return [2 /*return*/, this.http
                                .post(tempUrl + "/" + tempKey + "/crm.contact.add", postData, {
                                headers: { "Content-Type": "application/json" }
                            })
                                .toPromise()];
                }
            });
        });
    };
    BitrixItestService.prototype.createCompany = function (postData, enterprise) {
        return __awaiter(this, void 0, Promise, function () {
            var y, tempUrl, tempKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bitrixTokenService.getBitrixSetup()];
                    case 1:
                        y = _a.sent();
                        tempUrl = this.url;
                        tempKey = this.key;
                        if (enterprise === enums_1.EnumEnterprise.itest) {
                            tempUrl = y.itestURL;
                            tempKey = y.itestToken;
                        }
                        else {
                            tempUrl = y.expertNetworksURL;
                            tempKey = y.expertNetworksToken;
                        }
                        return [2 /*return*/, this.http
                                .post(tempUrl + "/" + tempKey + "/crm.company.add", postData, {
                                headers: { "Content-Type": "application/json" }
                            })
                                .toPromise()];
                }
            });
        });
    };
    BitrixItestService.prototype.addFile = function (postData) {
        return this.http
            .post(this.url + "/" + this.key + "/disk.folder.uploadfile", postData, {
            headers: { "Content-Type": "application/json" }
        })
            .toPromise();
    };
    BitrixItestService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], BitrixItestService);
    return BitrixItestService;
}());
exports.BitrixItestService = BitrixItestService;

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
exports.CompanySearchPage = void 0;
var core_1 = require("@angular/core");
var company_1 = require("src/app/models/company");
var CompanySearchPage = /** @class */ (function () {
    function CompanySearchPage(itestService, modalController, toast) {
        this.itestService = itestService;
        this.modalController = modalController;
        this.toast = toast;
        this.enterprise = "";
        this.target = "";
        this.nameSearchText = "";
        this.searching = false;
        this.newCompany = new company_1.Company();
        this.companiesListFound = [];
        this.segmentOption = "search";
    }
    CompanySearchPage.prototype.ngOnInit = function () { };
    CompanySearchPage.prototype.onSearch = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.nameSearchText.length > 1)) return [3 /*break*/, 4];
                        event.target.blur();
                        this.searching = true;
                        _a = this;
                        return [4 /*yield*/, this.itestService.getCompaniesByName(this.nameSearchText, this.enterprise)];
                    case 1:
                        _a.companiesListFound = _b.sent();
                        if (!(!this.companiesListFound || this.companiesListFound.length <= 0)) return [3 /*break*/, 3];
                        message = this.toast.create({
                            message: "No contacts found containing \"" + this.nameSearchText + "\".",
                            color: "warning",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 2:
                        (_b.sent()).present();
                        _b.label = 3;
                    case 3:
                        this.searching = false;
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CompanySearchPage.prototype.back = function () {
        this.confirmCompany();
    };
    CompanySearchPage.prototype.selectCompany = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.companiesListFound.forEach(function (element) {
                    if (element.id == id) {
                        element.selected = true;
                        _this.selectedCompany = element;
                    }
                    else {
                        element.selected = false;
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    CompanySearchPage.prototype.isCompanySelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.selectedCompany.title];
            });
        });
    };
    CompanySearchPage.prototype.confirmCompany = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.modalController.dismiss(this.selectedCompany);
                        if (!this.selectedCompany) return [3 /*break*/, 2];
                        message = this.toast.create({
                            message: "Company Selected.",
                            color: "success",
                            duration: 1000
                        });
                        return [4 /*yield*/, message];
                    case 1:
                        (_a.sent()).present();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CompanySearchPage.prototype.clearSelectedCompany = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.selectedCompany = null;
                this.companiesListFound.forEach(function (item) { return (item.selected = false); });
                return [2 /*return*/];
            });
        });
    };
    CompanySearchPage.prototype.saveNewCompany = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.selectedCompany = this.newCompany;
                this.confirmCompany();
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        core_1.Input()
    ], CompanySearchPage.prototype, "enterprise");
    __decorate([
        core_1.Input()
    ], CompanySearchPage.prototype, "target");
    CompanySearchPage = __decorate([
        core_1.Component({
            selector: "app-company-search",
            templateUrl: "./company-search.page.html",
            styleUrls: ["./company-search.page.scss"]
        })
    ], CompanySearchPage);
    return CompanySearchPage;
}());
exports.CompanySearchPage = CompanySearchPage;

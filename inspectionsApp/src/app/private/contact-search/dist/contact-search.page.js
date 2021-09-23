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
exports.ContactSearchPage = void 0;
var core_1 = require("@angular/core");
var contact_1 = require("src/app/models/contact");
var ContactSearchPage = /** @class */ (function () {
    function ContactSearchPage(itestService, modalController, toast) {
        this.itestService = itestService;
        this.modalController = modalController;
        this.toast = toast;
        this.enterprise = "";
        this.target = "";
        this.emailSearchText = "";
        this.searching = false;
        this.newContact = new contact_1.Contact();
        this.contactsListFound = [];
        this.segmentOption = "search";
    }
    // validations_form = this.formBuilder.group({
    //   firstName: new FormControl("", Validators.compose([Validators.required])),
    // });
    ContactSearchPage.prototype.ngOnInit = function () { };
    ContactSearchPage.prototype.onSearch = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.emailSearchText.length > 1)) return [3 /*break*/, 4];
                        event.target.blur();
                        this.searching = true;
                        _a = this;
                        return [4 /*yield*/, this.itestService.getContactsByEmail(this.emailSearchText, this.enterprise)];
                    case 1:
                        _a.contactsListFound = _b.sent();
                        if (!(!this.contactsListFound || this.contactsListFound.length <= 0)) return [3 /*break*/, 3];
                        message = this.toast.create({
                            message: "No contacts found containing \"" + this.emailSearchText + "\".",
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
    ContactSearchPage.prototype.back = function () {
        this.confirmContact();
    };
    ContactSearchPage.prototype.selectContact = function (contactId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.contactsListFound.forEach(function (element) {
                    if (element.idContact == contactId) {
                        element.selected = true;
                        _this.selectedContact = element;
                    }
                    else {
                        element.selected = false;
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    ContactSearchPage.prototype.isContactSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.selectedContact.idContact];
            });
        });
    };
    ContactSearchPage.prototype.confirmContact = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.modalController.dismiss(this.selectedContact);
                        if (!this.selectedContact) return [3 /*break*/, 2];
                        message = this.toast.create({
                            message: "Contact Selected.",
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
    ContactSearchPage.prototype.clearSelectedContact = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.selectedContact = null;
                this.contactsListFound.forEach(function (item) { return (item.selected = false); });
                return [2 /*return*/];
            });
        });
    };
    ContactSearchPage.prototype.saveNewContact = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.selectedContact = this.newContact;
                this.confirmContact();
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        core_1.Input()
    ], ContactSearchPage.prototype, "enterprise");
    __decorate([
        core_1.Input()
    ], ContactSearchPage.prototype, "target");
    ContactSearchPage = __decorate([
        core_1.Component({
            selector: "app-contact-search",
            templateUrl: "./contact-search.page.html",
            styleUrls: ["./contact-search.page.scss"]
        })
    ], ContactSearchPage);
    return ContactSearchPage;
}());
exports.ContactSearchPage = ContactSearchPage;

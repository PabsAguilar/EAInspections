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
exports.SetupBitrixTokenPage = void 0;
var core_1 = require("@angular/core");
var bitrix_setup_1 = require("src/app/models/bitrix-setup");
var SetupBitrixTokenPage = /** @class */ (function () {
    function SetupBitrixTokenPage(bitrixTokenService, alertController, bitrixService, toast, auth) {
        this.bitrixTokenService = bitrixTokenService;
        this.alertController = alertController;
        this.bitrixService = bitrixService;
        this.toast = toast;
        this.auth = auth;
        this.bitrixSetup = new bitrix_setup_1.BitrixSetup();
    }
    SetupBitrixTokenPage.prototype.ngOnInit = function () { };
    SetupBitrixTokenPage.prototype.ionViewDidEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.bitrixTokenService.getBitrixSetup()];
                    case 1:
                        _a.bitrixSetup = _b.sent();
                        this.bitrixSetup.itestToken = "";
                        this.bitrixSetup.expertNetworksToken = "";
                        return [2 /*return*/];
                }
            });
        });
    };
    SetupBitrixTokenPage.prototype.userWantsToUpdateSetup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert, error_1, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 6]);
                        return [4 /*yield*/, this.bitrixTokenService.setBitrixSetup(this.bitrixSetup)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alertController.create({
                                header: "Confirmation",
                                message: "Settings has been updated, please login to complete the setup.",
                                buttons: [
                                    {
                                        text: "Ok",
                                        handler: function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                console.log("saved");
                                                this.auth.logout();
                                                return [2 /*return*/];
                                            });
                                        }); }
                                    },
                                ]
                            })];
                    case 2:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        message = this.toast.create({
                            message: error_1,
                            color: "danger",
                            duration: 2000
                        });
                        return [4 /*yield*/, message];
                    case 5:
                        (_a.sent()).present();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // async userCanSaveSetup(): Promise<boolean> {
    //   return
    // }
    SetupBitrixTokenPage.prototype.change = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.testingSucessfullEN = null;
                this.testingSucessfullITest = null;
                return [2 /*return*/];
            });
        });
    };
    SetupBitrixTokenPage.prototype.userWantsToTestENSetup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("test");
                        _a = this;
                        return [4 /*yield*/, this.bitrixService.testSetup(this.bitrixSetup.expertNetworksURL, this.bitrixSetup.expertNetworksToken)];
                    case 1:
                        _a.testingSucessfullEN = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.bitrixService.testSetup(this.bitrixSetup.itestURL, this.bitrixSetup.itestToken)];
                    case 2:
                        _b.testingSucessfullITest = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SetupBitrixTokenPage = __decorate([
        core_1.Component({
            selector: "app-setup-bitrix-token",
            templateUrl: "./setup-bitrix-token.page.html",
            styleUrls: ["./setup-bitrix-token.page.scss"]
        })
    ], SetupBitrixTokenPage);
    return SetupBitrixTokenPage;
}());
exports.SetupBitrixTokenPage = SetupBitrixTokenPage;

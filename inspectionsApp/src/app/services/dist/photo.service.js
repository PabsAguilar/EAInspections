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
exports.PhotoService = void 0;
var core_1 = require("@angular/core");
var core_2 = require("@capacitor/core");
var bitrix_picture_1 = require("../models/bitrix-picture");
var Camera = core_2.Plugins.Camera, Filesystem = core_2.Plugins.Filesystem, Storage = core_2.Plugins.Storage;
var PhotoService = /** @class */ (function () {
    function PhotoService(platform) {
        this.convertBlobToBase64 = function (blob) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onerror = reject;
                reader.onload = function () {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });
        };
        this.platform = platform;
    }
    PhotoService.prototype.takePhoto = function () {
        return __awaiter(this, void 0, Promise, function () {
            var capturedPhoto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Camera.getPhoto({
                            resultType: core_2.CameraResultType.DataUrl,
                            source: core_2.CameraSource.Camera,
                            quality: 40,
                            width: 1920
                        })];
                    case 1:
                        capturedPhoto = _a.sent();
                        result = capturedPhoto.dataUrl;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PhotoService.prototype.takePhotoB = function () {
        return __awaiter(this, void 0, Promise, function () {
            var capturedPhoto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Camera.getPhoto({
                            resultType: core_2.CameraResultType.DataUrl,
                            source: core_2.CameraSource.Camera,
                            quality: 40,
                            width: 1920
                        })];
                    case 1:
                        capturedPhoto = _a.sent();
                        result = new bitrix_picture_1.BitrixPicture();
                        result.base64Image = capturedPhoto.dataUrl;
                        result.format = capturedPhoto.format;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // Read camera photo into base64 format based on the platform the app is running on
    PhotoService.prototype.readAsBase64 = function (cameraPhoto) {
        return __awaiter(this, void 0, void 0, function () {
            var file, response, blob;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.platform.is("hybrid")) return [3 /*break*/, 2];
                        return [4 /*yield*/, Filesystem.readFile({
                                path: cameraPhoto.path
                            })];
                    case 1:
                        file = _a.sent();
                        return [2 /*return*/, file.data];
                    case 2: return [4 /*yield*/, fetch(cameraPhoto.webPath)];
                    case 3:
                        response = _a.sent();
                        return [4 /*yield*/, response.blob()];
                    case 4:
                        blob = _a.sent();
                        return [4 /*yield*/, this.convertBlobToBase64(blob)];
                    case 5: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    PhotoService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], PhotoService);
    return PhotoService;
}());
exports.PhotoService = PhotoService;

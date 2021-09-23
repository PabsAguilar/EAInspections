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
exports.SlidesPhotosComponent = void 0;
var core_1 = require("@angular/core");
var bitrix_picture_1 = require("src/app/models/bitrix-picture");
var image_modal_page_1 = require("../image-modal/image-modal.page");
var SlidesPhotosComponent = /** @class */ (function () {
    function SlidesPhotosComponent(photoService, modalController) {
        this.photoService = photoService;
        this.modalController = modalController;
        this.first = true;
        this._photoArray = new bitrix_picture_1.BitrixPictureList();
        this.photoChanged = new core_1.EventEmitter();
        this.sliderConfig = {
            // slidesPerView: 1.1,
            // spaceBetween: 2,
            centeredSlides: true
        };
    }
    Object.defineProperty(SlidesPhotosComponent.prototype, "photoArray", {
        get: function () {
            return this._photoArray;
        },
        set: function (value) {
            this._photoArray = value;
        },
        enumerable: false,
        configurable: true
    });
    SlidesPhotosComponent.prototype.openPreview = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: image_modal_page_1.ImageModalPage,
                            cssClass: "transparent-modal",
                            componentProps: {
                                image: image
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    SlidesPhotosComponent.prototype.takePicture = function () {
        return __awaiter(this, void 0, void 0, function () {
            var picture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.photoService.takePhotoB()];
                    case 1:
                        picture = _a.sent();
                        //var picture = new BitrixPicture();
                        //picture.base64Image = photo;
                        picture.isSync = false;
                        this._photoArray.images.push(picture);
                        return [4 /*yield*/, this.ionSlides.update()];
                    case 2:
                        _a.sent();
                        this.ionSlides.slideTo(this._photoArray.images.length + 1);
                        this.photoChanged.emit({ value: this._photoArray });
                        this.first = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    SlidesPhotosComponent.prototype.ngOnInit = function () { };
    SlidesPhotosComponent.prototype.ionSlidedrag = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.first) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.ionSlides.update()];
                    case 1:
                        _a.sent();
                        this.first = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    SlidesPhotosComponent.prototype.deletePictureFrontHouse = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("delete " + index);
                        this._photoArray.images.splice(index, 1);
                        return [4 /*yield*/, this.ionSlides.update()];
                    case 1:
                        _a.sent();
                        this.photoChanged.emit({ value: this._photoArray });
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.ViewChild("slides")
    ], SlidesPhotosComponent.prototype, "ionSlides");
    __decorate([
        core_1.Input()
    ], SlidesPhotosComponent.prototype, "title");
    __decorate([
        core_1.Input()
    ], SlidesPhotosComponent.prototype, "readonly");
    __decorate([
        core_1.Input("ngModel")
    ], SlidesPhotosComponent.prototype, "photoArray");
    __decorate([
        core_1.Output()
    ], SlidesPhotosComponent.prototype, "photoChanged");
    SlidesPhotosComponent = __decorate([
        core_1.Component({
            selector: "app-slides-photos",
            templateUrl: "./slides-photos.component.html",
            styleUrls: ["./slides-photos.component.scss"]
        })
    ], SlidesPhotosComponent);
    return SlidesPhotosComponent;
}());
exports.SlidesPhotosComponent = SlidesPhotosComponent;

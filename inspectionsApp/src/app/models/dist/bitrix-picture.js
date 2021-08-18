"use strict";
exports.__esModule = true;
exports.BitrixPicture = exports.BitrixPictureList = void 0;
var sync_info_1 = require("./sync-info");
var BitrixPictureList = /** @class */ (function () {
    // imagesCodesSync: any[];
    function BitrixPictureList() {
        this.syncInfo = new sync_info_1.SyncInfo();
        this.images = [];
        // this.imagesCodesSync = [];
        this.maxPictures = 5;
    }
    return BitrixPictureList;
}());
exports.BitrixPictureList = BitrixPictureList;
var BitrixPicture = /** @class */ (function () {
    function BitrixPicture() {
        this.syncList = false;
        this.isSync = false;
    }
    return BitrixPicture;
}());
exports.BitrixPicture = BitrixPicture;

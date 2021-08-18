"use strict";
exports.__esModule = true;
exports.GeneralInfoInspection = void 0;
var bitrix_picture_1 = require("../bitrix-picture");
var sync_info_1 = require("../sync-info");
var GeneralInfoInspection = /** @class */ (function () {
    function GeneralInfoInspection() {
        this.syncInfo = new sync_info_1.SyncInfo();
        this.picturesFrontHouse = new bitrix_picture_1.BitrixPictureList();
        this.propertyYear = null;
        this.pictureHouseNumbers = new bitrix_picture_1.BitrixPictureList();
        this.pictureHouseNumbers.maxPictures = 1;
        this.propertyType = "";
    }
    return GeneralInfoInspection;
}());
exports.GeneralInfoInspection = GeneralInfoInspection;

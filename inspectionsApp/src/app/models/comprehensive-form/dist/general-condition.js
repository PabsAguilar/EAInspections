"use strict";
exports.__esModule = true;
exports.GeneralCondition = void 0;
var bitrix_picture_1 = require("../bitrix-picture");
var GeneralCondition = /** @class */ (function () {
    //generalConditionBitrixMapping: GeneralConditionBitrixMapping;
    function GeneralCondition() {
        this.pictures = new bitrix_picture_1.BitrixPictureList();
        this.moistureLevel = null;
        this.notes = null;
        this.condition = [];
        //this.generalConditionBitrixMapping = new GeneralConditionBitrixMapping();
    }
    return GeneralCondition;
}());
exports.GeneralCondition = GeneralCondition;
// export class GeneralConditionBitrixMapping {
//   conditionCode: string;
//   moistureLevelCode: string;
//   picturesCode: string;
//   notesCode: string;
//   waterQualityTestCode: string;
//   otherCode: string;
// }

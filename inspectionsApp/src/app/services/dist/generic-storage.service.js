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
exports.GenericStorageService = void 0;
var core_1 = require("@angular/core");
var GenericStorageService = /** @class */ (function () {
    function GenericStorageService(collectionName, storage) {
        this.storage = storage;
        this.collectionName = collectionName;
    }
    GenericStorageService.prototype.add = function (item) {
        var _this = this;
        return this.storage.get(this.collectionName).then(function (items) {
            if (items) {
                items.push(item);
                return _this.storage.set(_this.collectionName, items);
            }
            else {
                return _this.storage.set(_this.collectionName, [item]);
            }
        });
    };
    GenericStorageService.prototype.complexAdd = function (item) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_b) {
                if (!item.id) {
                    throw new Error("item id is missing.");
                }
                return [2 /*return*/, this.storage.set(this.collectionName + "_" + item.id + ((_a = item.enterprise) !== null && _a !== void 0 ? _a : ""), item)];
            });
        });
    };
    GenericStorageService.prototype.addItems = function (newItems) {
        var _this = this;
        return this.storage.get(this.collectionName).then(function (items) {
            if (items) {
                items = items.concat(newItems);
                return _this.storage.set(_this.collectionName, items);
            }
            else {
                return _this.storage.set(_this.collectionName, newItems);
            }
        });
    };
    GenericStorageService.prototype.complexAddItems = function (newItems) {
        var _this = this;
        return Promise.all(newItems.map(function (x) {
            return _this.complexAdd(x);
        }));
    };
    GenericStorageService.prototype.update = function (item) {
        var _this = this;
        return this.storage.get(this.collectionName).then(function (items) {
            if (!items || items.length === 0) {
                return null;
            }
            var newItems = [];
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var i = items_1[_i];
                if (i.id === item.id &&
                    (item.enterprise == null || item.enterprise == i.enterprise)) {
                    newItems.push(item);
                }
                else {
                    newItems.push(i);
                }
            }
            return _this.storage.set(_this.collectionName, newItems);
        });
    };
    GenericStorageService.prototype.complexUpdate = function (item) {
        var _a;
        if (!item.id) {
            throw new Error("item id is missing.");
        }
        return this.storage.set(this.collectionName + "_" + item.id + ((_a = item.enterprise) !== null && _a !== void 0 ? _a : ""), item);
    };
    GenericStorageService.prototype.updateAll = function (items) {
        return this.storage.set(this.collectionName, items);
    };
    GenericStorageService.prototype.getAll = function (enterprise) {
        if (enterprise === void 0) { enterprise = null; }
        return this.storage
            .get(this.collectionName)
            .then(function (items) {
            if (!items || items.length === 0) {
                return [];
            }
            return items.filter(function (x) { return enterprise == null || enterprise == x.enterprise; });
        });
    };
    GenericStorageService.prototype.complexGetAll = function (enterprise) {
        if (enterprise === void 0) { enterprise = null; }
        return __awaiter(this, void 0, Promise, function () {
            var keys, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.keys()];
                    case 1: return [4 /*yield*/, (_a.sent()).filter(function (x) { return x.indexOf(_this.collectionName) == 0; })];
                    case 2:
                        keys = _a.sent();
                        return [4 /*yield*/, Promise.all(keys.map(function (k) { return __awaiter(_this, void 0, Promise, function () {
                                var item;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.storage.get(k)];
                                        case 1:
                                            item = _a.sent();
                                            return [2 /*return*/, item];
                                    }
                                });
                            }); }))];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result.filter(function (x) { return enterprise == null || enterprise == x.enterprise; })];
                }
            });
        });
    };
    GenericStorageService.prototype.get = function (id, enterprise) {
        if (enterprise === void 0) { enterprise = null; }
        return this.storage
            .get(this.collectionName)
            .then(function (items) {
            if (!items || items.length === 0) {
                return null;
            }
            for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
                var i = items_2[_i];
                if (i.id === id &&
                    (enterprise == null || enterprise == i.enterprise)) {
                    return i;
                }
            }
        });
    };
    GenericStorageService.prototype.complexGet = function (id, enterprise) {
        if (enterprise === void 0) { enterprise = null; }
        return this.storage.get(this.collectionName + "_" + id + (enterprise !== null && enterprise !== void 0 ? enterprise : ""));
    };
    GenericStorageService.prototype.complexDelete = function (item) {
        var _a;
        return this.storage.remove(this.collectionName + "_" + item.id + ((_a = item.enterprise) !== null && _a !== void 0 ? _a : ""));
    };
    GenericStorageService.prototype["delete"] = function (item) {
        var _this = this;
        return this.storage.get(this.collectionName).then(function (items) {
            if (!items || items.length === 0) {
                return null;
            }
            var keepItems = [];
            for (var _i = 0, items_3 = items; _i < items_3.length; _i++) {
                var i = items_3[_i];
                if (i.id !== item.id ||
                    item.enterprise == null ||
                    item.enterprise == i.enterpise) {
                    keepItems.push(i);
                }
            }
            return _this.storage.set(_this.collectionName, keepItems);
        });
    };
    GenericStorageService.prototype.clear = function () {
        return this.storage.set(this.collectionName, null);
    };
    GenericStorageService.prototype.complexClear = function () {
        return __awaiter(this, void 0, Promise, function () {
            var list;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAll()];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, Promise.all(list.map(function (x) {
                                _this["delete"](x);
                            }))];
                }
            });
        });
    };
    GenericStorageService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        })
    ], GenericStorageService);
    return GenericStorageService;
}());
exports.GenericStorageService = GenericStorageService;

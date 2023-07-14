"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoizeDict = void 0;
const core_1 = require("@vueuse/core");
class MemoizeDict {
    constructor(options) {
        this.asyncComputedMap = new Map();
        this.options = options;
        this.memoFetch = (0, core_1.useMemoize)(this._fetch.bind(this));
    }
    get(dictName) {
        if (!this.asyncComputedMap.has(dictName)) {
            const asyncComputedRef = (0, core_1.asyncComputed)(() => this.memoFetch(dictName));
            this.asyncComputedMap.set(dictName, asyncComputedRef);
        }
        const computedRef = this.asyncComputedMap.get(dictName);
        return computedRef.value;
    }
    fetch(dictName) {
        return this.memoFetch(dictName);
    }
    load(dictName) {
        return this.memoFetch.load(dictName);
    }
    clear() {
        return this.memoFetch.clear();
    }
    delete(dictName) {
        return this.memoFetch.delete(dictName);
    }
    find(dictName, value) {
        var _a;
        const valueFieldName = ((_a = this.options.fieldNames) === null || _a === void 0 ? void 0 : _a.value) || "value";
        const dict = this.get(dictName);
        return dict === null || dict === void 0 ? void 0 : dict.find((item) => item[valueFieldName] === value);
    }
    label(dictName, value) {
        var _a;
        const labelFieldName = ((_a = this.options.fieldNames) === null || _a === void 0 ? void 0 : _a.label) || "label";
        const item = this.find(dictName, value);
        return item === null || item === void 0 ? void 0 : item[labelFieldName];
    }
    _fetch(dictName) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.options.config[dictName];
            if (!config) {
                throw new Error(`config not found: ${dictName}`);
            }
            return (yield config.data());
        });
    }
}
exports.MemoizeDict = MemoizeDict;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiagnoses = void 0;
const diagnoses_1 = __importDefault(require("../data/diagnoses"));
const getDiagnoses = () => {
    return diagnoses_1.default;
};
exports.getDiagnoses = getDiagnoses;
exports.default = { getDiagnoses: exports.getDiagnoses };

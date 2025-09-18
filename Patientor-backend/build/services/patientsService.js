"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../data/patients"));
const uuid_1 = require("uuid");
const getPatients = () => {
    return patients_1.default;
};
const getNonSensitivePatients = () => {
    return patients_1.default.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};
const addPatient = (newPatientEntry) => {
    const newPatient = Object.assign(Object.assign({}, newPatientEntry), { id: (0, uuid_1.v4)() });
    patients_1.default.push(newPatient);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ssn } = newPatient, addedPatient = __rest(newPatient, ["ssn"]);
    return addedPatient;
};
exports.default = { getPatients, getNonSensitivePatients, addPatient };

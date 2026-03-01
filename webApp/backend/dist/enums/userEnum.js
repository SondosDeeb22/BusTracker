"use strict";
//==============================
//? user Roles
//==============================
Object.defineProperty(exports, "__esModule", { value: true });
exports.appearance = exports.language = exports.status = exports.gender = exports.role = void 0;
var role;
(function (role) {
    role["driver"] = "driver";
    role["admin"] = "admin";
})(role || (exports.role = role = {}));
//==============================
//? user Gender
//==============================
var gender;
(function (gender) {
    gender["female"] = "female";
    gender["male"] = "male";
})(gender || (exports.gender = gender = {}));
//==============================
//? user status
//==============================
var status;
(function (status) {
    status["active"] = "active";
    status["inactive"] = "inactive";
})(status || (exports.status = status = {}));
//==============================
//? app language
//==============================
var language;
(function (language) {
    language["english"] = "english";
    language["turkish"] = "turkish";
})(language || (exports.language = language = {}));
//==============================
//? app appereance
//==============================
var appearance;
(function (appearance) {
    appearance["light"] = "light";
    appearance["dark"] = "dark";
})(appearance || (exports.appearance = appearance = {}));
//# sourceMappingURL=userEnum.js.map
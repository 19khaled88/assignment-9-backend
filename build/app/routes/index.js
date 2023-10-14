"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = require("../modules/users/route");
const userRootRoute = express_1.default.Router();
const ModuleRoute = [
    {
        path: '/user',
        routes: route_1.UserRouter
    }
];
ModuleRoute.forEach(routes => userRootRoute.use(routes.path, routes.routes));
exports.default = userRootRoute;
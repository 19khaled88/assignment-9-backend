"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameTypeRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../../middleware/validationMiddleware"));
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.delete('/delete/:id', (0, authCheck_1.default)(client_1.RoleEnumType.ADMIN, client_1.RoleEnumType.SUPER_ADMIN), controller_1.GameTypeController.deleteGameTypeControler);
router.put('/update/:id', (0, authCheck_1.default)(client_1.RoleEnumType.ADMIN, client_1.RoleEnumType.SUPER_ADMIN), controller_1.GameTypeController.updateGameTypeController);
router.get('/single/:id', controller_1.GameTypeController.getSingleGameTypeController);
router.post('/create', (0, authCheck_1.default)(client_1.RoleEnumType.ADMIN, client_1.RoleEnumType.SUPER_ADMIN), (0, validationMiddleware_1.default)(validation_1.GameTypeValidation.create), controller_1.GameTypeController.createController);
router.get('/allGameTypes', controller_1.GameTypeController.getAllGameTypeController);
exports.GameTypeRouter = router;

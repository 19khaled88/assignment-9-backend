"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurfRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.delete('/delete/:id', (0, authCheck_1.default)(client_1.RoleEnumType.ADMIN, client_1.RoleEnumType.SUPER_ADMIN), controller_1.TurfController.deleteTurfControler);
router.put('/update/:id', (0, authCheck_1.default)(client_1.RoleEnumType.ADMIN, client_1.RoleEnumType.SUPER_ADMIN), controller_1.TurfController.updateTurfController);
router.get('/single/:id', controller_1.TurfController.getSingleTurfController);
router.post('/create', controller_1.TurfController.createController);
// router.post('/create', authCheck(RoleEnumType.ADMIN,RoleEnumType.SUPER_ADMIN),validateRequest(TurfValidation.create), TurfController.createController)
router.get('/allTurfs', controller_1.TurfController.getAllTurfsController);
exports.TurfRouter = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authCheck_1 = __importDefault(require("../../middleware/authCheck"));
const validationMiddleware_1 = __importDefault(require("../../middleware/validationMiddleware"));
const controller_1 = require("./controller");
const validation_1 = require("./validation");
const router = express_1.default.Router();
router.get('/single/:id', controller_1.UserController.getSingleUserController);
router.delete('/delete/:id', (0, authCheck_1.default)(client_1.RoleEnumType.ADMIN, client_1.RoleEnumType.SUPER_ADMIN), controller_1.UserController.deleteUserControler);
router.put('/update/:id', (0, authCheck_1.default)(client_1.RoleEnumType.ADMIN, client_1.RoleEnumType.SUPER_ADMIN, client_1.RoleEnumType.USER), controller_1.UserController.updateUserController);
router.post('/signUp', controller_1.UserController.signUpController);
router.post('/signUp', (0, authCheck_1.default)(client_1.RoleEnumType.ADMIN, client_1.RoleEnumType.SUPER_ADMIN), (0, validationMiddleware_1.default)(validation_1.UserValidation.create), controller_1.UserController.signUpController);
router.post('/signIn', controller_1.UserController.signInController);
// router.get('/allUsers',UserController.getAllUsersController)
router.get('/allUsers', (0, authCheck_1.default)(client_1.RoleEnumType.ADMIN, client_1.RoleEnumType.SUPER_ADMIN), controller_1.UserController.getAllUsersController);
exports.UserRouter = router;

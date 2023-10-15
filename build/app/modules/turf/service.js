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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurfService = void 0;
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const prisma = new client_1.PrismaClient();
const createTurfService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isExist = yield transactionClient.turf.findFirst({
            where: {
                name: data.name
            }
        });
        if (isExist) {
            throw new apiError_1.default(400, 'A turf with this name already created');
        }
        const result = yield transactionClient.turf.create({
            data: data,
        });
        const newUser = yield transactionClient.turf.findFirst({
            where: {
                id: result.id
            },
            select: {
                name: true,
                owner: true,
                location: true
            }
        });
        return newUser;
    }));
    return result;
});
const getAllTurfs = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.turf.findMany({
        select: {
            id: true,
            name: true,
            location: true,
            owner: true,
            gameOffers: true
        },
    });
    return result;
});
const getSingleTurf = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma.turf.findFirst({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            location: true,
            owner: true,
            gameOffers: true
        }
    });
    return isExist;
});
const deleteTurf = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield prisma.turf.delete({
        where: {
            id: id,
        },
    });
    return isDeleted;
});
const updateTurf = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield prisma.turf.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return isUpdated;
});
exports.TurfService = {
    createTurfService,
    getAllTurfs,
    getSingleTurf,
    deleteTurf,
    updateTurf
};

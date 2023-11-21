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
exports.GameOfferService = void 0;
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const prisma = new client_1.PrismaClient();
const createGameOfferService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isValid = yield transactionClient.turf.findFirst({
            where: {
                AND: [
                    { id: data.turfId },
                    {
                        fields: {
                            some: {
                                id: data.fieldId
                            }
                        }
                    }
                ],
            }
        });
        if (!isValid) {
            throw new apiError_1.default(400, 'No field to the given turf registered yet!');
        }
        const isExist = yield transactionClient.gameOffer.findFirst({
            where: {
                AND: [
                    {
                        turfId: data.turfId
                    }, {
                        gameTypeId: data.gameTypeId
                    },
                    {
                        fieldId: data.fieldId
                    }
                ]
            }
        });
        if (isExist) {
            throw new apiError_1.default(400, 'A field with this code already created');
        }
        const result = yield transactionClient.gameOffer.create({
            data: data,
        });
        const newGameOffer = yield transactionClient.gameOffer.findFirst({
            where: {
                id: result.id
            },
            select: {
                price_per_hour: true,
                turfId: true,
                gameTypeId: true,
                fieldId: true,
                bookings: true
            }
        });
        return newGameOffer;
    }));
    return result;
});
const getAllGameOffers = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transactionClient.gameOffer.findMany({
            select: {
                id: true,
                price_per_hour: true,
                turf: {
                    select: {
                        name: true,
                        location: true,
                        owner: true
                    }
                },
                turfId: true,
                gameTypeId: true,
                gameType: {
                    select: {
                        name: true,
                        numberOfPalyers: true
                    }
                },
                fieldId: true,
                field: {
                    select: {
                        code: true,
                        size: true
                    }
                },
                bookings: {
                    select: {
                        start_time: true,
                        end_time: true,
                        turfId: true,
                        gameOfferId: true,
                        fieldId: true,
                        userId: true
                    }
                },
            },
        });
        return result;
    }));
    return response;
});
const getSingleGameOffer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma.gameOffer.findFirstOrThrow({
        where: {
            id: id,
        },
        select: {
            id: true,
            price_per_hour: true,
            turfId: true,
            gameTypeId: true,
            fieldId: true,
            bookings: true
        }
    });
    return isExist;
});
const deleteGameOffer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield prisma.gameOffer.delete({
        where: {
            id: id,
        },
    });
    return isDeleted;
});
const updateGameOffer = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield prisma.gameOffer.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return isUpdated;
});
exports.GameOfferService = {
    createGameOfferService,
    getAllGameOffers,
    getSingleGameOffer,
    deleteGameOffer,
    updateGameOffer
};

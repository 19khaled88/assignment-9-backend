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
exports.GameOfferService = void 0;
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const interfaces_1 = require("./interfaces");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
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
const getAllGameOffers = (paginatinOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const { searchTerm } = filterOptions, filterData = __rest(filterOptions, ["searchTerm"]);
        const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginatinOptions);
        let andConditions = [];
        if (searchTerm) {
            andConditions.push({
                OR: interfaces_1.game_offers_serarch_fields_constant.map(field => {
                    const fieldName = Object.keys(field)[0]; // Type assertion
                    const fieldValue = field[fieldName];
                    console.log(fieldName, fieldValue);
                    const condition = {
                        [fieldName]: {
                            [fieldValue]: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    };
                    return condition;
                })
            });
        }
        //filtering code
        if (Object.keys(filterData).length > 0) {
            andConditions.push({
                // AND: Object.keys(filterData).map((key) => {
                // 	return{
                // 		[key]: {
                // 			equals: (filterData as any)[key]
                // 		}
                // 	}
                // })
                AND: Object.keys(filterData).map((key) => {
                    if (key === 'name') {
                        return {
                            gameType: {
                                [key]: {
                                    equals: filterData[key],
                                }
                            },
                        };
                    }
                    else if (key === 'location') {
                        return {
                            turf: {
                                [key]: {
                                    equals: filterData[key],
                                }
                            }
                        };
                    }
                    else {
                        return {};
                    }
                }),
            });
        }
        // const whereCondition: Prisma.GameOfferWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}
        const whereCondition = andConditions.length > 0 ? { OR: andConditions } : {};
        const result = yield transactionClient.gameOffer.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy: paginatinOptions.sortBy && paginatinOptions.sortOrder ? {
                [paginatinOptions.sortBy]: paginatinOptions.sortOrder
            } : { createAt: 'asc' },
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
        const total = yield prisma.gameOffer.count();
        return {
            meta: {
                limit,
                page,
                total
            },
            data: result
        };
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

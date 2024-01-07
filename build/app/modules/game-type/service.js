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
exports.GameTypeService = void 0;
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const interfaces_1 = require("./interfaces");
const prisma = new client_1.PrismaClient();
const field = 'numberOfPalyers';
const createGameTypeService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isExist = yield transactionClient.gameType.findFirst({
            where: {
                name: data.name
            }
        });
        if (isExist) {
            throw new apiError_1.default(400, 'A Game type with this name already created');
        }
        const result = yield transactionClient.gameType.create({
            data: data,
        });
        const newGame = yield transactionClient.gameType.findFirst({
            where: {
                id: result.id
            },
            select: {
                name: true,
                imgurl: true,
                numberOfPalyers: true
            }
        });
        return newGame;
    }));
    return result;
});
const getAllGameType = (paginatinOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filterOptions, filterData = __rest(filterOptions, ["searchTerm"]);
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginatinOptions);
    // if(Object.keys(filterData)[0] === 'numberOfPalyers' && typeof Object.values(filterData)[0] === 'string'){
    //     //  filterData['numberOfPalyers'] =	
    // 	//  Number(Object.values(filterData)[0])
    // 	type T =  keyof typeof filterData
    // 	Number(filterData[field as keyof typeof filterData])
    // 	console.log(Number(filterData[field as keyof typeof filterData]), T)
    // }
    let andConditions = [];
    //searching code
    if (searchTerm) {
        andConditions.push({
            OR: interfaces_1.game_type_search_fields_constant.map(field => {
                return {
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    },
                };
            }),
        });
    }
    //filtering code
    // if (Object.keys(filterData).length > 0) {
    // 	andConditions.push({
    // 		AND: Object.keys(filterData).map((key) => ({
    // 			[key]: {
    // 				equals: (filterData as any)[key],
    // 				mode: 'insensitive'
    // 			}
    // 		}))
    // 	})
    // }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: key === 'numberOfPalyers' ? parseInt(filterData[key]) : filterData[key],
                }
            }))
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma.gameType.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: paginatinOptions.sortBy && paginatinOptions.sortOrder ? {
            [paginatinOptions.sortBy]: paginatinOptions.sortOrder
        } : { createAt: 'asc' },
        select: {
            id: true,
            name: true,
            imgurl: true,
            numberOfPalyers: true,
            bookings: true,
            GameOffers: true
        },
    });
    const total = yield prisma.gameType.count();
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const getSingleGameType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma.gameType.findFirst({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            imgurl: true,
            numberOfPalyers: true,
            bookings: true,
            GameOffers: {
                select: {
                    field: {
                        select: {
                            code: true
                        }
                    },
                    gameType: {
                        select: {
                            name: true
                        }
                    },
                    turf: {
                        select: {
                            name: true
                        }
                    },
                    price_per_hour: true
                }
            }
        }
    });
    return isExist;
});
const deleteGameType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield prisma.gameType.delete({
        where: {
            id: id,
        },
    });
    return isDeleted;
});
const updateGameType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield prisma.gameType.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return isUpdated;
});
exports.GameTypeService = {
    createGameTypeService,
    getAllGameType,
    getSingleGameType,
    deleteGameType,
    updateGameType
};

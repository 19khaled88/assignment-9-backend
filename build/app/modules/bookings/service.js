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
exports.BookingService = void 0;
const client_1 = require("@prisma/client");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
// import ApiError from "../../../errors/apiError";
const prisma = new client_1.PrismaClient();
const createBookingService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.start_time > data.end_time) {
            throw new apiError_1.default(400, 'End date must be bigger than Start date!');
        }
        const isUserExist = yield transactionClient.user.findFirst({
            where: {
                id: data.userId
            }
        });
        if (!isUserExist) {
            throw new apiError_1.default(400, 'This user not exist!');
        }
        const offeredGame = yield transactionClient.gameOffer.findFirst({
            where: {
                id: data.gameOfferId
            }
        });
        const isExist = yield transactionClient.booking.findFirst({
            where: {
                AND: [
                    {
                        start_time: {
                            lt: data.end_time
                        },
                        end_time: {
                            gt: data.start_time
                        }
                    },
                    {
                        turfId: offeredGame === null || offeredGame === void 0 ? void 0 : offeredGame.turfId
                    },
                    {
                        fieldId: offeredGame === null || offeredGame === void 0 ? void 0 : offeredGame.fieldId
                    },
                ]
            }
        });
        if (isExist) {
            throw new apiError_1.default(400, 'A booking with this information already exist!');
        }
        const result = yield transactionClient.booking.create({
            data: data,
        });
        const newGameOffer = yield transactionClient.booking.findFirst({
            where: {
                id: result.id
            },
            select: {
                start_time: true,
                end_time: true,
                gameOfferId: true,
                userId: true,
                fieldId: true,
                gameTypeId: true,
                turfId: true,
                payment_status: true
            }
        });
        return newGameOffer;
    }));
    return result;
});
const getAllBookingService = (role, userId, paginatinOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginatinOptions);
    const fetchAllTransaction = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isUser = yield transactionClient.user.findUnique({
            where: {
                id: userId
            }
        });
        if (role === client_1.RoleEnumType.SUPER_ADMIN || role === client_1.RoleEnumType.ADMIN) {
            const admin_SuperAdmin = yield transactionClient.booking.findMany({
                skip,
                take: limit,
                orderBy: paginatinOptions.sortBy && paginatinOptions.sortOrder
                    ? {
                        [paginatinOptions.sortBy]: paginatinOptions.sortOrder
                    }
                    : { createAt: 'asc' },
                select: {
                    id: true,
                    start_time: true,
                    end_time: true,
                    gameOfferId: true,
                    user: {
                        select: {
                            name: true
                        }
                    },
                    turf: {
                        select: {
                            name: true
                        }
                    },
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
                    payment_status: true
                }
            });
            return admin_SuperAdmin;
        }
        else if (role === client_1.RoleEnumType.USER) {
            const user = yield transactionClient.booking.findMany({
                where: {
                    userId: userId
                },
                skip,
                take: limit,
                orderBy: paginatinOptions.sortBy && paginatinOptions.sortOrder
                    ? {
                        [paginatinOptions.sortBy]: paginatinOptions.sortOrder
                    }
                    : { createAt: 'asc' },
                select: {
                    id: true,
                    start_time: true,
                    end_time: true,
                    gameOfferId: true,
                    user: {
                        select: {
                            name: true
                        }
                    },
                    turf: {
                        select: {
                            name: true
                        }
                    },
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
                    payment_status: true
                }
            });
            return user;
        }
    }));
    const total = fetchAllTransaction === null || fetchAllTransaction === void 0 ? void 0 : fetchAllTransaction.length;
    return {
        meta: {
            limit,
            page,
            total: total != undefined ? total : 0
        },
        data: fetchAllTransaction
    };
});
const getSingleBookingService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma.booking.findFirstOrThrow({
        where: {
            id: id,
        },
        select: {
            id: true,
            start_time: true,
            end_time: true,
            gameOfferId: true,
            userId: true,
            fieldId: true,
            gameTypeId: true,
            turfId: true
        }
    });
    return isExist;
});
const getBookingsByUserIdSerivce = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.booking.findMany({
        where: {
            userId: userId
        }
    });
    return result;
});
const deleteBookingService = (id, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isUser = yield transactionClient.booking.findFirst({
            where: {
                userId: userId
            }
        });
        if (role === 'USER' && isUser === null) {
            throw new apiError_1.default(400, 'This user not authorized!');
        }
        if (role === 'USER') {
            const isDeleted = yield transactionClient.booking.delete({
                where: {
                    id: id,
                    userId: userId
                }
            });
            return isDeleted;
        }
        // if(role === 'ADMIN' || role === 'SUPER_ADMIN'){
        // }
        const isDeleted = yield transactionClient.booking.delete({
            where: {
                id: id
            }
        });
        return isDeleted;
    }));
    // const isDeleted = await prisma.booking.delete({
    // 	where: {
    // 		id: id,
    // 	},
    // });
    // return isDeleted;
    return response;
});
const updateBookingService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield prisma.booking.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return isUpdated;
});
exports.BookingService = {
    createBookingService,
    getAllBookingService,
    getSingleBookingService,
    getBookingsByUserIdSerivce,
    deleteBookingService,
    updateBookingService
};

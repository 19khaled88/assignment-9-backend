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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const token_1 = require("../../../utils/token");
const interfaces_1 = require("./interfaces");
const prisma = new client_1.PrismaClient();
const signUpServices = (data, token) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.role === "ADMIN" && !token) {
        throw new apiError_1.default(400, "Token not found or invalid token!!");
    }
    else if (data.role === "ADMIN" && token) {
        const isSuperAdmin = (0, token_1.verifyJwt)(token);
        if (isSuperAdmin.role !== "SUPER_ADMIN") {
            throw new apiError_1.default(400, "Unauthorized access!!");
        }
    }
    const isExist = yield prisma.user.findFirst({
        where: {
            email: data.email,
        },
    });
    if (isExist) {
        throw new Error("This user already exist");
    }
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 12);
    data.password = hashedPassword;
    const userCreated = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma.user.create({
            data: data,
        });
        const newUser = yield transactionClient.user.findFirst({
            where: {
                id: result.id,
            },
            select: {
                id: true,
                name: true,
                role: true,
                email: true,
                contactNo: true,
                address: true,
                location: true,
            },
        });
        return newUser;
    }));
    return userCreated;
});
const signInServices = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma.user.findFirst({
        where: {
            email: data.email,
        },
    });
    if (isExist === null) {
        throw new Error("This user does not exist");
    }
    if (isExist !== null &&
        data.password !== undefined &&
        (yield bcrypt_1.default.compare(data.password, isExist.password))) {
        const access_token = (0, token_1.signJwt)({ role: isExist.role, userId: isExist.id }, { expiresIn: "2h" });
        return { token: access_token };
    }
    throw new Error("User sign in error");
});
const getAllUsers = (paginatinOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filterOptions, filterData = __rest(filterOptions, ["searchTerm"]);
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginatinOptions);
    let andConditions = [];
    //searching code
    if (searchTerm) {
        andConditions.push({
            OR: interfaces_1.user_search_fields_constant.map((field) => {
                return {
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                };
            }),
        });
    }
    //filtering code
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: paginatinOptions.sortBy && paginatinOptions.sortOrder
            ? {
                [paginatinOptions.sortBy]: paginatinOptions.sortOrder,
            }
            : { createAt: "asc" },
        select: {
            id: true,
            name: true,
            role: true,
            email: true,
            contactNo: true,
            address: true,
            location: true,
            bookings: true,
        },
    });
    const total = yield prisma.user.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma.user.findFirst({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            role: true,
            email: true,
            contactNo: true,
            address: true,
            location: true,
            bookings: true,
        },
    });
    return isExist;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield prisma.user.delete({
        where: {
            id: id,
        },
    });
    return isDeleted;
});
const updateUser = (id, payload, tokenizedRole) => __awaiter(void 0, void 0, void 0, function* () {
    if (id === undefined || null) {
        throw new apiError_1.default(400, 'Request is not valid');
    }
    if (payload === undefined || null) {
        throw new apiError_1.default(400, 'Update not happend');
    }
    const updateTransaction = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isValidUser = yield transactionClient.user.findUnique({
            where: {
                id: id,
            },
        });
        if (isValidUser &&
            (isValidUser.role === client_1.RoleEnumType.ADMIN ||
                isValidUser.role === client_1.RoleEnumType.SUPER_ADMIN)) {
            const isUpdate = yield transactionClient.user.update({
                where: {
                    id: id,
                },
                data: Object.assign({}, payload),
            });
            return isUpdate;
        }
        else {
            const isUpdate = yield transactionClient.user.update({
                where: {
                    id: id,
                    AND: {
                        role: tokenizedRole,
                    },
                },
                data: Object.assign({}, payload),
            });
            return isUpdate;
        }
    }));
    return updateTransaction;
});
exports.UserService = {
    signUpServices,
    signInServices,
    getAllUsers,
    updateUser,
    deleteUser,
    getSingleUser,
};

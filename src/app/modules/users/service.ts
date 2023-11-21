import { Prisma, PrismaClient, RoleEnumType, User } from "@prisma/client";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/apiError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IFilters } from "../../../shared/filterType";
import { IGenericResponse } from "../../../shared/paginationResponse";
import { IPaginationOptions } from "../../../shared/paginationType";
import { signJwt, verifyJwt } from "../../../utils/token";
import {
  IUserResponse,
  Token,
  user_search_fields_constant,
} from "./interfaces";

const prisma = new PrismaClient();


const signUpServices = async (
  data: User,
  token: string | undefined
): Promise<IUserResponse | null> => {
  if (data.role === "ADMIN" && !token) {
    throw new ApiError(400, "Token not found or invalid token!!");
  } else if (data.role === "ADMIN" && token) {
    const isSuperAdmin = verifyJwt(token);
    if (isSuperAdmin.role !== "SUPER_ADMIN") {
      throw new ApiError(400, "Unauthorized access!!");
    }
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  data.password = hashedPassword;
  const userCreated = await prisma.$transaction(async (transactionClient) => {
    const result = await prisma.user.create({
      data: data,
    });
    const newUser = await transactionClient.user.findFirst({
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
  });
  return userCreated;
};

const signInServices = async (data: Partial<User>): Promise<Token | null> => {
  const isExist = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });
  if (isExist === null) {
    throw new Error("This user does not exist");
  }
  if (
    isExist !== null &&
    data.password !== undefined &&
    (await bcrypt.compare(data.password, isExist.password))
  ) {
    const access_token = signJwt(
      { role: isExist.role, userId: isExist.id },
      { expiresIn: "2h" }
    );
    return { token: access_token };
  }
  throw new Error("User sign in error");
};

const getAllUsers = async (
  paginatinOptions: IPaginationOptions,
  filterOptions: IFilters
): Promise<IGenericResponse<IUserResponse[]>> => {
  const { searchTerm, ...filterData } = filterOptions;
  const { limit, page, skip } =
    paginationHelper.calculatePagination(paginatinOptions);

  let andConditions = [];

  //searching code
  if (searchTerm) {
    andConditions.push({
      OR: user_search_fields_constant.map((field) => {
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      paginatinOptions.sortBy && paginatinOptions.sortOrder
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

  const total = await prisma.user.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<IUserResponse | null> => {
  const isExist = await prisma.user.findFirst({
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
};

const deleteUser = async (id: string): Promise<User | null> => {
  const isDeleted = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return isDeleted;
};

const updateUser = async (
  id: string,
  payload: Partial<User>,
  tokenizedRole: RoleEnumType | undefined
): Promise<User> => {

  if (id === undefined || null) {
    throw new ApiError(400, 'Request is not valid')
  }

  if (payload === undefined || null) {
    throw new ApiError(400, 'Update not happend')
  }
  const updateTransaction = await prisma.$transaction(
    async (transactionClient) => {
      const isValidUser = await transactionClient.user.findUnique({
        where: {
          id: id,
        },
      });

      if (
        isValidUser &&
        (isValidUser.role === RoleEnumType.ADMIN ||
          isValidUser.role === RoleEnumType.SUPER_ADMIN)
      ) {
        const isUpdate = await transactionClient.user.update({
          where: {
            id: id,
          },
          data: { ...payload },
        });
        return isUpdate;
      } else {
        const isUpdate = await transactionClient.user.update({
          where: {
            id: id,
            AND: {
              role: tokenizedRole,
            },
          },
          data: { ...payload },
        });
        return isUpdate;
      }
    }
  );

  return updateTransaction;
};

export const UserService = {
  signUpServices,
  signInServices,
  getAllUsers,
  updateUser,
  deleteUser,
  getSingleUser,
};

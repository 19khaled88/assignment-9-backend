import { Booking, PrismaClient, RoleEnumType } from "@prisma/client";
import ApiError from "../../../errors/apiError";
import { IAllBookingResponse, IBookingResponse } from "./interfaces";
import { IPaginationOptions } from "../../../shared/paginationType";
import { IGenericResponse } from "../../../shared/paginationResponse";
import { paginationHelper } from "../../../helpers/paginationHelper";
// import ApiError from "../../../errors/apiError";
const prisma = new PrismaClient()


const createBookingService = async (data: Booking): Promise<IBookingResponse | null> => {
	const result = await prisma.$transaction(async transactionClient => {

		if (data.start_time > data.end_time) {
			throw new ApiError(400, 'End date must be bigger than Start date!')
		}

		const isUserExist = await transactionClient.user.findFirst({
			where: {
				id: data.userId
			}
		})

		if (!isUserExist) {
			throw new ApiError(400, 'This user not exist!')
		}

		const offeredGame = await transactionClient.gameOffer.findFirst({
			where: {
				id: data.gameOfferId
			}
		})

		const isExist = await transactionClient.booking.findFirst({
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
						turfId: offeredGame?.turfId
					},
					{
						fieldId: offeredGame?.fieldId
					},

				]
			}
		})

		if (isExist) {
			throw new ApiError(400, 'A booking with this information already exist!')
		}

		const result = await transactionClient.booking.create({
			data: data,

		});

		const newGameOffer = await transactionClient.booking.findFirst({
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
		})

		return newGameOffer
	})
	return result;
};

const getAllBookingService = async (
	role: string,
	userId: string,
	paginatinOptions: IPaginationOptions,
): Promise<IGenericResponse<IAllBookingResponse[] | undefined>> => {

	const { limit, page, skip } =
		paginationHelper.calculatePagination(paginatinOptions);

	const fetchAllTransaction = await prisma.$transaction(async transactionClient => {
		const isUser = await transactionClient.user.findUnique({
			where: {
				id: userId
			}
		})

		if (role === RoleEnumType.SUPER_ADMIN || role === RoleEnumType.ADMIN) {
			const admin_SuperAdmin = await transactionClient.booking.findMany({
				skip,
				take: limit,
				orderBy:
					paginatinOptions.sortBy && paginatinOptions.sortOrder
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
			return admin_SuperAdmin
		} else if (role === RoleEnumType.USER) {
			const user = await transactionClient.booking.findMany({
				where: {
					userId: userId
				},
				skip,
				take: limit,
				orderBy:
					paginatinOptions.sortBy && paginatinOptions.sortOrder
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
			return user
		}

	})
	const total = fetchAllTransaction?.length
	
	return {
		meta: {
			limit,
			page,
			total: total != undefined ? total : 0
		},
		data: fetchAllTransaction
	}
};

const getSingleBookingService = async (id: string): Promise<IBookingResponse | null> => {
	const isExist = await prisma.booking.findFirstOrThrow({
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
};

const getBookingsByUserIdSerivce = async (userId: string) => {
	const result = await prisma.booking.findMany({
		where: {
			userId: userId
		}
	})
	return result
}

const deleteBookingService = async (id: string, userId: string, role: string): Promise<Booking | null> => {
	const response = await prisma.$transaction(async transactionClient => {
		const isUser = await transactionClient.booking.findFirst({
			where: {
				userId: userId
			}
		})

		if (role === 'USER' && isUser === null) {
			throw new ApiError(400, 'This user not authorized!')
		}
		if (role === 'USER') {
			const isDeleted = await transactionClient.booking.delete({
				where: {
					id: id,
					userId: userId
				}
			})
			return isDeleted
		}
		// if(role === 'ADMIN' || role === 'SUPER_ADMIN'){

		// }
		const isDeleted = await transactionClient.booking.delete({
			where: {
				id: id
			}
		})
		return isDeleted
	})

	// const isDeleted = await prisma.booking.delete({
	// 	where: {
	// 		id: id,
	// 	},
	// });
	// return isDeleted;
	return response
};

const updateBookingService = async (
	id: string,
	payload: Partial<Booking>
): Promise<Booking> => {
	const isUpdated = await prisma.booking.update({
		where: {
			id: id,
		},
		data: payload,
	});
	return isUpdated;
};

export const BookingService = {
	createBookingService,
	getAllBookingService,
	getSingleBookingService,
	getBookingsByUserIdSerivce,
	deleteBookingService,
	updateBookingService
}
import { Booking, PrismaClient, RoleEnumType } from "@prisma/client";
import ApiError from "../../../errors/apiError";
import { IAllBookingResponse, IBookingResponse } from "./interfaces";
// import ApiError from "../../../errors/apiError";
const prisma = new PrismaClient()


const createBookingService = async (data: Booking): Promise<IBookingResponse | null> => {
	const result = await prisma.$transaction(async transactionClient => {
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
		console.log(offeredGame)
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

const getAllBookingService = async (role: string, userId: string): Promise<IAllBookingResponse[] | undefined> => {

	// const result = await prisma.booking.findMany({
	// 	select: {
	// 		id: true,
	// 		start_time: true,
	// 		end_time: true,
	// 		gameOfferId: true,
	// 		userId: true,
	// 		fieldId: true,
	// 		gameTypeId: true,
	// 		turfId: true
	// 	}
	// });
	// console.log(role,userId)

	const fetchAllTransaction = await prisma.$transaction(async transactionClient => {
		const isUser = await transactionClient.user.findUnique({
			where: {
				id: userId
			}
		})
		
		if (role === RoleEnumType.SUPER_ADMIN || role === RoleEnumType.ADMIN) {
			const admin_SuperAdmin = await transactionClient.booking.findMany({
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

		// else{
		// 	console.log({success:false})
		// 	return {success:false}
		// }
	})

	return fetchAllTransaction;
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
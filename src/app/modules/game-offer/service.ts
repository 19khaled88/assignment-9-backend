import { GameOffer, Prisma, PrismaClient } from "@prisma/client";
import ApiError from "../../../errors/apiError";
import { IGameOfferesponse, ISingleGameOfferesponse, game_offer_search_fields_constant, game_offers_serarch_fields_constant } from "./interfaces";
import { IPaginationOptions } from "../../../shared/paginationType";
import { IFilters } from "../../../shared/filterType";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../shared/paginationResponse";
const prisma = new PrismaClient()



const createGameOfferService = async (data: GameOffer): Promise<ISingleGameOfferesponse | null> => {
	const result = await prisma.$transaction(async transactionClient => {
		const isValid = await transactionClient.turf.findFirst({
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
		})
		if (!isValid) {
			throw new ApiError(400, 'No field to the given turf registered yet!')
		}
		const isExist = await transactionClient.gameOffer.findFirst({
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
		})
		if (isExist) {
			throw new ApiError(400, 'A field with this code already created')
		}
		const result = await transactionClient.gameOffer.create({
			data: data,

		});
		const newGameOffer = await transactionClient.gameOffer.findFirst({
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
		})
		return newGameOffer
	})
	return result;
};


const getAllGameOffers = async (paginatinOptions: IPaginationOptions, filterOptions: IFilters): Promise<IGenericResponse<any>> => {


	const response = await prisma.$transaction(async transactionClient => {

		const { searchTerm, ...filterData }: { [key: string]: any } = filterOptions
		const { limit, page, skip } = paginationHelper.calculatePagination(paginatinOptions)

		let andConditions = []
		
		if (searchTerm) {
			andConditions.push({
				OR: game_offers_serarch_fields_constant.map(field => {
					const fieldName = Object.keys(field)[0] as keyof typeof field; // Type assertion
					const fieldValue = field[fieldName];
					console.log(fieldName,fieldValue)
					const condition = {
						
						[fieldName]: {
							[fieldValue as string]: {
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
									equals: (filterData as any)[key],
								}
							},
						};
					} else if (key === 'location') {
						return {
							turf: {
								[key]: {
									equals: (filterData as any)[key],
								}
							}
						};
					} else {
						return {};
					}
				}),
			})
		}

		// const whereCondition: Prisma.GameOfferWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}
		const whereCondition: Prisma.GameOfferWhereInput = andConditions.length > 0 ? { OR: andConditions } : {};
		const result = await transactionClient.gameOffer.findMany({
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
		const total = await prisma.gameOffer.count()
		return {
			meta: {
				limit,
				page,
				total
			},
			data: result
		}
	})
	return response;
};

const getSingleGameOffer = async (id: string): Promise<ISingleGameOfferesponse | null> => {
	const isExist = await prisma.gameOffer.findFirstOrThrow({
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
};

const deleteGameOffer = async (id: string): Promise<GameOffer | null> => {
	const isDeleted = await prisma.gameOffer.delete({
		where: {
			id: id,
		},
	});
	return isDeleted;
};

const updateGameOffer = async (
	id: string,
	payload: Partial<GameOffer>
): Promise<GameOffer> => {
	const isUpdated = await prisma.gameOffer.update({
		where: {
			id: id,
		},
		data: payload,
	});
	return isUpdated;
};

export const GameOfferService = {
	createGameOfferService,
	getAllGameOffers,
	getSingleGameOffer,
	deleteGameOffer,
	updateGameOffer
}
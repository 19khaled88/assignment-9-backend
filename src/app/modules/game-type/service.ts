import { GameType, Prisma, PrismaClient } from "@prisma/client";
import ApiError from "../../../errors/apiError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IFilters } from "../../../shared/filterType";
import { IGenericResponse } from "../../../shared/paginationResponse";
import { IPaginationOptions } from "../../../shared/paginationType";
import { IGameTypeResponse, game_type_search_fields_constant } from "./interfaces";
const prisma = new PrismaClient()


const field = 'numberOfPalyers' as string

const createGameTypeService = async (data: GameType): Promise<IGameTypeResponse | null> => {
	const result = await prisma.$transaction(async transactionClient => {
		const isExist = await transactionClient.gameType.findFirst({
			where: {
				name: data.name
			}
		})
		if (isExist) {
			throw new ApiError(400, 'A Game type with this name already created')
		}
		const result = await transactionClient.gameType.create({
			data: data,

		});
		const newGame = await transactionClient.gameType.findFirst({
			where: {
				id: result.id
			},
			select: {
				name: true,
				imgurl:true,
				numberOfPalyers: true
			}
		})
		return newGame
	})
	return result;
};

const getAllGameType = async (paginatinOptions:IPaginationOptions,filterOptions:IFilters): Promise<IGenericResponse<IGameTypeResponse[]>> => {
	const { searchTerm, ...filterData }: { [key: string]: any }  = filterOptions
	const { limit, page, skip } = paginationHelper.calculatePagination(paginatinOptions)


	// if(Object.keys(filterData)[0] === 'numberOfPalyers' && typeof Object.values(filterData)[0] === 'string'){
		
	//     //  filterData['numberOfPalyers'] =	
	// 	//  Number(Object.values(filterData)[0])
	// 	type T =  keyof typeof filterData
	// 	Number(filterData[field as keyof typeof filterData])
	// 	console.log(Number(filterData[field as keyof typeof filterData]), T)
	// }

	let andConditions = []

	//searching code
	if (searchTerm) {
		andConditions.push({
			OR: game_type_search_fields_constant.map(field => {
				return {
					[field]: {
						contains: searchTerm,
						mode: 'insensitive'
					},
				}
			}),
		})
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
					equals: key === 'numberOfPalyers' ? parseInt((filterData as any)[key]) : (filterData as any)[key],
				}
			}))
		})
	}



	const whereCondition: Prisma.GameTypeWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

	const result = await prisma.gameType.findMany({
		where:whereCondition,
		skip,
		take:limit,
		orderBy:paginatinOptions.sortBy && paginatinOptions.sortOrder ? {
			[paginatinOptions.sortBy]:paginatinOptions.sortOrder
		}:{createAt:'asc'},
		select: {
			id: true,
			name: true,
			imgurl:true,
			numberOfPalyers: true,
			bookings:true,
			GameOffers:true
		},

	});
	const total = await prisma.gameType.count()

	return {
		meta:{
			page,
			limit,
			total
		},
		data:result
	}
};

const getSingleGameType = async (id: string): Promise<IGameTypeResponse | null> => {
	const isExist = await prisma.gameType.findFirst({
		where: {
			id: id,
		},
		select: {
			id: true,
			name: true,
			imgurl:true,
			numberOfPalyers: true,
			bookings:true,
			GameOffers:{
				select:{
					field:{
						select:{
							code:true
						}
					},
					gameType:{
						select:{
							name:true
						}
					},
					turf:{
						select:{
							name:true
						}
					},
					price_per_hour:true
				}
			}
		}
	});
	return isExist;
};

const deleteGameType = async (id: string): Promise<GameType | null> => {
	const isDeleted = await prisma.gameType.delete({
		where: {
			id: id,
		},
	});
	return isDeleted;
};

const updateGameType = async (
	id: string,
	payload: Partial<GameType>
): Promise<GameType> => {
	const isUpdated = await prisma.gameType.update({
		where: {
			id: id,
		},
		data: payload,
	});
	return isUpdated;
};

export const GameTypeService = {
	createGameTypeService,
	getAllGameType,
	getSingleGameType,
	deleteGameType,
	updateGameType

}
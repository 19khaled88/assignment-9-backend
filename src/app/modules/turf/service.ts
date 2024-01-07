import { Prisma, PrismaClient, Turf } from "@prisma/client";
import ApiError from "../../../errors/apiError";
import { IPaginationOptions } from "../../../shared/paginationType";
import { ITurfResponse, turf_search_fields_constant } from "./interfaces";

import { paginationHelper } from "../../../helpers/paginationHelper";
import { IFilters } from "../../../shared/filterType";
import { IGenericResponse } from "../../../shared/paginationResponse";
const prisma = new PrismaClient()


const createTurfService = async (data: Turf): Promise<ITurfResponse | null> => {


	const result = await prisma.$transaction(async transactionClient => {
		const isExist = await transactionClient.turf.findFirst({
			where: {
				name: data.name
			}
		})
		if (isExist) {
			throw new ApiError(400, 'A turf with this name already created')
		}
		const result = await transactionClient.turf.create({
			data: data,

		});
		const newUser = await transactionClient.turf.findFirst({
			where: {
				id: result.id
			},
			select: {
				name: true,
				owner: true,
				imgurl:true,
				location: true
			}
		})
		return newUser
	})
	return result;
};

const getAllTurfs = async (paginatinOptions:IPaginationOptions,filterOptions:IFilters): Promise<IGenericResponse<ITurfResponse[]>> => {

	
	const {searchTerm, ...filterData} = filterOptions
	const {limit,page,skip} = paginationHelper.calculatePagination(paginatinOptions)
    
	let andConditions = []

	//searching code
	if (searchTerm) {
		andConditions.push({
			OR: turf_search_fields_constant.map(field => {
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
	if (Object.keys(filterData).length > 0) {
		andConditions.push({
			AND: Object.keys(filterData).map((key) => ({
				[key]: {
					equals: (filterData as any)[key]
				}
			}))
		})
	}

	const whereCondition: Prisma.TurfWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

	const result = await prisma.turf.findMany({
		where:whereCondition,
		skip,
		take:limit,
		orderBy:paginatinOptions.sortBy && paginatinOptions.sortOrder ? {
			[paginatinOptions.sortBy]:paginatinOptions.sortOrder
		}:{createAt:'asc'},
		select: {
			id: true,
			name: true,
			location: true,
			owner: true,
			imgurl:true,
			gameOffers:true,
			fields:true,
			bookings:true
		},

	});
	const total = await prisma.turf.count()
	return {
		meta:{
			limit,
			page,
			total
		},
		data:result
	}
};


const getSingleTurf = async (id: string): Promise<ITurfResponse | null> => {
	const isExist = await prisma.turf.findFirst({
		where: {
			id: id,
		},
		select: {
			id: true,
			name: true,
			location: true,
			owner: true,
			imgurl:true,
			gameOffers:{
				select:{
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
					field:{
						select:{
							code:true
						}
					}
				}
			},
			fields:true,
			bookings:true,
			
		}
	});
	return isExist;
};

const deleteTurf = async (id: string): Promise<Turf | null> => {
	const isDeleted = await prisma.turf.delete({
		where: {
			id: id,
		},
	});
	return isDeleted;
};

const updateTurf = async (
	id: string,
	payload: Partial<Turf>
): Promise<Turf> => {
	const isUpdated = await prisma.turf.update({
		where: {
			id: id,
		},
		data: payload,
	});
	return isUpdated;
};

export const TurfService = {
	createTurfService,
	getAllTurfs,
	getSingleTurf,
	deleteTurf,
	updateTurf

}
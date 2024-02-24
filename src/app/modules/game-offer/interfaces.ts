type IBooking = {
	start_time: string,
	end_time: string,
	gameOfferId: string,
	userId: string,
	turfId: string,
	fieldId: string,
}
type IField = {
	code: string,
	size: string
}
type IGameType = {
	name: string,
	numberOfPalyers: number
}

type ITurf = {
	name: string,
	location: string,
	owner: string
}

export type ISingleGameOfferesponse = {
	id?:string,
	price_per_hour: number,
	turfId: string,
	turf?:ITurf,
	gameTypeId: string,
	gameType?: IGameType,
	fieldId: string,
	field?: IField,
	// bookings?: IBooking[]
}
export type IGameOfferesponse = {
	id:string,
	price_per_hour: number,
	turfId: string,
	turf:ITurf,
	gameTypeId: string,
	gameType: IGameType,
	fieldId: string,
	field: IField,
	bookings: IBooking[]
}


// export type IGameOfferesponse = {
// 	id?:string,
// 	price_per_hour: number,
// 	turfId: string,
// 	turf?:ITurf,
// 	gameTypeId: string,
// 	gameType?: IGameType,
// 	fieldId: string,
// 	field?: IField,
// 	// bookings?: IBooking[]
// }


export const game_offer_search_fields_constant = ['name','location']



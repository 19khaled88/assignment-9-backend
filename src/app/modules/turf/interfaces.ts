type gameOffer = {
	turfId: string,
	gameTypeId: string,
	fieldId: string
}
type fields = {
	code: string,
	size: string,
	turfId: string
}
type bookings ={
	start_time:string,
	end_time:string,
	gameOfferId:string,
	userId:string,
	turfId:string,
	fieldId:string,
	gameTypeId:string
}

export type ITurfResponse = {
	name: string,
	owner: string,
	location: string,
	imgurl:string,
	gameOffers?: gameOffer[] | any,
	fields?: fields[],
	bookings?:bookings[]
}

export const turf_search_fields_constant = ['name','location','owner']




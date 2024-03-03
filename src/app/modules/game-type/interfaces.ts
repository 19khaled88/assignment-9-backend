
type gameOffer = {
	turfId: string,
	gameTypeId: string,
	fieldId:string
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

export type IGameTypeResponse = {
	name: string,
	numberOfPalyers: number,
	imgurl:string,
	GameOffers?:gameOffer[] | any,
	bookings?:bookings[]
}



export const game_type_search_fields_constant = ['name']

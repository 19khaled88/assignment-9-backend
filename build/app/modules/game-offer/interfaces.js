"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.game_offers_serarch_fields_constant = exports.game_offer_search_fields_constant = void 0;
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
exports.game_offer_search_fields_constant = ['game', 'location'];
exports.game_offers_serarch_fields_constant = [
    { gameType: 'name' },
    { turf: 'location' }
];

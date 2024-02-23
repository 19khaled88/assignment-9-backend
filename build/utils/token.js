"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_KEY = "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlCT1FJQkFBSkFZOHRTUEZXMTk3bWgwcitCWUdLVTA4OFRPcDkrT2FObVNWQ1lMMTFhb05ZeEY1TSs1d0NSCnNDTnAxVEdHNW5zb215NW9QRitLajFsOGhjbmtUSUU2SndJREFRQUJBa0FVN2dLc1ZzbVlVQjJKWnRMS2xVSmoKZmUycGdPUG5VTWJXSDRvYmZQZlIvWGNteTdONkQyVXVQcnJ0MkdQVUpnNVJ4SG5NbVFpaDJkNHUwY3pqRDhpcApBaUVBcDFNaUtvY1BEWDJDU0lGN3c5SzVGWHlqMjIzQXJQcVJoUzNtL1dkVzVlVUNJUUNZcmxyeXRJOFkvODIzCkQ1ZTFHVExnbDlTcXN1UWdvaGF4ZCtKaXludGZHd0lnQ2xlK0xlakpTbWt1cTNLdGhzNDR1SlpLdnA2TElXWWYKcHA3T3YyMHExdTBDSVFDSy9lYWpuZ1hLLzB3NXcwTWJSUVpRK1VkTDRqRFZHRm5LVTFYUEUzOStVd0lnSEdLWgpjcDd2K3VyeG5kU05GK25MVEpZRG9abkMrKytteXRMaCtSUmU4dVU9Ci0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0t";
const signJwt = (payload, options = {}) => {
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_KEY, Object.assign({}, (options && options)));
};
exports.signJwt = signJwt;
// process.env.ACCESS_TOKEN_KEY
// export const verifyJwt = <T>(token: string): JwtPayload  => {
// 	try {
// 		const isVerified = jwt.verify(token, ACCESS_TOKEN_KEY) as JwtPayload;
// 		console.log(token)
// 		return isVerified
// 	} catch (error) {
// 		throw new Error('Invalid token found')
// 	}
// };
const verifyJwt = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_KEY);
        return payload;
    }
    catch (error) {
        throw new Error("Invalid token found");
    }
};
exports.verifyJwt = verifyJwt;

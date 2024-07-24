"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const { DISCORD_TOKEN, DISCORD_CID } = process.env;
if (!DISCORD_TOKEN || !DISCORD_CID) {
    throw new Error('Missing environment variables');
}
exports.config = {
    DISCORD_TOKEN,
    DISCORD_CID,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_interactions_1 = require("discord-interactions");
const raw_body_1 = tslib_1.__importDefault(require("raw-body"));
const config_1 = require("./config");
const TEST_COMMAND = {
    name: "Test",
    description: "Run a test command",
};
const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${config_1.config.DISCORD_CID}&scope=applications.commands`;
module.exports = async (request, response) => {
    if (request.method === "POST") {
        const signature = request.headers["x-signature-ed25519"];
        const timestamp = request.headers["x-signature-timestamp"];
        const rawBody = await (0, raw_body_1.default)(request);
        const isValidRequest = (0, discord_interactions_1.verifyKey)(rawBody, signature, timestamp, config_1.config.DISCORD_TOKEN);
        if (!isValidRequest) {
            console.error("Invalid Request");
            return response.status(401).send({ error: "Bad request signature " });
        }
        const message = request.body;
        if (message.type === discord_interactions_1.InteractionType.PING) {
            console.log("Handling Ping request");
            response.send({
                type: discord_interactions_1.InteractionResponseType.PONG,
            });
        }
        else if (message.type === discord_interactions_1.InteractionType.APPLICATION_COMMAND) {
            switch (message.data.name.toLowerCase()) {
                case TEST_COMMAND.name.toLowerCase():
                    response.status(200).send({
                        type: 4,
                        data: {
                            content: INVITE_URL,
                            flags: 64,
                        },
                    });
                    console.log("Test command request!");
                    break;
                default:
                    console.error("Unknown Command");
                    response.status(400).send({ error: "Unknown Type" });
                    break;
            }
        }
        else {
            console.error("Unknown Type");
            response.status(400).send({ error: "Unknown Type" });
        }
    }
};

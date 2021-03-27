import { connect, Document, model, Schema } from "mongoose";
import { economyMember } from "./commands/economy/economy";

export async function connectDB(uri: string) {
    try {
        await connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log("Connected to DB");
    } catch (err) {
        console.error("Failed to connect to MongoDB: ", err.message);
    }
}

const guildSchema = new Schema({
    _id: String,
    roles: { type: Array, default: [] },
    economy: { type: Array, default: [] },
});

export const guild = model("guild", guildSchema);

export type guild = Document & {
    _id: string;
    roles: Array<savedRole>;
    economy: Array<economyMember>;
};

export type savedRole = {
    user: string;
    roles: string[];
    timestamp: number;
};

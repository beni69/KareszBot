import { connect, Document, model, Schema } from "mongoose";

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

export const guild = model(
    "guild",
    new Schema({
        _id: String,
        roles: { type: Array, default: [] },
    })
);

export type guild = Document & {
    _id: string;
    roles: Array<savedRole>;
};
export type savedRole = {
    user: string;
    roles: string[];
};

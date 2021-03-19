import { connect, connection, model, Schema } from "mongoose";

export function connectDB(uri: string) {
    try {
        connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log("Connected to DB");
    } catch (err) {
        console.error("Failed to connect to MongoDB: ", err.message);
    } finally {
        connection.close();
    }
}

export const user = model(
    "user",
    new Schema({
        _id: String,
        roles: { type: Array, default: [] },
    })
);

export type user = {
    _id: string;
    roles: Array<string>;
};

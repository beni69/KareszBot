import { Command } from "@beni69/cmd";
import yargs from "yargs-parser";

export const command = new Command(
    {
        names: "status",
        description: "change the bots status",
        adminOnly: true,
        noSlash: true,
        argvAliases: { type: ["t"], url: ["u"] },
    },
    ({ trigger, client, args }) => {
        const argv = yargs(args);

        const name = argv.get("_yargs")._.join(" ");
        const type = argv.get("type");
        const url = argv.get("url");
        const status = argv.get("status") || "online";

        client.user?.setPresence({ status, activities: [{ name, type, url }] });
    }
);

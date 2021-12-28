import { Command } from "@beni69/cmd";
import { PresenceStatusData } from "discord.js";

export const command = new Command(
    {
        names: "status",
        description: "change the bots status",
        react: "👌",
        adminOnly: true,
        noSlash: true,
        options: [
            {
                name: "name",
                description: "",
                type: "STRING",
                required: true,
            },
            {
                name: "type",
                description: "",
                type: "STRING",
                required: false,
            },
            {
                name: "url",
                description: "",
                type: "STRING",
                required: false,
            },
            {
                name: "status",
                description: "",
                type: "STRING",
                required: false,
            },
        ],
        yargs: true,
        argvAliases: { name: ["_"], type: ["t"], url: ["u"], status: ["s"] },
    },
    ({ client, argv }) => {
        const name = argv.getString("name") ?? undefined,
            type = (argv.getString("type")?.toUpperCase() as any) ?? undefined,
            url = argv.getString("url") ?? undefined,
            status =
                (argv.getString("status") as PresenceStatusData) || "online";

        client.user?.setPresence({ status, activities: [{ name, type, url }] });

        return true;
    }
);

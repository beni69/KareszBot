import { Command } from "@beni69/cmd";

export const command = new Command(
    {
        names: "status",
        description: "change the bots status",
        adminOnly: true,
        noSlash: true,
        argvAliases: { type: ["t"], url: ["u"] },
    },
    ({ trigger, client, argv }) => {
        if (trigger.isSlash()) return false;
        const name = argv.get("_yargs")._.join(" ");
        const type = argv.get("type");
        const url = argv.get("url");
        const status = argv.get("status") || "online";

        client.user?.setPresence({ status, activities: [{ name, type, url }] });
    }
);

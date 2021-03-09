import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: "status", adminOnly: true },
    ({ message, client, argv }) => {
        const name = argv._.join(" ");
        const t: any = argv.t || argv.type;

        client.user?.setPresence({
            activity: { name, type: t ? t.toUpperCase() : undefined },
        });
    }
);

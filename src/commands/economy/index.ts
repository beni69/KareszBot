import { Client, Guild, GuildResolvable } from "discord.js";
import { guild as guildModel } from "../../Mongoose";

export class Economy {
    readonly guild: Guild;

    constructor(client: Client, guild: GuildResolvable) {
        const g = client.guilds.resolve(guild);
        if (!g) throw new Error("invalid guild");
        this.guild = g;

        this.dbInit().then();
    }

    public async fetch() {
        return (await guildModel.findById(this.guild.id)) as guildModel | null;
    }

    private async dbInit() {
        let g = await this.fetch();
        const economy: economyDB = { currency: "₭", users: [] };

        if (!g) {
            g = new guildModel({ _id: this.guild.id, economy }) as guildModel;
            await g.save();
        } else if (!g.economy) {
            await g.updateOne({ economy });
        }
    }

    public async getBalance(user: string) {
        const g = await this.fetch();
        if (!g) return g;
        const b = g.economy.users.find(e => e.user == user);
        if (!b) return null;

        return { ...b, currency: g.economy.currency } || null;
    }

    public async setBalance(user: string, amount: number) {
        let g = (await this.fetch()) as guildModel;
        let i = g.economy.users.findIndex(e => e.user == user) as number;
        let e = g.economy.users[i];

        if (!e) {
            e = { user, balance: 0 };
            i = g.economy.users.push(e) - 1;
        }

        e.balance = amount;

        g.economy.users[i] = e;

        await g?.updateOne({ economy: g.economy });
    }

    public async give(user: string, amount: number) {
        let bal = await this.getBalance(user);
        if (!bal) bal = { user, balance: 0, currency: "" };

        await this.setBalance(user, bal.balance + amount);
    }
}
export default Economy;

export type economyDB = {
    users: {
        user: string;
        balance: number;
    }[];
    currency: string;
};

import Discord from "discord.js";
import { join as pathJoin, dirname as pathDirname } from "path";
import readdirp from "readdirp";
import yargs from "yargs";
import * as reaction from "./reaction";

class Handler {
    client: Discord.Client;
    prefix: string;
    commands: Discord.Collection<string, Command>;
    commandsDir: string;
    listening: boolean;
    admins: Set<Discord.Snowflake>;
    testServers: Set<Discord.Snowflake>;
    triggers: Discord.Collection<string, Discord.EmojiIdentifierResolvable>;

    v: boolean; // verbose mode

    constructor({
        client,
        prefix,
        commandsDir,
        verbose = false,
        admins = [],
        testServers = [],
        triggers = [],
    }: {
        client: Discord.Client;
        prefix: string;
        commandsDir: string;
        verbose?: boolean;
        admins?: Array<Discord.Snowflake>;
        testServers?: Array<Discord.Snowflake>;
        triggers?: Array<Array<string>>;
    }) {
        this.client = client;
        this.prefix = prefix;
        this.commandsDir = pathJoin(pathDirname(process.argv[1]), commandsDir);
        this.v = verbose;
        this.admins = new Set(admins);
        this.testServers = new Set(testServers);
        this.triggers = new Discord.Collection();
        triggers.forEach(item => this.triggers.set(item[0], item[1]));

        this.listening = false;
        this.commands = new Discord.Collection();

        if (this.v) console.log("Command handler launching in verbose mode");

        // load the commands
        this.loadCommands(this.commandsDir);
    }

    async loadCommands(dir: string, nuke: boolean = false) {
        if (nuke) this.commands.clear();

        if (this.v) console.log(`Loading commands from: ${dir}`);
        let i = 0;
        for await (const entry of readdirp(dir, {
            fileFilter: ["*.js", "*.ts"],
        })) {
            delete entry.dirent; // dont need

            if (this.v) console.log(`Loading command: ${entry.basename}`);

            // import the actual file
            const command: Command = (await import(entry.fullPath)).command;

            // error checking
            if (command === undefined)
                throw new Error(
                    `Couldn't import command from ${entry.path}. Make sure you are exporting a command variable that is a new Command`
                );
            if (this.getCommand(command.opts.names) !== undefined)
                throw new Error(
                    `Command name ${command.opts.names[0]} is being used twice!`
                );
            if (command.opts.adminOnly && this.admins.size == 0)
                throw new Error(
                    `Command ${entry.path} is set to admin only, but no admins were defined.`
                );

            // add the command to the collection
            this.commands.set(command.opts.names[0], command);

            i++;
        }

        // if (this.v)
        console.log(`Finished loading ${i} commands.`);

        // start listening to messages
        this.listen();
    }

    private listen() {
        if (this.listening) return;
        this.listening = true;

        this.client.on("message", message => {
            //* reaction triggers
            for (const item of this.triggers.keyArray()) {
                if (message.content.toLowerCase().includes(item)) {
                    const emoji = this.triggers.get(
                        item
                    ) as Discord.EmojiIdentifierResolvable;
                    reaction.React(message, emoji);
                }
            }

            //* executing actual command
            if (!message.content.startsWith(this.prefix)) return;

            const args = message.content
                .slice(this.prefix.length)
                .trim()
                .split(/\s+/);

            // removes first item of args and that is the command name
            const commandName = args.shift()!.toLowerCase();

            const command = this.getCommand(commandName);

            /* i dont do annoying discord error messages whenever someone
            says something that starts with the prefix,
            but isnt actually a command and the bot says some bs */
            if (!command) return;

            if (command.opts.adminOnly && !this.admins.has(message.author.id))
                return message.channel.send("You can't run this command!");

            if (command.opts.test && !this.admins.has(message.guild!.id))
                return console.log(
                    `${message.author.tag} used ${command.opts.names[0]}`
                );

            // running the actual command
            command.run({
                client: this.client,
                message,
                args,
                argv: yargs(args).argv,
                prefix: this.prefix,
                handler: this,
            });
        });
    }

    // find a command from any of its names
    getCommand(name: string | string[]): Command | undefined {
        if (typeof name === "string")
            return (
                this.commands.get(name) ||
                this.commands.find(c => c.opts.names.includes(name))
            );

        let found: Command | undefined = undefined;
        name.forEach(item => {
            const res = this.getCommand(item);
            if (res !== undefined) found = res;
        });
        return found;
    }
}

class Command {
    opts: { names: string[]; adminOnly?: boolean; test?: boolean };
    run: (params: {
        client: Discord.Client;
        message: Discord.Message;
        args: string[];
        argv: yargs.Arguments;
        prefix: string;
        handler: Handler;
    }) => void;

    constructor(
        opts: { names: string[] | string; adminOnly?: boolean; test?: boolean },
        run: (params: {
            client: Discord.Client;
            message: Discord.Message;
            args: string[];
            argv: yargs.Arguments;
            prefix: string;
            handler: Handler;
        }) => void
    ) {
        this.run = run;

        // if name is string convert it to "[name]"
        if (typeof opts.names === "string")
            this.opts = { ...opts, names: [opts.names] };
        else this.opts = { ...opts, names: opts.names as string[] };
    }
}

export { Handler, Command };

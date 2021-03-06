import Discord from "discord.js";
import { join as pathJoin, dirname as pathDirname } from "path";
import readdirp from "readdirp";

class Handler {
    client: Discord.Client;
    prefix: string;
    commands: Discord.Collection<string, Command>;
    commandsDir: string;
    listening: boolean;
    admins: Array<Discord.Snowflake>;

    v: boolean; // verbose mode

    constructor({
        client,
        prefix,
        commandsDir,
        verbose = false,
        admins = [],
    }: {
        client: Discord.Client;
        prefix: string;
        commandsDir: string;
        verbose?: boolean;
        admins?: Array<Discord.Snowflake>;
    }) {
        this.client = client;
        this.prefix = prefix;
        this.commands = new Discord.Collection();
        this.v = verbose;
        this.admins = admins;
        this.commandsDir = pathJoin(pathDirname(process.argv[1]), commandsDir);
        this.listening = false;

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
            if (command.opts.adminOnly && this.admins.length == 0)
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
            // ignore messages that arent commands
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

            if (
                command.opts.adminOnly &&
                !this.admins.includes(message.author.id)
            )
                return message.channel.send("You can't run this command!");

            // running the actual command
            command.run({
                client: this.client,
                message,
                args,
                argv: null,
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
    //? have i mentioned that i hate repeating myself?
    opts: { names: string[]; adminOnly?: boolean };
    run: (params: {
        client: Discord.Client;
        message: Discord.Message;
        args: string[];
        argv: any; // TODO: pass in yargs
        prefix: string;
        handler: Handler;
    }) => void;

    constructor(
        opts: { names: string[] | string; adminOnly?: boolean },
        run: (params: {
            client: Discord.Client;
            message: Discord.Message;
            args: string[];
            argv: any; // TODO: pass in yargs
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

import {
  Client, IntentsBitField, Partials, REST, Routes, Collection
} from 'discord.js';
import * as fs from 'fs';
import { config } from 'dotenv';
config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages
  ],
  partials: [
    Partials.Channel
  ]
});

client.rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

client.buttons = new Collection();
client.commands = new Collection();
client.commandsArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith(".js"));
  for (const file of functionFiles) {
    const {default: defaultExport} = await import(`./functions/${folder}/${file}`);
    defaultExport(client);
  }
}

async function registerCommands() {
  try {
    console.log('Started refreshing application (/) commands.');
    await client.rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_ID), { body: client.commandsArray });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

await client.handleEvents();
await client.handleComponents();
await client.handleCommands()
//registerCommands()

client.login(process.env.DISCORD_BOT_TOKEN);
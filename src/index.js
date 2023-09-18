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

client.commands = new Collection();
client.commandsArray = [];
client.buttons = [];

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
//await client.handleComponents();
await client.handleCommands()
//registerCommands()

/*const test = await fetch('https://opentdb.com/api.php?category=25&type=multiple&amount=20');
console.log(test);
const json = await test.json();
console.log(json);*/

client.login(process.env.DISCORD_BOT_TOKEN);
let msgStr = "";
let users = ["Joe", "Ted"];
for(let i = users.length-2; i >= 0; i--) {
  msgStr = users[i] + ", " + msgStr;
}
if(users.length == 2) msgStr = msgStr.substring(0, msgStr.length-2) + " "
if(users.length > 1) {
  msgStr +="and ";
}
msgStr += users[users.length-1] + ".";

// with Bob.
// with Jane and Bob.
// with Billy, Jane, and Bob.
// with Joe, Billy, Jane, and Bob.
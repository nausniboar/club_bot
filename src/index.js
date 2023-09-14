import {
  Client, IntentsBitField, Partials, REST, Routes, Collection,
  ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder,
  TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle
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

client.commands = new Collection();
client.commandsArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith(".cjs"));
  for (const file of functionFiles) {
    //require(`./functions/${folder}/${file}`)(client);
    const func = await import(`./functions/${folder}/${file}`);
  }
}


client.handleEvents();
//client.handleCommands();
client.login(process.env.DISCORD_BOT_TOKEN);
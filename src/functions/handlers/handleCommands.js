import * as fs from 'fs';

export default (client) => {
  client.handleCommands = async() => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
      //const { commands, commandsArray } = client;
      for (const file of commandFiles) {
        // importing commands as objects
        const {default: command} = await import(`../../commands/${folder}/${file}`);
        // adding the command type to the command's data, as the field "type"
        command.type = folder;
        // adding the command's name and the command itself, including the function, into our command collection
        client.commands.set(command.data.name, command);
        // adding the command's JSON structure to our command array for when we refresh all of our commands
        client.commandsArray.push(command.data.toJSON());
      }
    }
  }
}
 
    
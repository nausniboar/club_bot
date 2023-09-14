import * as fs from 'fs';

module.exports = (client) => {
  client.handleCommands = async() => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        // importing commands as objects
        require(`../../commands/${folder}/${file}`);
        // adding the command's name and the command itself, including the function, into our command collection
        commands.set(command.data.name, command);
        // adding the command's JSON structure to our command array for when we refresh all of our commands
        commandArray.push(command.data.toJSON());
      }
    }
  }
}
 
    
export default {
  name: 'interactionCreate',
  once: false,
  /**
   * @param {Client} client 
   */
  async execute (interaction, client) {
    switch(interaction.type) {
      // Interaction type 1: Ping
      case 1:
        console.log("interaction is ping");
        break;
      
      // Interaction type 2: Application command
      case 2:
        console.log("interaction is application command");
        switch(interaction.commandType) {
          // Command type 1: Most common, chat input (/) commands
          case 1:
            let command = client.commands.get(interaction.commandName);
            if(command == undefined) {
              await interaction.reply({content: "Error, could not find command."})
              console.log("User submitted an unknown command.")
            } else {
              try {
                await command.execute(interaction, client);
              } catch(error) {
                console.log("Error!");
                console.log(error);
              }
            }
            break;

          // Command type 2: Right-click -> user command
          case 2:
            console.log("command is user command");
            break;
          
          // Command type 3: Right click -> message command
          case 3:
            console.log("command is right-click message command");
            break;
        }
        break;
      
      // Interaction type 3: Message component, like buttons, text inputs, etc
      case 3:
        console.log("interaction is message component");
        break;
      
      // Interaction type 4: Application command autocomplete?
      case 4:
        console.log("interaction is application command autocomplete");
        break;
      
      // Interaction type 5: Modal submit, aka a form that pops up on screen
      case 5:
        console.log("interaction is modal submit");
        break;
      
      // There are currently no interactions 6-onwards, so this should never happen
      default:
        console.log("error, command is not one of known 1-5 types")
        break;
    }
  }
}
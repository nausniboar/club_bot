import * as fs from 'fs';

export default (client) => {
  client.handleComponents = async() => {
    const componentFolders = fs.readdirSync("./src/components");
    for(const folder of componentFolders) {
      const componentFiles = fs.readdirSync(`./src/components/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { buttons } = client;

      switch(folder) {
        case "buttons":
          for(const file of componentFiles) {
            const {default: button} = await import(`../../components/${folder}`);
            buttons.set(button.data.name, button);
          }
          break;
        
        default:
          break;
        
      }
    }
  }
}
 
    
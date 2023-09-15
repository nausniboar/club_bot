import * as fs from 'fs';

export default (client) => {
  client.handleEvents = async() => {
    const eventFolders = fs.readdirSync("./src/events");
    for (const folder of eventFolders) {
      const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith(".js"));
      // how we handle our event js files depends on their folder aka function, client will be different than others
      switch(folder) {
        case "client":
          // loop over all event files found in client directory
          for(const file of eventFiles) {
            // import event file
            const {default: event} = await import(`../../events/${folder}/${file}`)
            // if event is a "once" event, give it to our client with the "once" function; otherwise is an "on" event
            // also on/once need callback functions to do once event happens, so we pass in our event.execute that we've written
            if(event.once)
              client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));
          }
          break;
        
        default:
          break;
      }
    }
  }
}
 
    
export default {
  name: 'messageCreate',
  once: true,
  async execute (msg) {
    msg.channel.send("No.");
  }
}
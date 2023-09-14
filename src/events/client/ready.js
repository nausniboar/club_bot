module.exports = {
  name: 'ready',
  once: true,
  async execute (client) {
    console.log(`Ready, ${client.user.name} has logged in successfully.`)
  }
}
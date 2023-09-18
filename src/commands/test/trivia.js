import { SlashCommandBuilder, ComponentType, Component,
  ChatInputCommandInteraction, User, TextChannel} from "discord.js";

const categories = [
  "General Knowledge",
  "Entertainment: Books",
  "Entertainment: Film",
  "Entertainment: Music",
  "Entertainment: Musicals & Theatres",
  "Entertainment: Television",
  "Entertainment: Video Games",
  "Entertainment: Board Games",
  "Science & Nature",
  "Science: Computers",
  "Science: Mathematics",
  "Mythology",
  "Sports",
  "Geography",
  "History",
  "Politics",
  "Art",
  "Celebrities",
  "Animals"
]

function categoriesOption(option) {
  option
    .setName('category')
    .setDescription('optional question category selection')
  for(let i = 0; i < categories.length; i++) {
    option.addChoices({
      name: categories[i],
      value: `${i+9}`
    })
  }
  return option;
}

let data = new SlashCommandBuilder()
.setName('trivia')
.setDescription('Play a little game of trivia. Optional category specifiers and optional users to play with.')
.addIntegerOption((option) => option 
  .setName('number')
  .setDescription('number of questions, max is 50')
  .setMaxValue(50)
  .setRequired(true)
)
.addStringOption(categoriesOption)
.addStringOption((option) => option
  .setName('difficulty')
  .setDescription('optional difficulty selection')
  .setChoices(
    {name: 'Easy', value: 'easy'},
    {name: 'Medium', value: 'medium'},
    {name: 'Hard', value: 'hard'}
  )
)
.addStringOption((option) => option
  .setName('type')
  .setDescription('optional question type selection')
  .setChoices(
    {name: 'MultipleChoice', value: 'multiple'},
    {name: 'TrueFalse', value: 'boolean'},
  )
)/*
.addUserOption((option) => option
  .setName('user1')
  .setDescription('optional user 1')
)
.addUserOption((option) => option
  .setName('user2')
  .setDescription('optional user 2')
)
.addUserOption((option) => option
  .setName('user3')
  .setDescription('optional user 3')
)*/

const numExtraUsers = 3;
for(let i = 1; i <= numExtraUsers; i++) {
  data.addUserOption((option) => option 
    .setName(`user${i}`)
    .setDescription(`optional user ${i}`)
  )
}

export default {
  data,
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client 
   */
  async execute (interaction, client) {
    // Calling the data from the api
    const amt = '?amount=' + interaction.options.getInteger('number');
    
    let cat = interaction.options.getString('category');
    cat = cat === null ? '' : '&category='+cat

    let difficulty = interaction.options.getString('difficulty');
    difficulty = difficulty === null ? '' : '&difficulty='+difficulty

    let type = interaction.options.getString('type');
    type = type === null ? '' : '&type='+type
    
    const data = await fetch('https://opentdb.com/api.php' + amt + cat + difficulty + type);
    console.log('https://opentdb.com/api.php' + amt + cat + difficulty + type)
    let parsedData = '';
    try {
      parsedData = await data.json();
    } catch(err) {
      console.log("json conversion error on trivia data");
      console.log(err);
      interaction.reply({content: "Error in converting trivia data to json, try again later :("})
    }
    // Continuing with the game if the data is good
    if(parsedData["response_code"] != 0) {
      console.log("couldn't fetch trivia data");
      interaction.reply({content: "Couldn't fetch trivia data, try again later :("})
    } else {
      // Collecting all non-duplicate users mentioned in options
      let users = [];
      for(let i = 1; i <= numExtraUsers; i++) {
        const user = interaction.options.getUser(`user${i}`)
        if(user !== null && user.id !== interaction.user.id) {
          users.push(user);
        }
      }
      // Annoying 1st-year CS fenceposting problem just to get that sweet oxford comma
      let msgStr = "";
      if(users.length > 0) {
        for(let i = users.length-2; i >= 0; i--) {
          msgStr = users[i].globalName + ", " + msgStr;
        }
        if(users.length == 2) msgStr = msgStr.substring(0, msgStr.length-2) + " "
        if(users.length > 1) {
          msgStr +="and ";
        }
        msgStr = " with " + msgStr + users[users.length-1].globalName;
      }
      await interaction.reply({content: `${interaction.user.globalName} started a trivia game${msgStr}.`})
      users.push(interaction.user);
      this.triviaGame(interaction.channel, users, parsedData["results"]);      
    }
  },
  /**
   * @param {TextChannel} channel
   * @param {Array.<User>} users 
   * @param {Array} results
   */
  triviaGame(channel, users, results) {
    const filter = (msg) => {
      for(const user of users) {
        if(msg.author.id === user.id) return true;
      }
      return false;
    }
    const limit = results.length
    console.log(limit);
    const collector = channel.createMessageCollector({filter, max: limit});
    console.log(collector);
    collector.on('collect', (message) => {
      channel.send(results[0]['question'])
      results.shift();
    })
    collector.on('end', (collected) => {
      console.log("Ended");
    })
  }
}

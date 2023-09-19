import { SlashCommandBuilder, ComponentType, Component, EmbedBuilder,
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
)
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
    let parsedData = '';
    try {
      parsedData = await data.json();
    } catch(err) {
      console.log("json conversion error on trivia data");
      console.log(err);
      interaction.reply({content: "Error in converting trivia data to json, try again later :("})
    }
    // Have to validate the received data; stopping the game if data is bad; response code is only 0 when good
    if(parsedData["response_code"] != 0) {
      console.log("couldn't fetch trivia data");
      interaction.reply({content: "Couldn't fetch trivia data, try again later :("})
    // If response code is 0, data is intact, then proceed with game
    } else {
      console.log(parsedData);
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
      // We excluded the user beforehand to list the other participants, but now that we have a list of valid
      // users which also doesn't contain any instnaces of the command-invoking user, we can just add that 
      // user to the list and pass it to our trivia game, where the user list is used to facilitate
      // each trivia round instead of just printing
      users.push(interaction.user);
      this.sendTriviaEmbed(interaction.channel, parsedData['results'][0])
      this.triviaGame(interaction.channel, users, parsedData['results']);      
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
    let scores = new Map(users.map((user) => ([user.id, 0])));
    console.log(scores);
    console.log(scores.get('100285329709203456'));
    scores.set('100285329709203456', scores.get('100285329709203456') + 1)
    console.log(scores);
    console.log(scores.get('100285329709203456'));
    let answered = new Map(users.map((user) => ([user.id, false])));
    let attempts = results[0]['incorrect_answers'].length + 1
    const collector = channel.createMessageCollector({filter, max: limit});

    collector.on('collect', (message) => {
      console.log(message.author);
      if(!answered.get(message.author.id)) {
        answered.set(message.author.id, true);
        const triviaEntry = results[0];
        let str = '';
        let reset = true;
        
        if(message.content.toLowerCase() != triviaEntry['correct_answer'].toLowerCase()) {
          if(attempts > 0) {
            str = "Incorrect guess."
            attempts--;
            reset = false;
          } else {
            str = `Nobody got it right, correct answer was ${triviaEntry['correct_answer']}. `
          }
        } else {
          str = `**${message.author.globalName}** is correct!`
          scores.set(message.author.id, scores.get(message.author.id)+1);
          scores.sort();
          console.log(scores);
        }
        channel.send(str);
        if(reset) {
          results.shift();
          attempts = triviaEntry['incorrect_answers'].length + 1
          for(const userid in answered) {
            answered.set(userid, false);
          }
          if(results.length > 0) {
            this.sendTriviaEmbed(channel, triviaEntry)
          } else {
            channel.send("No more questions");
          }
        }
      }
    })
    collector.on('end', (collected) => {
      console.log("Ended trivia game");
    })
  },

  sendTriviaEmbed(channel, triviaEntry) {
    console.log(triviaEntry['incorrect_answers'])
    let answers = [...triviaEntry['incorrect_answers'], triviaEntry['correct_answer']]
    answers = answers
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)

    let strAnswers = "• " + answers[0];
    for(let i = 1; i < answers.length; i++) {
      strAnswers += "\n• " + answers[i]
    }
    
    const embed = new EmbedBuilder()
      .setTitle(triviaEntry['question'])
      .setColor(0x8B44FF)
      .setThumbnail('https://im4.ezgif.com/tmp/ezgif-4-7806bb74c0.png')
      .addFields([
        { 
          name: 'Possible answers:',
          value: strAnswers
        },
        { 
          name: 'Difficulty level:',
          value: triviaEntry['difficulty']
        },
        { 
          name: 'Category:',
          value: triviaEntry['category']
        }
      ])
    channel.send({embeds: [embed]});
  }
}

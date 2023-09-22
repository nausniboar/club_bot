import { SlashCommandBuilder, ComponentType, Component, EmbedBuilder,
  ChatInputCommandInteraction, User, TextChannel, AttachmentBuilder} from "discord.js";
import chalk from "chalk";

const categories = [
  "🧠 General Knowledge",
  "📚 Entertainment: Books",
  "🎬 Entertainment: Film",
  "🎶 Entertainment: Music",
  "🎭 Entertainment: Musicals & Theatres",
  "📺 Entertainment: Television",
  "🎮 Entertainment: Video Games",
  "🎲 Entertainment: Board Games",
  "🧬 Science & Nature",
  "💻 Science: Computers",
  "➗ Science: Mathematics",
  "🏛️ Mythology",
  "🏅 Sports",
  "🌎 Geography",
  "📜 History",
  "⚖️ Politics",
  "🎨 Art",
  "🕶️ Celebrities",
  "🐎 Animals"
]

function categoriesOption(option) {
  option
    .setName('category')
    .setDescription('optional question category selection')
  for(let i = 0; i < categories.length; i++) {
    option.addChoices({
      name: categories[i]/*.substring(1)*/,
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
  .setDescription('number of questions, min is 1, max is 50')
  .setMinValue(1)
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

function listUserString(users) {
  let msgStr = "";
  for(let i = users.length-2; i >= 0; i--) {
    msgStr = `**${users[i].globalName}**, ${msgStr}`;
  }
  if(users.length == 2) msgStr = msgStr.substring(0, msgStr.length-2) + " "
  if(users.length > 1) {
    msgStr +="and ";
  }
  msgStr += `**${users[users.length-1].globalName}**`;
  return msgStr;
}

export default {
  data,
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client 
   */
  async execute (interaction, client) {
    let dataStr = 'https://opentdb.com/api.php?amount=' + interaction.options.getInteger('number');
    
    let users = [];
    for(let i = 1; i <= numExtraUsers; i++) {
      const user = interaction.options.getUser(`user${i}`)
      if(user !== null && user.id !== interaction.user.id) {
        users.push(user);
      }
    }

    let msgStr = `**📣🗯️${
      interaction.user.globalName
    }** started a **${
      interaction.options.getInteger('number')
    }-question** trivia game${
      users.length > 0 ? ' with ' : ''}${listUserString(users)}
    }.\n`;

    console.log(chalk.bgYellow("data string"));
    console.log(dataStr);

    let cat = interaction.options.getString('category');
    if(cat !== null) {
      dataStr += '&category='+cat
      console.log(chalk.bgYellow("Category"));
      console.log(cat)
      console.log(categories[cat]);
      msgStr += `🗂️\`Category:\` \`${categories[cat-9]}, \``
    }
    
    console.log(chalk.bgYellow("data string"));
    console.log(dataStr);

    let difficulty = interaction.options.getString('difficulty');
    if(difficulty !== null) {
      dataStr += '&difficulty='+difficulty
      msgStr += `♨️\`Difficulty:\` \`${difficulty.charAt(0).toUpperCase() + difficulty.substring(1)}, \``
    }
    
    console.log(chalk.bgYellow("data string"));
    console.log(dataStr);

    let type = interaction.options.getString('type');
    if(type !== null) {
      dataStr += '&type='+type
      msgStr += '📝`Type:` '
      if(type == 'boolean') {
        msgStr += '`True/False,` '
      } else {
        msgStr += '`Multiple Choice,` '
      }
    }

    console.log(chalk.bgYellow("msgStr"));
    console.log(`"${msgStr}"`);

    msgStr = msgStr.slice(0, -3);
    msgStr += '`';

    console.log(chalk.bgYellow("msgStr"));
    console.log(`"${msgStr}"`);

    console.log(chalk.bgYellow("data string"));
    console.log(dataStr);
    
    // Calling the data from the api
    data = await fetch(dataStr);
    let parsedData = '';
    try {
      parsedData = await data.json();
    } catch(err) {
      console.log(chalk.bgRed("json conversion error on trivia data"));
      console.log(chalk.red(err));
      interaction.reply({content: "Error in converting trivia data to json, try again later :("})
    }
    // Have to validate the received data; stopping the game if data is bad; response code is only 0 when good
    switch(parsedData["response_code"]) {
      case 4:
        interaction.reply({content: "Couldn't fetch trivia data, not enough results for query :("})
        console.log(chalk.red("response code 4, session token returned all possible questions"));
        break;
      case 3:
        interaction.reply({content: "Couldn't fetch trivia data, token not working :("})
        console.log(chalk.red("response code 3, session token does not exist"));
        break;
      case 2:
        interaction.reply({content: "Couldn't fetch trivia data, internal error:("})
        console.log(chalk.red("response code 2, invalid paremeter"));
        break;
      case 1:
        interaction.reply({content: "Couldn't fetch trivia data, not enough results for query :("})
        break;
      case 0:
        // If response code is 0, data is intact, then proceed with game
        await interaction.reply({
          content: msgStr
        })
        console.log(chalk.bgGreen("Data parsed correctly"))
        console.log(parsedData);
        // Collecting all non-duplicate users mentioned in options
        // Annoying 1st-year CS fenceposting problem just to get that sweet oxford comma
        /*let msgStr = "";
        if(users.length > 0) {
          for(let i = users.length-2; i >= 0; i--) {
            msgStr = users[i].globalName + ", " + msgStr;
          }
          if(users.length == 2) msgStr = msgStr.substring(0, msgStr.length-2) + " "
          if(users.length > 1) {
            msgStr +="and ";
          }
          msgStr = " with " + msgStr + users[users.length-1].globalName;
        }*/
        // We excluded the user beforehand to list the other participants, but now that we have a list of valid
        // users which also doesn't contain any instnaces of the command-invoking user, we can just add that 
        // user to the list and pass it to our trivia game, where the user list is used to facilitate
        // each trivia round instead of just printing
        users.push(interaction.user);
        this.sendTriviaEmbed(interaction.channel, parsedData['results'][0])
        this.triviaGame(interaction.user, interaction.channel, users, parsedData['results']);
        break;
    }
  },
  /**
   * @param {TextChannel} channel
   * @param {Array.<User>} users 
   * @param {Array} results
   */
  triviaGame(cmdAuthor, channel, users, results) {
    const filter = (msg) => {
      for(const user of users) {
        if(msg.author.id === user.id) return true;
      }
      return false;
    }
    const limit = results.length
    let scores = new Map(users.map((user) => ([user.id, 0])));
    let answered = new Map(users.map((user) => ([user.id, false])));
    let attempts = users.length;
    const collector = channel.createMessageCollector({filter, time: 60000});

    collector.on('collect', (message) => {
      if(message.content.toLowerCase() === 'stop' && message.author.id === cmdAuthor.id) {
        channel.send("Stopping");
        collector.stop();
        answered.set(message.author.id, true);
      }
      collector.resetTimer()
      //console.log(message.author);
      console.log(answered.get(message.author.id));
      if(!answered.get(message.author.id)) {
        answered.set(message.author.id, true);
        console.log("Setting author id to true")
        const triviaEntry = results[0];
        let str = '';
        let reset = true;
        
        if(message.content.toLowerCase() != triviaEntry['correct_answer'].toLowerCase()) {
          console.log("wrong answer");
          if(attempts > 1) {
            console.log("attempts left");
            str = "Incorrect guess."
            attempts--;
            reset = false;
          } else {
            console.log("no attempts left");
            if(users.length > 1) {
              console.log("multi-party game");
              str = `Nobody got it right, correct answer was ${triviaEntry['correct_answer']}. `
            } else {
              console.log("single-party game");
              str = `Incorrect guess, correct answer was ${triviaEntry['correct_answer']}. `
            }
          }
        } else {
          console.log("right answer");
          str = `**${message.author.globalName}** is correct!`
          scores.set(message.author.id, scores.get(message.author.id)+1);
        }
        channel.send(str);
        if(reset) {
          console.log("resetting");
          results.shift();
          attempts = users.length;
          /*for(const userid of answered.keys()) {
            answered.set(userid, false);
          }*/
          answered.forEach((value, key) => {
            answered.set(key, false)
          })
          if(results.length > 0) {
            this.sendTriviaEmbed(channel, results[0], scores, users)
          } else {
            //channel.send("All questions have been answered.");
            collector.stop();
          }
        }
      }
      /*setTimeout(() => {
        channel.send("15 seconds left for anyone to answer.")
      }, 15000)*/
    })
    collector.on('end', (collected) => {
      let finalMsg = '';
      if(results.length > 0) finalMsg = 'Timer ran out. '
      let scorePrint = [...scores.entries()]
      scorePrint.sort((a, b) => b[1] - a[1])
      const winners = users.filter(user => scores.get(user.id) == scorePrint[0][1])
      finalMsg += "Trivia game ended. " + listUserString(winners) + " won, ";
      if(winners.length > 1) {
        finalMsg += "tied at "
      } else {
        finalMsg += "with "
      }
      const plural = scorePrint[0][1] == 1 ? '' : 's';
      channel.send(`${finalMsg}**${scorePrint[0][1]}** point${plural}.`);
    })
  },

  sendTriviaEmbed(channel, triviaEntry, scores, users) {
    console.log(chalk.bgYellow("incorrect answers"))
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
    
    const picture = new AttachmentBuilder('./resources/questionmark.png')
    const embeds = [new EmbedBuilder()
      .setTitle(triviaEntry['question'])
      .setColor(0x8B44FF)
      .setThumbnail('attachment://questionmark.png')
      .addFields([
        { 
          name: 'Possible answers:',
          value: strAnswers,
          inline: true
        },
        { 
          name: 'Category:',
          value: triviaEntry['category'],
          inline: true
        },
        { 
          name: 'Difficulty level:',
          value: triviaEntry['difficulty'],
          inline: true
        }
      ])
    ]
    if(scores !== undefined) {
      /*scores.set('100285329709201111', 0)
      scores.set('100285329709202222', 14)
      scores.set('100285329709203333', 2)
      users.push({globalName: "binky", id: '100285329709201111'})
      users.push({globalName: "bob", id: '100285329709202222'})
      users.push({globalName: "junior", id: '100285329709203333'})*/
      let scorePrint = [...scores.entries()]
      scorePrint.sort((a, b) => b[1] - a[1])
      scorePrint = scorePrint.map(([id, score]) => (
        {name: users.find((e) => e.id == id).globalName, value: `${score}`, inline: true}
      ))
      embeds.push(new EmbedBuilder()
        .setTitle('Scores:')
        .addFields(scorePrint)
      )
    }
    channel.send({embeds: embeds, files: [picture]});
  }
}

import { Injectable } from '@nestjs/common';
import TeleBot = require('telebot');
import { AppService } from '../app.service';
const axios = require('axios');
const { NlpManager } = require('node-nlp');

@Injectable()
export class TelegramService {

    private static manager = new NlpManager({ languages: ['en'] });
    public constructor() {
        console.log('A new TelegramService is born');
    }

    public static async startTheTelegramBot() {
        await TelegramService.initializeAndStartTelegramBot();

        await TelegramService.trainOurNLPSkills();
    }

    private static async trainOurNLPSkills() {
        // Adds the utterances and intents for the NLP
        TelegramService.manager.addDocument('en', 'goodbye for now', 'greetings.bye');
        TelegramService.manager.addDocument('en', 'bye bye take care', 'greetings.bye');
        TelegramService.manager.addDocument('en', 'okay see you later', 'greetings.bye');
        TelegramService.manager.addDocument('en', 'bye for now', 'greetings.bye');
        TelegramService.manager.addDocument('en', 'i must go', 'greetings.bye');
        TelegramService.manager.addDocument('en', 'hello', 'greetings.hello');
        TelegramService.manager.addDocument('en', 'hi', 'greetings.hello');
        TelegramService.manager.addDocument('en', 'howdy', 'greetings.hello');

        // Train also the NLG
        TelegramService.manager.addAnswer('en', 'greetings.bye', 'Till next time');
        TelegramService.manager.addAnswer('en', 'greetings.bye', 'see you soon!');
        TelegramService.manager.addAnswer('en', 'greetings.hello', 'Hey there!');
        TelegramService.manager.addAnswer('en', 'greetings.hello', 'Greetings!');

        (async () => {
            await TelegramService.manager.train();
            TelegramService.manager.save();
        })();
    }

    private static async findAnAppropriateAnswer(input: string) {
        const nlpResultFromExternalLibrary = await TelegramService.manager.process('en', input);
        if (nlpResultFromExternalLibrary.answers[0] === undefined) {
            return 'I do not know what to say.';
        }
        return nlpResultFromExternalLibrary.answers[0].answer;
    }

    private static async initializeAndStartTelegramBot() {

        const bot = new TeleBot({ token: AppService.configurationFile.botToken });

        bot.on('text', async (msg) => {
            // await msg.reply.text(`selber ${msg.text}`);
            // await msg.reply.text(await this.findAnAppropriateAnswer(msg.text));

            // await msg.reply.text(`Die ISS ist gerade an der folgenden Position:`);

            // const result =
                // await axios.get('https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=1436029892,1436029902&units=miles');

            // const latitude = result.data[0].latitude;
            // const longitude = result.data[0].longitude;

            // await msg.reply.text(`Latitude: ${latitude}`);
            // await msg.reply.text(`Longitude: ${longitude}`);

            const ourAppropriateAnswer: string = await TelegramService.findAnAppropriateAnswer(msg.text);
            await msg.reply.text(ourAppropriateAnswer);
        });

        bot.start();
    }
}

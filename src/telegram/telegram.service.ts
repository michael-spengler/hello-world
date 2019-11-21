import { Injectable } from '@nestjs/common';
import TeleBot = require('telebot');
import * as fs from 'fs-sync';
const axios = require('axios');
const { NlpManager } = require('node-nlp');

@Injectable()
export class TelegramService {

    private manager = new NlpManager({ languages: ['en'] });
    public constructor() {

        this.initializeAndStartTelegramBot();

        this.trainOurNLPSkills();
    }

    private trainOurNLPSkills() {
        // Adds the utterances and intents for the NLP
        this.manager.addDocument('en', 'goodbye for now', 'greetings.bye');
        this.manager.addDocument('en', 'bye bye take care', 'greetings.bye');
        this.manager.addDocument('en', 'okay see you later', 'greetings.bye');
        this.manager.addDocument('en', 'bye for now', 'greetings.bye');
        this.manager.addDocument('en', 'i must go', 'greetings.bye');
        this.manager.addDocument('en', 'hello', 'greetings.hello');
        this.manager.addDocument('en', 'hi', 'greetings.hello');
        this.manager.addDocument('en', 'howdy', 'greetings.hello');

        // Train also the NLG
        this.manager.addAnswer('en', 'greetings.bye', 'Till next time');
        this.manager.addAnswer('en', 'greetings.bye', 'see you soon!');
        this.manager.addAnswer('en', 'greetings.hello', 'Hey there!');
        this.manager.addAnswer('en', 'greetings.hello', 'Greetings!');

        (async () => {
            await this.manager.train();
            this.manager.save();
            const response = await this.manager.process('en', 'I should go now');
        })();
    }

    private async findAnAppropriateAnswer(input: string) {
        const nlpResultFromExternalLibrary = await this.manager.process('en', input);
        return nlpResultFromExternalLibrary.answers[0].answer;
    }

    private initializeAndStartTelegramBot() {
        const filePath = `${__dirname}/../../.env`;

        const fileContent = fs.read(filePath);

        const token = fileContent.split('=')[1];
        const bot = new TeleBot({ token });

        bot.on('text', async (msg) => {
            // await msg.reply.text(`selber ${msg.text}`);
            // await msg.reply.text(await this.findAnAppropriateAnswer(msg.text));

            // await msg.reply.text(`Die ISS ist gerade an der folgenden Position:`);

            // const result = await axios.get('https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=1436029892,1436029902&units=miles');

            // const latitude = result.data[0].latitude;
            // const longitude = result.data[0].longitude;

            // await msg.reply.text(`Latitude: ${latitude}`);
            // await msg.reply.text(`Longitude: ${longitude}`);

            const ourAppropriateAnswer: string = await this.findAnAppropriateAnswer(msg.text);
            await msg.reply.text(ourAppropriateAnswer);
        });

        bot.start();
    }
}

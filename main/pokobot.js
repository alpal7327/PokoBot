
 
// A Cisco Spark bot that retrieves messages sent in a group and translates it to the requested language.

var SparkBot = require("node-sparkbot");
var bot = new SparkBot();
//bot.interpreter.prefix = "#"; // Remove comment to overlad default / prefix to identify bot commands

var SparkAPIWrapper = require("node-sparkclient");
if (!process.env.SPARK_TOKEN) {
    console.log("Could not start as this bot requires a Cisco Spark API access token.");
    console.log("Please add env variable SPARK_TOKEN on the command line");
    console.log("Example: ");
    console.log("> SPARK_TOKEN=XXXXXXXXXXXX DEBUG=sparkbot* node helloworld.js");
    process.exit(1);
}
var spark = new SparkAPIWrapper(process.env.SPARK_TOKEN);

// Various bot commands users can call

// Help command shows the syntax for typing in the chat if users want to translate something
bot.onCommand("help", function (command) {
    spark.createMessage(command.message.roomId, "Hi, I'm Poko-Translator. \n\nType in /translate <<source language>> <<target language>> <<message>> to be a boko.", { "markdown":true }, function(err, message) {
        if (err) {
            console.log("ERROR: You're already a boko. Cannot post message to a poko chatroom: " + command.message.roomId);
            return;
        }
    });
});

// Fallback command is called when the user inputs an unsupported command.
bot.onCommand("fallback", function (command) {
    spark.createMessage(command.message.roomId, "Sorry kid, don't be a poko. We don't support this poko-feature.\n\nType /help to see REAL Poko-Translator syntax.", { "markdown":true }, function(err, response) {
        if (err) {
            console.log("ERROR: You're already a boko,. Cannot post message to a poko chatroom: " + command.message.roomId);
            return;
        }
    });
});

// Translate command takes in a phrase, source language, and target language, translates the phrase, and posts it to the chatroom.
bot.onCommand("translate", function (command) {
    var text = command.message.text; // Original text
    
    // Target language to translate to
    const target_lang = text.slice(11, 14);
    
    // Phrase we want to translate
    const phrase = text.slice(14, text.length);
    var key = "trnsl.1.1.20171008T150106Z.f502184428102f87.bfc11cf7ab8adb365deb06d39745a33c40fcbaee";
    
    var translate = require('yandex-translate')(key);

    var translated_phrase = "-1";
    translate.translate(phrase, { to: target_lang }, function(err, res) {
        translated_phrase = res.text; {
        if (err) {
            console.log("IDK");
            return;
        }}
    });
    
    spark.createMessage(command.message.roomId, translated_phrase, { "markdown":true }, function(err, message) {
        if (err) {
            console.log("WARNING: EXTREME POKO ALERT IN ROOM: " + command.message.roomId);
            return;
        }
    });
});


};


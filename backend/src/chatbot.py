import os
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

chatbot = ChatBot('Ron Obvious')
trainer = ChatterBotCorpusTrainer(chatbot)

if not os.path.exists('db.sqlite3'):
    trainer.train("chatterbot.corpus.english")


def get_response(msg):
    return chatbot.get_response(msg).text
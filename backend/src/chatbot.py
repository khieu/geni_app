import os


def init(engine):
    if engine == 'chatterbot':
        from chatterbot import ChatBot
        from chatterbot.trainers import ChatterBotCorpusTrainer
        chatbot = ChatBot('Ron Obvious')

        if not os.path.exists('db.sqlite3'):
            trainer = ChatterBotCorpusTrainer(chatbot)
            trainer.train("chatterbot.corpus.english")
        return lambda msg: chatbot.get_response(msg).text
    elif engine == 'chatbotrnn':
        from chatbotrnn.chatbot import get_response
        return get_response
    else: raise ValueError
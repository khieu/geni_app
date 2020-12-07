import socket  
import select  
import sys  
from chatbot import get_response
from _thread import *


server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  

server.bind(("127.0.0.1", 5001))  
server.listen(100)  
  
list_of_clients = []  
  

def clientthread(conn, addr):    
    while True:  
        try:  
            message = conn.recv(2048)  
            if message:
                message_to_send = get_response(message.decode())
                conn.send(message_to_send.encode())  
            else:  
                remove(conn)  
        except Exception as e:  
            print(e)
            continue


def remove(client):
    if client in list_of_clients:  
        list_of_clients.remove(client)


while True:  
    conn, addr = server.accept()
    list_of_clients.append(conn)
    
    print (addr[0] + " connected") 
    start_new_thread(clientthread,(conn,addr))    

conn.close()
server.close()
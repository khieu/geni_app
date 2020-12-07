import socket  
import select  
import sys  
  
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  
server.connect(('127.0.0.1', 5001))  
  
while True:
    message = input('> ')
    server.send(message.encode())
    message = server.recv(2048)
    print(message)
            
server.close()  
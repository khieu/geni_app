import socket  
import select  
import sys  
  
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  
server.connect(('0.0.0.0', 5000))  
  
while True:
    message = input('> ')
    server.send(message.encode())
    message = server.recv(2048)
    print(message)
            
server.close()
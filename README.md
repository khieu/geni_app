# GENI Chatbot

[Demo Video](https://drive.google.com/file/d/1isVHkhvJBVskuMp2WMrtBcYyTsyhU0-F/view?usp=sharing) - [Rspec](./Rspec.xml)

## Install

Installation scripts are located at `deploy/`. For installing chatbot-rnn (seq2seq chatbot), run `./install` in `backend/chatbotrnn/` (we have not tried to deploy it on GENI server, can run locally)

## Run

### Local

After installing all the required libraries, run the following commands to start servers on two separate terminals.

```
cd backend
python3 src/api.py --port 5000 --engine [chatterbot/chatbotrnn]

cd backend
python3 src/sock.py --port 5001 --engine [chatterbot/chatbotrnn]
```

Run the web app demo:

```
npm start
```

A React-based frontend will be launched at `http://127.0.0.1:3000`

### GENI instances

To allow client to access the servers, we need to change the host to `0.0.0.0`.

```
cd backend
python3 src/api.py --host 0.0.0.0 --port 5000 --engine chatterbot

cd backend
python3 src/sock.py --host 0.0.0.0 --port 5001 --engine chatterbot
```

## Reproducing Experiments

Two scripts `measure_tcp.js` and `measure_socket.js` in `experiments/` can be run similarly for measuring round-time trip (RTT) of two protocols. For example, the following command compute RTT by sending 10 messages of size 1000B every 3 seconds. The result is appended to `outputs_rest.txt` for further analysis.

```
node experiments/measure_socket.js --msg_size 1000 --delay 3000 --host server --port 5001 --num_trials 10
```

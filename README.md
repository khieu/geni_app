# Install

## Server

## Client

# Run

## REST API Server

## WebSocket Server

```
cd backend
python3 src/api.py --host 127.0.0.1 --port 5000 --engine chatterbot
```

# Reproducing Experiments

## REST API

```
node experiments/measure_tcp.js --num_trials 10 --msg_size 100
```

## WebSocket
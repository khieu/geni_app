const crypto = require('crypto');
const io = require('socket.io-client');
const { program } = require('commander');
const { resolveSoa } = require('dns');
const fs = require('fs');

program
  .option('--host <type>', 'host name', '127.0.0.1')
  .option('--port <number>', 'port number', 5001)
  .option('--num_trials <number>', 'number of trials', 10)
  .option('--msg_size <number>', 'size of messages', 10)
  .option('--delay <number>', 'delay in ms', 3000);
program.parse(process.argv);

let SOCKET_ENDPOINT = `ws://${program.host}:${program.port}`;

console.log('before', SOCKET_ENDPOINT);
socket = io.connect(SOCKET_ENDPOINT);

let num_trial = parseInt(program.num_trials);
let msg_size = parseInt(program.msg_size);

rtts = []
promisses = []
time_sent_to_idx = {}
num_received = 0

socket.on("connected", message => {
    console.log(`WebSocket connection established`)
    for (let i = 0; i < num_trial; i++) {
        promisses.push(new Promise((resolve) => send_req(i, resolve)));
    }
    Promise.all(promisses).then(() => {});
})

socket.on('response', (res) => {
    // console.log(`Message received in ${(Date.now() - res.sent_time) / 1000}s: "${res.text}"`)
    const rtt = Date.now() - res.sent_time;
    rtts.push(rtt)
    num_received++;
    console.log(`Response for message sent at ${res.sent_time} received in ${rtt}`)
    if (rtts.length == num_trial) {
        let sum = rtts.reduce((a,b)=> a+b,0);
        console.log('average RTT ', sum / rtts.length, 'ms');
        fs.appendFileSync('outputs_sock.txt', `${num_trial},${msg_size},${sum / num_trial}\n`);
        process.exit()
    }
})

const send_req = (i, resolve) => {
    time_sent = Date.now()
    setTimeout(() => {
        let message = crypto.randomBytes(msg_size).toString('hex');
        socket.emit("message", { text: message, time: time_sent });
        console.log(`Message ${i + 1} sent`)
    }, program.delay * i);
}
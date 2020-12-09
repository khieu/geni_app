var crypto = require('crypto');
const io = require('socket.io-client');

let SOCKET_ENDPOINT = 'ws://127.0.0.1:5001';

console.log('before', SOCKET_ENDPOINT);
socket = io.connect(SOCKET_ENDPOINT);
let num_trial = parseInt(process.argv[2]);
let msg_size = parseInt(process.argv[3]);
let delay = 100;

rtts = []

socket.on("connected", message => {
    console.log(`WebSocket connection established`)
    })
socket.on('response', (res) => {
    console.log(`Message received in ${(Date.now() - res.sent_time) / 1000}s: "${res.text}"`)
    rtts.push(Date.now() - res.sent_time)
})

const send_req = (i) => {
    let message = crypto.randomBytes(msg_size).toString('hex');
    socket.emit("message", { text: message, time: Date.now() });
}
async function experiment() {
    var i
    for(i = 0; i < num_trial; i++) {
        send_req(i);
        await new Promise(r => setTimeout(r, delay));        
    }
    await new Promise(r => setTimeout(r, 3000));
    console.log('average rrt of ', rtts.length, ' trials = ', rtts.reduce((a,b)=> a+b,0)/rtts.length, 'ms');
    socket.disconnect();
}

experiment()
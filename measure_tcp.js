var axios = require('axios');
var crypto = require('crypto');

// ############################################################
// ## commandline argument: number of trial and message size ##
// ############################################################

let ENDPOINT = `http://127.0.0.1:5000/message`;

let num_trial = parseInt(process.argv[2]);
let msg_size = parseInt(process.argv[3]);
let rtts = [];
let delay = 3000; // delay time (ms) before making the next call

const send_req = (i) => {
    let message = crypto.randomBytes(msg_size).toString('hex');
    const time_start = Date.now();
    axios.post(
        ENDPOINT,
        { text: message, time: time_start }
    ).then(res => {
        let response = res.data.text;
        const time_end = new Date();
        rtts.push(time_end - time_start);
        console.log(rtts);
        if (i % 1 == 0) {
            console.log('i=', i, 'rtts size=', rtts.length);
            console.log('average rtt so far = ', rtts.reduce((a,b)=> a+b,0)/rtts.length);
        }
        if (rtts.length == num_trial) {
            let sum = rtts.reduce((a,b)=> a+b,0);
            console.log('average RTT ', sum/rtts.length, 'ms');
        }
    }).catch((error) => {
        console.log(error)
    })
}
async function experiment() {
    var i
    for(i = 0; i < num_trial; i++) {
        send_req(i);
        await new Promise(r => setTimeout(r, delay));        
    }
}
experiment()
var axios = require('axios');
var crypto = require('crypto');
const { program } = require('commander');

// ############################################################
// ## commandline argument: number of trial and message size ##
// ############################################################

let ENDPOINT = `http://127.0.0.1:5000/message`;

program
  .option('--num_trials <number>', 'output extra debugging', 10)
  .option('--msg_size <number>', 'small pizza size', 10);
program.parse(process.argv);

let num_trial = parseInt(program.num_trials);
let msg_size = parseInt(program.msg_size);
console.log(num_trial, msg_size)
let rtts = [];
let delay = 3000; // delay time (ms) before making the next call

const send_req = (i) => {
    let message = crypto.randomBytes(msg_size).toString('hex');
    const time_start = Date.now();
    console.log(`Request ${i} sent`)
    axios.post(
        ENDPOINT,
        { text: message, time: time_start }
    ).then(res => {
        console.log(`Response for request ${i} received`)
        let response = res.data.text;
        const time_end = new Date();
        rtts.push(time_end - time_start);
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
        // await new Promise(r => setTimeout(r, delay));        
    }
}
experiment()
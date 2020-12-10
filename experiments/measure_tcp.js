var axios = require('axios');
var crypto = require('crypto');
const { program } = require('commander');
const fs = require('fs');

// ############################################################
// ## commandline argument: number of trial and message size ##
// ############################################################

let ENDPOINT = `http://127.0.0.1:5000/message`;

program
  .option('--num_trials <number>', 'number of trials', 10)
  .option('--msg_size <number>', 'size of messages', 10)
  .option('--delay <number>', 'delay in ms', 3000);
program.parse(process.argv);

let num_trial = parseInt(program.num_trials);
let msg_size = parseInt(program.msg_size);
let rtts = [];

const send_req = (i, resolve) => {
    setTimeout(() => {
        let message = crypto.randomBytes(msg_size).toString('hex');
        const time_start = Date.now();
        console.log(`Message ${i + 1} sent`)
        axios.post(
            ENDPOINT,
            { text: message, time: time_start }
        ).then(res => {
            console.log(`Response for message ${i + 1} received`)
            let response = res.data.text;
            const time_end = new Date();
            rtts.push(time_end - time_start);
            resolve()
        }).catch((error) => {
            console.log(error)
        })
    }, program.delay * i);
}

function experiment() {
    promisses = []
    for (let i = 0; i < num_trial; i++) {
        promisses.push(new Promise((resolve) => send_req(i, resolve)));
    }
    Promise.all(promisses).then(() => {
        if (rtts.length == num_trial) {
            let sum = rtts.reduce((a,b)=> a + b,0);
            console.log('average RTT ', sum / rtts.length, 'ms');
            fs.appendFileSync('outputs_rest.txt', `${num_trial},${msg_size},${sum / num_trial}\n`);
        }
    });
}

experiment();
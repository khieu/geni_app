import React from 'react';
import { RadioGroup, Radio, Button, TextField, FormControlLabel, Grid, Box, Paper, Chip } from '@material-ui/core';

import Card from '@material-ui/core/Card';
import axios from 'axios';
import io from 'socket.io-client';

import './App.css';

let USER_MESSAGE = 1;
let CHATBOT_MESSAGE = 0;
let ENDPOINT = `http://127.0.0.1:5000/message`;
let SOCKET_ENDPOINT = '127.0.0.1:5001'

const REST_API_TAG = "REST"
const WEBSOCKET_TAG = "SOCK"

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      messages: [[CHATBOT_MESSAGE, "Hello, I am GENI Bot, a chat bot. I will talk to you to day!"]],
      inputValue: "",
      logs: [],
      protocol: "rest"
    };
  }

  keyPress = (e) => {
    if(e.keyCode == 13) {
       this.handleSendButtonClick();
    }
  }

  handleOnChange = (e) => {
    this.setState({
      inputValue: e.target.value
    });
  }

  displayText(texts){
    let items = texts.map((item, index) => 
    <li key={index}>
      <Card className={item[0] == USER_MESSAGE ? 'User-text Message-box' : 'Bot-text Message-box'}>{item[1]} </Card>
    </li>)
    return (
      <ul>{items}</ul>
    )
  }

  handleSendButtonClick = () => {
    let updatedInputs = [...this.state.messages];
    let msg = this.state.inputValue;
    updatedInputs.push([USER_MESSAGE, msg]);
    this.setState({messages: updatedInputs, inputValue: ""});
    if (this.state.protocol == 'rest') {
      this.getResponse_REST_API(msg);
    } else {
      this.getResponse_WebSocket(msg);
    }
  }

  writeLog = (text, tag) => {
    this.setState({
      logs: [
        ...this.state.logs,
        { text, tag }
      ]
    })
  }

  getResponse_REST_API = (message) => {
    this.writeLog("Message sent", REST_API_TAG)
    const time_start = Date.now();
    axios.post(
      ENDPOINT,
      { text: message, time: time_start }
    ).then(res => {
      let response = res.data.text;
      let updatedInputs = [...this.state.messages];
      updatedInputs.push([CHATBOT_MESSAGE, response]);
      this.setState({messages: updatedInputs, inputValue: ""});

      const time_end = new Date()
      this.writeLog(`Response received in ${(time_end - time_start) / 1000}s (${res.data})`, REST_API_TAG)
    }).catch((error) => {
      this.writeLog(`ERROR in receving response`, REST_API_TAG)
    })
  }

  getResponse_WebSocket = (message) => {
    this.writeLog(`Message sent: "${message}"`, WEBSOCKET_TAG);
    this.socket.emit("message", { text: message, time: Date.now() });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleProtocolChange = (e) => {
    this.setState({
      protocol: e.target.value
    })

    if (e.target.value == 'sock') {
      if (this.socket) {
        this.socket.disconnect()
      }
      this.socket = io(SOCKET_ENDPOINT);
      console.log(this.socket)
      this.socket.on("connected", message => {
        this.writeLog(`WebSocket connection established`, WEBSOCKET_TAG)
      })
      this.socket.on('response', (res) => {
        this.writeLog(`Message received in ${(Date.now() - res.sent_time) / 1000}s: "${res.text}"`, WEBSOCKET_TAG)
        let updatedInputs = [...this.state.messages];
        updatedInputs.push([CHATBOT_MESSAGE, res.text]);
        this.setState({messages: updatedInputs, inputValue: ""});
      })
    }

    this.writeLog("Protocol switched to " + (e.target.value == 'rest' ? "REST API" : "WebSocket"), '')
  }

  render() {
    const logItems = this.state.logs.map((log) => {
      const chip = log.tag ? <Chip size="small" label={log.tag} /> : '';
      return (<li class='log-item'>
        {chip}
        {" " + log.text}
      </li>)
    })

    return (
      <div className="App">
        <header className="App-header">
          <label className="App-link" >
            GENI CHATBOT
          </label>
        </header>
        <Grid container>
          <Grid item md={6}>
            <Grid container>
              <Grid item md={12}>
                <Paper className='textBox' variant="outlined">
                  {this.displayText(this.state.messages)}
                  <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                  </div>
                </Paper>
              </Grid>
              <Grid item md={12}>
                <RadioGroup onChange={this.handleProtocolChange}>
                  <FormControlLabel value="rest" control={<Radio checked={this.state.protocol == 'rest'} />} label="Rest API" />
                  <FormControlLabel value="sock" control={<Radio checked={this.state.protocol == 'sock'} />} label="WebSocket" />
                </RadioGroup>
              </Grid>
              <Grid item md={12}>
                <TextField 
                  id="filled-basic"
                  // multiline
                  // rowsMax={2}
                  className="Text-field"
                  label="Type a message..."
                  onKeyDown={this.keyPress}
                  value={this.state.inputValue}
                  onChange={this.handleOnChange}
                  variant='filled'
                />
                <Button variant="contained" color="primary" className="Send-button" onClick={this.handleSendButtonClick}>
                  Send
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6}>
            <ul>{logItems}</ul>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;

import React from 'react';
import { RadioGroup, Radio, Button, TextField, FormControlLabel, Grid, Box, Paper } from '@material-ui/core';

import Card from '@material-ui/core/Card';
import axios from 'axios';
import io from 'socket.io-client';

import './App.css';

let USE_SOCKET = true;
let USER_MESSAGE = 1;
let CHATBOT_MESSAGE = 0;
<<<<<<< Updated upstream
let ENDPOINT = `http://server:5000/message`;
=======
let ENDPOINT = `http://127.0.0.1:5000/message`;
>>>>>>> Stashed changes
let SOCKET_ENDPOINT = '127.0.0.1:5001'

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
    if(e.keyCode == 13){
       let updatedInputs = [...this.state.messages];
       updatedInputs.push([USER_MESSAGE, e.target.value]);
       this.setState({messages: updatedInputs, inputValue: ""});
       this.requestChatBot(e.target.value);
       console.log('user_input: ', e.target.value);
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
      this.getResponse_WebSocket(msg);
    } else {
      this.getResponse_REST_API(msg);
    }
  }

  writeLog = (msg) => {
    this.setState({
      logs: [
        ...this.state.logs,
        msg
      ]
    })
  }

<<<<<<< Updated upstream
  requestChatBot = (message) => {
    
    if (USE_SOCKET == true) { 
      this.socket.emit("message", {'data':message})
=======
  getResponse_REST_API = (message) => {
    this.writeLog("Send POST request")
    axios.post(
      ENDPOINT,
      {"text": message}
    ).then(res => {
      console.log('bot response: ', res.data);
      let response = res.data.text;
      let updatedInputs = [...this.state.messages];
      updatedInputs.push([CHATBOT_MESSAGE, response]);
      this.setState({messages: updatedInputs, inputValue: ""});
      this.writeLog("Response received")
    }).catch(function (error) {
      console.error(error);
    })
  }

  getResponse_WebSocket = (message) => {
    this.socket.emit("message", {'data':message})
>>>>>>> Stashed changes
      this.socket.on('response', (response) => {
        console.log(response);
        let updatedInputs = [...this.state.messages];
        updatedInputs.push([CHATBOT_MESSAGE, response]);
        this.setState({messages: updatedInputs, inputValue: ""});
      })
<<<<<<< Updated upstream
    } else {
      axios.post(
        ENDPOINT,
        {"text": message}
      ).then(res => {
        console.log('bot response: ', res.data);
        let response = res.data.text;
        let updatedInputs = [...this.state.messages];
        updatedInputs.push([CHATBOT_MESSAGE, response]);
        this.setState({messages: updatedInputs, inputValue: ""});
      }).catch(function (error) {
        console.error(error);
      })
    }
    
=======
>>>>>>> Stashed changes
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
<<<<<<< Updated upstream
    if (USE_SOCKET == true) {
      this.socket = io(SOCKET_ENDPOINT);
      this.socket.on("responseMessage", message => {
        console.log("responseMessage", message)
      })
    }
=======
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on("responseMessage", message => {
      this.writeLog("responseMessage: " + message)
    })
>>>>>>> Stashed changes
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleProtocolChange = (e) => {
    this.setState({
      protocol: e.target.value
    })
    this.writeLog("Protocol changed to " + (e.target.value == 'rest' ? "REST API" : "WebSocket"))
  }

  render() {
    const logItems = this.state.logs.map((text) => <li>{text}</li>)

    return (
      <div className="App">
        <header className="App-header">
          <label className="App-link" >
            GENI CHATBOT
          </label>
        </header>
        <Grid container>
          <Grid item md={6} borderRight={1}>
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

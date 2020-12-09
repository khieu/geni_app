import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import axios from 'axios';
import io from 'socket.io-client';

import './App.css';

let USE_SOCKET = true;
let USER_MESSAGE = 1;
let CHATBOT_MESSAGE = 0;
let ENDPOINT = `http://server:5000/message`;
let SOCKET_ENDPOINT = '127.0.0.1:5001'

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      messages: [[CHATBOT_MESSAGE, "Hello, I am GENI Bot, a chat bot. I will talk to you to day!"]],
      inputValue: "",
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
    console.log('user_input: ', msg);
    updatedInputs.push([USER_MESSAGE, msg]);
    this.setState({messages: updatedInputs, inputValue: ""});
    this.requestChatBot(msg);
  }

  requestChatBot = (message) => {
    
    if (USE_SOCKET == true) { 
      this.socket.emit("message", {'data':message})
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
    
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
    if (USE_SOCKET == true) {
      this.socket = io(SOCKET_ENDPOINT);
      this.socket.on("responseMessage", message => {
        console.log("responseMessage", message)
      })
      this.socket.on('response', (response) => {
        console.log(response);
        let updatedInputs = [...this.state.messages];
        updatedInputs.push([CHATBOT_MESSAGE, response]);
        this.setState({messages: updatedInputs, inputValue: ""});
      })
    }
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render(){  
    return (
      <div className="App">
        <header className="App-header">
          <label className="App-link" >
            GENI CHATBOT
          </label>
        </header>
        <div className='textBox'>
          {this.displayText(this.state.messages)}
          <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        <div className='Input-area'>
          <TextField 
            id="filled-basic"
            // multiline
            // rowsMax={2}
            label="Type a message..."
            className="Text-field"
            onKeyDown={this.keyPress}
            value={this.state.inputValue}
            onChange={this.handleOnChange}
            variant='filled'
          />
          <Button variant="contained" color="primary" className="Send-button" onClick={this.handleSendButtonClick}>
            Send
          </Button>
        </div>
      </div>
    );
  }
}

export default App;

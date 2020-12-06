import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import './App.css';



class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      userInputs: [],
      inputValue: "",
      count: 0
    };
    // this.keyPress = this.keyPress.bind(this);
    // this.handleOnChange = this.handleOnChange.bind(this);
    // this.handleSendButtonClick = this.handleSendButtonClick.bind(this);
  }

  keyPress = (e) => {
    if(e.keyCode == 13){
       console.log('value', e.target.value);
       let updatedCount = this.state.count + 1;
       let updatedInputs = [...this.state.userInputs];
       updatedInputs.push([updatedCount % 2, e.target.value]);
       this.setState({userInputs: updatedInputs, inputValue: "", count: updatedCount});
    }
  }

  handleOnChange = (e) => {
    this.setState({
      inputValue: e.target.value
    });
  }

  displayText(texts){
    console.log(texts);
    let items = texts.map((item, index) => 
    <li key={index}>
      <Card className={item[0] == 1 ? 'User-text Message-box' : 'Bot-text Message-box'}>{item[1]} </Card>
    
    </li>)

    return (
      <ul>{items}</ul>
    )
  }

  handleSendButtonClick = () => {
    let updatedCount = this.state.count + 1;
    let updatedInputs = [...this.state.userInputs];
    let msg = this.state.inputValue;
    updatedInputs.push([updatedCount % 2, msg]);
    this.setState({userInputs: updatedInputs, inputValue: "", count: updatedCount});
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

  render(){  
    console.log('inputs: ', this.state.userInputs)
    return (
      <div className="App">
        <header className="App-header">
          <label className="App-link" >
            GENI CHATBOT
          </label>
        </header>
        <div className='textBox'>
          {this.displayText(this.state.userInputs)}
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

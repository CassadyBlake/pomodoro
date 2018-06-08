import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeRemaining: {},
      workTime: 1500
    };

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    let newTimeRem = this.state.workTime;
    this.setState({ timeRemaining: newTimeRem });
  }

  startTimer() {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  };

  countDown() {
    let newTimeRem = this.state.timeRemaining - 1;
    this.setState({ timeRemaining: newTimeRem });

    if (newTimeRem <= 0) {
      clearInterval(this.timer);
    }
  };

  formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds - (minutes * 60));

    if(!timeInSeconds) { return "-:--" }

    minutes = minutes < 10 ? "0" + minutes: minutes;
    seconds = seconds < 10 ? "0" + seconds: seconds;

    return minutes + ":" + seconds;
  };


  render() {
    return (
      <div className="Main">
        <div className="Controller">
          {this.formatTime(this.state.timeRemaining)}
          <br></br>
          <button type="button" className="btn start" onClick={this.startTimer} >Start</button>
        </div>
      </div>
    );
  }
}

export default App;
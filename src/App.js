import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeRemaining: {},
      workTime: 1500,
      breakTime: 300,
      longBreakTime: 1800,
      sessionCount: 0,
      isCounting: false,
      onBreak: false
    };

    this.timer = 0;
    this.startResetTimer = this.startResetTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    let newTimeRem = this.state.workTime;
    this.setState({ timeRemaining: newTimeRem });
  }

  startResetTimer() {
    if (!this.state.isCounting) {
      this.timer = setInterval(this.countDown, 1000);
      this.setState({ isCounting: true })
    }
    else {
      clearInterval(this.timer);
      if (!this.state.onBreak) {
        this.setState({ timeRemaining: this.state.workTime, isCounting: false });
      }
      else {
        this.setState({ timeRemaining: this.state.breakTime, isCounting: false });
      }
    }
  };

  countDown() {
    let newTimeRem = this.state.timeRemaining - 1;
    this.setState({ timeRemaining: newTimeRem });

    if (newTimeRem <= 0) {
      clearInterval(this.timer);
      if (!this.state.onBreak) {
        let newSessionCount = this.state.sessionCount + 1;
        this.setState({ timeRemaining: this.state.breakTime, sessionCount: newSessionCount, isCounting: false, onBreak: true })
        if (newSessionCount >= 4) {
          this.setState({ timeRemaining: this.state.longBreakTime, sessionCount: 0 })
        }
      }
      else {
        this.setState({ timeRemaining: this.state.workTime, isCounting: false, onBreak: false })
      }
    }
  };

  formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds - (minutes * 60));

    if(!timeInSeconds) { return "--:--" }

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
          <button type="button" className="btn start" onClick={this.startResetTimer} >{ this.state.onBreak ? (this.state.isCounting ? "Reset" : "Start Break") : (this.state.isCounting ? "Reset" : "Start Work") }</button>
        </div>
      </div>
    );
  }
}

export default App;

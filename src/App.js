import React, { Component } from 'react';
import * as firebase from 'firebase';
import buzz from 'buzz';
import './App.css';
import './components/Clock.css';
import TaskList from './components/TaskList';


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDD4OSEmEXhUOa2-yP6cXzvdxlXcc0hBT8",
    authDomain: "pomodoro-b89d3.firebaseapp.com",
    databaseURL: "https://pomodoro-b89d3.firebaseio.com",
    projectId: "pomodoro-b89d3",
    storageBucket: "pomodoro-b89d3.appspot.com",
    messagingSenderId: "1074891164678"
  };
  firebase.initializeApp(config);

const comSound = new buzz.sound("/sounds/completed.mp3", {
  preload: true,
});

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
    this.handlePausePlayClick = this.handlePausePlayClick.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    let newTimeRem = this.state.workTime;
    this.setState({ timeRemaining: newTimeRem });
    this.updateClock(newTimeRem);
  }

  handlePausePlayClick() {
    let timeRem = this.state.timeRemaining;
    this.setState({ timeRemaining: timeRem })
    if(this.state.isCounting) {
      clearInterval(this.timer);
      this.setState({ isCounting: false });
    } else {
      this.startResetTimer();
    }
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
      this.updateClock(newTimeRem);

      if (newTimeRem <= 0) {

        comSound.play();

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

  updateClock(time) {
      let minutes = Math.floor(time / 60);
      let angleMinutes = (time / 60) * 6;
      let angleSeconds = ((time - (minutes * 60)) * 60) / 10;

      document.getElementById('js-seconds').style.transform = "translate(-50%, -100%) rotate(" + angleSeconds + "deg)";
      document.getElementById('js-minutes').style.transform = "translate(-50%, -100%) rotate(" + angleMinutes + "deg)";
  }

  formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds - (minutes * 60));

    if(!timeInSeconds) { return "--:--" }

    minutes = minutes < 10 ? "0" + minutes: minutes;
    seconds = seconds < 10 ? "0" + seconds: seconds;

    return minutes + ":" + seconds;
  //  if (seconds % 2 === 0) {
  //    return minutes + ":" + seconds;
  //  }
  //  else {
  //    return minutes + " " + seconds;
  //  }
  };


  render() {
    return (
      <div className="App">
        <div className="Nav">
            < TaskList
              firebase={firebase}
            />
        </div>
        <div className="Main">
          <div className="Controller">
            <div className="Analog">
              <div className="clock">
                <div className="end_marker"></div>
                <button onClick={ this.handlePausePlayClick } className={ this.state.isCounting ? "pp pause" : "pp play" } ></button>
                <div id ="js-minutes" className="clock__tick clock__tick--minutes">
                </div>
                <div id ="js-seconds" className="clock__tick clock__tick--seconds">
                </div>
              </div>
            </div>
            <div className="display">
            {this.formatTime(this.state.timeRemaining)}
            </div>
            <button type="button" className="btn reset" onClick={this.startResetTimer} >{ this.state.isCounting ? "RESET" : " " }</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

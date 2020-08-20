import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import buzz from 'buzz';
import './style/App.css';
import './style/Clock.css';
import TaskList from './components/TaskList';

// store all break, longBreak and work in currentState...


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
      onBreak: false,
      onLongBreak: false,
      currentState: "",
    };

    this.timer = 0;
    this.resetTimer = this.resetTimer.bind(this);
    this.handlePausePlayClick = this.handlePausePlayClick.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    let newTimeRem = 0;
    this.setState({ timeRemaining: newTimeRem });
    this.updateClock(newTimeRem);
  }

  handlePausePlayClick() {
    let timeRem = this.state.timeRemaining;
    this.setState({ timeRemaining: timeRem })
    if(this.state.isCounting) {
      clearInterval(this.timer);
      this.setState({ isCounting: false, currentState: "- PAUSED -" });
    } else {
      this.timer = setInterval(this.countDown, 50);
      this.setState({ isCounting: true });
      if(this.state.onBreak) {
        this.setState({ currentState: "- BREAK -" });
        document.getElementById('end_marker').style.transform = "translate(-50%, 0%) rotate(30deg)";
      } else if(this.state.onLongBreak) {
        this.setState({ currentState: "- LUNCH -" });
        document.getElementById('end_marker').style.transform = "translate(-50%, 0%) rotate(180deg)";
      } else {
        this.setState({ currentState: "- WORKING -" });
        console.log(document.getElementById)
        document.getElementById('end_marker').style.transform = "translate(-50%, 0%) rotate(150deg)";
      }
      
    }
    console.log(this.timer)
  }

  resetTimer() {
    clearInterval(this.timer);
    this.setState({ timeRemaining: 0, isCounting: false, currentState: "" });
    this.updateClock(0);
  };

  countDown() {
    let newTimeRem = this.state.timeRemaining + .05;
    this.setState({ timeRemaining: newTimeRem });
    this.updateClock(newTimeRem);

    if (this.state.onBreak) {
      if(newTimeRem >= this.state.breakTime) {
        comSound.play();
        
        clearInterval(this.timer);
        this.updateClock(0);
        this.setState({ timeRemaining: 0, isCounting: false, onBreak: false, onLongBreak: false, currentState: "- WORKING -" });
      }
    } else if(this.state.onLongBreak) {
      if(newTimeRem >= this.state.longBreakTime) {
        comSound.play();
        
        clearInterval(this.timer);
        this.updateClock(0);
        this.setState({ timeRemaining: 0, isCounting: false, onBreak: false, onLongBreak: false, currentState: "- WORKING -" });
      }
    } else {
      if(newTimeRem >= this.state.workTime) {
        comSound.play();
        clearInterval(this.timer);
        let newSessionCount = this.state.sessionCount + 1;
        this.setState({ timeRemaining: 0, sessionCount: newSessionCount, isCounting: false, onBreak: true, currentState: "- BREAK -" });
        this.updateClock(0);
        if (newSessionCount >= 4) {
          this.setState({ timeRemaining: 0, sessionCount: 0, onBreak: false, onLongBreak: true, currentState: "- LUNCH -" });
        }
      }
    }
  }

  updateClock(time) {
      let minutes = Math.floor(time / 60);
      // console.log("time:", time);
      // console.log("minutes:", minutes);
      let angleMinutes = (time / 60) * 6 ;
      // console.log("angle minutes:", angleMinutes);
      let angleSeconds = ((time - (minutes * 60)) * 60) / 10;
      // console.log("angle seconds:", angleSeconds);
      if(time === 0) {
        angleMinutes = 0;
        angleSeconds = 0;
      }
      document.getElementById('js-seconds').style.transform = "translate(-50%, -100%) rotate(" + angleSeconds + "deg)";
      document.getElementById('js-minutes').style.transform = "translate(-50%, -100%) rotate(" + angleMinutes + "deg)";
  }

  formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds - (minutes * 60));

    if(!timeInSeconds) { return "00:00" }

    minutes = minutes < 10 ? "0" + minutes: minutes;
    seconds = seconds < 10 ? "0" + seconds: seconds;

    return minutes + ":" + seconds;
  };


  render() {
    return (
    <div>
      <div className="title col-4">
        <span>POMODORO</span> / 
        {/* <div className="cross-line"></div> */}
        <span>TIMER</span>
      </div>
      <div className="main-container">
        <div className="container col-12">
          <div className="clock-container col-5">
            <div className="controller">
              <div className="display">
                {this.formatTime(this.state.timeRemaining)}
              </div>
              <div className="button-box">
                <div 
                  className="btn" 
                  onClick={ !this.state.isCounting ? this.handlePausePlayClick : null }
                >
                  <button>
                    <i className={this.state.isCounting ? "material-icons md-dark active" : "material-icons md-dark"}> play_arrow </i>
                  </button>
                </div>
                <div 
                  className="btn" 
                  onClick={ this.state.isCounting ? this.handlePausePlayClick : null }
                >
                  <button>
                    <i className={!this.state.isCounting ? "material-icons md-dark active" : "material-icons md-dark"}> pause </i>
                  </button>
                </div>
                <div 
                  className="btn"
                  onClick={ this.resetTimer }
                >
                  <button>
                    <i className="material-icons md-dark">restore</i>
                  </button>
                </div>
              </div>
            </div>
            {/* <div className="analog"> */}
                <div className="clock">
                  <div className={ this.state.currentState !== '- WORKING -' ? "current-state pause" : "current-state"}>{ this.state.currentState }</div>
                  <div className="start_marker"></div>
                  <div id ="end_marker" className="end_marker twenty_five"></div>
                  <div id ="js-minutes" className="clock__tick clock__tick--minutes">
                  </div>
                  <div id ="js-seconds" className="clock__tick clock__tick--seconds">
                  </div>
                </div>
            {/* </div> */}
          </div>
          
          <div className="tasks-box col-7">
            < TaskList
              firebase={firebase}
            />
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default App;

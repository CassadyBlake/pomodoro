import React, { Component } from 'react';
import '../style/Tasks.css';

class TaskList extends Component {


  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      value: '',
      hover: null,
    };

    this.tasksRef = this.props.firebase.database().ref('tasks');
    this.firebase = this.props.firebase.database();
  }

  componentDidMount() {
      this.tasksRef.on('child_added', snapshot => {
        const task = snapshot.val();
        task.key = snapshot.key;
        this.setState({ tasks: this.state.tasks.concat( task ) });
      });
  }
  deleteTaskClick = (taskKey) => {
    this.tasksRef.child(taskKey).remove();
    this.setState({ tasks: this.state.tasks.filter(task => taskKey !== task.key)});
  }

  completeTaskClick = (taskKey) => {
    console.log("complete:", taskKey);
    const selectedTask = this.firebase.ref(`tasks/${taskKey}`);
    selectedTask.update({ completed: true });
    this.setState({ tasks: this.state.tasks.map( task => {
      console.log("task map:", task)
      if(task.key === taskKey) {
        let newTask = task;
        newTask.completed = true;
        return newTask;
      }
      return task;
    })});
  }

  handleChange = (event) => {
      this.setState({ value: event.target.value });
  }

  handleHoverState = (index) => {
    this.setState({ hover: index })
  }

  handleSubmit = (event) => {
    if(this.state.value) {
      this.tasksRef.push({
        name: this.state.value,
        completed: false
      });
      this.setState({ value: '' });
    }
    event.preventDefault();
  }


  render() {
    return(
      <div className="task-display">
        <div className="task-list" >
          <form className="form-task" onSubmit={this.handleSubmit}>
            <div className="tasks form">
                <input type="text" className="addInput" placeholder="type new task name" value={this.state.value} onChange={this.handleChange} />
                <button type="submit" className="submit" value="Create Task">
                  <i className="material-icons">add</i>
                </button>
            </div>
          </form>
          {
            this.state.tasks.map( (task, index) =>
              <div 
                className="tasks" 
                key={index} 
                onMouseEnter={() => this.handleHoverState(index)}
                onMouseLeave={() => this.handleHoverState(null)}
              >
                <div className="taskName">- &nbsp;{ task.name }</div>
                <div className="task-button-display">
                  { this.state.hover === index ? (
                    <div className="task-button-box">
                      { !task.completed ? (
                        <button
                          className="task-button complete"
                          onClick={() => this.completeTaskClick(task.key)}
                        >
                          <i className="material-icons">check</i>
                        </button>
                      ) : null}
                      <button
                        className="task-button delete"
                        onClick={() => this.deleteTaskClick(task.key)}
                      >
                        <i className="material-icons">delete</i>
                      </button>
                    </div>
                  ) : (
                      <button 
                        className="task-button" 
                        // onClick={() => this.deleteTaskClick(task.key)}
                        // onMouseEnter={() => this.handleHoverState(index)}
                        // onMouseLeave={() => this.handleHoverState(null)}
                      >
                        { task.completed 
                          ? <i className="material-icons  green">check_box</i>
                          : <i className="material-icons">check_box_outline_blank</i>
                        }
                      </button>
                  )}
                </div>
              </div>
            ).reverse()
          }
        </div>
      </div>
    );
  }
}
export default TaskList;

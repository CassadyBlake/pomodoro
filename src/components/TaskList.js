import React, { Component } from 'react';
import '../style/Tasks.css';

class TaskList extends Component {


  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      value: undefined,
      hover: null,
    };

    this.tasksRef = this.props.firebase.database().ref('tasks');
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
    console.log("complete:", this.tasksRef.child(taskKey).completed);
    this.tasksRef.child(taskKey).completed = true;
  }

  handleChange = (event) => {
      this.setState({ value: event.target.value });
  }

  handleHoverState = (index) => {
    this.setState({ hover: index })
  }

  handleSubmit = (event) => {
    this.tasksRef.push({
      name: this.state.value,
      completed: false
    });
    this.setState({ value: '' });
    event.preventDefault();
  }


  render() {
    return(
      <div className="task-display">
        <div className="task-list" >
          {
            this.state.tasks.map( (task, index) =>
              <div 
                className="tasks" 
                key={index} 
                onMouseEnter={() => this.handleHoverState(index)}
                onMouseLeave={() => this.handleHoverState(null)}
              >
                <div className="taskName">- &nbsp;{ task.name }</div>
                
                  { this.state.hover === index ? (
                    <div className="task-button-box">
                      <button
                        className="task-button delete"
                        onClick={() => this.deleteTaskClick(task.key)}
                      >
                        <i className="material-icons">delete</i>
                      </button>
                      <button
                        className="task-button complete"
                        onClick={() => this.completeTaskClick(task.key)}
                      >
                        <i className="material-icons">check</i>
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="task-button" 
                      // onClick={() => this.deleteTaskClick(task.key)}
                      // onMouseEnter={() => this.handleHoverState(index)}
                      // onMouseLeave={() => this.handleHoverState(null)}
                    >
                      <i className="material-icons">{ task.completed ? 'check_box' : 'check_box_outline_blank' }</i>
                    </button>
                  )}
              </div>
            ).reverse()
          }
        </div>
        <form className="form-task" onSubmit={this.handleSubmit}>
          <div className="tasks form">
              <input type="text" className="addInput" placeholder="type new task name" value={this.state.value} onChange={this.handleChange} />
              <button type="submit" className="submit" value="Create Task">
                <i className="material-icons">add</i>
              </button>
          </div>
        </form>
      </div>
    );
  }
}
export default TaskList;

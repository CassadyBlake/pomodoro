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

  handleChange = (event) => {
      this.setState({ value: event.target.value });
  }

  handleHoverState = (index) => {
    this.setState({ hover: index })
  }

  handleSubmit = (event) => {
    this.tasksRef.push({
      name: this.state.value,
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
              <div className= "tasks" key={index}>
                <div className="taskName">- &nbsp;{ task.name }</div>
                <button 
                  className="delete" 
                  onClick={() => this.deleteTaskClick(task.key)}
                  onMouseEnter={() => this.handleHoverState(index)}
                  onMouseLeave={() => this.handleHoverState(null)}
                >
                  <i className="material-icons">{ this.state.hover === index ? 'delete' : 'check_circle' }</i>
                </button>
              </div>
            ).reverse()
          }
        </div>
        <form className="form-task" onSubmit={this.handleSubmit}>
          <div className="tasks">
              <label>
                <input type="text" className="addInput" placeholder="type new task name" value={this.state.value} onChange={this.handleChange} />
              </label>
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

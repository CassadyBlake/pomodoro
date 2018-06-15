import React, { Component } from 'react';
import './Tasks.css';

class TaskList extends Component {


  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      value: undefined
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
          <form className="form-task" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <h2>Add a completed task</h2>
                  <button type="submit" className="btn submit" value="Create Task">Add</button>
                  <label>
                    <input type="text" className="addInput" placeholder="type new task name" value={this.state.value} onChange={this.handleChange} />
                  </label>
              </div>
            </form>
            <h2>Completed Tasks</h2>
              {
                this.state.tasks.map( (task, index) =>
                <div className="task-list" key={index}>
                  <div className= "tasks">
                    <button value="Delete" className="btn delete" onClick={() => this.deleteTaskClick(task.key)}>
                      Delete
                    </button>
                    &nbsp;{ task.name }
                  </div>
                </div>
                )
              }
      </div>
    );
  }
}
export default TaskList;

import React, { Component } from 'react';
import '../style/Tasks.css';

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
              <h2>Add a Task</h2>
              <div className="tasks">
                  <label>
                    <input type="text" className="addInput" placeholder="type new task name" value={this.state.value} onChange={this.handleChange} />
                  </label>
                  <button type="submit" className="btn submit" value="Create Task">Add</button>
              </div>
            </form>
            <h2>Tasks to Complete</h2>
            <div className="task-list" >
                {
                  this.state.tasks.map( (task, index) =>
                    <div className= "tasks" key={index}>
                      <div className="taskName">&nbsp;{ task.name }</div>
                      <button className="delete" onClick={() => this.deleteTaskClick(task.key)}></button>
                    </div>
                ).reverse()
                }
            </div>
      </div>
    );
  }
}
export default TaskList;

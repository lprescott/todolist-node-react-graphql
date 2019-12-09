import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Todos from './components/Todos';
import Header from './components/layout/Header'
import AddTodo from './components/AddTodo';
import About from './components/pages/About'
import uuid from 'uuid';

import './App.css';

class App extends Component {
  state = {
    todos: [
      {
        id: uuid.v4(), 
        text: 'Take out the trash',
        completed: false
      },
      {
        id: uuid.v4(), 
        text: 'Dinner with family',
        completed: true
      },
      {
        id: uuid.v4(), 
        text: 'Meeting with boss',
        completed: false
      }
    ]
  }

  // Toggle Completed
  toggleComplete = (id) => {
    this.setState({ todos: this.state.todos.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    }) });
  }

  // Delete Todo
  deleteTodo = (id) => {
    this.setState({ todos: this.state.todos.filter(todo => todo.id !== id) });
  }

  // Update Todo
  updateTodo = (id, text) => {
    this.setState({ todos: this.state.todos.map(todo => {
      if (todo.id === id) {
        todo.text = text;
      }
      return todo;
    }) });
  }

  addTodo = (text) => {
    const newTodo = {
      id: uuid.v4(),
      text,
      completed: false
    }
    // usage of the spread operator to copy initial state
    this.setState({ todos: [...this.state.todos, newTodo]})
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Header />
            <Route exact path="/" render={props => (
              <React.Fragment>
                <AddTodo addTodo={this.addTodo}/>
                <Todos todos={this.state.todos} toggleComplete={this.toggleComplete} deleteTodo={this.deleteTodo} updateTodo={this.updateTodo} />
              </React.Fragment>
            )} />
            <Route path="/about" component={About} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

import React from 'react';
import './App.css';

// const process = window.require('process');

const tempTasks = [
  { id: "SHED-14", title: "Посещение ПЗ и других образовательных мероприятий" },
  { id: "EF-23", title: "Реализовать механизм автоматического снятия скриншотов для App Store" },
  { id: "CDS-39", title: "Настроить YouTrack" },
];

const Task = (props) => {
  const { id, title } = props;
  return (
    <div className="Task">
      <a href="https://yandex.ru" target="_blank" rel="noopener noreferrer">{id}</a> {title}
    </div>
  );
}

const TaskList = (props) => {
  const { tasks } = props;
  return (
    <div className="TaskList">
      {tasks.map((task) => <Task key={task.id} { ...task } />)}
    </div>
  );
}

const App = () => {
  return (
    <div className="App">
      <TaskList tasks={tempTasks}/>
    </div>
  );
}

export default App;

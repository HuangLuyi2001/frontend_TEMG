import React, { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'task-manager-app-data';

function App() {
  const [data, setData] = useState({
    todo: [],
    inProgress: [],
    archived: []
  });
  const [newTitle, setNewTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function handleNewTitleChange(event, list) {
    if (!event.target.value) return;

    const newList = [...data[list], { id: Date.now(), title: event.target.value, description: '' }];
    setData({ ...data, [list]: newList });
    setNewTitle('');
  }

  function handleNewDescriptionChange(event, list, id) {
    const newList = data[list].map(task => {
      if (task.id === id) {
        return { ...task, description: event.target.value };
      }
      return task;
    });
    setData({ ...data, [list]: newList });
  }

  function handleAddTask(list) {
    if (!newTitle) return;

    const newList = [...data[list], { id: Date.now(), title: newTitle, description: '' }];
    setData({ ...data, [list]: newList });
    setNewTitle('');
  }

  function handleEditTask(list, id, newTitle, newDescription) {
    const newList = data[list].map(task => {
      if (task.id === id) {
        return { ...task, title: newTitle, description: newDescription };
      }
      return task;
    });
    setData({ ...data, [list]: newList });
  }

  function handleDeleteTask(list, id) {
    const newList = data[list].filter(task => task.id !== id);
    setData({ ...data, [list]: newList });
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  function filterTasks(tasks) {
    return tasks.filter(task => {
      const titleMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = task.description.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || descriptionMatch;
    });
  }

  function handleDragStart(event, list, id) {
    event.dataTransfer.setData('list', list);
    event.dataTransfer.setData('id', id);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event, list) {
    const sourceList = event.dataTransfer.getData('list');
    const sourceId = Number(event.dataTransfer.getData('id'));
    const targetIndex = Number(event.currentTarget.dataset.index);

    if (sourceList === list) {
      const newList = [...data[sourceList]];
      const sourceIndex = newList.findIndex(task => task.id === sourceId);
      const [removedTask] = newList.splice(sourceIndex, 1);
      newList.splice(targetIndex, 0, removedTask);
      setData({ ...data, [sourceList]: newList });
    } else {
      const sourceListTasks = [...data[sourceList]];
      const sourceIndex = sourceListTasks.findIndex(task => task.id === sourceId);
      const [removedTask] = sourceListTasks.splice(sourceIndex, 1);

      const targetListTasks = [...data[list]];
      targetListTasks.splice(targetIndex, 0, removedTask);

      setData({
        ...data,
        [sourceList]: sourceListTasks,
        [list]: targetListTasks
      });
    }
  }

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div className="board">
        <div className="list">
          <h2>To Do</h2>
          <div className="cards" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, 'todo')}>
            {filterTasks(data.todo).map((task, index) => (
              <div key={task.id} className="card" draggable onDragStart={(event) => handleDragStart(event, 'todo', task.id)} data-index={index}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="card-actions">
                  <button onClick={() => handleDeleteTask('todo', task.id)}>Delete</button>
                  <button onClick={() => handleEditTask('todo', task.id, prompt('Enter new title', task.title), prompt('Enter new description', task.description))}>Edit</button>
                </div>
              </div>
            ))}
            <div className="add-card">
              <input type="text" placeholder="Title" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
              <textarea placeholder="Description" value={data.todo.length > 0 ? data.todo[data.todo.length - 1].description : ''} onChange={(event) => handleNewDescriptionChange(event, 'todo', data.todo.length)}></textarea>
              <button onClick={() => handleAddTask('todo')}>Add Task</button>
            </div>
          </div>
        </div>
        <div className="list">
          <h2>In Progress</h2>
          <div className="cards" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, 'inProgress')}>
            {filterTasks(data.inProgress).map((task, index) => (
              <div key={task.id} className="card" draggable onDragStart={(event) => handleDragStart(event, 'inProgress', task.id)} data-index={index}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="card-actions">
                  <button onClick={() => handleDeleteTask('inProgress', task.id)}>Delete</button>
                  <button onClick={() => handleEditTask('inProgress', task.id, prompt('Enter new title', task.title), prompt('Enter new description', task.description))}>Edit</button>
                </div>
              </div>
            ))}
            <div className="add-card">
              <input type="text" placeholder="Title" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
              <textarea placeholder="Description" value={data.inProgress.length > 0 ? data.inProgress[data.inProgress.length - 1].description : ''} onChange={(event) => handleNewDescriptionChange(event, 'inProgress', data.inProgress.length)}></textarea>
              <button onClick={() => handleAddTask('inProgress')}>Add Task</button>
            </div>
          </div>
        </div>
        <div className="list">
          <h2>Archived</h2>
          <div className="cards" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, 'archived')}>
            {filterTasks(data.archived).map((task, index) => (
              <div key={task.id} className="card" draggable onDragStart={(event) => handleDragStart(event, 'archived', task.id)} data-index={index}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="card-actions">
                  <button onClick={() => handleDeleteTask('archived', task.id)}>Delete</button>
                  <button onClick={() => handleEditTask('archived', task.id, prompt('Enter new title', task.title), prompt('Enter new description', task.description))}>Edit</button>
                </div>
              </div>
            ))}
            <div className="add-card">
              <input type="text" placeholder="Title" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
              <textarea placeholder="Description" value={data.archived.length > 0 ? data.archived[data.archived.length - 1].description : ''} onChange={(event) => handleNewDescriptionChange(event, 'archived', data.archived.length)}></textarea>
              <button onClick={() => handleAddTask('archived')}>Add Task</button>
            </div>
          </div>
        </div>
      </div>
      <div className="search">
        <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearchTermChange} />
      </div>
    </div>
  );
}

export default App;
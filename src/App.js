import { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from "react-icons/bs";
import './App.css';

function App() {
  const [isFull, setIsFull] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completed, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const handleAddTodo = () => {
    if (newTitle.trim() && newDescription.trim()) {
      const newTodoItem = {
        title: newTitle,
        description: newDescription
      };
      const updatedTodoArr = [...allTodos, newTodoItem];
      setTodos(updatedTodoArr);
      localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
      setNewTitle("");
      setNewDescription("");
    } else {
      alert("Please fill out both fields");
    }
  };

  const handleDeleteTodo = (index) => {
    const reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleCompleteTodo = (index) => {
    const now = new Date();
    const completedOn = `${now.getDate()}-${now.getMonth()}-${now.getFullYear()} at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const filteredItem = {
      ...allTodos[index],
      completedOn
    };
    const updatedCompletedArr = [...completed, filteredItem];
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('CompletedTodos', JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = (index) => {
    const reducedTodo = [...completed];
    reducedTodo.splice(index, 1);
    localStorage.setItem('CompletedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('todolist'));
    const savedCompleted = JSON.parse(localStorage.getItem('CompletedTodos'));
    if (saved) {
      setTodos(saved);
    }
    if (savedCompleted) {
      setCompletedTodos(savedCompleted);
    }
  }, []);

  const handleEdit = (index, temp) => {
    setCurrentEdit(index);
    setCurrentEditedItem(temp);
  };

  const handleUpdatedTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  const handleUpdatedDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };
  
  const handleUpdatedToDo = () => {
    const newTodo = [...allTodos];
    newTodo[currentEdit] = currentEditedItem;
    setTodos(newTodo);
    localStorage.setItem('todolist', JSON.stringify(newTodo));
    setCurrentEdit("");
  };

  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className='todo-list'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='Whats the task title' />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input type='text' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder='Whats the task Description?' />
          </div>
          <div className='todo-input-item'>
            <button type='button' className='btn' onClick={handleAddTodo}>Add</button>
          </div>
        </div>
        <div className='btn-area'>
          <button className={`secondaryBtn ${!isFull && 'active'}`} onClick={() => setIsFull(false)}>Todo</button>
          <button className={`secondaryBtn ${isFull && 'active'}`} onClick={() => setIsFull(true)}>Completed</button>
        </div>
        <div className='tolist'>
          {!isFull && allTodos.map((temp, index) => {
            if (currentEdit === index) {
              return (
                <div className="edit" key={index}>
                  <input placeholder="updated Title" onChange={(e) => handleUpdatedTitle(e.target.value)} value={currentEditedItem.title} />
                  <textarea placeholder='update Description' rows={4} onChange={(e) => handleUpdatedDescription(e.target.value)} value={currentEditedItem.description} />
                  <div className='todo-input-item'>
                    <button type='button' className='btn' onClick={handleUpdatedToDo}>Update</button>
                  </div>
                </div>
              )
            } else {
              return (
                <div className='list' key={index}>
                  <div>
                    <h3>{temp.title}</h3>
                    <p>{temp.description}</p>
                  </div>
                  <div>
                    <AiOutlineDelete className='icon' onClick={() => handleDeleteTodo(index)} title='Delete?' />
                    <BsCheckLg className='check-icon' onClick={() => handleCompleteTodo(index)} />
                    <AiOutlineEdit className='check-icon' onClick={() => handleEdit(index, temp)} />
                  </div>
                </div>
              );
            }
          })}
          {isFull && completed.map((temp, index) => {
            return (
              <div className='list' key={index}>
                <div>
                  <h3>{temp.title}</h3>
                  <p>{temp.description}</p>
                  <p>Completed on: {temp.completedOn}</p>
                </div>
                <div>
                  <AiOutlineDelete className='icon' onClick={() => handleDeleteCompletedTodo(index)} title='Delete?' />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

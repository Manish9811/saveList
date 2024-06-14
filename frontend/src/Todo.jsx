import React, { useEffect, useState } from 'react';
import './todo.css';
import axios from 'axios'

const backendURL = "https://apitodo-black.vercel.app";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskAddedStatus, setTaskAddedStatus] = useState(false);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {

      saveInDatabase();
      // setTasks([...tasks, <newTask></newTask>]);
      setNewTask('');
      return setTaskAddedStatus(false)
    }

  };


  async function saveInDatabase() {
    // alert("hello")
    await axios.post(`${backendURL}/addTodo`, {
      task: newTask
    },

      {
        withCredentials: true,
        headers: { "Content-Type": 'application/json' }
      }).then((data) => {
        setTaskAddedStatus(true)
      }).catch((err) => {
        console.log(err)
      })

  }

  useEffect(() => {

    setTasks([])

    axios.get(`${backendURL}/getAllTask`, {
      withCredentials: true
    }).then((data) => {
      if(!data.data.tasks){
        return setTasks(false)
      }
      for (let i of data.data.tasks) {
        setTasks((prevValue) => [...prevValue, { id: i.id, userTask: i.userTask }]);
      }
      setTaskAddedStatus(false)
    })


  }, [taskAddedStatus])


  const handleDeleteTask = (index) => {
    deleteTask(index)
    const updatedTasks = tasks.filter((task, taskIndex) => taskIndex !== index);
    setTasks(updatedTasks);
  };

  function deleteTask(index) {

    axios.delete(`${backendURL}/deleteData`, {
      data: {
        id: index
      },
        withCredentials: true,
        headers: {
          'content-type': 'application/json'
        }
      }).then((data) => {
        setTaskAddedStatus(true)
      })
  }

 

  return (
    <div className="todo-list">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
      <ul>
        {
          !tasks && <h1> No Data Found </h1>
        }
        {tasks && tasks.map((task, index) => (

          <li key={index}>
            {task.userTask}
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;

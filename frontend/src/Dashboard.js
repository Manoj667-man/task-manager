import React, { useEffect, useState } from "react";
import "./App.css";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 2;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {

    const response = await fetch("http://localhost:8090/tasks");

    const data = await response.json();

    setTasks(data);
  };

  const addTask = async () => {

    if(newTask.trim() === ""){
      return;
    }

    const task = {
      title: newTask,
      completed: false
    };

    await fetch("http://localhost:8090/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    });

    setNewTask("");

    fetchTasks();
  };

  const deleteTask = async (id) => {

    await fetch(`http://localhost:8090/tasks/${id}`, {
      method: "DELETE"
    });

    fetchTasks();
  };

  const toggleStatus = async (task) => {

    const updatedTask = {
      ...task,
      completed: !task.completed
    };

    await fetch(`http://localhost:8090/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    });

    fetchTasks();
  };

  const startEdit = (task) => {

    setEditId(task.id);

    setEditText(task.title);
  };

  const saveEdit = async (task) => {

    const updatedTask = {
      ...task,
      title: editText
    };

    await fetch(`http://localhost:8090/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    });

    setEditId(null);

    fetchTasks();
  };

  const logout = () => {

    window.location.href = "/";
  };

  const filteredTasks = tasks.filter((task) => {

    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Completed"
        ? task.completed
        : !task.completed;

    return matchesSearch && matchesFilter;
  });

  const indexOfLastTask = currentPage * tasksPerPage;

  const indexOfFirstTask = indexOfLastTask - tasksPerPage;

  const currentTasks = filteredTasks.slice(
    indexOfFirstTask,
    indexOfLastTask
  );

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (

    <div className="dashboard">

      <div className="navbar">

        <h2>Task Manager</h2>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

      <h1>Task Manager Dashboard</h1>

      <div className="top-bar">

        <input
          type="text"
          placeholder="Enter Task"
          value={newTask}
          onChange={(e)=>setNewTask(e.target.value)}
        />

        <button className="add-btn" onClick={addTask}>
          Add Task
        </button>

      </div>

      <div className="search-filter">

        <input
          type="text"
          placeholder="Search Task"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e)=>setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>

      </div>

      {
        currentTasks.map((task)=>(
          <div key={task.id} className="task-card">

            {
              editId === task.id ? (
                <div>

                  <input
                    type="text"
                    value={editText}
                    onChange={(e)=>setEditText(e.target.value)}
                  />

                  <button
                    className="add-btn"
                    onClick={()=>saveEdit(task)}
                  >
                    Save
                  </button>

                </div>
              ) : (
                <h2>{task.title}</h2>
              )
            }

            <p>
              Status :
              <span className={task.completed ? "completed" : "pending"}>

                {task.completed ? " Completed" : " Not Completed"}

              </span>
            </p>

            <button
              className={
                task.completed
                  ? "pending-btn"
                  : "complete-btn"
              }
              onClick={()=>toggleStatus(task)}
            >
              {
                task.completed
                  ? "Mark Pending"
                  : "Mark Completed"
              }
            </button>

            <div className="action-buttons">

              <button
                className="edit-btn"
                onClick={()=>startEdit(task)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={()=>deleteTask(task.id)}
              >
                Delete
              </button>

            </div>

          </div>
        ))
      }

      <div className="pagination">

        <button
          onClick={()=>setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="page-text">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={()=>setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Dashboard;
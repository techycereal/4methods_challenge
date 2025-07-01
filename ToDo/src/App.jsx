import React, { useState, useEffect } from 'react';

const TODO_API = 'YOUR_API_URL'; // Replace with your MockAPI URL

export default function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch(TODO_API);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!task.trim()) return;
    const res = await fetch(TODO_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, priority, completed: false })
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setTask('');
    setPriority('Medium');
  };

  const toggleComplete = async (id, current) => {
    const res = await fetch(`${TODO_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !current })
    });
    const updated = await res.json();
    setTodos(todos.map(todo => (todo.id === id ? updated : todo)));
  };

  const startEditing = (id, currentTask, currentPriority) => {
    setEditingId(id);
    setEditTask(currentTask);
    setEditPriority(currentPriority);
  };

  const updateTodo = async (id) => {
    const res = await fetch(`${TODO_API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: editTask, priority: editPriority })
    });
    const updated = await res.json();
    setTodos(todos.map(todo => todo.id === id ? updated : todo));
    setEditingId(null);
    setEditTask('');
    setEditPriority('Medium');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTask('');
    setEditPriority('Medium');
  };

  const deleteTodo = async (id) => {
    await fetch(`${TODO_API}/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityBadge = (level) => {
    const colors = {
      High: 'bg-red-500',
      Medium: 'bg-yellow-500',
      Low: 'bg-green-500'
    };
    return (
      <span className={`text-white text-xs px-2 py-1 rounded-full ${colors[level]}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-blue-50 shadow-xl rounded-xl mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">📝 Task Tracker</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New task..."
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button
          onClick={addTodo}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-4">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
              todo.completed ? 'opacity-60 line-through' : ''
            }`}
          >
            {editingId === todo.id ? (
              <div className="w-full">
                <input
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  className="w-full border p-2 rounded-md mb-2"
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="border p-2 rounded-md mb-2"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <div className="space-x-2">
                  <button
                    onClick={() => updateTodo(todo.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id, todo.completed)}
                    className="h-5 w-5 accent-blue-600"
                  />
                  <p className="text-gray-800">{todo.task}</p>
                  {getPriorityBadge(todo.priority)}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => startEditing(todo.id, todo.task, todo.priority)}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

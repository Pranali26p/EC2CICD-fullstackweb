import React, { useEffect, useState } from 'react';
import { api } from './api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  async function loadTasks() {
    setLoading(true);
    setError('');
    try {
      const data = await api.list();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(task) {
    try {
      const created = await api.create(task);
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(id, task) {
    try {
      const updated = await api.update(id, task);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditing(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(task) {
    await handleUpdate(task.id, { completed: !task.completed });
  }

  async function handleDelete(id) {
    try {
      await api.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Tasks</h1>
        <p className="subtitle">A full-stack CRUD demo (React + Node + RDS)</p>
      </header>

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}

      <TaskForm
        key={editing ? editing.id : 'new'}
        initial={editing}
        onSubmit={
          editing
            ? (task) => handleUpdate(editing.id, task)
            : handleCreate
        }
        onCancel={editing ? () => setEditing(null) : null}
      />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

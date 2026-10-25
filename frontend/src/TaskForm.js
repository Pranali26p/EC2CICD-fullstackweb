import React, { useState } from 'react';

// Shared form for both creating and editing a task.
export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial ? initial.title : '');
  const [description, setDescription] = useState(
    initial ? initial.description || '' : ''
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description });
    if (!initial) {
      setTitle('');
      setDescription('');
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Task title"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Task description"
      />
      <div className="form-actions">
        <button type="submit">{initial ? 'Save changes' : 'Add task'}</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

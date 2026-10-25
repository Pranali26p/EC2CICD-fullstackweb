import React from 'react';

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Add one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.completed ? 'completed' : ''}>
          <div className="task-main">
            <input
              type="checkbox"
              checked={Boolean(task.completed)}
              onChange={() => onToggle(task)}
              aria-label={`Mark "${task.title}" complete`}
            />
            <div>
              <span className="task-title">{task.title}</span>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
            </div>
          </div>
          <div className="task-actions">
            <button className="secondary" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button className="danger" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

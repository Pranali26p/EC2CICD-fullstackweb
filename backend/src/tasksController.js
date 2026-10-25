const { pool } = require('./db');

// GET /api/tasks - list all tasks
async function getAllTasks(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/tasks/:id - fetch a single task
async function getTaskById(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks - create a task
async function createTask(req, res, next) {
  try {
    const { title, description = '', completed = false } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title is required' });
    }
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
      [title.trim(), description, Boolean(completed)]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/:id - update a task
async function updateTask(req, res, next) {
  try {
    const { title, description, completed } = req.body;
    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [
      req.params.id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const current = existing[0];
    const updated = {
      title: title !== undefined ? title : current.title,
      description:
        description !== undefined ? description : current.description,
      completed:
        completed !== undefined ? Boolean(completed) : current.completed,
    };
    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
      [updated.title, updated.description, updated.completed, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id - delete a task
async function deleteTask(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

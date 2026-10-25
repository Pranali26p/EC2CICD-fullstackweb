const express = require('express');
const controller = require('./tasksController');

const router = express.Router();

router.get('/tasks', controller.getAllTasks);
router.get('/tasks/:id', controller.getTaskById);
router.post('/tasks', controller.createTask);
router.put('/tasks/:id', controller.updateTask);
router.delete('/tasks/:id', controller.deleteTask);

module.exports = router;

const path = require("path");
const express = require("express");
const uuid = require("uuid/v4");

const db = require("./dataLayer");

const router = express.Router();
const dbFilePath = path.join(__dirname, "todos.json");

// all router paths have "/api" prepended to them
// this full route is "/api/todos"
router.get("/todos", async (request, response, next) => {
  try {
    response.json(await db.readFile(dbFilePath));
  } catch (error) {
    next(error);
  }
});

// todo: { id: "uuid", text: "anything", "completed": false }
router.post("/todos", async (request, response, next) => {
  try {
    const todo = {
      id: uuid(),
      text: request.body.text,
      completed: false,
    };

    // validate our todo against the schema
    // if todo is invalid, it will throw an error
    await db.schema.validateAsync(todo);

    const todos = await db.readFile(dbFilePath);
    todos.push(todo);
    await db.writeFile(dbFilePath, todos);

    response.json(todo);
  } catch (error) {
    next(error);
  }
});

// only update the completed field of a todo
router.put("/todos/:id", async (request, response, next) => {
  try {
    console.log(request.params.id);
    console.log(request.body);
    const todos = await db.readFile(dbFilePath);

    let updatedTodo;

    const updatedTodos = todos.map((todo) => {
      if (todo.id === request.params.id) {
        const newTodo = { ...todo, completed: request.body.completed };
        updatedTodo = newTodo;
        return newTodo;
      } else {
        return todo;
      }
    });

    await db.writeFile(dbFilePath, updatedTodos);

    response.json(updatedTodo);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  router,
};

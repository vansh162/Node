const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8082;

app.set("view engine", "ejs");
app.set("views", "./views");
// app.use(express.static("./"));
app.use(bodyParser.urlencoded({ extended: true }));

// Sample ToDo list (each task has id & content)
let todoList = [];
let idCounter = 1;

// READ - home page
app.get("/", (req, res) => {
  res.render("home", { todoList });
});

// CREATE - add a new task
app.post("/add", (req, res) => {
  const newTask = req.body.newTask;
  if (newTask.trim() !== "") {
    todoList.push({ id: idCounter++, task: newTask });
  }
  res.redirect("/");
});

// DELETE - remove task
app.post("/delete/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  todoList = todoList.filter(task => task.id !== taskId);
  res.redirect("/");
});

// UPDATE - load edit form
app.get("/edit/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskToEdit = todoList.find(task => task.id === taskId);
  if (taskToEdit) {
    res.render("edit", { task: taskToEdit });
  } else {
    res.redirect("/");
  }
});

// UPDATE - submit edited task
app.post("/update/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedText = req.body.updatedTask;

  const task = todoList.find(task => task.id === taskId);
  if (task && updatedText.trim() !== "") {
    task.task = updatedText;
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

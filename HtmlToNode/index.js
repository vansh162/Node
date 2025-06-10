const PORT = 8082;
const express = require("express");

const app = express();
app.use(express.static('public'));
app.set("view engine", "ejs");

let userData = {
  userName: "Vansh",
  age: "19",
  city: "Ahmedabad",
};

app.get("/", (req, res) => {
  res.render("home", {userData});
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/features", (req, res) => {
  res.render("features");
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log("server is not connected");
    return;
  }
  console.log("server is connected on port", PORT);
}); 
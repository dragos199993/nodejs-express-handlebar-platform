const express = require("express");
const hbs = require("hbs");

const os = require("os");
const fs = require("fs");

const port = process.env.PORT || 3000;

let app = express();

hbs.registerPartials(__dirname + "/views/partials"); // Add partials support

app.set("view engine", "hbs"); // Use handlebar template engine

hbs.registerHelper("year", () => {
  return new Date().getFullYear(); // Add Helper to render the year variable in all templates
});

// Uncomment to enter a maintanance mode
// app.use((req, res, next) => {
//   res.render("maintanance.hbs"); // Use a middleware to render only maintanance view. Without a next().
// });

app.use(express.static(__dirname + '/public')); // Use static folder to render standard html files

app.use((req, res, next) => {
  let user = os.userInfo().username;
  let log = `${user} on ${new Date().toString()} ${req.method} - ${req.url}`;
  fs.appendFileSync("server.txt", log + "\n", err => {
    if (err) console.log(err);
  });
  next();
});

app.get("/", (req, res) => {
  res.render("homepage.hbs", {
    pageTitle: "Home page",
    welcomeMessage: "Hello there, you are on homepage"
  });
});
app.get("/about", (req, res) => {
  res.render("about.hbs", {
    pageTitle: "About page"
  });
});
app.get("/bad", (req, res) => {
  res.send({
    error: "Something went wrong."
  });
});
app.listen(port, () => {
  console.log("App running at port " + port);
});

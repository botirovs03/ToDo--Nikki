// server/index.js
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users");
const categoryRoutes = require('./routes/category');
const taskRoutes = require('./routes/taks');
const getUserCategories = require('./routes/getUserCategories');
const getUpcomingTasks = require('./routes/getUpcomingTasks');
const PORT = process.env.PORT || 3001;

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));
// configure the app to use bodyParser()

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with the actual origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ... 

app.use(bodyParser.json());

app.use(usersRoutes);
app.use(categoryRoutes);
app.use(taskRoutes);
app.use(getUserCategories);
app.use(getUpcomingTasks);

app.get('/', (req, res) =>{
  res.status(200).json({message: 'Welcome to Nikki'});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


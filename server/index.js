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
// const HOST = '0.0.0.0';

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/dist")));
// configure the app to use bodyParser()

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with the actual origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ... 

app.use(bodyParser.json());

app.use(usersRoutes);
app.use(categoryRoutes);
app.use(taskRoutes);
app.use(getUserCategories);
app.use(getUpcomingTasks);

function listRoutes(app) {
  const routes = [];
  
  // Iterate through the app's router stack
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === 'router') {
      // Routes registered through app.use()
      middleware.handle.stack.forEach((handler) => {
        routes.push(handler.route);
      });
    }
  });
  
  return routes;
}


// Define a custom route to list all APIs
app.get("/api-list", (req, res) => {
  const routes = app._router.stack
    .filter((r) => r.path)
    .map((r) => ({
      // method: Object.keys(r),
      path: r.path,
    }));

  res.json({ routes });
});

app.get('/', (req, res) =>{
  res.status(200).json({message: 'Welcome to Nikki'});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  
  // List all routes after the server starts
  const allRoutes = listRoutes(app);
  console.log('List of all routes:');
  allRoutes.forEach((route) => {
    console.log(`${route.stack[0].method.toUpperCase()} - ${route.path}`);
  });
  
});


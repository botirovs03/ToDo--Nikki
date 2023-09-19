const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users");
const categoryRoutes = require("./routes/category");
const taskRoutes = require("./routes/taks");
const getUserCategories = require("./routes/getUserCategories");
const getUpcomingTasks = require("./routes/getUpcomingTasks");
const PORT = process.env.PORT || 3001;
const app = express();

// Serve the React app's static files
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace with the actual origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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
    } else if (middleware.name === "router") {
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
  const routes = listRoutes(app).map((route) => ({
    method: route.stack[0].method.toUpperCase(),
    path: route.path,
  }));

  res.json(routes);
});

// Serve the React app's HTML file for all other routes (client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

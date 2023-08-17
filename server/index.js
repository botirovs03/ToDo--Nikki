// server/index.js
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users");
console.log('tes1t');
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

app.use(bodyParser.json());

app.use(usersRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

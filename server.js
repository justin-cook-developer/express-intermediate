const path = require("path");
const express = require("express");

// importing the router
const { router } = require("./api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "static")));

// create the `req.body` property
app.use(express.json());

// associating the router with "/api" routes
app.use("/api", router);

// custom error handler
// errors passed to this piece of middleware by next(error)
app.use((error, request, response, next) => {
  if (error.name === "ValidationError") {
    response.status(400).json({
      validationError: error.message,
    });
  } else {
    console.log("500 Error " + error.message);
    response.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log("App is listening.");
});

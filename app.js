const express = require("express");
const { connect } = require("mongoose");
const { AppError } = require("./utils/app-error");
const morgan = require("morgan");
const appRouter = require("./routes/app-routes");

const app = express();
const host = "127.0.0.1";
const port = 8000;

connect("mongodb://localhost:27017/corporate-employee")
  .then(() => console.log("database is connected"))
  .catch(() => {
    console.log("database is disconnected");
    process.exit(1);
  });

app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

app.use("/", appRouter);

app.all("*", (request, response, next) => {
  next(new AppError(404, "not-found"));
});

app.use((err, request, response, next) => {
  const { statusCode = 500, status = "error", message = "internal server error" } = err;
  response.status(statusCode).json({ status, message });
});

app.listen(port, host, () => {
  console.log(`you are listening to ${host}: ${port}`);
});

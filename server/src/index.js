
const express=require('express');
require('dotenv').config();
const mongoose=require('mongoose');
const cors=require('cors');
const path =require('path');


dotenv({ path: path.join(__dirname, "../.env") });
const app = express();
const port = process.env.PORT || (5000);

connectDb();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.use((req, res) => {
  console.log("error not found 404");
  res.status(404).json({
    message: "Not Found",
    Status_code: 404,
  });
});
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,content-type"
  );
  next();
});

app.use((error, req, res, next) => {
  const errorstatus = req.statusCode || 400;
  console.log(errorstatus);
  res.status(errorstatus).json({
    message: error.message || "Something Went Wrong. Please try Again!",
    status_code: errorstatus,
  });
});
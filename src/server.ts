import app from "./app";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("**----------------------------------**");
  console.log("====      Server is On...!!!      ====");
  console.log(`====        port : ${PORT}        ====`);
  console.log("**----------------------------------**");
});

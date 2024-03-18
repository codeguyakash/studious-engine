const express = require("express");
const cluster = require("cluster");
const os = require("os");

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 4321;
console.log(numCPUs);

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("code--------------------", code);
    console.log("signal------------------", signal);
    cluster.fork();
  });
} else {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

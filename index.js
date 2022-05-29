const express = require("express");
const cors = require("cors")
const app = express();
const data = require("./api/weiboHot");

app.use(cors())
app.use(express.json({ extended: false }));
app.use("/api/hot", data);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

const express = require("express");
const app = express();
const data = require("./api/weiboHot");

app.use(express.json({ extended: false }));

app.use("/api/hot", data);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

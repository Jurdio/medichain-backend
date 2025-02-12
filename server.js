const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/auth/auth.routes");
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

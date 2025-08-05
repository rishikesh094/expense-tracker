const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const UserRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
const TransactionRouter = require("./routes/transactions");
const verifyToken = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", UserRouter);
app.use("/api/transactions", TransactionRouter);

app.get("/verify", verifyToken, (req, res) => {
  const user = req.user;
  
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

app.get("/logout", (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: true
    });

    // Send success response
    return res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);

    // Send error response
    return res.status(500).json({ msg: "Logout failed. Please try again later." });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// 1st version of server.js for testing purposes, before adding PostgreSQL and authentication
// const express = require("express");

// const app = express();
// const PORT = 3000;

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({ message: "Cocktail backend is running!" });
// });

// app.get("/api/cocktails", (req, res) => {
//   res.json([
//     { id: 1, name: "Margarita" },
//     { id: 2, name: "Mojito" }
//   ]);
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });



require("dotenv").config();

const express = require("express");
const cors = require("cors");
// const pool = require("./db");

const authRoutes = require("./routes/auth");
const cocktailRoutes = require("./routes/cocktails");
const userRoutes = require("./routes/users");
const favoriteRoutes = require("./routes/favorites");
const reviewRoutes = require("./routes/reviews");
const likeRoutes = require("./routes/likes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.json({ message: "Cocktail backend is running!" });
});


app.use("/api/auth", authRoutes);
app.use("/api/cocktails", cocktailRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/comments", reviewRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/likes", likeRoutes);


// Test PostgreSQL connection
// app.get("/api/database-test", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json({
//       message: "Database connected successfully",
//       time: result.rows[0].now
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Database connection failed",
//       error: error.message
//     });
//   }
// });

// Get cocktails from PostgreSQL
// app.get("/api/cocktails", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM cocktails ORDER BY name"
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// });




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
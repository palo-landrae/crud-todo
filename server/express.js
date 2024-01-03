const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
app.use(cors());

app.use(bodyParser.json());

const pool = new Pool({
  user: username,
  host: "localhost",
  database: "mydb",
  password: password,
  port: 5432,
});

app.get("/todos", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM todos");
    client.release();
    res.json({ todos: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/todos", async (req, res) => {
  const { task } = req.body;
  if (!task) {
    res.status(400).json({ error: "Task field is required" });
    return;
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO todos (task) VALUES ($1) RETURNING id",
      [task],
    );
    client.release();
    res.json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query("DELETE FROM todos WHERE id = $1", [id]);
    client.release();
    res.json({ message: "Todo deleted", deletedRows: result.rowCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  if (!task) {
    res.status(400).json({ error: "Task field is required" });
    return;
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE todos SET task = $1 WHERE id = $2",
      [task, id],
    );
    client.release();
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json({ message: "Task updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = "notes.json";

app.use(express.json());
app.use(express.static("public"));

function readNotes() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf8") || "[]");
}

function saveNotes(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

// GET - fetch all notes
app.get("/api/notes", (req, res) => {
  res.json(readNotes());
});

// POST - create a note
app.post("/api/notes", (req, res) => {
  const notes = readNotes();

  const note = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date().toISOString()
  };

  notes.push(note);
  saveNotes(notes);

  res.status(201).json(note);
});

// DELETE - delete a note
app.delete("/api/notes/:id", (req, res) => {
  let notes = readNotes();

  notes = notes.filter(note => note.id !== Number(req.params.id));
  saveNotes(notes);

  res.json({ message: "Note deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
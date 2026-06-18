const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

app.get("/users", (req, res) => {
  const allUsers = users;
  //userList is undefined.. so we should send allUsers instead
  res.send(allUsers);
});

app.get("/users/:id", (req, res) => {
  //user.id is in number format so we should convert req.params.id to number before comparing
  const id = Number(req.params.id);
  //even if we remove one '=' it will still work but it is not a good practice
  const user = users.find(u => u.id === id);
  res.send(user);
});

function getUserById(id) {
  const user = users.find(u => u.id === Number(id));
  //function is not returning anything so we should return user
  return user;
}

app.get("/notes/count", (req, res) => {
  const total = notes.length;
  res.send({ total });
});

app.get("/external-data", async (req, res) => {
  //fetchExternalData is not defined so we should define it before using
  //and as it is external api we should use await
  const data = await fetchExternalData();
  res.send(data);
});

app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    console.log("No notes found");
  }
  res.send(notes);
});

function generateNoteId() {
  //with this we can make sure that duplicate ids are not generated
  return Math.max(...notes.map(n => n.id), 0) + 1;
}

app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content) {
    return res.send("Invalid input");
  }

  const newNote = {
    id: generateNoteId(),
    title: title,
    content: content,
    userId: userId
  };

  notes.push(newNote);
  res.send(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);
  //if noteIndex is -1 it means note not found
  if (noteIndex === -1) {
    return res.status(404).send({ message: "Note not found" });
  }

  notes.splice(noteIndex, 1);
  res.send({ message: "Note deleted" });
});

app.put("/users/:id", (req, res) => {
  //converting id into number is a good practice
  const id = Number(req.params.id);
  const { name } = req.body;

  const user = users.find(u => u.id === id);
  //if user is not found we should return else server will break
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  user.name = name;

  res.send(user);
});

app.get("/user-notes/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const userNotes = notes.filter(n => n.userId === userId);
  res.send(userNotes);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {
    res.send({ message: "Login successful" });
  } else {
    res.send({ message: "Invalid credentials" });
  }
});

app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send(user.name);
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;
  //req.body always returns string
  const total = Number(a) + Number(b);
  res.send({ total });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
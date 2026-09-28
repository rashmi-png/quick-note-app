async function loadNotes() {
  const response = await fetch("/api/notes");
  const notes = await response.json();

  const notesDiv = document.getElementById("notes");
  notesDiv.innerHTML = "";

  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";

    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <button onclick="deleteNote(${note.id})">Delete</button>
    `;

    notesDiv.appendChild(div);
  });
}

async function addNote() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (title === "" || content === "") {
    alert("Please enter both title and content");
    return;
  }

  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      content: content
    })
  });

  if (response.ok) {
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    await loadNotes();
  } else {
    alert("Could not add note");
  }
}

async function deleteNote(id) {
  await fetch("/api/notes/" + id, {
    method: "DELETE"
  });

  loadNotes();
}

loadNotes();
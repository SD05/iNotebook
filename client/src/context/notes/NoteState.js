import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];

  const [notes, setNotes] = useState(notesInitial);

  // Get all Note
  const getNotes = async () => {
    // API call
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjQ1MzY5YTkyNmE1NGZlOGM2ODkzNDU0IiwiaWF0IjoxNjgzOTA2ODYxfQ.bwlk5B7zFEuNbpy9osn1nUImBwLdGFnd3EIhiSZ7NtM",
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjQ1MzY5YTkyNmE1NGZlOGM2ODkzNDU0IiwiaWF0IjoxNjgzOTA2ODYxfQ.bwlk5B7zFEuNbpy9osn1nUImBwLdGFnd3EIhiSZ7NtM",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    setNotes(notes.concat(json));
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjQ1MzY5YTkyNmE1NGZlOGM2ODkzNDU0IiwiaWF0IjoxNjgzOTA2ODYxfQ.bwlk5B7zFEuNbpy9osn1nUImBwLdGFnd3EIhiSZ7NtM",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = response.json();

    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        element.title = title ? title : element.title;
        element.description = description ? description : element.description;
        element.tag = tag ? tag : element.tag;
      }
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjQ1MzY5YTkyNmE1NGZlOGM2ODkzNDU0IiwiaWF0IjoxNjgzOTA2ODYxfQ.bwlk5B7zFEuNbpy9osn1nUImBwLdGFnd3EIhiSZ7NtM",
      },
    });
    const json = await response.json();

    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, getNotes, addNote, editNote, deleteNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
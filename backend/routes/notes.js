const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/notesModel");

// ROUTE 1: Get all the notes using: GET "/api/notes/fetchnotes". login required
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new note using: POST "/api/notes/addnote". login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //If there are errors, returns a Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Creating the note in the database
      const note = await Notes.create({
        title,
        description,
        tag,
        user: req.user,
      });

      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote". login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(400);
      throw new Error("Note not found");
    }

    // Check for User
    if (!req.user) {
      res.status(401);
      throw new Error("User not Found");
    }

    // Make sure the logged in user matches with the goal user
    if (note.user.toString() !== req.user) {
      res.status(401);
      throw new Error("User Not Authorized");
    }

    // Create  anew note object
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    // Find the note to be updated and update it.

    const updatedNote = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      {
        new: true,
      }
    );

    res.json(updatedNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete an existing note using: PUT "/api/notes/updatenote". login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      res.status(400);
      throw new Error("Note not found");
    }

    // Check for User
    if (!req.user) {
      res.status(401);
      throw new Error("User not Found");
    }

    // Make sure the logged in user matches with the goal user
    if (note.user.toString() !== req.user) {
      res.status(401);
      throw new Error("User Not Authorized");
    }

    // Find the note to be updated and update it.

    const deleteNote = await Notes.findByIdAndRemove(req.params.id);
    res.status(200).json(deleteNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

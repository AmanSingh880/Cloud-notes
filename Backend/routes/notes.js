const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Route 1: Get all notes for the authenticated user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ errors: "Server Error" });
    }
});

// Route 2: Add a new note for the authenticated user
router.post('/addnotes', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description length should be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;
        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id
        });

        const saveNote = await note.save();
        res.json(saveNote);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ errors: "Server Error" });
    }
});

// Route 2: Add a new note for the authenticated user
router.post('/updatenote:id', fetchuser, async (req, res) => {

});


module.exports = router;

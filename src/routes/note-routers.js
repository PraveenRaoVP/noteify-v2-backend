const express = require("express");
const Note = require("../models/note");
const auth = require("../middlewares/auth");

const router = new express.Router();

//save note
router.post("/notes/create", auth, async (req,res) => {
    const note = new Note({
        ...req.body, 
        owner: req.user._id
    })

    try{
        await note.save();
        res.status(201).send({note,message: "note saved"})
    } catch(e){
        res.status(500).send(e);
    }
});

//get all notes
router.get('/notes/get', auth, async (req,res) => {
    try{
        await req.user.populate(notes);
        res.send(req.user.notes);
        res.status(200);
    } catch(e) {
        res.status(500).send(e);
    }
});

//get note by id
router.get('/notes/:id',auth, async (req,res) => {
    try{
        const note = await Note.findById({ _id: req.params.id});
        if(!note){
            return res.status(404).send();
        }
        res.send(note);
    } catch(e){
        res.status(500).send(e);
    }
});

//delete note
router.delete('/notes/:id',auth, async (req,res) => {
    try{
        const note = await Note.findOneAndDelete({ _id: req.params.id });
        if(!note){
            return res.status(404).send();
        }
        res.send({message: "Note deleted"});
    } catch(e){
        res.status(500).send(e);
    }
});

module.exports = router;



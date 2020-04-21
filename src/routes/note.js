const express = require('express')
const Note = require('../models/note')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()


router.post('/notes', auth, async (req, res) => {
    const note = new Note({
        ...req.body,
        owner: req.user._id
    })

    try {
        await note.save()
        console.log(note)
        res.status(201).send(note)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/notes', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'notes',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.notes)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/notes/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const note = await Note.findOne({ _id, owner: req.user._id })

        if (!note) {
            return res.status(404).send()
        }

        res.send(note)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/notes/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description','myday']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const note = await Note.findOne({ _id: req.params.id, owner: req.user._id})

        if (!note) {
            return res.status(404).send()
        }

        updates.forEach((update) => note[update] = req.body[update])
        await note.save()
        res.send(note)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/notes/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!note) {
            res.status(404).send()
        }

        res.send(note)
    } catch (e) {
        res.status(500).send()
    }
})


// Image upload in notes 

const upload = multer({
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})



router.post('/notes/:id/myday', auth, upload.single('myday'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    console.log("buffer", buffer)
     const note = await Note.findOne({ _id: req.params.id, owner: req.user._id})

    
    console.log("from notes/mtynotesss", note)
    note.myday = buffer
    console.log("ADD MY DAY", note)
    
    await note.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


   


    
   
// router.delete('/notes/my/myday', auth, async (req, res) => {
//     req.note.myday = undefined
//     await req.note.save()
//     res.send()
// })

// router.get('/notes/:id/myday', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)

//         if (!user || !user.image) {
//             throw new Error()
//         }

//         res.set('Content-Type', 'image/png')
//         res.send(user.image)
//     } catch (e) {
//         res.status(404).send()
//     }
// })



//////////////////////////////////////////////////////////////////////////////////////////////





module.exports = router
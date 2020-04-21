const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Note = require('../models/note')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

       // const whomtolinkImage= await Note.findOne({_id: req.params.id, owner: req.user._id})
       

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user

        //req.note = whomtolinkImage
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth
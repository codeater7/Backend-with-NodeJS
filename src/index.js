const express = require('express')
require('./database/mongoose')
const userRouter = require('./routes/user')
const noteRouter = require('./routes/note')

const app = express()
//const port = process.env.PORT
const port = 3002

app.use(express.json())
app.use(userRouter)
app.use(noteRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
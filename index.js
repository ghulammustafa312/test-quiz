const express = require('express');
const cors = require('cors');
require('dotenv').config({})

const connectDB = require('./db');

connectDB()
const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({
        success: true, errors: null, data: {
            message: "Quiz Task Finished"
        }
    })
})

app.use('/api/quiz', require('./routes/quiz.routes'))

app.use('*', function (req, res) {
    res.status(404).json({ success: false, errors: "Not Found", data: null });
});

app.use((error, request, response, next) => {
    console.log(`error ${error.message}`)
    const status = error.status || 500
    response.status(status).json({ success: false, errors: error.message, data: null })
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running"))
const express = require('express')
const app = express()
const port = 3000

const config = require('./config/key');

//const bodyParser = require('body-parser');
const User = require('./models/User.js');

app.use(express.urlencoded({extended: false}));
//app.use(bodyParser.json());
console.log(process.env.MONGO_URI);

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.log(err));



app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요1~')
})

app.post('/register', (req, res) =>{
    //sign up -> database
    const user = new User(req.body);
    console.log(user);
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err});

        return res.status(200).json({success: true});
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
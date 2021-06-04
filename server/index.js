const express = require('express')
const app = express()

const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');

const config = require('./config/key');

//const bodyParser = require('body-parser');
const {User} = require('./models/User.js');

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.log(err));



app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요1~')
})

app.get('/api/hello', (req, res) => {
    res.send('hello~~~~!!');
})


//회원가입
app.post('/api/users/register', function(req, res){
    //sign up -> database
    const user = new User(req.body);
    console.log(user);
    //db에 저장
    user.save(function(err, userInfo) {
        if(err) return res.json({ success: false, err});

        return res.status(200).json({success: true});
    });
})

app.post('/api/users/login', function(req, res) {
    
    //요청된 이메일을 db에서 찾는다
    User.findOne({email: req.body.email}, function(err, user){
        //console.log(user);
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //이메일이 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, function(err, isMatch) {
            console.log(isMatch);
            if(!isMatch) 
                return res.json({loginSuccess: false, 
                    message: "비밀번호가 틀렸습니다."})

            //비밀번호까지 맞으면 토큰 생성
            user.generateToken(function (err, user) {
                if(err) return res.status(400).send(err);

                res.cookie('x_auth', user.token).status(200)
                .json({loginSuccess: true, userId: user._id})
            })
        })
    })
})

app.get('/api/users/auth', auth, function(req, res){
    //여기까지왔으면 auth가 true임
    res.status(200).json({
        _id: req.user._id,

        //role 0이면 일반유저
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, function(req, res) {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""},
    function(err, user){
        if(err) return res.json({success: false})
        return res.status(200).json({
            success:true
        })
    })
})

const port = 5000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
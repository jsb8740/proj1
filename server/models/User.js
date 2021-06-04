const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;  //salt가 몇글자인지 10자리인 salt를만듬
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 16
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { //사용자가 누구인지..
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')){

        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else{
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    } )
}

userSchema.methods.generateToken = function(cb) {
    var user =this;

    //jsonwebtoken을 이용해서 token 생성  user._id + 'secretToken' = token
    var token = jwt.sign(user._id.toString(), 'secretToken');

    //user._id + 'secretToken' => token을 만듬 encode함
    //decode하려면 secretToken를 빼면 user._id가나옴

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })


}

userSchema.statics.findByToken = function (token, cb) {
    var user =this;

    //토큰을 decode함
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function (err, user){
            if(err) return cb(err);

            cb(null, user);
        })

    })
}

const User = mongoose.model('User', userSchema);

module.exports = {User};
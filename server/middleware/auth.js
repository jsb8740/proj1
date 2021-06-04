const {User} = require('../models/User');

let auth = function (req, res, next) {

    //인증 처리하는 곳

    //클라이언트 쿠키에서 토큰을 가져옴..
    let token = req.cookies.x_auth;

    //토큰을 복호화 하고 유저를 찾음
    User.findByToken(token, function(err, user){
        if(err) throw err;

        //없으면 no
        if(!user) return res.json({isAuth: false, error: true});

        console.log(`req.token: ${req.token}
        token: ${token}`);
        //유저가 있으면 인증
        req.token = token;
        req.user = user;
        next();

    })

}

module.exports = {auth};
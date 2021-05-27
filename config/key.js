if(process.env.NODE_ENV === 'product') { 
    //process.env.NODE_ENV는 개발환경 로컬에서 하면 development
    module.exports = require('./prod');
} else {    //배포된 환경
    module.exports = require('./dev');
}
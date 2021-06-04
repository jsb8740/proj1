import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action';

export default function(SpeificComponent, option, adMinRoute = null) {

    //옵션 null ->아무나 출입이 가능한 페이지
    //true -> 로그인한 유저만 출입
    //false -> 로그인한 유저는 출입 불가능..

    //adMinRoute true-> 어드민만 들갈수있음

    function AuthenticationCheck(props) {

        const disPatch = useDispatch();
        useEffect(() => {
            
            disPatch(auth()).then(response=> {
                console.log(response);

                //로그인 하지않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login');
                    }

                }else { //로그인 한 상태
                    if(adMinRoute && !response.payload.isAdmin){
                        props.history.push('/');
                    } else{ //로그인한 유저가 회원가입, 로그인 페이지 갈때
                        if(option === false)
                            props.history.push('/');
                    }
                }
            })
            
        }, [])

        return (
            <SpeificComponent />
        )
    }
    return AuthenticationCheck
}
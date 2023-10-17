import {Link} from "react-router-dom";
import { useEffect, useContext } from "react";
import {UserContext} from "./UserContext"

export default function Header(){
    
    const {setUserInfo,userInfo} = useContext(UserContext)

    useEffect(()=>{
        fetch('http://localhost:4000/profile',{
            credentials: 'include',
        }).then(response=>{
            response.json().then(userInfo=>{//the token info is inside the userInfo now
                setUserInfo(userInfo);
            })
        })
    },[]);

    function logout(){
        fetch('http://localhost:4000/logout',{
            credentials: 'include',
            method: 'POST'
        });
        setUserInfo(null);//set username to null when hit the logout button
    }

    const username = userInfo?.username;//username sometimes be null

    return(
        <header>
            <Link to="/" className="logo">MyBlog</Link>
            <nav>
                {username && (
                    <>
                        <Link to="/create">Create new post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
                
            </nav>
        </header>
    );
}
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext } from "react";

export default function Login(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect,setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext)

    async function login(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/login',{
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'},
            credentials: 'include',
        });
        if(response.ok){
            response.json().then(userInfo=>{
                setUserInfo(userInfo);//set user info to response userinfo
                setRedirect(true);
            })
            
        }else{
            alert('Incorrect credentials');
        }
    }

    if (redirect){
        return <Navigate to={'/'} /> 
    }

    return(
        <div>
            <form className="login" onSubmit={login}>
                <h1>Login</h1>
                <input 
                type="text" 
                value={username} 
                onChange={ev=>setUsername(ev.target.value)}
                placeholder="username"
                 />
                <input 
                type="password" 
                value={password}
                onChange={ev=>setPassword(ev.target.value)}
                placeholder="password" 
                />
                <button>Login</button>
            </form>
        </div>
    );
}
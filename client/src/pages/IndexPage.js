import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage(){
    const [posts,setPosts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/post').then(response=>{
            response.json().then(posts=>{
                setPosts(posts);
            });
        });
    }, []);
    return(
        <>
            {posts.length > 0 && posts.map(post=>( //if posts array's length is greater than 0 then runs the map function
                <Post {...post} /> //pass the properties of post
                ))}
        </>
    );
}
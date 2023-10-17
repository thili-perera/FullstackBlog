import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {useEffect, useState} from "react";
import { Navigate, useParams } from "react-router-dom";

const modules = {
    toolbar : [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        [ 'link','image'],
      
        ['clean']                                         // remove formatting button
      ]
}

export default function EditPost(){
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files,setFiles] = useState('');
    // const [cover,setCover] = useState('');
    const [redirect,setRedirect] = useState(false);

    useEffect(()=>{
        fetch('http://localhost:4000/post/'+id)
        .then(response =>{
            response.json().then(postInfo => {
                console.log(postInfo);
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
            });
        });
    },[]);

    async function updatePost(ev){
        ev.preventDefault();
        
        const data = new FormData(); //bcz there is file so its better to not use json..that's why create a new object called data
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('id',id)
        if(files?.[0]){//if we have files of zero
            data.set('file',files?.[0]);//not an array of files
        }

        const response = await fetch('http://localhost:4000/post',{
            method:'PUT',
            body: data,
            credentials: 'include',
        });

        if(response.ok){
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/post/'+id} /> 
    }
    
    return(
        <form onSubmit={updatePost}>
            <input type="title" 
                    placeholder={'Title'} 
                    value={title}
                    onChange={ev=> setTitle(ev.target.value)} />
            <input type="summary" 
                    placeholder={'Summary'}
                    value={summary}
                    onChange={ev=> setSummary(ev.target.value)} />
            <input type="file"
                    onChange={ev=>setFiles(ev.target.files)} />
            <ReactQuill value={content}
                        onChange={setContent}
                        modules={modules} />
            <button style={{marginTop:'5px'}}>Update post</button>
        </form>
    );
}
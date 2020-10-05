import React, {useState} from 'react';
import { Link } from 'react-router-dom';

const serverUrl = 'http://localhost:4000/upload';

const Index = ()=>{
    const user = sessionStorage.getItem('user');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [buttonLoader, setButtonLoader] = useState(false)
    const progressBar = uploading ? <div style = {{
        position:"absolute",
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        zIndex: 100,
        background: 'rgba(0,0,0,0.7)'
    }}><div style={{
        flexBasis: '100%',
        textAlign:'center',
        color: 'white',
        fontSize: 40,
        fontWeight: 600, 
        marginBottom: '-150px'
    }}>{Math.floor(uploadProgress * 100 - 1)}%</div><progress value = {uploadProgress} style={{
            marginTop: '-150px'
    }}></progress></div> : undefined
    if(user){
        const handleFormData = async (e)=>{
            const promise = await new Promise((resolve, reject)=>{
                const form = e.target;
                const heading = form.heading.value;
                const content = form.content.value;
                const video = form.video.files[0]
                if (heading.trim() !== '' && content.trim() !== '') {
                    const formData = new FormData();
                    formData.append('video', video, video.name)
                    formData.append('heading', heading)
                    formData.append('content', content)
                    //generating thumbnail for session
                    const videoPlayer = document.createElement('video');
                    const url = URL.createObjectURL(video);
                    videoPlayer.src = url;
                    videoPlayer.currentTime = 10;
                    videoPlayer.onloadeddata = e => {
                        const canvas = document.createElement('canvas');
                        canvas.width = videoPlayer.videoWidth;
                        canvas.height = videoPlayer.videoHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
                        const data = ctx.canvas.toDataURL('image/png', 0.5);
                        formData.append('thumbnail', data);
                        //send to the server using ajax
                        const xml = new XMLHttpRequest();

                        //also check for progress
                        xml.upload.onprogress = e => {
                            const percentage = e.loaded * 100 / video.size;
                            setUploadProgress(percentage / 100)
                        }
                        //end progress check ---->
                        xml.onreadystatechange = e => {
                            if (xml.readyState === 1) {
                                setUploading(true)
                            }
                            if (xml.readyState === 4 && xml.status === 200) {
                                
                                form.reset()
                                resolve(xml.status)
                            }
                        }
                        
                        xml.open('post', serverUrl, true);
                        xml.send(formData)
                    }
                }else{
                    setButtonLoader(false)
                }
            });
            const response = await promise
            return response
        }

        console.log(user)
        return(
            <div className= 'add'>
                <div className="container">
                    <form action = "" onSubmit = {(e)=>{
                        e.preventDefault();
                        setButtonLoader(true)
                        e.persist()
                        handleFormData(e).then(response =>{
                            if(response === 200){
                                setUploading(false);
                                setButtonLoader(false)
                            }
                        })
                    }}>
                        <div className="remove">
                            <Link to = '/delete'> Delete Posts</Link>
                        </div>
                        <label htmlFor="heading">
                            <p>Heading</p>
                            <input type="text" placeholder = 'Choose a Heading' name= 'heading'/>
                        </label>
                        <label htmlFor="writeup">
                            <p>Body Content</p>
                            <textarea  spellCheck = 'true' name="content" id="" cols="30" rows="10"></textarea>
                        </label>
                        <label htmlFor="video">
                            <input type="file" className = 'file' accept='video/mp4' name='video' />
                        </label>
                        <button type = 'submit'>{buttonLoader ? <div className="lds-ring"><div></div><div></div><div></div><div></div></div> : 'Upload'}</button>
                        {progressBar}
                    </form>
                </div>
            </div>
        )
    }else{
        window.location.href = '/'
    }
   
}
export default Index
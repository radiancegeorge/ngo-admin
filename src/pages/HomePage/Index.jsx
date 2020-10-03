import React, {useState, useEffect} from 'react';

const Index = () =>{
    const [user, alertUser] = useState('Please Sign In')
    const credentials = {
        username: 'radiance',
        password: 'radiance'
    }
    useEffect( e =>{
       setTimeout(() => {
           alertUser('Please Sign in')
           
       }, 3000); 
    },[]);
    if(sessionStorage.getItem('user')){
        window.location.href = '/add'
    }else{
        return (
            <div className='homepage'>
                <div className="container">

                    <form action="" onSubmit={(e) => {
                        e.preventDefault()
                        if (e.target.username.value === credentials.username && e.target.password.value === credentials.password) {
                            sessionStorage.setItem('user', e.target.username.value);
                            window.location.href = '/add';
                        } else {
                            alertUser('Invalid Credentials')
                        }
                    }}>
                        <div style={{
                            fontSize: 30
                        }}>
                            {user}
                        </div>
                        <input type="text" name='username' placeholder='UserName' />
                        <input type="Password" name='password' placeholder='Password' />
                        <button type='submit'>Log In</button>
                    </form>
                </div>
            </div>
        )
    }
    
}
export default Index
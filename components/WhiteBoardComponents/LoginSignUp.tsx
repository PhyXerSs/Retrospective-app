import { AnimatePresence , motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { linkFromUrlState, RoomDataStateType, WhiteBoardRoomDataState, whiteBoardUserDataState, whiteBoardUserDataStateType } from '../../WhiteBoardStateManagement/Atom'
import TextField from '@mui/material/TextField';
import { borderColor } from '@mui/system';
import { styled } from '@mui/material/styles';
import GoogleLogin from 'react-google-login';
import { v4 as uuid } from 'uuid';
import Lobby from './Lobby';
import { useRouter } from "next/router";
import firebase, { signInWithGoogle } from '../../firebase/firebase-config';
import UploadPhotoInLogin from './UploadPhotoInLogin';
import { useWindowSize } from 'usehooks-ts'
import { firestore } from 'firebase';
function LoginSignUp() {
    const [ userData , setUserData ] = useRecoilState(whiteBoardUserDataState);
    const [ roomData , setRoomData ] = useRecoilState(WhiteBoardRoomDataState); 
    const [ loginSignupMode , setLoginSignupMode ] = useState<string>('login');
    const [isLoading ,setIsLoading] = useState<boolean>(false);
    const [delayAnimation , setDelayAnimation] = useState<number>(0);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const signupEmailRef = useRef<HTMLInputElement>(null);
    const signupPasswordRef = useRef<HTMLInputElement>(null);
    const signupDisplayName = useRef<HTMLInputElement>(null);
    const [ linkFromUrl , setLinkFromUrl ] = useRecoilState(linkFromUrlState);
    const [ selectImage , setSelectImage ] = useState<string>('-');
    const [ isSelectedImage , setIsSelectedImage] = useState<boolean>(false);
    const router = useRouter();
    const CssTextField = styled(TextField)({
        '& label.Mui-focused': {
          borderColor:'#94a3b8',
          color:'#94a3b8'
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#94a3b8',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#94a3b8',
          },
          '&:hover fieldset': {
            borderColor: '#94a3b8',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#94a3b8',
          },
        },
      });
    const { width, height } = useWindowSize();
    const [ isEmailSignupError , setIsEmailSignupError ] = useState<string>('');
    const [ isPasswordSignupError , setIsPasswordSignupError ] = useState<boolean>(false);
    const [ emailSinginErrorType , setEmailSinginErrorType ] = useState<string>('');
    useEffect(()=>{
        if(userData.userId === '-' && roomData.roomId === '-'){
            setDelayAnimation(0);
            setLoginSignupMode('login');
            setIsEmailSignupError('');
            setIsPasswordSignupError(false);
            setEmailSinginErrorType('');
        }
    },[userData , roomData])

    useEffect(()=>{
        // handle login
        firebase.auth().onAuthStateChanged(authUser => {
            // console.log(authUser);
            if(authUser){
                firebase.database().ref(`/userRetrospective/${authUser.uid}`).once('value' ,async snapshot =>{
                    // old user case
                    if(snapshot.val()){
                        let user = {} as whiteBoardUserDataStateType;
                        user.userId = authUser.uid;
                        user.userName = snapshot.val()?.displayName as string;
                        user.profilePicture = snapshot.val()?.photoURL as string;
                        user.backgroundPicture = snapshot.val()?.backgroundPicture as string;
                        // user.category = snapshot.val()?.category as string[];
                        setUserData(user);
                    }else{// new user case (login with gmail)
                        if(!authUser.displayName)
                            return;
                        let categoryDocs = await firebase.firestore().collection('whiteboard').add({
                            'catagories': 'DEFAULT',
                            'create': new Date().valueOf(),
                            'userInCategory':[authUser.uid],
                            'userAllowAccessAllBoard':[authUser.uid],
                            'headOfCategory':authUser.uid
                        })
                        firebase.database().ref(`/userRetrospective/${authUser.uid}`).set({
                            displayName:authUser?.displayName,
                            photoURL:authUser?.photoURL,
                            backgroundPicture:'',
                        })
                        let user = {} as whiteBoardUserDataStateType;
                        user.userId = authUser.uid;
                        user.userName = authUser?.displayName as string;
                        user.profilePicture = authUser?.photoURL as string;
                        user.backgroundPicture = ''
                        // user.category = [categoryDocs.id] as string[];
                        setUserData(user);
                    }
                })
                let roomIdFromPath = router.asPath.split('#')[1] as string;
                if(roomIdFromPath !== undefined){
                    setLinkFromUrl(roomIdFromPath);
                }
            }
            
        })
        // if(localStorage.getItem('whiteboard_userId') !== null){
        //     let user = {} as whiteBoardUserDataStateType;
        //     user.userId = localStorage.getItem('whiteboard_userId') as string;
        //     user.userName = localStorage.getItem('whiteboard_userName') as string;
        //     user.profilePicture = localStorage.getItem('whiteboard_userProfilePicture') as string;
        //     user.backgroundPicture = localStorage.getItem('whiteboard_userBackgroundPicture') as string;
        //     setUserData(user);
        // }
        
    },[])

    useEffect(()=>{
        if(linkFromUrl !== '-' && userData.userId !== '-'){
            (async function(){
                await firebase.database().ref(`retrospective/${linkFromUrl}/roomDetail`).once('value' , async snapshot =>{
                    if(snapshot.val()){
                        let categoryId = snapshot.val()?.catagories

                        let categoyDoc = await firebase.firestore().collection('whiteboard').doc(categoryId).get();
                        let usersCategoryList = categoyDoc.data()?.userInCategory as string[];
                        if(!usersCategoryList.includes(userData.userId)){
                            await firebase.firestore().collection('whiteboard').doc(categoryId).update({
                                userInCategory:[...usersCategoryList, userData.userId]
                            });
                        }
                        await Promise.all([
                            firebase.database().ref(`retrospective/${linkFromUrl}/roomDetail/userInRoom/${userData.userId}`).set({
                                name:userData.userName,
                                profilePicture:userData.profilePicture,
                                isOnline:true,
                            }),
                            firebase.database().ref(`userRetrospective/${userData.userId}`).update({
                                statusOnline:true,
                                room:linkFromUrl
                            }),
                            
                        ]);
                    }
                })
                
                await firebase.database().ref(`retrospective/${linkFromUrl}/roomDetail`).once('value' , snapshot =>{
                    if(snapshot.val() !== null){
                        let roomSelect = {} as RoomDataStateType;
                        roomSelect.roomId = linkFromUrl;
                        roomSelect.roomName = snapshot.val()?.roomName;
                        roomSelect.createBy = snapshot.val()?.createBy;
                        setRoomData(roomSelect);
                    }
                })
            }()); 
            setLinkFromUrl('-');
        }
    },[linkFromUrl , userData])

    function RenderSigninError(){
        if(emailSinginErrorType !== ''){
            return <p className="pl-2 text-danger text-[14px]">Email or password invalid.</p>
        }else{
            return<></>
        }

    }

    async function handleLogin(e:any) {
        e.preventDefault();
        if(emailRef.current && passwordRef.current){
            try{
                await firebase.auth().signInWithEmailAndPassword(emailRef.current?.value , passwordRef.current?.value);
            }
            catch(err:any){
                setEmailSinginErrorType(err.message);
            }
        }
    }

    async function handleSignup(e:any){
        e.preventDefault();
        setIsEmailSignupError('');
        setIsPasswordSignupError(false);
        if(signupEmailRef.current && signupPasswordRef.current && signupDisplayName.current){
            try{
                let resultSignup = await firebase.auth().createUserWithEmailAndPassword(signupEmailRef.current.value , signupPasswordRef.current.value);
                let user = firebase.auth().currentUser;
                user?.updateProfile({
                    displayName: signupDisplayName.current.value.replaceAll(" ","").replaceAll("-",""),
                    photoURL: '/static/images/whiteboard/profile.png'
                })
                let categoryDocs = await firebase.firestore().collection('whiteboard').add({
                    'catagories': 'DEFAULT',
                    'create': new Date().valueOf(),
                    'userInCategory':[resultSignup?.user?.uid],
                    'userAllowAccessAllBoard':[resultSignup?.user?.uid],
                    'headOfCategory':resultSignup?.user?.uid
                })
                await firebase.database().ref(`/userRetrospective/${resultSignup?.user?.uid}`).set({
                    displayName:signupDisplayName.current.value.replaceAll(" ","").replaceAll("-",""),
                    photoURL:'/static/images/whiteboard/profile.png',
                    backgroundPicture:'',
                })
                let newUser = {} as whiteBoardUserDataStateType;
                newUser.userId = resultSignup?.user?.uid as string;
                newUser.userName = signupDisplayName.current.value.replaceAll(" ","").replaceAll("-","");
                newUser.profilePicture = "/static/images/whiteboard/profile.png";
                newUser.backgroundPicture = "";
                newUser.category = [categoryDocs.id];
                setUserData(newUser);
            }catch(err:any){
                console.log(err);
                
                if(err?.message === 'The email address is badly formatted.'){
                    setIsEmailSignupError('Invalid email address format.');
                }
                if(err?.message === 'The email address is already in use by another account.'){
                    setIsEmailSignupError(err?.message);
                }
                if(err?.message === 'Password should be at least 6 characters'){
                    setIsPasswordSignupError(true);
                }
            }
        }
    }

    function RenderLoginOrSignUp(){
        if(loginSignupMode === 'login' && delayAnimation === 0){
            return(
                <div className="w-full flex justify-center items-center overscroll-auto">
                    <motion.div className="flex flex-col flex-1 justify-center items-center px-[70px] overscroll-auto"
                        animate={{ opacity: 1 , x:0 }}
                        initial={{opacity : 0 , x:0 }}
                        exit ={{ opacity : 0  , x:0}}
                        transition={{  duration:0.5}}
                    >
                        <div className="w-full flex flex-col items-center max-w-[350px] md:max-w-[500px] h-fit">
                            <motion.p className="text-[32px] font-[800]" style={{fontFamily:"'Montserrat', sans-serif"}}
                                    animate={{ opacity: 1 , y:0 }}
                                    initial={{opacity : 0 , y:-150 }}
                                    exit ={{ opacity : 0  }}
                                    transition={{  duration:0.3}}
                            >Sign in</motion.p>
                            <form  className="w-full" 
                                onSubmit={handleLogin}
                            >
                                <motion.div
                                    animate={{ opacity: 1 , x:0 }}
                                    initial={{opacity : 0 , x:-500 }}
                                    exit ={{ opacity : 0  ,}}
                                    transition={{  duration: 0.6 }}
                                >
                                    <CssTextField required inputRef={emailRef} fullWidth variant="outlined" label="email" size={'small'} style={{ marginTop:'40px'}} InputLabelProps={{ required: false }}/>
                                </motion.div>
                                <motion.div
                                    animate={{ opacity: 1 , x:0 }}
                                    initial={{opacity : 0 , x:-500 }}
                                    exit ={{ opacity : 0  ,}}
                                    transition={{  duration: 0.9  }}
                                >
                                    <CssTextField required type={'password'} inputRef={passwordRef} fullWidth variant="outlined" label="password" size={'small'} style={{ marginTop:'30px'}} InputLabelProps={{ required: false }}/>
                                </motion.div>
                                <motion.div
                                    animate={{ opacity: 1 , scale:1 }}
                                    initial={{opacity : 0 , scale:0 }}
                                    exit ={{ opacity : 0  ,}}
                                    transition={{  duration:1.2}}
                                >
                                    <div className="w-full flex justify-center items-center">
                                        <p className="text-h5 font-bold mt-10 " style={{fontFamily:"'Montserrat', sans-serif"}}>Or Sign in with</p>
                                    </div>
                                    
                                    <div onClick={signInWithGoogle} className="w-full flex justify-center items-center py-3 border-[1px] border-secondary-gray-3 rounded-md outline-none mt-8 gap-3">
                                                <img src="/static/images/whiteboard/googleIcon.jpg"  alt="" className="w-4" />
                                                <p className="text-secondary-gray-3 text-h5 font-semibold" style={{fontFamily:"'Montserrat', sans-serif"}}>Sign in with Google</p>
                                    </div>
                                    {/* <GoogleLogin
                                        clientId="40517616525-di1vjhemnupkg9iavccfft03b2k8egkf.apps.googleusercontent.com"
                                        render={renderProps => (
                                            <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="w-full flex justify-center items-center py-3 border-[1px] border-secondary-gray-3 rounded-md outline-none mt-8 gap-3">
                                                <img src="/static/images/whiteboard/googleIcon.jpg"  alt="" className="w-4" />
                                                <p className="text-secondary-gray-3 text-h5 font-semibold" style={{fontFamily:"'Montserrat', sans-serif"}}>Sign in with Google</p>
                                            </button>
                                        )}
                                        buttonText="Login"
                                        onSuccess={onLoginWithGoogleSuccess}
                                        onFailure={onLoginWithGoogleFailure}
                                        cookiePolicy={'single_host_origin'}
                                    /> */}
                                </motion.div>
                                <motion.div className="flex flex-col w-full justify-center items-center mt-16 gap-2"
                                    animate={{ opacity: 1 ,  x:0}}
                                    initial={{opacity : 0 ,  x:-500}}
                                    exit ={{ opacity : 0 }}
                                    transition={{  duration: 1.2 }}
                                >
                                    <button type="submit" className={`w-full md:max-w-[250px] flex justify-center items-center drop-shadow-lg ${isLoading ? 'bg-primary-blue-2 cursor-default' : 'bg-[#334155] hover:bg-[#546c8d] cursor-pointer'} duration-200 ease-in text-white font-semibold py-2 rounded-md`} style={{fontFamily:"'Montserrat', sans-serif"}}>
                                        Sign in
                                    </button>
                                    {RenderSigninError()}
                                </motion.div>

                                <motion.div className="flex w-full justify-center items-center mt-10 gap-3" style={{fontFamily:"'Montserrat', sans-serif"}}
                                    animate={{ opacity: 1 }}
                                    initial={{opacity : 0 }}
                                    exit ={{ opacity : 0 }}
                                    transition={{  duration: 0.5 }}
                                >
                                    <p className="text-h5 font-semibold" >{`Don't have an account?`}</p>
                                    <p className="text-h5 font-semibold hover:text-[#4682ef] cursor-pointer"
                                        onClick={()=>{
                                            setDelayAnimation(1);
                                            setTimeout(()=>{setLoginSignupMode('signup')},1000);
                                        }}
                                    >Sign up</p>
                                </motion.div>
                            </form>
                        </div>
                        {/* <div className=" w-9/12 max-w-[500px] h-full flex flex-col justify-center items-start">
                            <motion.div className="flex flex-col items-start justify-start h-[180px]"
                                animate={{ opacity: 1 , y:0 }}
                                initial={{opacity : 0 , y:-150 }}
                                exit ={{ opacity : 0  }}
                                transition={{  duration:0.5}}
                            >
                                <img src={'/static/images/whiteboard/LogoRetro4x.png'} className="w-48 object-cover" alt=""
                                    draggable={false}
                                />
                            </motion.div>
                            <div className="w-full flex flex-col justify-start items-start gap-12">
                                <motion.p className="text-[28px] font-[800]" style={{fontFamily:"'Montserrat', sans-serif"}}
                                    animate={{ opacity: 1 , x:0 }}
                                    initial={{opacity : 0 , x:-500 }}
                                    exit ={{ opacity : 0  ,}}
                                    transition={{  duration: 0.8 }}
                                >Create account</motion.p>

                                <div className="flex w-full justify-start items-center gap-12">
                                    <div className="w-[88px] h-[88px] flex items-center justify-center bg-[#f5f5f5] rounded-full">
                                        {selectImage === '-' ? 
                                            <img className="w-[22px]" src={'/static/images/whiteboard/ImageIcon.png'} alt=""/>
                                            :<img className="w-full h-full object-cover rounded-full" src={selectImage} alt=''/>
                                        }   
                                        
                                    </div>
                                    <div className="flex justify-center items-center bg-[#1363df] hover:bg-[#153a62] rounded-lg px-5 py-2 cursor-pointer ease-in duration-200"
                                        onClick={()=>{
                                            setIsSelectedImage(true);
                                        }}
                                    >
                                        <p className="text-white">Upload photo</p>
                                    </div>
                                </div>

                                <form  className="w-full" 
                                    onSubmit={(e)=>{
                                        e.preventDefault();
                                        if(emailRef.current !== null && emailRef.current.value !== '' && !isLoading){
                                            let user = {} as whiteBoardUserDataStateType;
                                            user.userId = uuid();
                                            user.userName = emailRef.current.value.replaceAll(" ","").replaceAll("-","");
                                            if(selectImage === '-'){
                                                user.profilePicture = "/static/images/whiteboard/profile.png"
                                            }else{
                                                user.profilePicture = selectImage;
                                            }
                                            user.backgroundPicture = ""
                                            setDelayAnimation(-1);
                                            setTimeout(()=>{
                                                setUserData(user);
                                                localStorage.setItem('whiteboard_userId' , user.userId);
                                                localStorage.setItem('whiteboard_userName' , user.userName);
                                                localStorage.setItem('whiteboard_userProfilePicture' , user.profilePicture);
                                                localStorage.setItem('whiteboard_userBackgroundPicture' , user.backgroundPicture)
                                            },600);
                                        }
                                        
                                    }}
                                >
                                    <motion.div
                                        animate={{ opacity: 1 , x:0 }}
                                        initial={{opacity : 0 , x:-500 }}
                                        exit ={{ opacity : 0  ,}}
                                        transition={{  duration: 1.3  }}
                                    >
                                        <CssTextField required inputRef={emailRef} fullWidth variant="outlined" label="Please enter your name" size={'small'}/>
                                    </motion.div>
                                    
                                    <motion.div className="flex flex-col w-full justify-end items-center h-[210px]"
                                        animate={{ opacity: 1 ,  x:0}}
                                        initial={{opacity : 0 ,  x:-500}}
                                        exit ={{ opacity : 0 }}
                                        transition={{  duration: 1.5 }}
                                    >
                                        <button type="submit" className={`w-full max-w-[300px] flex justify-center items-center drop-shadow-lg ${isLoading ? 'bg-primary-blue-2 cursor-default' : 'bg-[#1363df] hover:bg-[#153a62] cursor-pointer'} duration-200 ease-in text-white py-2 rounded-md`} style={{fontFamily:"'Montserrat', sans-serif"}}>
                                            Create account
                                        </button>
                                    </motion.div>
                                    
                                </form>
                            </div>
                        </div> */}
                    </motion.div>
                    <motion.div className=" hidden md:flex flex-1 h-screen min-h-[500px]" style={{backgroundImage:'url(/static/images/whiteboard/bglogin.png)' , backgroundSize:'cover' , backgroundPosition:'center' , backgroundRepeat:'no-repeat'}}
                        animate={{ opacity: 1 , x:0 }}
                        initial={{opacity : 0 , x:0 }}
                        exit ={{ opacity : 0  , x: 1000}}
                        transition={{  duration: 0.5 }}
                    ></motion.div>
                </div>
            );
        }
        else if(loginSignupMode === 'signup' && delayAnimation === 1){
            return(
                <div className="w-full flex justify-center overflow-auto h-full relative py-10">
                    <motion.div className=" w-9/12 max-w-[600px] flex flex-col justify-start items-start drop-shadow-lg bg-white px-5 md:px-28 py-6 pt-12 rounded-xl h-full"
                        animate={{ opacity: 1  }}
                        initial={{opacity : 0 ,x:0 }}
                        exit ={{ opacity : 0  }}
                        transition={{  duration: 0.5 }}
                    >
                        <motion.p className="text-[32px] font-[800]" style={{fontFamily:"'Montserrat', sans-serif"}}
                            animate={{ opacity: 1 , y:0 }}
                            initial={{opacity : 0 , y:-150 }}
                            exit ={{ opacity : 0  }}
                            transition={{  duration:0.3}}
                        >Sign up</motion.p>
                        <form  className="w-full" 
                            onSubmit={handleSignup}
                        >
                            <motion.div
                                animate={{ opacity: 1 , x:0 }}
                                initial={{opacity : 0 , x:-500 }}
                                exit ={{ opacity : 0  ,}}
                                transition={{  duration: 0.6 }}
                                className="w-full flex flex-col items-start"
                            >
                                <CssTextField required inputRef={signupEmailRef} fullWidth variant="outlined" label="email" size={'small'} style={{ marginTop:'40px'}} InputLabelProps={{ required: false }}/>
                                {isEmailSignupError !== '' && <p className="pl-2 text-danger text-[14px]">{isEmailSignupError}</p>}
                            </motion.div>
                            <motion.div
                                animate={{ opacity: 1 , x:0 }}
                                initial={{opacity : 0 , x:-500 }}
                                exit ={{ opacity : 0  ,}}
                                transition={{  duration: 0.9  }}
                                className="w-full flex flex-col items-start"
                            >
                                <CssTextField required type="password" inputRef={signupPasswordRef} fullWidth variant="outlined" label="password" size={'small'} style={{ marginTop:'30px'}} InputLabelProps={{ required: false }}/>
                                {isPasswordSignupError && <p className="pl-2 text-danger text-[14px]">Password should be at least 6 characters.</p>}
                            </motion.div>
                            <motion.div
                                animate={{ opacity: 1 , x:0 }}
                                initial={{opacity : 0 , x:-500 }}
                                exit ={{ opacity : 0  ,}}
                                transition={{  duration: 0.9  }}
                            >
                                <CssTextField required inputRef={signupDisplayName} fullWidth variant="outlined" label="displayname" size={'small'} style={{ marginTop:'30px'}} InputLabelProps={{ required: false }}/>
                            </motion.div>
                            <motion.div
                                animate={{ opacity: 1 , scale:1 }}
                                initial={{opacity : 0 , scale:0 }}
                                exit ={{ opacity : 0  ,}}
                                transition={{  duration:1.2}}
                            >
                                <div className="w-full flex justify-center items-center">
                                    <p className="text-h5 font-bold mt-10 " style={{fontFamily:"'Montserrat', sans-serif"}}>Or Sign in with</p>
                                </div>
                                
                                <div onClick={signInWithGoogle} className="w-full flex justify-center items-center py-3 border-[1px] border-secondary-gray-3 rounded-md outline-none mt-8 gap-3">
                                            <img src="/static/images/whiteboard/googleIcon.jpg"  alt="" className="w-4" />
                                            <p className="text-secondary-gray-3 text-h5 font-semibold" style={{fontFamily:"'Montserrat', sans-serif"}}>Sign in with Google</p>
                                </div>
                                {/* <GoogleLogin
                                    clientId="40517616525-di1vjhemnupkg9iavccfft03b2k8egkf.apps.googleusercontent.com"
                                    render={renderProps => (
                                        <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="w-full flex justify-center items-center py-3 border-[1px] border-secondary-gray-3 rounded-md outline-none mt-8 gap-3">
                                            <img src="/static/images/whiteboard/googleIcon.jpg"  alt="" className="w-4" />
                                            <p className="text-secondary-gray-3 text-h5 font-semibold" style={{fontFamily:"'Montserrat', sans-serif"}}>Sign up with Google</p>
                                        </button>
                                    )}
                                    buttonText="Login"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    cookiePolicy={'single_host_origin'}
                                /> */}
                            </motion.div>
                            <motion.div className="flex w-full justify-center items-center mt-16"
                                animate={{ opacity: 1 ,  x:0}}
                                initial={{opacity : 0 ,  x:-500}}
                                exit ={{ opacity : 0 }}
                                transition={{  duration: 1.2 }}
                            >
                                <button type="submit" className={`w-full md:max-w-[250px] flex justify-center items-center drop-shadow-lg ${isLoading ? 'bg-primary-blue-2 cursor-default' : 'bg-[#334155] hover:bg-[#546c8d] cursor-pointer'} duration-200 ease-in text-white font-semibold py-2 rounded-md`} style={{fontFamily:"'Montserrat', sans-serif"}}>
                                    Sign up
                                </button>
                            </motion.div>
                            <motion.div className="flex w-full justify-center items-center mt-10 gap-3" style={{fontFamily:"'Montserrat', sans-serif"}}
                                animate={{ opacity: 1 }}
                                initial={{opacity : 0 }}
                                exit ={{ opacity : 0 }}
                                transition={{  duration: 0.5 }}
                            >
                                <p className="text-h5 font-semibold" >Already have an account ?</p>
                                <p className="text-h5 font-semibold hover:text-[#4682ef] cursor-pointer"
                                    onClick={()=>{
                                        setDelayAnimation(0);
                                        setTimeout(()=>{setLoginSignupMode('login')},1000);
                                    }}
                                >Sign in</p>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            );
        }
    }   
    
    return (
        <AnimatePresence>
            {userData.userId === '-' && roomData.roomId === '-' &&
            <motion.div className={`min-h-screen max-h-full w-screen fixed top-0 left-0 flex flex-col ${height < 500 ? 'justify-start' :'justify-center'} items-center z-[1500] bg-white overflow-auto`}>
                <AnimatePresence>
                    {RenderLoginOrSignUp()}
                    {isSelectedImage && <UploadPhotoInLogin isSelectedImage={isSelectedImage} setIsSelectedImage={setIsSelectedImage} setSelectImage={setSelectImage}/>}
                </AnimatePresence>
            </motion.div>}
            {userData.userId !== '-' && roomData.roomId ==='-' &&
            <motion.div className="w-screen h-screen max-h-screen overflow-auto fixed top-0 left-0 flex justify-center items-start z-[1500] bg-white ">
                <AnimatePresence>
                    <Lobby/>
                </AnimatePresence>
            </motion.div>
            }
        </AnimatePresence>
    )
}

export default LoginSignUp
import { AnimatePresence , motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil';
import { isReUsernameClickState, whiteBoardUserDataState } from '../../WhiteBoardStateManagement/Atom';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { roomListType, userInRoomType } from './Lobby';
import firebase from '../../firebase/firebase-config';


function ReUsername() {
    const ReNameRef = useRef<HTMLInputElement>(null);
    const [ isAlert , setIsAlert ] = useState<boolean>(false);
    const [ isLoading , setIsLoading ] = useState<boolean>(false);
    const [ isReUsernameClick , setIsReUsernameClick ] = useRecoilState(isReUsernameClickState);
    const [ userData , setUserData ] = useRecoilState(whiteBoardUserDataState);
    const [roomList , setRoomList ] = useState<roomListType[]>([])
    const [ closeModalAnimate , setCloseModalAnimate ] = useState<boolean>(true)
    useEffect(()=>{
        if(userData.userId !== '-'){
            firebase.database().ref(`retrospective`).on('value',async(snapshot)=>{
                if(snapshot.val()!==null){
                    let allRoom = snapshot.val();
                    let newRoomList = [] as roomListType[];
                    for(let id in allRoom){
                        let newRoom = {} as roomListType;
                        if(allRoom.hasOwnProperty(id)){
                            let roomDetail = allRoom[id].roomDetail;
                            newRoom.roomId = id;
                            newRoom.roomImage = roomDetail?.roomImage;
                            newRoom.roomName = roomDetail?.roomName;
                            newRoom.createBy = roomDetail?.createBy;
                            newRoom.createByName = roomDetail?.createByName;
                            newRoom.categories = roomDetail?.catagories;
                            newRoom.lastModified = roomDetail?.lastModified;
                            let userInRoomList = [] as userInRoomType[];
                            for(let userId in roomDetail?.userInRoom){
                                let user = {} as userInRoomType
                                if(roomDetail.userInRoom.hasOwnProperty(userId)){
                                    user.name = roomDetail?.userInRoom[userId]?.name;
                                    user.userId = userId;
                                    user.profilePicture = roomDetail?.userInRoom[userId]?.profilePicture;
                                    user.isOnline = roomDetail?.userInRoom[userId]?.isOnline;
                                    user.openAt = roomDetail?.userInRoom[userId]?.openAt;
                                }
                                userInRoomList.push(user)
                            }
                            newRoom.userInRoom = userInRoomList;
                            newRoomList.push(newRoom);
                        }
                        
                    }
                    setRoomList(newRoomList);
                }else{
                    setRoomList([]);
                }
            })
        }
    },[userData])

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
    return (
        <AnimatePresence>
            {closeModalAnimate &&
            <motion.div className="h-screen w-full fixed top-0 left-0  flex justify-center items-center z-50 bg-blue-dark-op50 "
                animate={{ opacity: 1 }}
                initial={{opacity : 0  }}
                exit = {{ opacity : 0 }}
                transition={{  duration: 1 }}
            >{closeModalAnimate &&
                <motion.div className="flex flex-col justify-center items-start w-full max-w-xl bg-white rounded-lg relative"
                            animate={{ opacity: 1 , y: 0 ,rotateX:0}}
                            initial={{opacity : 0 , y:-150 , rotateX:90}}
                            exit ={{ opacity : 0 ,scale:0 , rotateX:90}}
                            transition={{  duration: 0.7 }}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 absolute top-7 right-7 p-1 text-secondary-gray-1 rounded-full duration-200 ease-in hover:cursor-pointer hover:bg-secondary-gray-3 hover:text-white " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                onClick={()=>{
                                    setCloseModalAnimate(false);
                                    setTimeout(()=>setIsReUsernameClick(false), 1000);
                                }}
                        >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div className="flex justify-start items-center gap-3 p-7 border-b-[1px] border-secondary-gray-3 w-full">
                            <img className="w-8" src={'/static/images/whiteboard/team.png'} alt=""/>
                            <p className="font-semibold text-h3 text-gray"> Edit name</p>
                        </div>
                        
                        <form  className="w-full h-fit p-7" 
                            onSubmit={(e)=>{
                                e.preventDefault();
                                (async function(){
                                    try{
                                        if(ReNameRef.current !== null && ReNameRef.current.value !== '' && !isLoading){
                                            let renamevalue = ReNameRef.current?.value
                                            setIsLoading(true);
                                            await Promise.all(roomList.map((room)=>{
                                                if(room.userInRoom.find((user)=>user.userId === userData.userId )){
                                                    return firebase.database().ref(`retrospective/${room.roomId}/roomDetail/userInRoom/${userData.userId}`).update({
                                                        name:renamevalue
                                                    })
                                                }
                                            }))
                                            await Promise.all(roomList.map((room)=>{
                                                if(room.createBy === userData.userId){
                                                    return firebase.database().ref(`retrospective/${room.roomId}/roomDetail`).update({
                                                        createByName:renamevalue
                                                    })
                                                }
                                            }))
                                            firebase.database().ref(`userRetrospective/${userData.userId}`).update({
                                                displayName:renamevalue
                                            })
                                            setUserData({
                                                ...userData,
                                                userName:renamevalue
                                            })
                                            localStorage.setItem('whiteboard_userName' , renamevalue);
                                            // roomList.forEach((room)=>{
                                            //     room.userInRoom.forEach((user)=>{
                                            //         if(userData.userId === user.userId){
                                            //             roomStay = roomStay + 1;
                                            //             if(!teamStay.includes(room.categories)){
                                            //                 teamStay.push(room.categories)
                                            //             }
                                            //         }
                                            //     })
                                            // })
                                            setIsLoading(false);
                                            setCloseModalAnimate(false);
                                            setTimeout(()=>setIsReUsernameClick(false), 1000);
                                        }
                                    }catch(err){
                                        setIsAlert(true);
                                        setTimeout(()=>setIsAlert(false),3000);
                                        console.log(err);
                                    }
                                    }())
                                
                            }}
                        >
                            <div className="flex items-center gap-5">
                                <CssTextField required defaultValue={userData.userName} inputRef={ReNameRef} fullWidth variant="outlined" label="Your display name" size={'small'}/>
                                <button type="submit" className="w-32 flex justify-center items-center drop-shadow-lg bg-[#2c60db] hover:bg-[#153a62] hover:cursor-pointer duration-200 ease-in text-white py-2 rounded-md">
                                    Done
                                </button>
                            </div>
                        </form>
                        <AnimatePresence>
                    {isAlert && 
                    <motion.div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-h5 px-4 py-2 bg-[#1e1e1e] text-white rounded-lg"
                        animate={{opacity:1}}
                        initial={{opacity:0}}
                        exit={{opacity:0}}
                        transition={{duration:0.5}}
                    >
                        Error!
                    </motion.div>}
                </AnimatePresence>
                </motion.div>}
            </motion.div>}
        </AnimatePresence>
    )
}

export default ReUsername
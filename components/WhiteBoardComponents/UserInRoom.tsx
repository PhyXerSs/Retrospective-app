import React, { useEffect, useRef, useState } from 'react'
import { Snapshot, useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import firebase from '../../firebase/firebase-config';
import { isReUsernameClickState, isShowChangeBackgroundPictureState, isShowChangeProfilePictureState, RectState, selectedIdState, WhiteBoardRoomDataState, whiteBoardUserDataState } from '../../WhiteBoardStateManagement/Atom'
import { userInRoomType } from './Lobby';
import { Transition , Popover } from '@headlessui/react'
import { useWindowSize } from 'usehooks-ts';
import * as firebaseServer from 'firebase';
import UserProfileModal from './UserProfileModal';
import ReUsername from './ReUsername';
import ChangeProfilePicture from './ChangeProfilePicture';
import ChangeBackground from './ChangeBackground';
function UserInRoom({autoGetUrlRoomImage , setIsShareClick}:{autoGetUrlRoomImage:any , setIsShareClick:React.Dispatch<React.SetStateAction<boolean>>}) {
    const [roomData , setRoomData] = useRecoilState(WhiteBoardRoomDataState);
    const [ userInRoom , setUserInRoom ] = useState<userInRoomType[]>([])
    const resetRects = useResetRecoilState(RectState);
    const [ sortuserInRoom , setSortUserInRoom ] = useState<userInRoomType[]>([])
    const resetRoomData = useResetRecoilState(WhiteBoardRoomDataState);
    const userData = useRecoilValue(whiteBoardUserDataState);
    const [ showTextAreaRenameRoom , setShowTextAreaRenameRoom ] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null)
    const windowSize = useWindowSize();
    const [ isHoverProfileSelf , setIsHoverProfileSelf ] = useState<boolean>(false);
    const isReUsernameClick = useRecoilValue(isReUsernameClickState);
    const [isShowChangeProfilePicture, setIsShowChangeProfilePicture] =useRecoilState(isShowChangeProfilePictureState);
    const [isShowChangeBackgroundPicture , setIsShowChangeBackgroundPicture] = useRecoilState(isShowChangeBackgroundPictureState);
    useEffect(()=>{
        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom`).on('value',snapshot=>{
            if(snapshot.val()!==null){
                let allUser = snapshot.val();
                let userList = [] as userInRoomType[];
                for(let userId in allUser){
                    if(allUser.hasOwnProperty(userId)){
                        let user = {} as userInRoomType
                        user.userId = userId;
                        user.name = allUser[userId]?.name;
                        user.profilePicture = allUser[userId]?.profilePicture;
                        user.isOnline = allUser[userId]?.isOnline;
                        userList.push(user);
                    }
                }
                setUserInRoom(userList);
            }
        })

        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom/${userData.userId}`).on('value', snapshot =>{
            if(snapshot.val() === null){
                resetRoomData();
            }
        })

        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom/${userData.userId}`).onDisconnect().update({
            isOnline:false
        })

        firebase.database().ref(`userRetrospective/${userData.userId}`).onDisconnect().update({
            lastActive: new Date().valueOf(),
            statusOnline:false,
        })
        
        return ()=>{
            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom`).off();
            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom/${userData.userId}`).off();
            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom/${userData.userId}`).onDisconnect().cancel();
            firebase.database().ref(`userRetrospective/${userData.userId}`).onDisconnect().cancel();
        }
    },[roomData , userData])

    useEffect(()=>{
        let userListSorted = userInRoom.filter((user)=>user.isOnline);
        userInRoom.forEach((user)=>{
            if(!user.isOnline){
                userListSorted.push(user);
            }
        })
        let yourIndex = userListSorted.findIndex((user)=>user.userId === userData.userId);
        userListSorted = reorder(userListSorted , yourIndex , 0);
        setSortUserInRoom(userListSorted);
    },[userInRoom , userData])
    
    useEffect(()=>{
        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail`).on('value',snapshot=>{
            if(snapshot.val()!==null){
                setRoomData({
                    ...roomData,
                    roomName:snapshot.val()?.roomName
                })
                if(inputRef.current){
                    inputRef.current.value = snapshot.val()?.roomName;
                }
            }
        })
        return()=>{
            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail`).off();
        }
    },[roomData.roomId])

    const reorder = (list:any[], startIndex:number, endIndex:number) => {
        let result = Array.from(list);
        let [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    function truncate(str:string,n:number){
        return str?.length > n ? str.substr(0,n-1) + "..." : str;
    }
    
    function renderUserInNavbar(){
        let renderResult = [] as JSX.Element[];
        let rightOffset = 0;
        if(userInRoom.length > 3){
            renderResult.push(
                <div key={`userBadge01`} className="w-[47px] h-[47px] flex justify-center items-center absolute rounded-full bg-[#f0f0f0]" style={{right:rightOffset}} >
                    <p className="text-[#919191] text-[17px] font-semibold">{userInRoom.length - 3}+</p>
                </div>
            );
            rightOffset = rightOffset + 40;
        }
        let count = 0;
        for(let i = 0 ; i < sortuserInRoom?.length ; i++){
            if(count < 2 && sortuserInRoom[i]?.userId !== userData.userId ){
                count += 1;
                renderResult.push(
                    <div key={`userBadge${sortuserInRoom[i]?.userId}`} className="w-[45px] h-[45px] absolute rounded-full ring-2 ring-white" style={{ right:rightOffset , backgroundImage:`url(${sortuserInRoom[i]?.profilePicture})` , backgroundRepeat:'no-repeat' , backgroundPosition:'center' , backgroundSize:'cover'}}>
                        <div className={`absolute bottom-1 right-0 rounded-full ring-1 ring-white w-[9px] h-[9px] ${sortuserInRoom[i]?.isOnline ? 'bg-[#3ee144]' : 'bg-[#e0e0e0]'}`}></div>
                    </div>
                );
                rightOffset = rightOffset + 40;
            }
        }
        renderResult.push(
            <div key={`userBadge${userData.userId}`} className="w-[45px] h-[45px] absolute rounded-full ring-2 ring-white" style={{right:rightOffset , backgroundImage:`url(${userData.profilePicture})` , backgroundRepeat:'no-repeat' , backgroundPosition:'center' , backgroundSize:'cover'}}>
                <div className={`absolute bottom-1 right-0 rounded-full ring-1 ring-white w-[9px] h-[9px] bg-[#3ee144]`}></div>
            </div>
        )
        return renderResult;
    }

    function renderRoomName(){
        if(windowSize.width > 1024){
            if(roomData?.roomName?.length > 24){
                return truncate(roomData?.roomName,24);
            }else{
                return roomData.roomName;
            }
        }
        else if(windowSize.width > 768){
            return truncate(roomData?.roomName,12);
        }
        else{
            return truncate(roomData?.roomName,8);
        }
    }

    return (
        <>
            <div className="absolute top-[10px] w-11/12 p-1 md:p-4  flex items-center justify-between h-[75px] bg-white rounded-lg drop-shadow-xl z-[40]">
                <div className="flex gap-2 md:gap-3 lg:gap-5 justify-start items-center ml-2">
                    <div className="cursor-pointer"
                        onClick={async()=>{
                            // handleSelectShape(selectedId , null);
                            let uri = autoGetUrlRoomImage();
                            await Promise.all([
                                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom/${userData.userId}`).update({
                                    isOnline:false
                                }),
                                firebase.database().ref(`userRetrospective/${userData.userId}`).update({
                                    lastActive: new Date().valueOf(),
                                    statusOnline:false
                                }),
                                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                    roomImage: uri,
                                })
                            ])
                            resetRects();
                            resetRoomData();
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-11 w-11 text-white ease-in duration-200 rounded-full bg-[#1363df] hover:bg-[#153a62] p-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                    {windowSize.width > 834 &&
                    <div className="z-[999]">
                        <img className="mt-2" src={'/static/images/whiteboard/LogoRetrologo.png'} alt=""
                            draggable={false}
                        />
                    </div>
                    }
                    <div className=" w-fit flex justify-start items-center h-[60px] pb-1 ml-0 md:ml-3 z-[999] overflow-clip">
                        {!showTextAreaRenameRoom &&
                        <p className={`ease-in duration-200 text-[22px] font-semibold`}
                            onClick={()=>setShowTextAreaRenameRoom(true)}
                        >{renderRoomName()}</p>
                        }
                        <input ref={inputRef} className={`outline-none text-[22px] ${showTextAreaRenameRoom ? 'w-[200px] md:w-[300px]' : 'w-0'} `}
                            onKeyPress={async(e)=>{
                                if(e.key === 'Enter' && inputRef.current){
                                    await firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                        roomName:inputRef.current.value.replace(/\s/g, '') === "" ? 'Missing Room Name' : inputRef.current.value,
                                        lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                    })
                                    setShowTextAreaRenameRoom(false);
                                }
                            }}
                        />
                    </div>
                </div>
                <div className='flex items-center mr-5 lg:mr-12 gap-2 md:gap-6 lg:gap-12 relative'>
                    <Popover.Group>
                        <Popover>
                            <Popover.Button className="flex relative items-center h-14 outline-none " style={{width:Math.min(168 , userInRoom.length *42) }}>
                                {renderUserInNavbar()}
                            </Popover.Button>
                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                
                                <Popover.Panel id={`pop`} className="absolute w-[575px] max-h-96 flex flex-col items-center -right-[135px] md:-right-[165px] lg:-right-[215px] top-[20px] bg-white rounded-lg drop-shadow-lg" >
                                        <div className="absolute w-72 max-h-96 flex flex-col items-center right-0 top-[0px] bg-white rounded-lg drop-shadow-lg overflow-auto">
                                            {sortuserInRoom?.map((user)=>(
                                                <div key={`userInRoom${user?.userId}`} className="flex justify-start items-center w-full bg-white py-2 px-4 duration-150 ease-in  hover:bg-[#1363df] gap-2 text-[#0a0a0a] font-semibold hover:text-white"
                                                onMouseEnter={()=>{
                                                    if(user.userId === userData.userId){
                                                        setIsHoverProfileSelf(true)
                                                    }
                                                }}
                                                >
                                                    <div className="w-[36px] h-[36px] relative rounded-full ring-2 ring-white" style={{ backgroundImage:`url(${user?.profilePicture})` , backgroundRepeat:'no-repeat' , backgroundPosition:'center' , backgroundSize:'cover'}}>
                                                        <div className={`absolute bottom-[2px] -right-[2px] rounded-full ring-1 ring-white w-[9px] h-[9px] ${user?.isOnline ? 'bg-[#3ee144]' : 'bg-[#e0e0e0]'}`}></div>
                                                    </div>
                                                    <p className="w-[180px] overflow-x-clip whitespace-nowrap">{user?.name}</p>
                                                    { user?.userId === roomData.createBy && <img src={'/static/images/whiteboard/crownIcon.png'} alt="" className="w-6 h-6 object-cover" />}
                                                    {(user?.userId !== userData.userId && user?.userId !== roomData.createBy) && 
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-gray-3 hover:text-white ease-in duration-200 cursor-pointer " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                                        onClick={async()=>{
                                                            await Promise.all([
                                                                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom/${user.userId}`).once('value',snapshot=>{
                                                                    if(snapshot.val()!==null){
                                                                        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom/${user.userId}`).remove();
                                                                    }
                                                                }),
                                                                firebase.database().ref(`userRetrospective/${user.userId}`).update({
                                                                    lastActive: new Date().valueOf(),
                                                                    statusOnline:false
                                                                }),
                                                            ])
                                                        }}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    }    
                                                </div>
                                            ))}
                                        </div>
                                        {isHoverProfileSelf &&
                                            <div className="flex flex-col w-[280px] fixed top-0 left-[0px] rounded-lg justify-start items-center" style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px 14px 28px, rgba(0, 0, 0, 0.15) 0px 10px 10px'}}
                                                onMouseEnter={()=>{
                                                    setIsHoverProfileSelf(true)
                                                }}
                                                onMouseLeave={()=>{
                                                    setIsHoverProfileSelf(false);
                                                }}
                                            >
                                                <UserProfileModal/>
                                            </div>
                                        }
                                </Popover.Panel>
                                
                            </Transition>
                        </Popover>
                    </Popover.Group>
                    <button className="flex justify-center items-center text-white bg-[#1363df] hover:bg-[#153a62] ease-in duration-200 rounded-lg px-8 py-2 cursor-pointer"
                        onClick={()=>{
                            setIsShareClick(true);
                        }}
                    >
                        Share
                    </button>
                </div>
                
            </div>
            {isReUsernameClick && <ReUsername/>}
            {isShowChangeProfilePicture && <ChangeProfilePicture/>}
            {isShowChangeBackgroundPicture && <ChangeBackground/>}
        </>           
    )
}

export default UserInRoom
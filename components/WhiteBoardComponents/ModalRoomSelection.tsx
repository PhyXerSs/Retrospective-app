import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence , motion } from 'framer-motion'
import { roomListType } from './Lobby';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import firebase from '../../firebase/firebase-config';
import { isShowDeleteConfirmState, messageModalAlertState, RoomDataStateType, WhiteBoardRoomDataState, whiteBoardUserDataState } from '../../WhiteBoardStateManagement/Atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Transition , Popover } from '@headlessui/react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteRoom } from '../../pages/api/WhiteboardAPI/api';
import * as firebaseServer from 'firebase';
interface props{
    room:roomListType,
    index:number
    isHoverRoom:number,
    setIsHoverRoom:React.Dispatch<React.SetStateAction<number>>,
    setIsCopyUrl:React.Dispatch<React.SetStateAction<boolean>>;
    selectCategory:string,
}

function ModalRoomSelection({room , index , isHoverRoom , setIsHoverRoom , setIsCopyUrl , selectCategory}:props) {
    const [userData , setUserData] = useRecoilState(whiteBoardUserDataState);
    const [roomData , setRoomData] = useRecoilState(WhiteBoardRoomDataState);
    const [ isShowRenameInput , setIsShowRenameInput ] = useState<number>(-1);
    const inputRenameRef = useRef<HTMLInputElement>(null);
    const [isLoading , setIsLoading] = useState<boolean>(false);
    const setIsShowDeleteConfirm = useSetRecoilState(isShowDeleteConfirmState);
    const [ messageModalAlert , setMessageModalAlert ] = useRecoilState(messageModalAlertState);
    useEffect(()=>{
        if(inputRenameRef.current){
            inputRenameRef.current.value = room.roomName;
        }
    },[room.roomName])

    function truncate(str:string,n:number){
        return str?.length > n ? str.substr(0,n-1) + "..." : str;
    }

    async function updateJoinRoomToFirebase() {
        await Promise.all([
            firebase.database().ref(`retrospective/${room.roomId}/roomDetail/userInRoom/${userData.userId}`).set({
                name:userData.userName,
                profilePicture:userData.profilePicture,
                isOnline:true,
                openAt:new Date().getTime(),
            }),
            firebase.database().ref(`userRetrospective/${userData.userId}`).update({
                statusOnline:true,
                room:room.roomId
            })
        ])
    }

    return (
        <motion.div key={`roomList${index}`} className={`w-[260px] h-[210px] flex flex-col justify-start items-center rounded-xl bg-white hover:bg-gray-light ease-in duration-200 relative ${isHoverRoom === index ? 'z-[10]' : 'z-[0]'}`}
            style={{boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px'}}
            animate={{ opacity: 1 , scale:1 }}
            initial={{opacity : 0 , scale:1.3 }}
            exit ={{ opacity : 0 , scale:1.3 }}
            transition={{  duration: 0.3+(index)*0.1 }}
            onClick={async(e)=>{
                e.stopPropagation();
                let roomSelect = {} as RoomDataStateType;
                roomSelect.roomId = room.roomId;
                roomSelect.roomName = room.roomName;
                roomSelect.createBy = room.createBy;
                updateJoinRoomToFirebase();
                setRoomData(roomSelect);
            }}
            onMouseEnter={()=>{
                setIsHoverRoom(index)
            }}
            onMouseLeave={()=>{
                setIsHoverRoom(-1)
            }}
        >
            <div className="absolute top-0 w-full h-full rounded-xl ease-in duration-200" style={{backgroundColor:'black' , opacity: isHoverRoom === index ? 0.1 : 0}}></div>
            <img className="w-full h-full object-cover rounded-xl" src={room.roomImage === "" ? '/static/images/loading/xloading.gif' : room.roomImage} alt=""/>
            <div className={`w-full px-4 py-2 flex flex-col justify-start items-start rounded-b-xl ${isHoverRoom === index ? 'bg-[#e6e6e6] bg-opacity-80' : 'bg-white'} ${room.roomImage === "" ? "bg-opacity-0" : ""} absolute -bottom-[1px] gap-[2px] ease-in duration-200`}>
                <div className="w-full flex items-center justify-between">
                    <div className="flex w-full items-center">
                        {isShowRenameInput === -1 && <p className="font-semibold text-[18px] cursor-default">{truncate(room.roomName,15)}</p>}
                        <input ref={inputRenameRef} className={`${isShowRenameInput === index ? "w-11/12 p-1" : 'w-0 p-0'} outline-none bg-secondary-gray-2 rounded-lg  text-[18px] text-white font-semibold`}
                            onClick={(e)=>{
                                e.stopPropagation();
                            }} 
                            onKeyPress={async(e)=>{
                                if(e.key === 'Enter' && inputRenameRef.current){
                                    await firebase.database().ref(`retrospective/${room.roomId}/roomDetail/`).update({
                                        roomName:inputRenameRef.current.value.replace(/\s/g, '') === "" ? 'Missing Room Name' : inputRenameRef.current.value,
                                        lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                    })
                                    setIsShowRenameInput(-1);
                                }
                            }}
                        />
                    </div>
                    <svg className="cursor-pointer" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                        onClick={async(e)=>{
                            e.stopPropagation();
                            let categoyDoc = await firebase.firestore().collection('whiteboard').doc(room.categories).get();
                            let headCategoryId = categoyDoc.data()?.headOfCategory as string;
                            if(userData.userId === headCategoryId || userData.userId === room.createBy ){
                                setIsShowRenameInput(index);
                            }else{
                                setMessageModalAlert("You haven't permission to rename room");
                            }
                        }}
                    >
                            <path d="M0 14.2505V18H3.74948L14.8079 6.94154L11.0585 3.19206L0 14.2505ZM17.7075 4.04194C18.0975 3.65199 18.0975 3.02208 17.7075 2.63213L15.3679 0.292459C14.9779 -0.0974865 14.348 -0.0974865 13.9581 0.292459L12.1283 2.12221L15.8778 5.87168L17.7075 4.04194V4.04194Z" fill={isHoverRoom === index ? "#757575" : "#c2c2c2" }/>
                    </svg>
                </div>
                <p className={`${isHoverRoom === index ? 'text-secondary-gray-1' : 'text-secondary-gray-3'} ease-in duration-200 cursor-default`}>Created by {truncate(room.createByName,16)}</p>
            </div>
            
            <Popover className="absolute top-2 right-2">
                <Popover.Button className={`flex justify-center items-center font-bold text-h5 rounded-full ${isHoverRoom === index ? 'text-secondary-gray-1' : 'text-secondary-gray-3'} ease-in duration-200`}>
                    <MoreVertIcon />
                </Popover.Button>
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Popover.Panel className="absolute w-48 flex flex-col items-center -left-32 top-[10px] bg-white rounded-lg drop-shadow-md" >
                        <Popover.Button className="flex justify-start p-4 items-center w-full bg-white  rounded-t-md cursor-pointer duration-150 ease-in hover:bg-[#e8f3ff] gap-2"
                            onClick={async(e:any)=>{
                                e.stopPropagation();
                                let categoyDoc = await firebase.firestore().collection('whiteboard').doc(room.categories).get();
                                let headCategoryId = categoyDoc.data()?.headOfCategory as string;
                                if(userData.userId === headCategoryId || userData.userId === room.createBy ){
                                    setIsShowRenameInput(index);
                                }else{
                                    setMessageModalAlert("You haven't permission to rename room");
                                }
                            }}
                        >
                            <p>Rename</p>
                        </Popover.Button>
                        <Popover.Button className="flex justify-start p-4 items-center w-full bg-whitecursor-pointer duration-150 ease-in hover:bg-[#e8f3ff] gap-2"
                            onClick={async(e:any)=>{
                                e.stopPropagation();
                                updateJoinRoomToFirebase();
                                let newTab = `${window.location.protocol}//${window.location.hostname}:${window.location?.port}${window.location.pathname}#${room.roomId}`;
                                window.open(newTab);
                            }}
                        >
                            <p>Open in new tab</p>
                        </Popover.Button>
                        <Popover.Button className="flex justify-start p-4 items-center w-full bg-white cursor-pointer duration-150 ease-in hover:bg-[#e8f3ff] gap-2"
                            onClick={(e:any)=>{
                                e.stopPropagation();
                            }}
                        >
                            <CopyToClipboard text={`${window.location.protocol}//${window.location.hostname}${window.location.pathname}#${room.roomId}`}
                                onCopy={()=>{
                                    setIsCopyUrl(true);
                                    setTimeout(()=>setIsCopyUrl(false),2000);
                                }}
                            >
                                <p>Copy board link</p>
                            </CopyToClipboard>
                        </Popover.Button>
                        <Popover.Button className="flex justify-start p-4 items-center w-full bg-white rounded-b-md cursor-pointer duration-150 ease-in hover:bg-[#e8f3ff] gap-2"
                            onClick={async(e:any)=>{
                                e.stopPropagation();
                                let categoyDoc = await firebase.firestore().collection('whiteboard').doc(room.categories).get();
                                let headCategoryId = categoyDoc.data()?.headOfCategory as string;
                                if(userData.userId === headCategoryId || userData.userId === room.createBy ){
                                    setIsShowDeleteConfirm({
                                        isShowDeleteConfirm:true,
                                        categoryId:selectCategory,
                                        categoryName:selectCategory,
                                        roomId:room.roomId,
                                        roomName:room.roomName
                                    })
                                }else{
                                    setMessageModalAlert("You haven't permission to delete room");
                                }
                                
                                // if(!isLoading){
                                //     setIsLoading(true);
                                //     await deleteRoom(selectCategory,room.roomId);
                                //     // await firebase.database().ref(`retrospective/${room.roomId}`).once("value",async snapshot=>{
                                //     //     await firebase.database().ref(`retrospective/${room.roomId}`).remove();
                                //     // })
                                //     setIsLoading(false);
                                // }
                            }}
                        >
                            <p>Delete</p>
                        </Popover.Button>
                    </Popover.Panel>
                </Transition>
            </Popover>
                                            
        </motion.div>
    )
}

export default ModalRoomSelection
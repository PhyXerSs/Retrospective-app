import React, { useEffect, useState } from 'react'
import { Transition , Popover } from '@headlessui/react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { isReUsernameClickState, isShowChangeBackgroundPictureState, WhiteBoardRoomDataState, whiteBoardUserDataState } from '../../WhiteBoardStateManagement/Atom';
import { categoryObjectType, roomListType, userInRoomType } from './Lobby';
import firebase from '../../firebase/firebase-config';
import { isShowChangeProfilePictureState } from '../../PokerStateManagement/Atom';
function UserProfileModal() {
    const [userData , setUserData] = useRecoilState(whiteBoardUserDataState);
    const resetUserData = useResetRecoilState(whiteBoardUserDataState);
    const roomData = useRecoilValue(WhiteBoardRoomDataState);
    const resetRoomData = useResetRecoilState(WhiteBoardRoomDataState);
    const [ isReUsernameClick , setIsReUsernameClick ] = useRecoilState(isReUsernameClickState);
    const [ isShowChangeProfilePicture , setIsShowChangeProfilePicture ] = useRecoilState(isShowChangeProfilePictureState);
    const [ isShowChangeBackgroundPicture , setIsShowChangeBackgroundPicture ] = useRecoilState(isShowChangeBackgroundPictureState);
    const [ countTeamStay , setCountTeamStay ] = useState<number>(0);
    const [ countRoomStay , setCountRoomStay ] = useState<number>(0);
    const [roomList , setRoomList ] = useState<roomListType[]>([]);
    const [ categoriesList ,setCategoriesList ] = useState<categoryObjectType[]>([]);
    function truncate(str:string,n:number){
        return str?.length > n ? str.substr(0,n-1) + "..." : str;
    }

    useEffect(()=>{
        let unsubCategory = ()=>{};
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
            unsubCategory = firebase.firestore().collection('whiteboard').where("userInCategory" , "array-contains" , `${userData.userId}`).orderBy('create').onSnapshot((result)=>{
                let listCategory = [] as categoryObjectType[];
                result.docs.forEach((doc,index)=>{
                        let categoryObj = {} as categoryObjectType;
                        categoryObj.id = doc.id;
                        categoryObj.name = doc.data().catagories;
                        listCategory.push(categoryObj)
                })
                setCategoriesList(listCategory);
            })
        }
    },[userData.userId])

    useEffect(()=>{
        let teamStay = [] as string[];
        let roomStay = 0;
        roomList.forEach((room)=>{
            if(categoriesList.some(category => category.id === room.categories)){
                roomStay += 1;
            }
        })
        setCountRoomStay(roomStay);
        setCountTeamStay(categoriesList.length);
    },[ roomList , userData , categoriesList])
 
    return (
            <>
                <div className={`w-full rounded-t-lg flex flex-col items-center justify-center gap-1 pt-12 pb-5`} style={{ backgroundImage:userData.backgroundPicture==="" ? 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(52,106,221,1) 0%)' : `url(${userData.backgroundPicture})`, backgroundSize:'cover' , backgroundRepeat:'no-repeat' ,backgroundPosition:'center' }}>
                    <img className="w-[60px] h-[60px] rounded-full object-cover ring-2 ring-white" src={userData.profilePicture} alt=""/>
                    <p className="text-white text-h4">{truncate(userData.userName,22)}</p>
                    <p className="text-white text-h5 font-semibold" style={{fontFamily:"'Montserrat', sans-serif"}}>{countTeamStay} {countTeamStay > 1 ? 'teams' : 'team'} | {countRoomStay} {countRoomStay > 1 ? 'boards' : 'board'}</p>
                </div>
                <div className="w-full flex justify-start items-center px-9 py-3 bg-white hover:bg-[#e0e0e0] ease-in duration-200 cursor-pointer" style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px -15px 36px -28px inset'}}
                    onClick={()=>{
                        setIsReUsernameClick(true);
                    }}
                >
                    <p className="text-[18px] text-[#346add] font-semibold">Edit name</p>
                </div>
                <div className="w-full flex justify-start items-center px-9 py-3 bg-white hover:bg-[#e0e0e0] ease-in duration-200 cursor-pointer" style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px -15px 36px -28px inset'}}
                    onClick={()=>{
                        setIsShowChangeProfilePicture(true);
                    }}
                >
                    <p className="text-[18px] text-[#346add] font-semibold">Edit profile picture</p>
                </div>
                <div className="w-full flex justify-start items-center px-9 py-3 bg-white hover:bg-[#e0e0e0] ease-in duration-200 cursor-pointer" style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px -15px 36px -28px inset'}}
                    onClick={()=>{
                        setIsShowChangeBackgroundPicture(true);
                    }}
                >
                    <p className="text-[18px] text-[#346add] font-semibold">Edit background</p>
                </div>
                <div className="w-full flex justify-start items-center px-9 py-3 bg-white hover:bg-[#e0e0e0] ease-in duration-200 cursor-pointer rounded-b-lg " style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px -15px 36px -28px inset'}}
                    onClick={async()=>{
                        localStorage.removeItem('whiteboard_userId');
                        localStorage.removeItem('whiteboard_userName');
                        localStorage.removeItem('whiteboard_userProfilePicture');
                        firebase.auth().signOut();
                        if(roomData.roomId !== '-'){
                            await Promise.all([
                                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/userInRoom/${userData.userId}`).update({
                                    isOnline:false
                                }),
                                firebase.database().ref(`userRetrospective/${userData.userId}`).update({
                                    lastActive: new Date().valueOf(),
                                    statusOnline:false
                                }),
                            ])
                            resetRoomData();
                        }
                        resetUserData();
                    }}
                >
                    <p className="text-[18px] text-[#346add] font-semibold">Logout</p>
                </div>
            </>
                    
    )
}

export default UserProfileModal
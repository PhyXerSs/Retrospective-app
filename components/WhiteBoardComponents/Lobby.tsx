import { AnimatePresence , motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import firebase from '../../firebase/firebase-config';
import { isReUsernameClickState, isShowChangeBackgroundPictureState, isShowChangeProfilePictureState, RoomDataStateType, selectCategoryState, WhiteBoardRoomDataState, whiteBoardUserDataState } from '../../WhiteBoardStateManagement/Atom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { v4 as uuid } from 'uuid';
import { Transition , Popover } from '@headlessui/react'
import { createCategories, createRoom, deleteRoom } from '../../pages/api/WhiteboardAPI/api';
import ModalRoomSelection from './ModalRoomSelection';
import CreateCategoryModal from './CreateCategoryModal';
import ModalCategorySelect from './ModalCategorySelect';
import RenameCategory from './RenameCategory';
import * as firebaseServer from 'firebase';
import ReUsername from './ReUsername';
import UserProfileModal from './UserProfileModal';
import ChangeProfilePicture from './ChangeProfilePicture';
import ChangeBackground from './ChangeBackground';
import ConfirmDeleteModal from './ConfirmDeleteModal';
export interface userInRoomType{
    userId:string,
    name:string,
    profilePicture:string,
    isOnline:boolean,
    openAt:number,
}

export interface roomListType{
    roomName:string,
    roomId:string,
    roomImage:string,
    createBy:string,
    createByName:string,
    categories:string,
    lastModified:number;
    userInRoom:userInRoomType[],
}

function Lobby() {
    const [userData , setUserData] = useRecoilState(whiteBoardUserDataState);
    const [roomData , setRoomData] = useRecoilState(WhiteBoardRoomDataState);
    const [roomList , setRoomList] = useState<roomListType[]>([]);
    const resetUserData = useResetRecoilState(whiteBoardUserDataState);
    const [ isCreateRoomClick , setIsCreateRoomClick ] = useState<boolean>(false);
    const roomNameRef = useRef<HTMLInputElement>(null)
    const [isLoading , setIsLoading] = useState<boolean>(false)
    const [ selectCategory , setSelectCategory ] = useRecoilState(selectCategoryState);
    const resetSelectCategory = useResetRecoilState(selectCategoryState);
    const [ categoriesList , setCategoriesList ] = useState<string[]>([]);
    const [ searchText , setSearchText ] = useState<string>('');
    const [ filter , setFilter ] = useState<string>('Last opened');
    const [ isHoverRoom , setIsHoverRoom ] = useState<number>(-1);
    const [ isCopyUrl , setIsCopyUrl ] = useState<boolean>(false);
    const [isCreateCategoryClick , setIsCreateCategoryClick ] = useState<boolean>(false);
    const [roomListFiltered , setRoomListFiltered  ] = useState<roomListType[]>([]);
    const [isShowDropdownCategory , setIsShowDropdownCategory ] = useState<number>(-1);
    const [ isShowRenameCategory , setIsShowRenameCategory ] = useState<string>('-');
    const [ isReUsernameClick , setIsReUsernameClick ] = useRecoilState(isReUsernameClickState);
    const [isShowChangeProfilePicture, setIsShowChangeProfilePicture] =useRecoilState(isShowChangeProfilePictureState);
    const [isShowChangeBackgroundPicture , setIsShowChangeBackgroundPicture] = useRecoilState(isShowChangeBackgroundPictureState);
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
    useEffect(()=>{
        let unsubCategory = () => {};
        if(userData.userId !== '-' && roomData.roomId === '-'){
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
            unsubCategory = firebase.firestore().collection('whiteboard').orderBy("create").onSnapshot((result)=>{
                let listCategory = [] as string[];
                result.docs.forEach((doc)=>{
                    listCategory.push(doc.data().catagories)
                })
                setCategoriesList(listCategory);
            })
        }
        return()=>{
            firebase.database().ref(`retrospective`).off();
            unsubCategory();
        }
    },[userData , roomData]);
    
    useEffect(()=>{

        function compareLastOpen( a:roomListType, b:roomListType ) {
            let userIndexOfA = a.userInRoom.findIndex(user=>user.userId === userData.userId);  
            let userIndexOfB = b.userInRoom.findIndex(user=>user.userId === userData.userId);
            if(userIndexOfA === -1 && userIndexOfB === -1){
                return 0
            }
            if(userIndexOfA === -1 && userIndexOfB !== -1){
                return 1
            }
            if(userIndexOfA !== -1 && userIndexOfB === -1){
                return -1;
            }
            if ( a.userInRoom[userIndexOfA]?.openAt > b.userInRoom[userIndexOfB]?.openAt ){
              return -1;
            }
            if ( a.userInRoom[userIndexOfA]?.openAt < b.userInRoom[userIndexOfB]?.openAt ){
              return 1;
            }
            return 0;
        }
        function compareLastModified( a:roomListType, b:roomListType ) {  
            if ( a.lastModified > b.lastModified  ){
              return -1;
            }
            if ( a.lastModified  < b.lastModified  ){
              return 1;
            }
            return 0;
        }
        function compareLastAlphabetically( a:roomListType, b:roomListType ) {  
            if ( a.roomName.toLowerCase() < b.roomName.toLowerCase()){
              return -1;
            }
            if ( a.roomName.toLowerCase()  > b.roomName.toLowerCase()){
              return 1;
            }
            return 0;
        }
        let roomListFilter = roomList?.filter(room => (room?.categories === selectCategory || selectCategory === 'DEFAULT')).filter(room=> room?.roomName?.includes(searchText));
        if(filter === 'Last opened'){
            roomListFilter.sort(compareLastOpen)
        }
        if(filter === 'Last modified'){
            roomListFilter.sort(compareLastModified)
        }
        if(filter === 'A to Z'){
            roomListFilter.sort(compareLastAlphabetically)
        }
        setRoomListFiltered(
            roomListFilter
        )
        
    },[roomList , selectCategory , searchText , filter , userData])

    function truncate(str:string,n:number){
        return str?.length > n ? str.substr(0,n-1) + "..." : str;
    }

    return (
        <motion.div className="w-full flex flex-col justify-start items-center">
            <div className="w-screen fixed flex justify-center top-0 right-0 items-center h-[100px] z-[40] bg-white">
                <div className="w-full max-w-6xl flex justify-between items-center px-3">
                    <div className="flex-none">
                        <img src={'/static/images/whiteboard/LogoRetrologo.png'} alt=""
                            draggable={false}
                            />
                    </div>
                    <div className="flex flex-1 justify-start items-center">
                        <div className="ml-2 md:ml-5 lg:ml-[82px] w-56 md:w-96 px-3 py-[10px] bg-[#ededed] rounded-md flex justify-start items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#737373]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input value={searchText} type="text" className="bg-transparent outline-none w-[136px] md:w-80" placeholder="Search dashboard"
                                onChange={(e)=>{
                                    setSearchText(e.target.value);
                                }}
                            />
                            {searchText !== '' && 
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-gray-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                            onClick={()=>{
                                                setSearchText('');
                                            }}
                                        >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>}
                        </div>
                    </div>
                    <Popover className="flex flex-1 justify-end items-center relative">
                        <Popover.Button className="outline-none" >
                            <img className="w-14 h-14 rounded-full object-cover" src={userData.profilePicture} alt=""/>
                        </Popover.Button>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                          <Popover.Panel className="flex flex-col w-[280px] absolute top-11 right-0 rounded-lg justify-start items-center" style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px 14px 28px, rgba(0, 0, 0, 0.15) 0px 10px 10px'}}> 
                                <UserProfileModal/>         
                          </Popover.Panel>  
                        </Transition>
                    </Popover>         
                </div>
            </div>
            <div className="w-full max-w-6xl flex justify-start items-start mt-[120px] px-3">
                <div className="flex flex-col w-[160px] justify-start items-start gap-8 z-[10]">
                    {categoriesList.map((category,index)=>(
                        <ModalCategorySelect
                            key={`category${index}`}
                            index={index}
                            category={category}
                            isShowDropdownCategory={isShowDropdownCategory}
                            setIsShowDropdownCategory={setIsShowDropdownCategory}
                            setIsShowRenameCategory={setIsShowRenameCategory}
                        />
                    ))}
                    <motion.div className={`flex justify-center items-center py-3 w-[168px] bg-white hover:bg-secondary-gray-4 text-[#2c60db] duration-200 ease-in rounded-lg cursor-pointer`}
                            style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px 14px 28px, rgba(0, 0, 0, 0.15) 0px 10px 10px'}}
                            animate={{ opacity: 1 , x:0 }}
                            initial={{opacity : 0 , x:-400 }}
                            exit ={{ opacity : 0 , x:0 }}
                            transition={{  duration: 0.3 + (categoriesList?.length) * 0.15 }}
                            onClick={()=>{
                                setIsCreateCategoryClick(true);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                    </motion.div>
                </div>
                <div className="w-full pl-[22px] md:pl-9 lg:pl-24 flex flex-col justify-start items-start">
                    <div className=" w-full flex justify-around lg:justify-between items-center">
                        <h2 className="text-[20px] md:text-[30px] font-bold" style={{fontFamily:"'Montserrat', sans-serif"}}>Dashboard</h2>
                        <div className='flex items-center gap-3'>
                            <img className="w-5 h-5 hidden md:flex" src={'/static/images/whiteboard/filter.png'} alt=""/>
                            <div className='flex items-center border-[1px] border-secondary-gray-3 rounded-md'>
                                <div className="flex w-[108px] md:w-32 h-8 justify-center items-center">
                                    {filter}
                                </div>
                                <Popover className="relative z-[10]">
                                    <Popover.Button className="flex justify-center items-center px-1 py-1 md:px-2 md:py-2 border-l-[1px] border-secondary-gray-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Popover.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Popover.Panel className="absolute w-[172px] flex flex-col items-center -left-[129px] top-[12px] bg-white rounded-lg drop-shadow-md" 
                                            style={{boxShadow:'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'}}
                                        >
                                            <Popover.Button className="flex justify-start items-center w-full bg-white  rounded-t-md py-1 cursor-pointer duration-150 ease-in hover:bg-[#2c60db] gap-2 text-secondary-gray-1 hover:text-white border-b-[1px] border-b-secondary-gray-4"
                                                onClick={async(e:any)=>{
                                                    setFilter('Last opened');
                                                }}
                                            >
                                                <p className='py-2 px-4'>Last opened</p>
                                            </Popover.Button>
                                            <Popover.Button className="flex justify-start items-center w-full bg-white py-1 cursor-pointer duration-150 ease-in hover:bg-[#2c60db] gap-2 text-secondary-gray-1 hover:text-white border-b-[1px] border-b-secondary-gray-4"
                                                onClick={async(e:any)=>{
                                                    setFilter('Last modified');
                                                }}
                                            >
                                                <p className='py-2 px-4'>Last modified</p>
                                            </Popover.Button>
                                            <Popover.Button className="flex justify-start items-center w-full bg-white  rounded-b-md py-1 cursor-pointer duration-150 ease-in hover:bg-[#2c60db] gap-2 text-secondary-gray-1 hover:text-white "
                                                onClick={async(e:any)=>{
                                                    setFilter('A to Z');
                                                }}
                                            >
                                                <p className='py-2 px-4'>A to Z</p>
                                            </Popover.Button>
                                    </Popover.Panel>
                                    </Transition>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 mt-8 pb-4">
                            <motion.div key={`roomList${-1}`} className="w-[260px] h-[210px] flex flex-col justify-center items-center rounded-xl drop-shadow-lg bg-[#2c60db] cursor-pointer hover:bg-[#153a62] text-white ease-in duration-200 relative"
                                animate={{ opacity: 1 , scale:1 }}
                                initial={{opacity : 0 , scale:1.3 }}
                                exit ={{ opacity : 0 , scale:1.3 }}
                                transition={{  duration: 0.4 }}
                                onClick={async(e)=>{
                                    setIsCreateRoomClick(true)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            
                            </motion.div>
                            {roomListFiltered.map((room , index)=>(
                                        <ModalRoomSelection
                                            key={`ModalRoomSelection${index}`}
                                            room={room}
                                            index={index}
                                            isHoverRoom={isHoverRoom}
                                            setIsHoverRoom={setIsHoverRoom}
                                            setIsCopyUrl={setIsCopyUrl}
                                            selectCategory={selectCategory}
                                        />     
                            ))}
                    </div>
                </div>
                {/* <div className="text-white font-semibold flex items-center gap-2 rounded-md bg-[#ff355f] hover:bg-[#d62b51] ease-in duration-200 px-3 py-[6px] cursor-pointer drop-shadow-md mb-3" 
                    onClick={()=>{
                        setIsCreateRoomClick(true);
                    }}
                >
                    <p style={{fontFamily:"'Montserrat', sans-serif"}}>Create Room</p>
                    <AddCircleOutlineIcon/>
                </div>
                <div className="grid grid-cols-4 w-full gap-x-6 gap-y-6 border-t-2 border-secondary-gray-3 pt-6">
                    {roomList.map((room,index)=>(
                        <motion.div key={`roomList${index}`} className="w-[200px] lg:w-[250px] flex flex-col justify-start items-center rounded-lg drop-shadow-lg bg-white cursor-pointer hover:bg-gray-light ease-in duration-200 relative"
                            animate={{ opacity: 1 , scale:1 }}
                            initial={{opacity : 0 , scale:1.5 }}
                            exit ={{ opacity : 0 , scale:1.5 }}
                            transition={{  duration: 0.3+index*0.15 }}
                            onClick={async(e)=>{
                                e.stopPropagation();
                                let roomSelect = {} as RoomDataStateType;
                                roomSelect.roomId = room.roomId;
                                roomSelect.roomName = room.roomName;
                                roomSelect.createBy = room.createBy;
                                await Promise.all([
                                    firebase.database().ref(`retrospective/${room.roomId}/roomDetail/userInRoom/${userData.userId}`).set({
                                        name:userData.userName,
                                        profilePicture:userData.profilePicture,
                                        isOnline:true,
                                    }),
                                    firebase.database().ref(`userRetrospective/${userData.userId}`).set({
                                        statusOnline:true,
                                        room:room.roomId
                                    })
                                ])
                                setRoomData(roomSelect);
                            }}
                        >
                            <Popover>
                                <Popover.Button className='flex absolute top-2 right-2 justify-center items-center font-bold text-h5 p-2 text-secondary-gray-3 hover:text-white hover:bg-secondary-gray-2 rounded-full'>
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
                                    <Popover.Panel className="absolute w-45 flex flex-col items-center -left-7 top-[56px] bg-white rounded-lg drop-shadow-md" >
                                        <Popover.Button className="flex justify-center items-center w-36 bg-white  rounded-md py-1 cursor-pointer duration-150 ease-in hover:bg-secondary-gray-1 gap-2 text-secondary-gray-1 hover:text-white "
                                            onClick={async(e:any)=>{
                                                e.stopPropagation();
                                                if(!isLoading){
                                                    setIsLoading(true);
                                                    await deleteRoom(selectCategory,room.roomId);
                                                    // await firebase.database().ref(`retrospective/${room.roomId}`).once("value",async snapshot=>{
                                                    //     await firebase.database().ref(`retrospective/${room.roomId}`).remove();
                                                    // })
                                                    setIsLoading(false);
                                                }
                                            }}
                                        >
                                            <DeleteIcon/>
                                            <p className='font-semibold py-1 mr-2'>Delete Room</p>
                                        </Popover.Button>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                            <div className="w-full h-[170px]" style={{backgroundImage:`url(${room.roomImage === "" ? '/static/images/loading/xloading.gif' : room.roomImage})` , backgroundPosition:'center' , backgroundSize:'cover' , backgroundRepeat:'no-repeat'}}></div>
                            <div className="w-full p-4 flex flex-col justify-start items-start">
                                <p className="text-secondary-gray-2 font-semibold" style={{fontFamily:"'Montserrat', sans-serif"}}>{room.roomName}</p>
                            </div>
                        </motion.div>
                    ))}
                </div> */}
                <AnimatePresence>
                    {isCopyUrl && 
                    <motion.div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-h5 px-4 py-2 bg-[#1e1e1e] text-white rounded-lg"
                        animate={{opacity:1}}
                        initial={{opacity:0}}
                        exit={{opacity:0}}
                        transition={{duration:0.5}}
                    >
                        Link copied to clipboard
                    </motion.div>}
                </AnimatePresence>
            </div>
            <CreateCategoryModal isCreateCategoryClick={isCreateCategoryClick} setIsCreateCategoryClick={setIsCreateCategoryClick} categoriesList={categoriesList}/>
            <RenameCategory isShowRenameCategory={isShowRenameCategory} setIsShowRenameCategory={setIsShowRenameCategory} categoriesList={categoriesList} />
            {isReUsernameClick && <ReUsername/>}
            {isShowChangeProfilePicture &&<ChangeProfilePicture/>}
            {isShowChangeBackgroundPicture && <ChangeBackground/>}
            <ConfirmDeleteModal/>
            <AnimatePresence>
                {isCreateRoomClick && 
                    <motion.div className="h-screen w-full fixed top-0 left-0  flex justify-center items-center z-50 bg-blue-dark-op50 "
                        animate={{ opacity: 1 }}
                        initial={{opacity : 0  }}
                        exit = {{ opacity : 0 }}
                        transition={{  duration: 1 }}
                    >
                        {isCreateRoomClick && 
                            <motion.div className="flex flex-col justify-center items-start w-full max-w-xl bg-white py-10 px-8 rounded-3xl relative"
                                    animate={{ opacity: 1 , y: 0 ,rotateX:0}}
                                    initial={{opacity : 0 , y:-150 , rotateX:90}}
                                    exit ={{ opacity : 0 ,scale:0 , rotateX:90}}
                                    transition={{  duration: 0.7 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 absolute top-2 right-2 p-1 text-secondary-gray-2 rounded-full duration-200 ease-in hover:cursor-pointer hover:bg-secondary-gray-3 hover:text-white " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                        onClick={()=>{setIsCreateRoomClick(false)}}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <p className="font-bold text-h4 text-gray"> Create Room</p>
                                <form  className="w-full h-fit" 
                                    onSubmit={(e)=>{
                                            (async function(){
                                                try{
                                                    if(roomNameRef.current !== null && roomNameRef.current.value !== '' && !isLoading){
                                                        setIsLoading(true);
                                                        let res = await createRoom(userData.userId , userData.userName , selectCategory , roomNameRef.current.value.replaceAll(" ","").replaceAll("-",""));
                                                        // await firebase.database().ref(`retrospective/${idRoom}/roomDetail`).set({
                                                        //     roomName:roomNameRef.current.value.replaceAll(" ","").replaceAll("-",""),
                                                        //     roomImage:"",
                                                        //     createBy:userData.userId
                                                        // })
                                                        console.log(res);
                                                        if(res === 'not exist category'){
                                                            resetSelectCategory();
                                                        }
                                                        setIsLoading(false);
                                                        setIsCreateRoomClick(false);
                                                    }
                                                }catch(err){
                                                    console.log(err);
                                                }
                                            }())
                                        e.preventDefault();
                                    }}
                                >
                                    <CssTextField required inputRef={roomNameRef} fullWidth variant="outlined" label="room name" size={'small'} style={{ marginTop:'60px' }}/>
                                
                                    <button type="submit" className="w-full flex justify-center items-center drop-shadow-lg bg-[#2c60db] hover:bg-[#153a62] hover:cursor-poin duration-200 ease-in text-white font-bold py-2 rounded-md mt-5">
                                        Confirm
                                    </button>
                                </form>
                            </motion.div>
                        }
                    </motion.div>
                    }
                </AnimatePresence>
            
        </motion.div>
    )
}

export default Lobby
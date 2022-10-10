import React from 'react'
import Navbar from '../../components/WhiteBoardComponents/Navbar'
import dynamic from "next/dynamic";
import Head from 'next/head'
import { RecoilRoot, useRecoilState } from 'recoil';
import Sidebar from '../../components/WhiteBoardComponents/Sidebar';
import CreateRoom from '../../components/WhiteBoardComponents/CreateRoom';
import { WhiteBoardRoomDataState, whiteBoardUserDataState } from '../../WhiteBoardStateManagement/Atom';
import LoginSignUp from '../../components/WhiteBoardComponents/LoginSignUp';
import RoomChat from '../../components/WhiteBoardComponents/RoomChat';
import FullChatImage from '../../components/WhiteBoardComponents/FullChatImage';
const StageComponent = dynamic(() => import("../../components/WhiteBoardComponents/StageComponent"), {
  ssr: false,
});

function WhiteBoardApp(){
  const [ userData , setUserData ] = useRecoilState(whiteBoardUserDataState);
  const [ roomData , setRoomData ] = useRecoilState(WhiteBoardRoomDataState);
  return(
    <>
      {userData.userId !== '-' && roomData.roomId !== '-' &&
        <>
        {/* <Navbar/> */}
        {/* <Sidebar/> */}
        <div className="w-full h-full">
          <StageComponent/>
          <RoomChat/>
          <FullChatImage/>
        </div>
        </>
      }
    </>
  )
}


function WhiteBoard() {
  
  return (
    <RecoilRoot>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300&display=swap" rel="stylesheet"/>
        </Head>
        <div className="w-screen h-screen flex justify-center items-center overflow-y-auto max-h-screen">
          <LoginSignUp/>
          <WhiteBoardApp/>
        </div>
    </RecoilRoot> 
  )
}

export default WhiteBoard
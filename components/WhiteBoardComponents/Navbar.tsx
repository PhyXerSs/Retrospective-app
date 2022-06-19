import React from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { isExpandedSideBarState, selectedIdState, WhiteBoardRoomDataState, whiteBoardUserDataState, whiteBoardUserDataStateType } from '../../WhiteBoardStateManagement/Atom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
function Navbar() {
  const isExpandedSideBar = useRecoilValue(isExpandedSideBarState);
  const [ RoomData , setRoomData ] = useRecoilState(WhiteBoardRoomDataState);
  const [ userData , setUserData ] = useRecoilState(whiteBoardUserDataState);
  
  return (
    <div className="flex w-full fixed top-0 h-[60px] bg-[#fafafa] justify-between items-center z-[999] overflow-y-visible">
      <p className={`absolute ${isExpandedSideBar ? 'left-[430px]':'left-20'} ease-in duration-200 font-semibold`}>{RoomData.roomName}</p>
      
      <div className="absolute right-5 flex justify-center items-center gap-4">
        <div className="flex py-1 px-2 hover:bg-[#e2e2e2] items-center rounded-lg ease-in duration-200 cursor-pointer">
          <PersonOutlineIcon style={{fontSize:26}}/>
          <p className="font-semibold">1</p>
        </div>
        <div className="text-white font-semibold flex items-center gap-1 rounded-md bg-[#ff355f] hover:bg-[#d62b51] ease-in duration-200 px-3 py-[6px] cursor-pointer" >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p>Share</p>
        </div>
      </div>

    </div>
  )
}

export default Navbar
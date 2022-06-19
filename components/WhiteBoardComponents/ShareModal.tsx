import { AnimatePresence ,motion} from 'framer-motion';
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil';
import { WhiteBoardRoomDataState } from '../../WhiteBoardStateManagement/Atom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import IconButton from '@mui/material/IconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
interface props{
    isShareClick:boolean;
    setIsShareClick:React.Dispatch<React.SetStateAction<boolean>>;
}
function ShareModal({isShareClick,setIsShareClick}:props) {
    const roomData = useRecoilValue(WhiteBoardRoomDataState);
    const [ isCopyUrl , setIsCopyUrl ] = useState<boolean>(false);
    return (
        <AnimatePresence>
        {isShareClick &&
            <motion.div className="h-screen w-full fixed top-0 left-0  flex justify-center items-center bg-blue-dark-op50 z-[1000] "
                animate={{ opacity: 1 }}
                initial={{opacity : 0  }}
                exit = {{ opacity : 0 }}
                transition={{  duration: 1 }}
            >
                    {isShareClick &&
                    <motion.div className="flex flex-col justify-center items-start w-fit min-w-xl bg-white py-12 px-12 rounded-3xl relative"
                                animate={{ opacity: 1 , y: 0 }}
                                initial={{opacity : 0 , y:-150 }}
                                exit ={{ opacity : 0 , scale: 0 }}
                                transition={{  duration: 0.8 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 absolute top-2 right-2 p-1 text-secondary-gray-2 rounded-full duration-200 ease-in hover:cursor-pointer hover:bg-secondary-gray-3 hover:text-white " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                    onClick={()=>{setIsShareClick(false);
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                
                                <p className="font-bold text-h3 text-gray mb-8"> Invite members </p>
                                <div className='flex w-full flex-col justify-center items-center gap-8'>
                                    <div className="flex w-fit justify-center items-center gap-3 border-2 border-secondary-gray-4 rounded-3xl pl-6">
                                        <p className="font-semibold text-secondary-gray-2 text-h4">{`${window.location.protocol}//${window.location.hostname}${window.location.pathname}#${roomData.roomId}`}</p>
                                        <CopyToClipboard text={`${window.location.protocol}//${window.location.hostname}${window.location.pathname}#${roomData.roomId}`}
                                            onCopy={()=>{
                                                setIsCopyUrl(true);
                                                setTimeout(()=>setIsCopyUrl(false),2000);
                                            }}
                                        >
                                            <IconButton color="primary" component="span">
                                                <FileCopyIcon/>
                                            </IconButton>
                                        </CopyToClipboard>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {isCopyUrl && 
                                    <motion.div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-h5 px-4 py-2 bg-[#1e1e1e] text-white rounded-lg"
                                        animate={{opacity:1}}
                                        initial={{opacity:0}}
                                        exit={{opacity:0}}
                                        transition={{duration:0.5}}
                                    >
                                        Link copied to clipboard
                                    </motion.div>}
                                </AnimatePresence>
                        </motion.div>
                    }
            </motion.div> }
        </AnimatePresence>
  )
}

export default ShareModal
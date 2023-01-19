import { AnimatePresence ,motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { createCategories } from '../../pages/api/WhiteboardAPI/api';
import { categoryObjectType } from './Lobby';
import firebase from '../../firebase/firebase-config';
import { useRecoilState, useRecoilValue } from 'recoil';
import { whiteBoardUserDataState } from '../../WhiteBoardStateManagement/Atom';
interface props{
    isJoinCategoryClick:boolean;
    setIsJoinCategoryClick:React.Dispatch<React.SetStateAction<boolean>>;
}

function JoinCategoryModal({isJoinCategoryClick , setIsJoinCategoryClick}:props) {
    const categoryNameRef = useRef<HTMLInputElement>(null);
    const [userData , setUserData] = useRecoilState(whiteBoardUserDataState);
    const [ isAlertType , setIsAlertType ] = useState<number>(0);
    const [ isLoading , setIsLoading ] = useState<boolean>(false);
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
            {isJoinCategoryClick &&
            <motion.div className="h-screen w-full fixed top-0 left-0  flex justify-center items-center z-50 bg-blue-dark-op50 "
                animate={{ opacity: 1 }}
                initial={{opacity : 0  }}
                exit = {{ opacity : 0 }}
                transition={{  duration: 1 }}
            >{isJoinCategoryClick&&
                <motion.div className="flex flex-col justify-center items-start w-full max-w-xl bg-white rounded-lg relative"
                            animate={{ opacity: 1 , y: 0 ,rotateX:0}}
                            initial={{opacity : 0 , y:-150 , rotateX:90}}
                            exit ={{ opacity : 0 ,scale:0 , rotateX:90}}
                            transition={{  duration: 0.7 }}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 absolute top-7 right-7 p-1 text-secondary-gray-1 rounded-full duration-200 ease-in hover:cursor-pointer hover:bg-secondary-gray-3 hover:text-white " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                onClick={()=>{setIsJoinCategoryClick(false)}}
                        >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div className="flex justify-start items-center gap-3 p-7 border-b-[1px] border-secondary-gray-3 w-full">
                            <img className="w-8" src={'/static/images/whiteboard/team.png'} alt=""/>
                            <p className="font-semibold text-h3 text-gray"> Join team</p>
                        </div>
                        
                        <form  className="w-full h-fit p-7" 
                            onSubmit={(e)=>{
                                    (async function(){
                                        try{
                                            if(categoryNameRef.current !== null && categoryNameRef.current.value !== '' && !isLoading){
                                                let categoyDoc = await firebase.firestore().collection('whiteboard').doc(categoryNameRef.current.value).get();
                                                if(categoyDoc.exists){
                                                    let usersCategoryList = categoyDoc.data()?.userInCategory as string[];
                                                    if(!usersCategoryList.includes(userData.userId)){
                                                        await firebase.firestore().collection('whiteboard').doc(categoryNameRef.current.value).update({
                                                            userInCategory:[...usersCategoryList, userData.userId]
                                                        });
                                                        setIsJoinCategoryClick(false)
                                                    }else{
                                                        setIsAlertType(2);
                                                        setTimeout(()=>setIsAlertType(0),2000);
                                                    }
                                                }else{
                                                    setIsAlertType(1);
                                                    setTimeout(()=>setIsAlertType(0),2000);
                                                }
                                            }
                                        }catch(err){
                                            console.log(err);
                                        }
                                    }())
                                e.preventDefault();
                            }}
                        >
                            <div className="flex items-center gap-5">
                                <CssTextField required inputRef={categoryNameRef} fullWidth variant="outlined" label="Team code" size={'small'}/>
                                <button type="submit" className="w-32 flex justify-center items-center drop-shadow-lg bg-[#2c60db] hover:bg-[#153a62] hover:cursor-pointer duration-200 ease-in text-white py-2 rounded-md">
                                    Done
                                </button>
                            </div>
                        </form>
                        <AnimatePresence>
                    {isAlertType === 1 && 
                    <motion.div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-h5 px-4 py-2 bg-[#1e1e1e] text-white rounded-lg"
                        animate={{opacity:1}}
                        initial={{opacity:0}}
                        exit={{opacity:0}}
                        transition={{duration:0.5}}
                    >
                        This code not valid.
                    </motion.div>}
                    {isAlertType === 2 && 
                    <motion.div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-h5 px-4 py-2 bg-[#1e1e1e] text-white rounded-lg"
                        animate={{opacity:1}}
                        initial={{opacity:0}}
                        exit={{opacity:0}}
                        transition={{duration:0.5}}
                    >
                        You are already in this Team.
                    </motion.div>}
                </AnimatePresence>
                </motion.div>}
            </motion.div>}
        </AnimatePresence>
    )
}

export default JoinCategoryModal
import { AnimatePresence , motion } from 'framer-motion';
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { leaveCategoryState, whiteBoardUserDataState } from '../../../WhiteBoardStateManagement/Atom';
import firebase from '../../../firebase/firebase-config';
function ModalConfrimLeaveCategory() {
    const leaveCategory = useRecoilValue(leaveCategoryState);
    const resetLeaveCategory = useResetRecoilState(leaveCategoryState);
    const [ isLoading , setIsLoading ] = useState<boolean>(false);
    const [ userData , setUserData ] = useRecoilState(whiteBoardUserDataState);
    return (
        <AnimatePresence>
            {leaveCategory.categoryId !== '-' &&
            <motion.div className="h-screen w-full fixed top-0 left-0  flex justify-center items-center z-50 bg-blue-dark-op50 "
                animate={{ opacity: 1 }}
                initial={{opacity : 0  }}
                exit = {{ opacity : 0 }}
                transition={{  duration: 1 }}
            >{leaveCategory.categoryId !== '-' &&
                <motion.div className="flex flex-col justify-center items-start w-full max-w-lg bg-white rounded-lg relative gap-10"
                            animate={{ opacity: 1 , y: 0 ,rotateX:0}}
                            initial={{opacity : 0 , y:-150 , rotateX:90}}
                            exit ={{ opacity : 0 ,scale:0 , rotateX:90}}
                            transition={{  duration: 0.7 }}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 absolute top-7 right-7 p-1 text-secondary-gray-1 rounded-full duration-200 ease-in hover:cursor-pointer hover:bg-secondary-gray-3 hover:text-white " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                onClick={()=>{
                                    resetLeaveCategory();
                                }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div className="flex justify-start items-center gap-3 p-7 border-b-[1px] border-secondary-gray-3 w-full">
                            <p className="font-semibold text-h3 text-gray"> {`Leave "${leaveCategory.categoryName}"`} </p>
                        </div>
                        <div className="w-full flex justify-center items-center">
                            <p className="text-h4">Are you sure to leave “{leaveCategory.categoryName}” ?</p>
                        </div>
                        <div className="w-full flex justify-center items-center gap-14 mb-9">
                            <button className="w-[33%] py-3 flex justify-center items-center rounded-lg drop-shadow-xl bg-[#2c60db] hover:bg-[#153a62] hover:cursor-pointer duration-200 ease-in text-white"
                                onClick={async()=>{
                                    if(!isLoading){
                                        setIsLoading(true)
                                        let categoyDoc = await firebase.firestore().collection('whiteboard').doc(leaveCategory.categoryId).get();
                                        if(categoyDoc.exists){
                                            let usersCategoryList = categoyDoc.data()?.userInCategory as string[];
                                            if(usersCategoryList.includes(userData.userId)){
                                                await firebase.firestore().collection('whiteboard').doc(leaveCategory.categoryId).update({
                                                    userInCategory:usersCategoryList.filter(id => id !== userData.userId),
                                                });
                                                
                                            }
                                            resetLeaveCategory();
                                        }else{
                                            resetLeaveCategory();
                                        }
                                        setIsLoading(false);
                                    }
                                }}
                            >
                                Sure
                            </button>
                            <button className="w-[33%] py-3 flex justify-center items-center rounded-lg drop-shadow-xl bg-[#9e9e9e] hover:bg-[#3a444f] hover:cursor-pointer duration-200 ease-in text-white"
                                onClick={()=>{
                                    resetLeaveCategory();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                </motion.div>}
            </motion.div>}
        </AnimatePresence>
    )
}

export default ModalConfrimLeaveCategory
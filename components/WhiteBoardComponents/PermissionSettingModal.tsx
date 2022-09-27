import firebase from '../../firebase/firebase-config';
import { AnimatePresence , motion} from 'framer-motion';
import React, { useEffect, useState } from 'react'
import SwitchToggle from '../SwitchToggle';

export interface PermissionSettingModalProps{
    categoryPermissionSelected:string;
    setCategoryPermissionSelected:React.Dispatch<React.SetStateAction<string>>;
}

interface userPermissionObj{
    userId:string;
    userDisplayName:string;
    isAllow:boolean;
    isHeadOfCategory:boolean;
}

function PermissionSettingModal({categoryPermissionSelected , setCategoryPermissionSelected}:PermissionSettingModalProps) {
    const [ userWithPermission , setUserWithPermission ] = useState<userPermissionObj[]>([]);
    useEffect(()=>{
        let unsubCategoryData = ()=>{};
        if(categoryPermissionSelected !== '-'){
            unsubCategoryData = firebase.firestore().collection('whiteboard').doc(categoryPermissionSelected).onSnapshot(async snapshot=>{
                let categoryData = snapshot.data();
                let allUserInCategory = categoryData?.userInCategory as string[];
                let userHavePermission = categoryData?.userAllowAccessAllBoard as string[];
                let headOfCategoryId = categoryData?. headOfCategory as string;
                let userPermissionList = [] as userPermissionObj[];
                for(let i in allUserInCategory){
                    let userDisplayName = '';
                    await firebase.database().ref(`userRetrospective/${allUserInCategory[i]}`).once('value' , snap =>{
                        if(snap.val()){
                            userDisplayName = snap.val()?.displayName;
                        }
                    })
                    let userPermission = {} as userPermissionObj;
                    userPermission.userId = allUserInCategory[i];
                    userPermission.userDisplayName = userDisplayName;

                    if(userHavePermission.includes(allUserInCategory[i])){
                        userPermission.isAllow = true;
                    }else{
                        userPermission.isAllow = false;
                    }

                    if(headOfCategoryId === allUserInCategory[i]){
                        userPermission.isHeadOfCategory = true;
                    }else{
                        userPermission.isHeadOfCategory = false;
                    }

                    userPermissionList.push(userPermission)
                }
              
                setUserWithPermission(userPermissionList)
            })   
        }
        return () =>{
            unsubCategoryData();
        }
    },[categoryPermissionSelected])

    async function setUserPermission(user:userPermissionObj){
        let oldCategoryData = (await firebase.firestore().collection('whiteboard').doc(categoryPermissionSelected).get()).data();
        let oldUsersAllowList = oldCategoryData?.userAllowAccessAllBoard as string[];
        let newUserPermissionList = [] as string[];
        if(user.isAllow){
            newUserPermissionList = oldUsersAllowList.filter(oldUserId => oldUserId!==user.userId);
        }else{
            newUserPermissionList = [...oldUsersAllowList , user.userId];
        }
        await firebase.firestore().collection('whiteboard').doc(categoryPermissionSelected).update({
            userAllowAccessAllBoard:newUserPermissionList
        })
    }

    return (
        <AnimatePresence>
            {categoryPermissionSelected !== '-' &&
            <motion.div className="h-screen w-full fixed top-0 left-0  flex justify-center items-center z-50 bg-blue-dark-op50 "
                animate={{ opacity: 1 }}
                initial={{opacity : 0  }}
                exit = {{ opacity : 0 }}
                transition={{  duration: 1 }}
            >
                {categoryPermissionSelected !== '-' &&
                <motion.div className="flex flex-col justify-center items-start w-full max-w-xl bg-white rounded-lg relative"
                            animate={{ opacity: 1 , y: 0 ,rotateX:0}}
                            initial={{opacity : 0 , y:-150 , rotateX:90}}
                            exit ={{ opacity : 0 ,scale:0 , rotateX:90}}
                            transition={{  duration: 0.7 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 absolute top-7 right-7 p-1 text-secondary-gray-1 rounded-full duration-200 ease-in hover:cursor-pointer hover:bg-secondary-gray-3 hover:text-white " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                onClick={()=>{setCategoryPermissionSelected('-')}}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div className="flex justify-start items-center gap-3 px-4 py-7 border-b-[1px] border-secondary-gray-3 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                        </svg>
                        <p className="font-semibold text-[20px] text-gray">Managing User Permissions</p>
                    </div>                    
                    <div className="w-full px-4 min-h-[400px] max-h-[400px] overflow-y-auto flex flex-col">
                        {userWithPermission.map((user,index)=>{
                            return(
                                <div key={`UserPermisionList${index}`} className="w-full flex justify-between items-center border-b-[1px] border-[#d4d4d4] min-h-[50px]">
                                    <p className="">{user.userDisplayName}</p>
                                    {user.isHeadOfCategory ? 
                                        <div className="flex items-center gap-1 w-[80px] justify-center">
                                            <i className="text-gray-tab">Owner</i>
                                        </div>:
                                        <div className="flex items-center gap-1 w-[80px] justify-center">
                                            <SwitchToggle state={user.isAllow}  callFunction={()=>setUserPermission(user)}/>
                                        </div>     
                                    }
                                </div>
                            );
                        })}
                    </div>
                </motion.div>}
            </motion.div>}
        </AnimatePresence>
    )
}

export default PermissionSettingModal
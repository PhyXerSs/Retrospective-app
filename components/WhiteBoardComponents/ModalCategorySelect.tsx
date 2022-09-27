import React, { useEffect, useRef, useState } from 'react'
import { Transition , Popover } from '@headlessui/react'
import { motion } from 'framer-motion'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { isShowDeleteConfirmState, leaveCategoryState, selectCategoryState, whiteBoardUserDataState } from '../../WhiteBoardStateManagement/Atom';
import { deleteCategories } from '../../pages/api/WhiteboardAPI/api';
import { categoryObjectType } from './Lobby';
interface props{
    index:number;
    category:categoryObjectType;
    isShowDropdownCategory:number;
    setIsShowDropdownCategory:React.Dispatch<React.SetStateAction<number>>
    setIsShowRenameCategory:React.Dispatch<React.SetStateAction<string>>
    setCategoryPermissionSelected:React.Dispatch<React.SetStateAction<string>>
}

function ModalCategorySelect({index,category , isShowDropdownCategory , setIsShowDropdownCategory , setIsShowRenameCategory , setCategoryPermissionSelected} : props) {
    const [ selectCategory , setSelectCategory ] = useRecoilState(selectCategoryState);
    const setIsShowDeleteConfirm = useSetRecoilState(isShowDeleteConfirmState);
    const [ userData , setUserData ] = useRecoilState(whiteBoardUserDataState);
    const setLeaveCategory = useSetRecoilState(leaveCategoryState);
    return(
        <Popover>
            {({ open , close}:{open:any , close:any})=>{
                if(open && isShowDropdownCategory !== index){
                    close();
                }
                return(
                    <>
                        <Popover.Button>
                            <motion.div className={`flex justify-center items-center py-3 px-2 ${selectCategory === category.id ? 'text-white bg-[#2c60db] hover:bg-[#153a62]' : 'text-[#1a1a1a] bg-white hover:bg-secondary-gray-4'} duration-200 ease-in rounded-lg cursor-pointer`}
                                style={{boxShadow: 'rgba(0, 0, 0, 0.15) 0px 14px 28px, rgba(0, 0, 0, 0.15) 0px 10px 10px'}}
                                animate={{ opacity: 1 , x:0 }}
                                initial={{opacity : 0 , x:-500 }}
                                exit ={{ opacity : 0 , x:-500 }}
                                transition={{  duration: 0.3+(index)*0.1 }}
                                onClick={()=>{
                                    setSelectCategory(category.id)
                                    if(selectCategory === category.id){
                                        setIsShowDropdownCategory(index)
                                    }else{
                                        setIsShowDropdownCategory(-1)
                                    }
                                }}
                            >
                                <p className="font-semibold w-[152px] break-words">{category.name}</p>
                            </motion.div>
                        </Popover.Button>
                        
                        <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                        >
                            { selectCategory === category.id &&
                            <Popover.Panel className="absolute w-40 flex flex-col items-center left-44 -top-[50px] bg-white rounded-lg drop-shadow-md" >
                                {category.headOfCategory === userData.userId &&
                                <Popover.Button className="flex justify-start py-4 px-8 items-center w-full bg-white  rounded-t-md cursor-pointer duration-150 ease-in hover:bg-[#e8f3ff] gap-2 border-b-[1px] border-b-secondary-gray-4"
                                    onClick={async(e:any)=>{
                                        e.stopPropagation();
                                        setIsShowRenameCategory(category.id)
                                    }}
                                >
                                    <p>Rename</p>
                                </Popover.Button>}
                                {category.headOfCategory === userData.userId &&
                                <Popover.Button className="flex justify-start py-4 px-8 items-center w-full bg-white  rounded-t-md cursor-pointer duration-150 ease-in hover:bg-[#e8f3ff] gap-2 border-b-[1px] border-b-secondary-gray-4"
                                    onClick={async(e:any)=>{
                                        e.stopPropagation();
                                        setCategoryPermissionSelected(category.id)
                                    }}
                                >
                                    <p>Permission</p>
                                </Popover.Button>}
                                {category.headOfCategory === userData.userId ?
                                <Popover.Button className="flex justify-start py-4 px-8 items-center w-full bg-white rounded-b-md cursor-pointer duration-150 ease-in hover:bg-[#e8f3ff] gap-2"
                                    onClick={async(e:any)=>{
                                        e.stopPropagation();
                                        setIsShowDeleteConfirm({
                                            isShowDeleteConfirm:true,
                                            categoryName:category.name,
                                            categoryId:category.id,
                                            roomId:'-',
                                            roomName:'-'
                                        })
                                        // setIsShowDeleteConfirm(true);
                                        // try{
                                        //     await deleteCategories(category);
                                        //     resetSelectCategory();
                                        // }catch(err){
                                        //     console.log(err);
                                        // }
                                    }}
                                    
                                >
                                    <p>Delete</p>
                                </Popover.Button>
                                :<Popover.Button className="flex justify-start py-4 px-8 items-center w-full bg-white rounded-b-md cursor-pointer duration-150 ease-in hover:bg-[#e8f3ff] gap-2"
                                    onClick={async(e:any)=>{
                                        e.stopPropagation();
                                        setLeaveCategory({
                                            categoryName:category.name,
                                            categoryId:category.id,
                                        })
                                    }}
                                >
                                    <p>Leave</p>
                                </Popover.Button>}
                            </Popover.Panel>
                            }
                            
                        </Transition>
                    </>
                )
            }}
            
        </Popover>
    );
}

export default ModalCategorySelect
import { StringifyOptions } from 'querystring'
import React from 'react'
import { atom } from 'recoil'

export interface RectStateType{
    rectId:string,
    model:string,
    selectedByUserId:string,
    selectedByUsername:string,
    selectedByProfilePicture:string,
    message:string,
    type:string,
    positionX:number,
    positionY:number,
    positionWordX:number,
    positionWordY:number,
    scaleX:number,
    scaleY:number,
    rotation:number,
    adaptiveFontSize:number,
    imageUrl:string,
    isDragging:boolean,
}

export const RectState = atom({
    key:'Rect_State',
    default:[] as RectStateType[],
    dangerouslyAllowMutability:true,
})

export interface whiteBoardUserDataStateType{
    userId:string,
    userName:string,
    profilePicture:string,
    backgroundPicture:string,
    category:string[],
}

export const whiteBoardUserDataState = atom({
    key:'white_Board_User_Data_State',
    default:{
        userId:'-',
        userName:'PhyXerSs',
        profilePicture:'https://s.isanook.com/jo/0/rp/r/w300/ya0xa0m1w0/aHR0cHM6Ly9qb294LWNtcy1pbWFnZS0xMjUxMzE2MTYxLmZpbGUubXlxY2xvdWQuY29tLzIwMjEvMDkvMjMvZTQ2YzJkN2ItMDkzYi00NDgzLTkxMjgtMmQ0ZGEyM2IzMTFiLmpwZy8xMDAw.jpg',
        backgroundPicture:'',
        category:[],
    } as whiteBoardUserDataStateType,
})

export interface RoomDataStateType{
    roomId:string,
    roomName:string,
    createBy:string,
}

export const WhiteBoardRoomDataState = atom({
    key:'White_Board_Room_Data_State',
    default: {
        roomId:'-',
        roomName:'Connect-X',
        createBy:'-',
    }as RoomDataStateType,
})

export const isExpandedSideBarState = atom({
    key:'is_Expanded_SideBar_State',
    default: false as boolean
})

export interface dragedRectTypeStateType{
    type:string,
    model:string,
}

export const dragedRectTypeState = atom({
    key:'draged_Rect_Type_State',
    default:{
        type:'-',
        model:'-',
    } as dragedRectTypeStateType,
})

export const selectedIdState = atom({
    key:'selected_Id_State',
    default: null as string|null
})

export const oldSelectedIdState = atom({
    key:'old_Selected_Id_State',
    default:null as string|null
})

export const isShowTextAreaState = atom({
    key: 'is_Show_Text_Area_State',
    default: false as boolean
})

export const linkFromUrlState = atom({
    key: 'link_From_Url_State',
    default:'-' as string,
})

export const defaultCategorySelectState = atom({
    key:'default_Category_Select_State',
    default:'DEFAULT' as string,
})

export const selectCategoryState = atom({
    key:'select_Category_State',
    default:'DEFAULT' as string,
})

export const isReUsernameClickState = atom({
    key:'is_ReUsername_Click_State',
    default:false as boolean
})

export const countTeamStayState = atom({
    key:'count_Team_Stay_State',
    default: 0 as number,
})

export const countRoomStayState = atom({
    key:'count_Room_Stay_State',
    default: 0 as number,
})

export const isShowChangeProfilePictureState = atom({
    key: 'is_Show_Change_Profile_Picture_State',
    default: false as boolean,
})

export const isShowChangeBackgroundPictureState = atom({
    key: 'is_Show_Change_Background_Picture_State',
    default: false as boolean,
})

export interface isShowDeleteConfirmStateType{
    isShowDeleteConfirm:boolean,
    categoryName:string,
    categoryId:string,
    roomId:string,
    roomName:string,
}

export const isShowDeleteConfirmState = atom({
    key:'is_Show_Delete_Confirm_State',
    default:{
        isShowDeleteConfirm:false,
        categoryName:'-',
        categoryId:'-',
        roomId:'-',
        roomName:'-'
    } as isShowDeleteConfirmStateType,
})

export const messageModalAlertState = atom({
    key:'message_Modal_Alert_State',
    default:'-' as string
})

export interface leaveCategoryType{
    categoryName:string,
    categoryId:string,
}

export const leaveCategoryState = atom({
    key:'leave_Category_State',
    default:{
        categoryName:'-',
        categoryId:'-',
    } as leaveCategoryType
})

export const isPermissionAllowAllBoardStage = atom({
    key:'is_Permission_Allow_All_Board_Stage',
    default: false as boolean
})
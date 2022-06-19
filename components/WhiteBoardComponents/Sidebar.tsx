import React, { useRef } from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { RecoilState, useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { dragedRectTypeState, isExpandedSideBarState, RectState, selectedIdState, WhiteBoardRoomDataState, whiteBoardUserDataState } from '../../WhiteBoardStateManagement/Atom';
import { v4 as uuid } from 'uuid';
// import firebase from '../../firebase/firebase-config';
import firebase from '../../firebase/firebase-config';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import Resizer from "react-image-file-resizer";
import TextFieldsIcon from '@mui/icons-material/TextFields';
export interface stickyNoteMetaType{
    type:string,
    bgColor:string,
    positionInCatelogue:string
}

function Sidebar() {
    const [ rects , setRects ] = useRecoilState(RectState);
    const [isExpandedSideBar , setIsExpandedSideBar] = useRecoilState(isExpandedSideBarState);
    const dragRef = useRef<any>(null);
    const setDragedRectType = useSetRecoilState(dragedRectTypeState);
    const [selectedId, selectShape] = useRecoilState(selectedIdState);
    const [ userData , setUserData ] = useRecoilState(whiteBoardUserDataState);
    const [ roomData , setRoomData ] = useRecoilState(WhiteBoardRoomDataState);
    const resetRoomData = useResetRecoilState(WhiteBoardRoomDataState);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const stickyNoteMeta : stickyNoteMetaType[] =[
        {
            type:'try',
            bgColor:'bg-[#f9fe89]',
            positionInCatelogue:'top-0 left-[60px]'
        },
        {
            type:'cons',
            bgColor:'bg-[#9cebfd]',
            positionInCatelogue:'top-0 left-[30px]'
        },
        {
            type:'pros',
            bgColor:'bg-[#ffc4e6]',
            positionInCatelogue:'top-0 left-[0]'
        },
    ]

    const stickyNoteCircleMeta : stickyNoteMetaType[] = [
        {
            type:'try',
            bgColor:'bg-[#f9fe89]',
            positionInCatelogue:'top-0 left-[60px]'
        },
        {
            type:'cons',
            bgColor:'bg-[#9cebfd]',
            positionInCatelogue:'top-0 left-[30px]'
        },
        {
            type:'pros',
            bgColor:'bg-[#ffc4e6]',
            positionInCatelogue:'top-0 left-[0]'
        },
    ]

    function convertFileToImage(file:File , mousePositionX : number , mousePositionY : number , mode : string){
        try {
          Resizer.imageFileResizer(
            file,
            500,
            500,
            "JPEG",
            150,
            0,
            async (uri) => {
              let idRect = uuid();
              let data = uri as string;
              if(mode === 'inputFile'){
                  mousePositionX = 720+rects.length*10;
                  mousePositionY = 250+rects.length*10;
              }
              handleSelectShape(selectedId , null);
              await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                  rectId:idRect,
                  model:'image',
                  selectedByUserId:userData.userId,
                  selectedByUsername:userData.userName,
                  message:'',
                  type:'image',
                  positionX:mousePositionX,
                  positionY:mousePositionY,
                  scaleX : 1,
                  scaleY : 1,
                  rotation : 0,
                  positionWordX : -50,
                  positionWordY : -50,
                  adaptiveFontSize : 12,
                  imageUrl:data,
                  isDragging : false,
              })
            },
            "Blob"
          );
        } catch (err) {
          console.log(err);
        }
      }

    function formatGridSquareShape(){
        
        let maxStageWidth = 1920;
        let maxStageHeight = 1080;
        let whitePaperWidth = 1280;
        let whitePaperheight = 880;
        let whitePaperOffsetX = 600;
        let whitePaperOffsetY = 100;
        let rescale = 0.7;
        let shapeWidth = 100 * rescale;
        let shapeHeight = 100 * rescale;
        let middlePaperX = whitePaperOffsetX + whitePaperWidth / 2 - shapeWidth / 2;
        let middlePaperY = whitePaperOffsetY + whitePaperheight / 2 - shapeHeight / 2;
        let gap = 20;
        shapeWidth = shapeWidth + gap;
        shapeHeight = shapeHeight + gap;
        let prosOrderX = 1;
        let prosOrderY = 1;
        let consOrderX = 1;
        let consOrderY = 1;
        let tryOrderX = 1;
        let tryOrderY = 1;
        let newPositionX = 0;
        let newPositionY = 0;
        setRects(
            rects.map((rect)=>{
                if(rect.type === "pros"){
                    newPositionX = (middlePaperX - shapeWidth  * prosOrderX);
                    newPositionY = (middlePaperY - shapeHeight * prosOrderY );
                    if( newPositionX < middlePaperX - whitePaperOffsetX ){
                        prosOrderX = 1;
                        newPositionX = (middlePaperX - shapeWidth * prosOrderX );
                        prosOrderY = prosOrderY + 1;
                        newPositionY = (middlePaperY - shapeHeight * prosOrderY ) ;
                    }
                    prosOrderX = prosOrderX + 1;
                    (async function(){
                        await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).update({
                            positionX : newPositionX,
                            positionY: newPositionY,
                            positionWordX:0,
                            positionWordY:0,
                            scaleX : rescale,
                            scaleY : rescale,
                            rotation: 0,
                        })
                    }());
                    return{
                        ...rect,
                        positionX : newPositionX,
                        positionY: newPositionY,
                        positionWordX:0,
                        positionWordY:0,
                        scaleX : rescale,
                        scaleY : rescale,
                        rotation: 0,
                    };
                }else if(rect.type === 'cons'){
                    newPositionX = (middlePaperX - shapeWidth  * consOrderX);
                    newPositionY = (middlePaperY + shapeHeight * consOrderY );
                    if(newPositionX < middlePaperX - whitePaperOffsetX ){
                        consOrderX = 1;
                        newPositionX = (middlePaperX - shapeWidth * consOrderX );
                        consOrderY = consOrderY + 1;
                        newPositionY = (middlePaperY + shapeHeight * consOrderY ) ;
                    }
                    consOrderX = consOrderX + 1;
                    (async function(){
                        await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).update({
                            positionX : newPositionX,
                            positionY: newPositionY,
                            positionWordX:0,
                            positionWordY:0,
                            scaleX : rescale,
                            scaleY : rescale,
                            rotation: 0,
                        })
                    }());
                    return{
                        ...rect,
                        positionX : newPositionX,
                        positionY: newPositionY,
                        positionWordX:0,
                        positionWordY:0,
                        scaleX : rescale,
                        scaleY : rescale,
                        rotation: 0,
                    };
                }else if(rect.type === 'try'){
                    newPositionX = (middlePaperX + shapeWidth  * tryOrderX);
                    newPositionY = (middlePaperY + shapeHeight * tryOrderY );
                    if( newPositionX > middlePaperX + whitePaperOffsetX ){
                        tryOrderX= 1;
                        newPositionX = (middlePaperX + shapeWidth * tryOrderX );
                        tryOrderY = tryOrderY + 1;
                        newPositionY = (middlePaperY + shapeHeight * tryOrderY ) ;
                    }
                    tryOrderX = tryOrderX + 1;
                    (async function(){
                        await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).update({
                            positionX : newPositionX,
                            positionY: newPositionY,
                            positionWordX:0,
                            positionWordY:0,
                            scaleX : rescale,
                            scaleY : rescale,
                            rotation: 0,
                        })
                    }());
                    return{
                        ...rect,
                        positionX : newPositionX,
                        positionY: newPositionY,
                        positionWordX:0,
                        positionWordY:0,
                        scaleX : rescale,
                        scaleY : rescale,
                        rotation: 0,
                    };
                }else{
                    return{
                        ...rect,
                    };
                }
                
            })
        );
        
    }

    const handleSelectShape = async(oldSelect:string|null , newSelect:string|null) => {
        if(oldSelect!==null){
            (async function(){
                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${oldSelect}`).update({
                    selectedByUserId:'-',
                    selectedByUsername:'-'
                })
            }());
        }
        if(newSelect !== null){
            (async function(){
                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${newSelect}`).update({
                    selectedByUserId:userData.userId,
                    selectedByUsername:userData.userName
                })
            }());
        }
    }

    return (
        <>
            <div className='flex flex-col w-14 drop-shadow-lg bg-[#fafafa] h-[3096px] max-h-screen fixed top-0 left-0 justify-start items-center z-[1000] gap-4'>
                <button onClick={()=>{
                    resetRoomData();
                }} >
                    <LogoutIcon className=" mt-3  p-2 rotate-180 hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer" style={{fontSize:40}} />
                </button>
                <button 
                    onClick={()=>{
                        setIsExpandedSideBar(!isExpandedSideBar)
                    }}
                >
                    <StickyNote2Icon className='p-2 hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer text-black-opa80' style={{fontSize:40}}  />
                </button>
                <label  >
                    <PhotoLibraryIcon className="p-2 hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer text-black-opa80" style={{fontSize:40}}/>
                    <input ref={inputFileRef} type="file" className="hidden" accept="image/*"
                        onChange={(e)=>{
                            e.preventDefault();
                            if (e.target.files !== null && e.target.files.length > 0){
                                convertFileToImage(e.target.files[0], 0 , 0 , 'inputFile');
                            }
                            e.target.value = ''
                        }}
                    />
                </label>
                <div className="p-2 hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer text-black-opa80"
                    onClick={formatGridSquareShape}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </div>
            </div>
            <div className={`flex flex-col w-[350px] ${isExpandedSideBar ? 'left-[56px]':'-left-[2000px]'} drop-shadow-lg bg-[#fafafa] h-[3096px] max-h-screen fixed top-0 justify-start items-center z-[999] gap-5 ease-in duration-200 overflow-y-auto overflow-x-clip`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute top-3 right-3 text-secondary-gray-2 hover:bg-secondary-gray-2 hover:text-white rounded-full ease-in duration-200 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    onClick={()=>{
                        setIsExpandedSideBar(false)
                    }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div className='flex flex-col items-start w-full mt-16 px-4 gap-2'>
                    <p className="text-secondary-gray-2 font-semibold">Text</p>
                    <div className="flex justify-start items-center w-[350px] relative">
                        <div className="flex p-3 border-[2px] border-secondary-gray-3 hover:border-secondary-gray-1 ease-in duration-200 cursor-pointer"
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'textfield',
                                    model:'textfield',
                                })
                            }}
                            onClick={async()=>{
                                let idRect = uuid();
                                handleSelectShape(selectedId , null);
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'textfield',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'textfield',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 50,
                                    positionWordY : 50,
                                    adaptiveFontSize: 12,
                                    imageUrl:'',
                                    isDragging : false,
                                })
                            }}
                        >
                            <TextFieldsIcon style={{fontSize:40}}/>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col items-start w-full px-4 gap-2'>
                    <p className="text-secondary-gray-2 font-semibold">Rectangular sticky note</p>
                    <div className="flex justify-start items-center w-[350px] h-24 relative">
                    {
                        stickyNoteMeta.map((note,index)=>{
                            return (
                            <div key={`notepick${note.type}`} className={`w-20 h-20 ${note.bgColor} absolute ${note.positionInCatelogue} drop-shadow-md hover:scale-110 ease-in duration-200 cursor-pointer`}
                                draggable
                                ref={dragRef}
                                onDragStart={(e:any)=>{
                                    setDragedRectType({
                                        type:note.type,
                                        model:'rectangular',
                                    })
                                }}
                                onClick={async()=>{
                                    let idRect = uuid();
                                    handleSelectShape(selectedId , null);
                                    await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                        rectId:`${idRect}`,
                                        model:'rectangular',
                                        selectedByUserId:userData.userId,
                                        selectedByUsername:userData.userName,
                                        message:'',
                                        type:note.type,
                                        positionX:720+rects.length*10,
                                        positionY:250+rects.length*10,
                                        scaleX : 1,
                                        scaleY : 1,
                                        rotation : 0,
                                        positionWordX : 50,
                                        positionWordY : 50,
                                        adaptiveFontSize: 12,
                                        imageUrl:'',
                                        isDragging : false,
                                    })
                                }}
                            >
                            </div>)
                        })
                    }
                    </div>
                </div>

                <div className='flex flex-col items-start w-full px-4 gap-2'>
                    <p className="text-secondary-gray-2 font-semibold">Circle Sticky note</p>
                    <div className="flex justify-start items-center w-[350px] h-24 relative">
                    {
                        stickyNoteCircleMeta.map((note,index)=>{
                            return (
                            <div key={`notepick${note.type}`} className={`w-20 h-20 ${note.bgColor} absolute ${note.positionInCatelogue} drop-shadow-md hover:scale-110 ease-in duration-200 cursor-pointer rounded-full`}
                                draggable
                                ref={dragRef}
                                onDragStart={(e:any)=>{
                                    setDragedRectType({
                                        type:note.type,
                                        model:'circle',
                                    })
                                }}
                                onClick={async()=>{
                                    handleSelectShape(selectedId , null);
                                    let idRect = uuid();
                                    await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                        rectId:`${idRect}`,
                                        model:'circle',
                                        selectedByUserId:userData.userId,
                                        selectedByUsername:userData.userName,
                                        message:'',
                                        type:note.type,
                                        positionX:720+rects.length*10,
                                        positionY:250+rects.length*10,
                                        scaleX : 1,
                                        scaleY : 1,
                                        rotation : 0,
                                        positionWordX : 0,
                                        positionWordY : 0,
                                        adaptiveFontSize: 12,
                                        isDragging : false,
                                    })
                                }}
                            >
                            </div>)
                        })
                    }
                    </div>
                </div>

                <div className='flex flex-col items-start w-full px-4 gap-2'>
                    <p className="text-secondary-gray-2 font-semibold">Shapes</p>
                    <div className="flex flex-wrap justify-start items-center w-[300px] relative gap-5">
                        <img src={'/static/images/whiteboard/octagon.png'} alt="" className="w-20 h-20 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'shapeLine',
                                    model:'octagon',
                                })
                            }}
                            onClick={async()=>{
                                handleSelectShape(selectedId , null);
                                let idRect = uuid();
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'octagon',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'shapeLine',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 0,
                                    positionWordY : 0,
                                    adaptiveFontSize: 12,
                                    isDragging : false,
                                })
                            }}
                        />
                        <img src={'/static/images/whiteboard/pentagon.png'} alt="" className="w-20 h-20 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'shapeLine',
                                    model:'pentagon',
                                })
                            }}
                            onClick={async()=>{
                                handleSelectShape(selectedId , null);
                                let idRect = uuid();
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'pentagon',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'shapeLine',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 0,
                                    positionWordY : 0,
                                    adaptiveFontSize: 12,
                                    isDragging : false,
                                })
                            }}
                        />
                        <img src={'/static/images/whiteboard/hexagon.png'} alt="" className="w-19 h-19 ml-[6px] object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'shapeLine',
                                    model:'hexagon',
                                })
                            }}
                            onClick={async()=>{
                                handleSelectShape(selectedId , null);
                                let idRect = uuid();
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'hexagon',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'shapeLine',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 0,
                                    positionWordY : 0,
                                    adaptiveFontSize: 12,
                                    isDragging : false,
                                })
                            }}
                        />
                        <img src={'/static/images/whiteboard/star.png'} alt="" className="w-20 h-20 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'shapeLine',
                                    model:'star',
                                })
                            }}
                            onClick={async()=>{
                                handleSelectShape(selectedId , null);
                                let idRect = uuid();
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'star',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'shapeLine',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 0,
                                    positionWordY : 0,
                                    adaptiveFontSize: 12,
                                    isDragging : false,
                                })
                            }}
                        />
                        <img src={'/static/images/whiteboard/starSeven.png'} alt="" className="w-20 h-20 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'shapeLine',
                                    model:'starSeven',
                                })
                            }}
                            onClick={async()=>{
                                handleSelectShape(selectedId , null);
                                let idRect = uuid();
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'starSeven',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'shapeLine',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 0,
                                    positionWordY : 0,
                                    adaptiveFontSize: 12,
                                    isDragging : false,
                                })
                            }}
                        />
                        <img src={'/static/images/whiteboard/starFour.png'} alt="" className="w-20 h-20 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'shapeLine',
                                    model:'starFour',
                                })
                            }}
                            onClick={async()=>{
                                handleSelectShape(selectedId , null);
                                let idRect = uuid();
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'starFour',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'shapeLine',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 0,
                                    positionWordY : 0,
                                    adaptiveFontSize: 12,
                                    isDragging : false,
                                })
                            }}
                        />
                        <img src={'/static/images/whiteboard/rectangularShape.png'} alt="" className="w-20 h-20 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'shapeLine',
                                    model:'rectangularShape',
                                })
                            }}
                            onClick={async()=>{
                                handleSelectShape(selectedId , null);
                                let idRect = uuid();
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'rectangularShape',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'shapeLine',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 0,
                                    positionWordY : 0,
                                    adaptiveFontSize: 12,
                                    isDragging : false,
                                })
                            }}
                        />
                        <img src={'/static/images/whiteboard/triangle.png'} alt="" className="w-20 h-20 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'shapeLine',
                                    model:'triangle',
                                })
                            }}
                            onClick={async()=>{
                                handleSelectShape(selectedId , null);
                                let idRect = uuid();
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'triangle',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'shapeLine',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 0,
                                    positionWordY : 0,
                                    adaptiveFontSize: 12,
                                    isDragging : false,
                                })
                            }}
                        />
                        <img src={'/static/images/whiteboard/starFourTriple.png'} alt="" className="w-20 h-20 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
                            draggable
                            ref={dragRef}
                            onDragStart={(e:any)=>{
                                setDragedRectType({
                                    type:'shapeLine',
                                    model:'starFourTriple',
                                })
                            }}
                            onClick={async()=>{
                                handleSelectShape(selectedId , null);
                                let idRect = uuid();
                                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                    rectId:`${idRect}`,
                                    model:'starFourTriple',
                                    selectedByUserId:userData.userId,
                                    selectedByUsername:userData.userName,
                                    message:'',
                                    type:'shapeLine',
                                    positionX:720+rects.length*10,
                                    positionY:250+rects.length*10,
                                    scaleX : 1,
                                    scaleY : 1,
                                    rotation : 0,
                                    positionWordX : 0,
                                    positionWordY : 0,
                                    adaptiveFontSize: 12,
                                    isDragging : false,
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar
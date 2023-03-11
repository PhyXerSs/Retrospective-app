import React, { useEffect, useRef, useState } from 'react'
import { Transition , Popover } from '@headlessui/react'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { dragedRectTypeState, RectState, selectedIdState, WhiteBoardRoomDataState, whiteBoardUserDataState , isDrawSelectedState , isEraserSelectedState , drawSettingState } from '../../WhiteBoardStateManagement/Atom';
import firebase from '../../firebase/firebase-config';
// import firebase from '../../firebase/firebaseConfig';
import { v4 as uuid } from 'uuid';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Resizer from "react-image-file-resizer";
import * as firebaseServer from 'firebase';
import { CSVLink } from "react-csv";
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import GestureIcon from '@mui/icons-material/Gesture';
export interface stickyNoteMetaType{
    type:string,
    bgColor:string,
    positionInCatelogue:string
}

export interface csvHeaderType{
    label:string,
    key:string,
}

export interface csvDataType{
    good:string,
    bad:string,
    try:string,
}

export const csvHeader = [
    { label: "Good", key: "good" },
    {label: "Bad", key: "bad"},
    {label: "Try", key: "try"},
]

function Toolbar({handleSaveImage , autoGetUrlRoomImage}:{handleSaveImage:any , autoGetUrlRoomImage:any}) {
    const [ rects , setRects ] = useRecoilState(RectState);
    const dragRef = useRef<any>(null);
    const setDragedRectType = useSetRecoilState(dragedRectTypeState);
    const [selectedId, selectShape] = useRecoilState(selectedIdState);
    const [ userData , setUserData ] = useRecoilState(whiteBoardUserDataState);
    const [ roomData , setRoomData ] = useRecoilState(WhiteBoardRoomDataState);
    const resetRoomData = useResetRecoilState(WhiteBoardRoomDataState);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [csvData , setCSVData] = useState<csvDataType[]>([]);
    const [ isDrawSelected , setIsDrawSelected ] = useRecoilState(isDrawSelectedState);
    const [ isEraserSelected , setIsEraserSelected ] = useRecoilState(isEraserSelectedState);
    const [ drawSetting , setDrawSetting ] = useRecoilState(drawSettingState);
    const stickyNoteMeta : stickyNoteMetaType[] =[
        // {
        //     type:'try',
        //     bgColor:'bg-[#f9fe89]',
        //     positionInCatelogue:'top-0 left-[60px]'
        // },
        // {
        //     type:'cons',
        //     bgColor:'bg-[#9cebfd]',
        //     positionInCatelogue:'top-0 left-[30px]'
        // },
        // {
        //     type:'pros',
        //     bgColor:'bg-[#ffc4e6]',
        //     positionInCatelogue:'top-0 left-[0]'
        // },
        {
            type:'green',
            bgColor:'bg-[#40a88e]',
            positionInCatelogue:'top-0 left-[240px]'
        },
        {
            type:'greenYellow',
            bgColor:'bg-[#8dbd74]',
            positionInCatelogue:'top-0 left-[210px]'
        },
        {
            type:'grayBlue',
            bgColor:'bg-[#58748f]',
            positionInCatelogue:'top-0 left-[180px]'
        },
        {
            type:'blue',
            bgColor:'bg-[#2c7ba0]',
            positionInCatelogue:'top-0 left-[150px]'
        },
        {
            type:'purple',
            bgColor:'bg-[#a151d8]',
            positionInCatelogue:'top-0 left-[120px]'
        },
        {
            type:'pink',
            bgColor:'bg-[#ff8ea8]',
            positionInCatelogue:'top-0 left-[90px]'
        },
        {
            type:'yellow',
            bgColor:'bg-[#f7c95a]',
            positionInCatelogue:'top-0 left-[60px]'
        },
        {
            type:'orange',
            bgColor:'bg-[#f88b4b]',
            positionInCatelogue:'top-0 left-[30px]'
        },
        {
            type:'red',
            bgColor:'bg-[#f9523e]',
            positionInCatelogue:'top-0 left-[0px]'
        },
    ]

    const stickyNoteCircleMeta : stickyNoteMetaType[] = [
        // {
        //     type:'try',
        //     bgColor:'bg-[#f9fe89]',
        //     positionInCatelogue:'top-0 left-[60px]'
        // },
        // {
        //     type:'cons',
        //     bgColor:'bg-[#9cebfd]',
        //     positionInCatelogue:'top-0 left-[30px]'
        // },
        // {
        //     type:'pros',
        //     bgColor:'bg-[#ffc4e6]',
        //     positionInCatelogue:'top-0 left-[0]'
        // },
        {
            type:'green',
            bgColor:'bg-[#40a88e]',
            positionInCatelogue:'top-0 left-[240px]'
        },
        {
            type:'greenYellow',
            bgColor:'bg-[#8dbd74]',
            positionInCatelogue:'top-0 left-[210px]'
        },
        {
            type:'grayBlue',
            bgColor:'bg-[#58748f]',
            positionInCatelogue:'top-0 left-[180px]'
        },
        {
            type:'blue',
            bgColor:'bg-[#2c7ba0]',
            positionInCatelogue:'top-0 left-[150px]'
        },
        {
            type:'purple',
            bgColor:'bg-[#a151d8]',
            positionInCatelogue:'top-0 left-[120px]'
        },
        {
            type:'pink',
            bgColor:'bg-[#ff8ea8]',
            positionInCatelogue:'top-0 left-[90px]'
        },
        {
            type:'yellow',
            bgColor:'bg-[#f7c95a]',
            positionInCatelogue:'top-0 left-[60px]'
        },
        {
            type:'orange',
            bgColor:'bg-[#f88b4b]',
            positionInCatelogue:'top-0 left-[30px]'
        },
        {
            type:'red',
            bgColor:'bg-[#f9523e]',
            positionInCatelogue:'top-0 left-[0px]'
        },
    ];

    const stickyGoodBadTry : stickyNoteMetaType[] =[
        {
            type:'Good',
            bgColor:'bg-[#C8DFB7]',
            positionInCatelogue:'top-0 left-[0]'
        },
        {
            type:'Bad',
            bgColor:'bg-[#FDAEB0]',
            positionInCatelogue:'top-0 left-[30px]'
        },
        {
            type:'Try',
            bgColor:'bg-[#FFD966]',
            positionInCatelogue:'top-0 left-[60px]'
        },
    ]

    const drawColors = ['#083AA9' , '#D2001A' , '#f9523e' ,'#40a88e' , '#a151d8' ,'#000000'  ]

    function formatGridSquareShape(){
        
        let maxStageWidth = 1920;
        let maxStageHeight = 1080;
        let whitePaperWidth = 1280;
        let whitePaperheight = 880;
        let whitePaperOffsetX = -640;
        let whitePaperOffsetY = -440;
        let rescale = 0.7;
        let shapeWidth = 100 * rescale;
        let shapeHeight = 100 * rescale;
        let middlePaperX = whitePaperOffsetX - whitePaperWidth / 2 - shapeWidth / 2;
        let middlePaperY = whitePaperOffsetY - whitePaperheight / 2 - shapeHeight / 2;
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
                  mousePositionX = -640+rects.length*10%640;
                  mousePositionY = -440+rects.length*10%440;
              }
              handleSelectShape(selectedId , null);
              let uriRoomImage = autoGetUrlRoomImage();
              await Promise.all([
                firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
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
                }),
                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                    // roomImage: uriRoomImage,
                    lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                })
              ])
            },
            "Blob"
          );
        } catch (err) {
          console.log(err);
        }
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

    useEffect(()=>{
        let csvDataList = [] as csvDataType[];
        let goodList = [] as string[]
        let badList = [] as string[]
        let tryList = [] as string[]
        rects.forEach(rect=>{
            if(rect.type === 'Good'){
                goodList.push(rect.message);
            }else if(rect.type === 'Bad'){
                badList.push(rect.message);
            }else if(rect.type === 'Try'){
                tryList.push(rect.message);
            }
        })
        let maxLength = Math.max(goodList.length , badList.length , tryList.length);
        goodList.sort();
        badList.sort();
        tryList.sort();
        for(let i = 0 ; i < maxLength ; i++){
            let csv = {} as csvDataType;
            csv.good = "";
            csv.bad = "";
            csv.try = "";
            if(goodList[i] !== undefined){
                csv.good = goodList[i];
            }
            if(badList[i] !== undefined){
                csv.bad = badList[i];
            }
            if(tryList[i] !== undefined){
                csv.try = tryList[i]
            }
            csvDataList.push(csv)
        }
        setCSVData(csvDataList);
    },[rects])
    
    return (
        <div className="fixed bottom-10 z-[40] flex justify-start items-center w-full min-w-[500px] max-w-[700px] bg-white rounded-xl h-20 " style={{boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'}}>
            <div className="flex w-full h-full justify-start items-center">
                { (isDrawSelected || isEraserSelected) ? 
                <>
                    <div className='w-full min-w-[400px] max-w-[560px] flex justify-start items-center gap-0 sm:gap-5'>
                        <div className="flex flex-1 flex-col justify-center items-center relative gap-1 pl-0 sm:pl-2">
                            <div className="flex w-36 sm:w-56 justify-between items-center">
                                <p className="text-secondary-gray-2">size</p>
                                <p className="text-secondary-gray-2">
                                    {drawSetting.size}
                                </p>
                            </div>
                            <input
                                type="range"
                                value={drawSetting.size}
                                min={3}
                                max={8}
                                step={1}
                                aria-labelledby="Zoom"
                                onChange={(e) => {
                                    setDrawSetting({
                                        ...drawSetting,
                                        size:Number(e.target.value)
                                    })
                                }}
                                className={`w-36 sm:w-56 bg-[#000000] `}
                                />
                        </div>
                        <div className="flex w-[200px] justify-center items-center relative gap-[6px] sm:gap-[8px]">
                            {drawColors.map((color,index)=>(
                                <div key={`drawColorKey${index}`} className={`w-7 h-7 drop-shadow-md hover:scale-125 ease-in duration-200 cursor-pointer rounded-full ${drawSetting.color === color && isDrawSelected ? 'scale-125' : 'scale-100'}`} style={{backgroundColor:color}}
                                    onClick={()=>{
                                        if(isEraserSelected){
                                            setIsEraserSelected(false)
                                        }             
                                        setIsDrawSelected(true)
                                        setDrawSetting({
                                            ...drawSetting,
                                            color:color
                                        })
                                    }}
                                >
                                </div>
                            ))}
                        </div>
                        <div className={`flex p-3 border-[2px] ${isEraserSelected ? ' border-blue hover:border-blue' :'border-secondary-gray-3 hover:border-secondary-gray-1'} rounded-full  ease-in duration-200 cursor-pointer`}
                            onClick={()=>{
                                if(isDrawSelected){
                                    setIsDrawSelected(false);
                                }
                                setIsEraserSelected(true)
                            }}
                        >
                            <img src={'/static/images/Icon/eraser-64.png'} alt='' className='min-w-6 h-6 object-cover'/>
                        </div> 
                    </div>
                    <div className="min-w-[100px] max-w-[140px] flex-1 flex justify-end pr-5">
                        <div className="px-2 py-1 w-fit rounded-md border-[2px] border-secondary-gray-3 hover:border-secondary-gray-1 text-[16px] cursor-pointer font-semibold"
                            onClick={()=>{
                                setIsDrawSelected(false);
                                setIsEraserSelected(false);
                            }}
                        >
                            Done
                        </div>
                    </div>
                </>
                :
                <>
                <Popover className="flex flex-1 justify-center items-center relative">
                    {({open}:any)=>(
                        <>
                            <Popover.Button className="outline-none p-[6px] hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer">
                                {open ? <img src={'/static/images/whiteboard/textActiveIcon.png'} className='w-6 h-6 object-cover' /> : <img src={'/static/images/whiteboard/textIcon.png'} className='w-6 h-6 object-cover'/>}
                            </Popover.Button>
                            <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                            >
                                <Popover.Panel className="flex justify-center items-center gap-2 p-4 absolute -top-32 -left-[58px] rounded-xl bg-white" style={{boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'}}>
                                    <Popover.Button className="flex p-3 border-[2px] border-secondary-gray-3 hover:border-secondary-gray-1 ease-in duration-200 cursor-pointer"
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
                                            let uri = autoGetUrlRoomImage();
                                            await Promise.all([
                                                firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                    rectId:`${idRect}`,
                                                    model:'textfield',
                                                    selectedByUserId:userData.userId,
                                                    selectedByUsername:userData.userName,
                                                    message:'',
                                                    type:'textfield',
                                                    positionX:-640+rects.length*10%640,
                                                    positionY:-440+rects.length*10%440,
                                                    scaleX : 1,
                                                    scaleY : 1,
                                                    rotation : 0,
                                                    positionWordX : 50,
                                                    positionWordY : 50,
                                                    adaptiveFontSize: 12,
                                                    imageUrl:'',
                                                    isDragging : false,
                                                }),
                                                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                    // roomImage: uri,
                                                    lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                })
                                            ])
                                        }}
                                    >
                                        <TextFieldsIcon style={{fontSize:20}}/>
                                    </Popover.Button>
                                    <div className={`flex p-3 border-[2px] ${isDrawSelected ? ' border-blue hover:border-blue' :'border-secondary-gray-3 hover:border-secondary-gray-1'}  ease-in duration-200 cursor-pointer`}
                                        onClick={async()=>{
                                            if(isEraserSelected){
                                                setIsEraserSelected(false)
                                            }             
                                            setIsDrawSelected(!isDrawSelected)
                                        }}
                                    >
                                        <GestureIcon style={{fontSize:20, color: isDrawSelected ?'rgb(32 118 210 / var(--tw-border-opacity))' : '', }}/>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                    
                </Popover>
                
                <Popover className="flex flex-1 justify-center items-center relative">
                    {({open}:any)=>(
                        <>
                            <Popover.Button className="outline-none p-2 hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer">
                                {open ? <img src={'/static/images/whiteboard/stickynotesActiveIcon.png'} className='w-5 h-5 object-cover' /> :<img src={'/static/images/whiteboard/stickynotesIcon.png'} className='w-5 h-5 object-cover' />}
                            </Popover.Button>
                            <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                            >
                                <Popover.Panel className="flex flex-col justify-start items-center p-4 absolute -top-48 -left-[190px] rounded-xl bg-white" style={{boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'}}>
                                    <div className='flex flex-col items-start w-[290px] gap-4'>
                                        <div className="flex justify-start items-center w-full h-12 relative">
                                        {
                                            stickyNoteMeta.map((note,index)=>{
                                                return (
                                                    <Popover.Button key={`notepick${note.type}`} className={`w-12 h-12 ${note.bgColor} absolute ${note.positionInCatelogue} drop-shadow-lg hover:scale-125 ease-in duration-200 cursor-pointer`}
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
                                                            let uri = autoGetUrlRoomImage();
                                                            await Promise.all([
                                                                firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                                    rectId:`${idRect}`,
                                                                    model:'rectangular',
                                                                    selectedByUserId:userData.userId,
                                                                    selectedByUsername:userData.userName,
                                                                    message:'',
                                                                    type:note.type,
                                                                    positionX:-640+rects.length*10%640,
                                                                    positionY:-440+rects.length*10%440,
                                                                    scaleX : 1,
                                                                    scaleY : 1,
                                                                    rotation : 0,
                                                                    positionWordX : 50,
                                                                    positionWordY : 50,
                                                                    adaptiveFontSize: 12,
                                                                    imageUrl:'',
                                                                    isDragging : false,
                                                                    favoriteList : [],
                                                                }),
                                                                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                                    // roomImage: uri,
                                                                    lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                                })
                                                            ]) 
                                                        }}
                                                    >
                                                    </Popover.Button>
                                                )
                                            })
                                        }
                                        </div>
                                        <div className='flex flex-col items-start w-full gap-2'>
                                            <div className="flex justify-start items-center w-full h-12 relative">
                                            {
                                                stickyNoteCircleMeta.map((note,index)=>{
                                                    return (
                                                    <Popover.Button key={`notepick${note.type}`} className={`w-12 h-12 ${note.bgColor} absolute ${note.positionInCatelogue} drop-shadow-md hover:scale-125 ease-in duration-200 cursor-pointer rounded-full`}
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
                                                            let uri = autoGetUrlRoomImage();
                                                            await Promise.all([
                                                                firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                                    rectId:`${idRect}`,
                                                                    model:'circle',
                                                                    selectedByUserId:userData.userId,
                                                                    selectedByUsername:userData.userName,
                                                                    message:'',
                                                                    type:note.type,
                                                                    positionX:-640+rects.length*10%640,
                                                                    positionY:-440+rects.length*10%440,
                                                                    scaleX : 1,
                                                                    scaleY : 1,
                                                                    rotation : 0,
                                                                    positionWordX : 0,
                                                                    positionWordY : 0,
                                                                    adaptiveFontSize: 12,
                                                                    isDragging : false,
                                                                    favoriteList : [],
                                                                }),
                                                                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                                    // roomImage: uri,
                                                                    lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                                })
                                                            ])
                                                        }}
                                                    >
                                                    </Popover.Button>)
                                                })
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>  
                        </>
                    )}
                </Popover>

                <Popover className="flex flex-1 justify-center items-center relative">
                    {({open}:any)=>(
                        <>
                            <Popover.Button className="outline-none p-2 hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer">
                                {open ? <img src={'/static/images/whiteboard/good-bad-try(active).png'} className='w-[22px] h-[22px] object-cover' /> :<img src={'/static/images/whiteboard/good-bad-try(inactive).png'} className='w-[22px] h-[22px] object-cover' />}
                            </Popover.Button>
                            <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                            >
                                <Popover.Panel className="flex flex-col justify-start items-center p-4 absolute -top-[180px] -left-[260px] rounded-xl bg-white" style={{boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'}}>
                                    <div className='flex flex-col items-start'>
                                        <div className="flex justify-start items-center w-full relative gap-5">
                                        {
                                            stickyGoodBadTry.map((note,index)=>{
                                                return (
                                                    <Popover.Button key={`noteGoodBadTryPick${note.type}`} className={`w-[135px] h-[100px] ${note.bgColor} drop-shadow-lg rounded-lg hover:scale-110 ease-in duration-200 cursor-pointer`}
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
                                                            let uri = autoGetUrlRoomImage();
                                                            await Promise.all([
                                                                firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                                    rectId:`${idRect}`,
                                                                    model:'rectangular',
                                                                    selectedByUserId:userData.userId,
                                                                    selectedByUsername:userData.userName,
                                                                    message:'',
                                                                    type:note.type,
                                                                    positionX:-640+rects.length*10%640,
                                                                    positionY:-440+rects.length*10%440,
                                                                    scaleX : 1,
                                                                    scaleY : 1,
                                                                    rotation : 0,
                                                                    positionWordX : 50,
                                                                    positionWordY : 50,
                                                                    adaptiveFontSize: 12,
                                                                    imageUrl:'',
                                                                    isDragging : false,
                                                                }),
                                                                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                                    // roomImage: uri,
                                                                    lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                                })
                                                            ]) 
                                                        }}
                                                    >
                                                        <p className="text-h4 font-semibold">{note.type}</p>
                                                    </Popover.Button>
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>  
                        </>
                    )}
                </Popover>

                <Popover className="flex flex-1 justify-center items-center relative">
                    {({open}:any)=>(
                        <>
                        <Popover.Button className="outline-none p-2 hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer">
                            {open ? <img src={'/static/images/whiteboard/shapesActiveIcon.png'} className=' w-5 h-5 object-cover' /> : <img src={'/static/images/whiteboard/shapesIcon.png'} className=' w-5 h-5 object-cover' />}
                        </Popover.Button>
                        <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                        >
                        <Popover.Panel className="flex flex-col justify-start items-center p-4 absolute -top-[180px] -left-[180px] rounded-xl bg-white" style={{boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'}}>
                            <div className="flex flex-wrap justify-start items-center w-[280px] relative gap-5">
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/octagon.png'} alt="" className="w-10 h-10 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
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
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            });
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/pentagon.png'} alt="" className="w-10 h-10 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
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
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            })
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/hexagon.png'} alt="" className="w-10 h-10 hover:scale-110 ease-in duration-200 cursor-pointer" 
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
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            })
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/star.png'} alt="" className="w-10 h-10 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
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
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            })
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/starSeven.png'} alt="" className="w-10 h-10 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
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
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            })
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/starFour.png'} alt="" className="w-10 h-10 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
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
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            })
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/hexagonHorizontal.png'} alt="" className="w-10 hover:scale-110 ease-in duration-200 cursor-pointer" 
                                        draggable
                                        ref={dragRef}
                                        onDragStart={(e:any)=>{
                                            setDragedRectType({
                                                type:'shapeLine',
                                                model:'hexagonHorizontal',
                                            })
                                        }}
                                        onClick={async()=>{
                                            handleSelectShape(selectedId , null);
                                            let idRect = uuid();
                                            await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                rectId:`${idRect}`,
                                                model:'hexagonHorizontal',
                                                selectedByUserId:userData.userId,
                                                selectedByUsername:userData.userName,
                                                message:'',
                                                type:'shapeLine',
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            })
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/rectangularShape.png'} alt="" className="w-10 h-10 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
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
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            })
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/triangle.png'} alt="" className="w-10 h-10 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
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
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            })
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                                <Popover.Button>
                                    <img src={'/static/images/whiteboard/starFourTriple.png'} alt="" className="w-10 h-10 object-cover hover:scale-110 ease-in duration-200 cursor-pointer" 
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
                                                positionX:-640+rects.length*10%640,
                                                positionY:-440+rects.length*10%440,
                                                scaleX : 1,
                                                scaleY : 1,
                                                rotation : 0,
                                                positionWordX : 0,
                                                positionWordY : 0,
                                                adaptiveFontSize: 12,
                                                isDragging : false,
                                            })
                                            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                            })
                                        }}
                                    />
                                </Popover.Button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                        
                        </>
                    )}
                </Popover>

                <Popover className="flex flex-1 justify-center items-center">
                    {({open}:any)=>(
                        <>
                            <Popover.Button className="outline-none p-[6px] hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer">
                                {open ? <img src={'/static/images/whiteboard/stampActiveIcon.png'} className=' w-6 h-6 object-cover ' /> : <img src={'/static/images/whiteboard/stampIncativeIcon.png'} className=' w-6 h-6 object-cover ' />}
                            </Popover.Button>
                            <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                            >
                                <Popover.Panel className="flex flex-col justify-start items-center p-8 absolute -top-[248px] -left-[170px] rounded-xl bg-white" style={{boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'}}>
                                    <div className="flex flex-wrap justify-start items-center w-[223px] relative gap-10">
                                        <Popover.Button>
                                            <img src={'/static/images/whiteboard/likeStamp.png'} alt="" className="w-12 h-12 object-contain hover:scale-150 ease-in duration-200 cursor-pointer" 
                                                draggable
                                                ref={dragRef}
                                                onDragStart={(e:any)=>{
                                                    setDragedRectType({
                                                        type:'stamp',
                                                        model:'like',
                                                    })
                                                }}
                                                onClick={async()=>{
                                                    handleSelectShape(selectedId , null);
                                                    let idRect = uuid();
                                                    await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                        rectId:`${idRect}`,
                                                        model:'like',
                                                        selectedByUserId:userData.userId,
                                                        selectedByUsername:userData.userName,
                                                        message:'',
                                                        type:'stamp',
                                                        positionX:-640+rects.length*10%640,
                                                        positionY:-440+rects.length*10%440,
                                                        scaleX : 1,
                                                        scaleY : 1,
                                                        rotation : 0,
                                                        positionWordX : 0,
                                                        positionWordY : 0,
                                                        adaptiveFontSize: 12,
                                                        isDragging : false,
                                                    })
                                                    firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                        lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                    })
                                                }}
                                            />
                                        </Popover.Button>
                                        <Popover.Button>
                                            <img src={'/static/images/whiteboard/dislikeStamp.png'} alt="" className="w-11 h-11 object-contain hover:scale-150 ease-in duration-200 cursor-pointer" 
                                                draggable
                                                ref={dragRef}
                                                onDragStart={(e:any)=>{
                                                    setDragedRectType({
                                                        type:'stamp',
                                                        model:'dislike',
                                                    })
                                                }}
                                                onClick={async()=>{
                                                    handleSelectShape(selectedId , null);
                                                    let idRect = uuid();
                                                    await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                        rectId:`${idRect}`,
                                                        model:'dislike',
                                                        selectedByUserId:userData.userId,
                                                        selectedByUsername:userData.userName,
                                                        message:'',
                                                        type:'stamp',
                                                        positionX:-640+rects.length*10%640,
                                                        positionY:-440+rects.length*10%440,
                                                        scaleX : 1,
                                                        scaleY : 1,
                                                        rotation : 0,
                                                        positionWordX : 0,
                                                        positionWordY : 0,
                                                        adaptiveFontSize: 12,
                                                        isDragging : false,
                                                    })
                                                    firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                        lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                    })
                                                }}
                                            />
                                        </Popover.Button>
                                        <Popover.Button>
                                            <img src={'/static/images/whiteboard/lovelove.png'} alt="" className="w-11 h-11 object-contain hover:scale-150 ease-in duration-200 cursor-pointer" 
                                                draggable
                                                ref={dragRef}
                                                onDragStart={(e:any)=>{
                                                    setDragedRectType({
                                                        type:'stamp',
                                                        model:'lovelove',
                                                    })
                                                }}
                                                onClick={async()=>{
                                                    handleSelectShape(selectedId , null);
                                                    let idRect = uuid();
                                                    await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                        rectId:`${idRect}`,
                                                        model:'lovelove',
                                                        selectedByUserId:userData.userId,
                                                        selectedByUsername:userData.userName,
                                                        message:'',
                                                        type:'stamp',
                                                        positionX:-640+rects.length*10%640,
                                                        positionY:-440+rects.length*10%440,
                                                        scaleX : 1,
                                                        scaleY : 1,
                                                        rotation : 0,
                                                        positionWordX : 0,
                                                        positionWordY : 0,
                                                        adaptiveFontSize: 12,
                                                        isDragging : false,
                                                    })
                                                    firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                        lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                    })
                                                }}
                                            />
                                        </Popover.Button>
                                        <Popover.Button>
                                            <img src={'/static/images/whiteboard/clapclap.png'} alt="" className="w-11 h-11 object-contain hover:scale-150 ease-in duration-200 cursor-pointer" 
                                                draggable
                                                ref={dragRef}
                                                onDragStart={(e:any)=>{
                                                    setDragedRectType({
                                                        type:'stamp',
                                                        model:'clapclap',
                                                    })
                                                }}
                                                onClick={async()=>{
                                                    handleSelectShape(selectedId , null);
                                                    let idRect = uuid();
                                                    await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                        rectId:`${idRect}`,
                                                        model:'clapclap',
                                                        selectedByUserId:userData.userId,
                                                        selectedByUsername:userData.userName,
                                                        message:'',
                                                        type:'stamp',
                                                        positionX:-640+rects.length*10%640,
                                                        positionY:-440+rects.length*10%440,
                                                        scaleX : 1,
                                                        scaleY : 1,
                                                        rotation : 0,
                                                        positionWordX : 0,
                                                        positionWordY : 0,
                                                        adaptiveFontSize: 12,
                                                        isDragging : false,
                                                    })
                                                    firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                        lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                    })
                                                }}
                                            />
                                        </Popover.Button>
                                        <Popover.Button>
                                            <img src={'/static/images/whiteboard/fighto.png'} alt="" className="w-10 h-10 object-contain hover:scale-150 ease-in duration-200 cursor-pointer" 
                                                draggable
                                                ref={dragRef}
                                                onDragStart={(e:any)=>{
                                                    setDragedRectType({
                                                        type:'stamp',
                                                        model:'fighto',
                                                    })
                                                }}
                                                onClick={async()=>{
                                                    handleSelectShape(selectedId , null);
                                                    let idRect = uuid();
                                                    await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                        rectId:`${idRect}`,
                                                        model:'fighto',
                                                        selectedByUserId:userData.userId,
                                                        selectedByUsername:userData.userName,
                                                        message:'',
                                                        type:'stamp',
                                                        positionX:-640+rects.length*10%640,
                                                        positionY:-440+rects.length*10%440,
                                                        scaleX : 1,
                                                        scaleY : 1,
                                                        rotation : 0,
                                                        positionWordX : 0,
                                                        positionWordY : 0,
                                                        adaptiveFontSize: 12,
                                                        isDragging : false,
                                                    })
                                                    firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                        lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                    })
                                                }}
                                            />
                                        </Popover.Button>
                                        <Popover.Button>
                                            <img src={'/static/images/whiteboard/byebye.png'} alt="" className="w-12 h-12 object-contain hover:scale-150 ease-in duration-200 cursor-pointer" 
                                                draggable
                                                ref={dragRef}
                                                onDragStart={(e:any)=>{
                                                    setDragedRectType({
                                                        type:'stamp',
                                                        model:'byebye',
                                                    })
                                                }}
                                                onClick={async()=>{
                                                    handleSelectShape(selectedId , null);
                                                    let idRect = uuid();
                                                    await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                                                        rectId:`${idRect}`,
                                                        model:'byebye',
                                                        selectedByUserId:userData.userId,
                                                        selectedByUsername:userData.userName,
                                                        message:'',
                                                        type:'stamp',
                                                        positionX:-640+rects.length*10%640,
                                                        positionY:-440+rects.length*10%440,
                                                        scaleX : 1,
                                                        scaleY : 1,
                                                        rotation : 0,
                                                        positionWordX : 0,
                                                        positionWordY : 0,
                                                        adaptiveFontSize: 12,
                                                        isDragging : false,
                                                    })
                                                    firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                                                        lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                                                    })
                                                }}
                                            />
                                        </Popover.Button>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                    
                </Popover>

                <div className="flex flex-1 justify-center items-center relative cursor-pointer pr-3 border-r-2 border-r-secondary-gray-2">
                        <label className="outline-none p-[6px] hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer selection:bg-primary-blue-1" >
                            <img src={'/static/images/whiteboard/ImageIcon.png'} className=' w-6 h-6 object-cover ' />
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
                </div>

                <Popover className="flex flex-1 ml-3 justify-center items-center relative">
                    {({ open }:any) => (     
                        <>
                        <Popover.Button className={`outline-none p-2 hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer`}
                        // onClick={()=>{
                        //     handleSaveImage();
                        // }}
                        >{
                            
                            open? <img src={'/static/images/whiteboard/exportActiveIcon.png'} className=' w-5 h-5 object-cover' /> :
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        }
                            
                            {/* <LogoutIcon className='p-2 hover:bg-[#e2e2e2] rounded-md ease-in duration-200 cursor-pointer text-black-opa80' style={{fontSize:40}}  /> */}
                            </Popover.Button>
                            <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                            >
                            <Popover.Panel className="flex w-[300px] p-5 gap-4 flex-col justify-center items-start absolute -top-[154px] -left-[160px] rounded-xl bg-white" style={{boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px'}}>
                                <Popover.Button>
                                    <CSVLink data={csvData} headers={csvHeader} filename={`issues_${roomData.roomName}.csv`} className="flex items-center gap-[9px] bg-white rounded-xl ease-in duration-200"> 
                                        <img src={'/static/images/whiteboard/csv.png'} className=' w-[26px] h-[26px] object-cover ' />
                                        <p className="font-semibold">{`Export to CSV (Good bad try)`}</p>
                                    </CSVLink>
                                </Popover.Button>
                                <Popover.Button className="w-[180px] flex items-center gap-3 bg-white rounded-xl ease-in duration-200"
                                    onClick={()=>{  
                                        handleSaveImage();
                                    }}
                                >
                                    <img src={'/static/images/whiteboard/ImageIcon.png'} className=' w-6 h-6 object-cover ' />
                                    <p className="font-semibold">Save as image</p>
                                </Popover.Button>
                            </Popover.Panel>
                        </Transition>
                        </>
                    )}
                    
                </Popover>
                </>
                }
                
            </div>
            
        </div>
    );
}

export default Toolbar
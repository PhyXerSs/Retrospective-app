import React, { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Star, Text ,Rect ,Group , Line  } from 'react-konva';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { dragedRectTypeState, DrawState, isDrawSelectedState, isEraserSelectedState, isExpandedSideBarState, isShowTextAreaState, oldSelectedIdState, RectState, RectStateType, selectedIdState, WhiteBoardRoomDataState, whiteBoardUserDataState, whiteBoardUserDataStateType } from '../../WhiteBoardStateManagement/Atom';
import ScrollContainer from 'react-indiana-drag-scroll'
import ModalPostIt from './ModalPostIt';
import { v4 as uuid } from 'uuid';
import firebase from '../../firebase/firebase-config';
// import firebase from '../../firebase/firebaseConfig';
import Resizer from "react-image-file-resizer";
import { useWindowSize } from 'usehooks-ts';
import UserInRoom from './UserInRoom';
import { fontSize } from '@mui/system';
import Toolbar from './Toolbar';
import ShareModal from './ShareModal';
import * as firebaseServer from 'firebase';
import RoomChat from './RoomChat';
import FullChatImage from './FullChatImage';
function StageComponent() {
    const [ rects , setRects ] = useRecoilState(RectState);
    // const [ lines , setLines ] = useRecoilState(DrawState);
    const [lines, setLines] = useState<any[]>([]);
    const [ stageX , setStageX] = useState<number>(0);
    const [ stageY , setStageY] = useState<number>(0);
    const [ stageScale , setStageScale ] = useState<number>(1);
    const [ stageWidth , setStageWidtg ] = useState<number>(1920);
    const [ stageHeight , setStageHeight ] = useState<number>(1080);
    const [ rectX , setRectX ] = useState<number>(-900);
    const [ rectY , setRectY ] = useState<number>(-650);
    const stageRef = useRef<any>(null);
    const layerRef = useRef<any>(null)
    const [selectedId, selectShape] = useRecoilState(selectedIdState);
    const [oldSelectedId , setOldSelectedId ] = useRecoilState(oldSelectedIdState);
    const isExpandedSideBar = useRecoilValue(isExpandedSideBarState);
    const [ dragedRectType,setDragedRectType ] = useRecoilState(dragedRectTypeState);
    const resetDragedRectType = useResetRecoilState(dragedRectTypeState);
    const [ userData , setUserData ] = useRecoilState(whiteBoardUserDataState);
    const [ roomData , setRoomData ] = useRecoilState(WhiteBoardRoomDataState);
    const resetRoomData = useResetRecoilState(WhiteBoardRoomDataState);
    const [ showTextArea , setShowTextArea ] = useRecoilState(isShowTextAreaState);
    const [ isShareClick , setIsShareClick ] = useState<boolean>(false);
    const [ isDrawSelected , setIsDrawSelected ] = useRecoilState(isDrawSelectedState);
    const [ isEraserSelected , setIsEraserSelected ] = useRecoilState(isEraserSelectedState);
    const isDrawing = useRef(false);
    useEffect(()=>{
        focusRect();
    },[]);

    useEffect(()=>{
        let checkYourSelectShap = false;
        rects.forEach((rect)=>{
            if(rect.selectedByUserId === userData.userId){
                selectShape(rect.rectId);
                checkYourSelectShap = true;
            }   
        })
        if(!checkYourSelectShap){
            selectShape(null);
        }
        
    },[rects,userData,roomData])

    useEffect(()=>{
        firebase.database().ref(`retrospective/${roomData.roomId}/shape`).on('value',async(snapshot) =>{
            if(snapshot.val() !== null){
                let allRect = snapshot.val()
                let newRects = [] as RectStateType[];
                for(let id in allRect){
                    if (allRect.hasOwnProperty(id)) {
                        let rectAttr = allRect[id] as RectStateType;
                        let newRect = {} as RectStateType;
                        newRect.rectId=rectAttr.rectId;
                        newRect.model = rectAttr.model;
                        newRect.selectedByUserId=rectAttr.selectedByUserId;
                        newRect.selectedByUsername=rectAttr.selectedByUsername;
                        newRect.selectedByProfilePicture = rectAttr.selectedByProfilePicture;
                        newRect.message=rectAttr.message;
                        newRect.type=rectAttr.type;
                        newRect.positionX=rectAttr.positionX;
                        newRect.positionY=rectAttr.positionY;
                        newRect.scaleX = rectAttr.scaleX;
                        newRect.scaleY = rectAttr.scaleY;
                        newRect.rotation = rectAttr.rotation;
                        newRect.positionWordX = rectAttr.positionWordX;
                        newRect.positionWordY = rectAttr.positionWordY;
                        newRect.adaptiveFontSize = rectAttr.adaptiveFontSize;
                        newRect.imageUrl = rectAttr.imageUrl;
                        newRect.isDragging = rectAttr.isDragging;
                        newRects.push(newRect)
                    }
                }
                const item = newRects.find(rect => rect.selectedByUserId === userData.userId) as RectStateType;
                if(item !== undefined){
                    const index = newRects.indexOf(item);
                    newRects.splice(index, 1);
                    newRects.push(item);
                }
                setRects(newRects);                
            }else{
                firebase.database().ref(`retrospective/${roomData.roomId}`).on('value',snapshot=>{
                    if(snapshot.val()===null){
                        resetRoomData();
                    }
                })
                setRects([]);
            }
        })

        return ()=>{
            firebase.database().ref(`retrospective/${roomData.roomId}/shape`).off();
            firebase.database().ref(`retrospective/${roomData.roomId}`).off();
        }
    },[userData,roomData])

    function autoGetUrlRoomImage(){
        stageRef.current.scaleX(1.25);
        stageRef.current.scaleY(1.25);
        let uri = stageRef.current.toDataURL({x:stageRef.current.attrs.x-960 , y:stageRef.current.attrs.y-540,mimeType:'image/jpeg'});
        stageRef.current.scaleX(stageScale);
        stageRef.current.scaleY(stageScale);
        return uri as string;
    }

    function handleSaveImage(){
        stageRef.current.scaleX(0.6);
        stageRef.current.scaleY(0.6);
        let uri = stageRef.current.toDataURL({x:stageRef.current.attrs.x-960 , y:stageRef.current.attrs.y-540});
        let link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        stageRef.current.scaleX(stageScale);
        stageRef.current.scaleY(stageScale);
    }    
    
    async function handleBackSpace(e:any){
        if(e.key === 'Backspace' && selectedId !== null && !showTextArea){
            await Promise.all([
                firebase.database().ref(`retrospective/${roomData.roomId}/shape/${selectedId}`).remove(),
                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                    lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                })
            ]);
            setRects(
                rects.filter((rect,index)=>rect.rectId !== selectedId)
            );
        }
    }

    function handlePasteEvent(e:any){
        e.preventDefault();
        e.stopPropagation();
        if(e.clipboardData.files.length > 0 && e.clipboardData.files[0].type.startsWith("image/")){
            convertFileToImage(e.clipboardData.files[0] , 0 , 0 , 'paste' );
        }
    }

    useEffect(()=>{
        window.addEventListener('keydown',handleBackSpace );
        window.addEventListener('paste',handlePasteEvent);
        return ()=>{
            window.removeEventListener('keydown',handleBackSpace);
            window.removeEventListener('paste',handlePasteEvent);
        }
    },[selectedId,rects,showTextArea])
    

    function boundFunc(pos:{x:number , y : number}, scale:number) {    
        let x = Math.min(window.innerWidth + stageWidth * ( scale - 0.55), Math.max(pos.x, stageWidth * ( 0.55 - scale)));
        let y = Math.min(window.innerHeight + stageHeight * ( scale - 0.55) , Math.max(pos.y, stageHeight * ( 0.55 - scale)));
        return {
          x,
          y
        };
    };

    function handleWheel(e:any){
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
    
        const mousePointTo = {
          x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
          y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };
    
        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy :oldScale * scaleBy  ;
        if (newScale <= 0.6) {
          return;
        }
    
        let x =
          -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale;
        let y =
          -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale;
        const pos = boundFunc({ x, y }, newScale);
    
        setStageScale(newScale);
        setStageX(pos.x);
        setStageY(pos.y);
    };
    
    function focusRect(){
        let newScale = 0.6;
        const rectWidth = 1800 * newScale;
        const rectHeight = 1200 * newScale;
        const x = -rectX * newScale + stageWidth / 2 - rectWidth / 2;
        const y = -rectY * newScale + stageHeight / 2 - rectHeight / 2;
        let pos = boundFunc({ x, y }, newScale);
        setStageScale(newScale);
        setStageX(pos.x);
        setStageY(pos.y);
    };
    
    const handleDragStart = async(e:any) => {
        const id = e.target.id();
    };
    const handleDragEnd = (e:any) => {
        let uri = autoGetUrlRoomImage();
        const id = e.target.id();
        (async function(){
            await Promise.all([
                firebase.database().ref(`retrospective/${roomData.roomId}/shape/${id}`).once("value",async snapshot => {
                    if(snapshot.exists()){
                        await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${id}`).update({
                            positionX:e.target.x(),
                            positionY:e.target.y(),
                            isDragging: false,
                        })
                    }
                }),
                firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                    roomImage: uri,
                    lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                })

            ])
        }());
        // setRects(
        //     rects.map((rect) => {
          
        //     if(rect.rectId === id){
        //         (async function(){
        //             await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).once("value",async snapshot => {
        //                 if(snapshot.exists()){
        //                     await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).update({
        //                         positionX:e.target.x(),
        //                         positionY:e.target.y(),
        //                         isDragging: false,
        //                     })
        //                 }
        //             })
                    
        //         }());
        //         return {
        //             ...rect,
        //             positionX:e.target.x(),
        //             positionY:e.target.y(),
        //             isDragging: false,
        //         };
        //     }else{
        //         return {
        //             ...rect,
        //             isDragging: false,
        //         };
        //     }
        //   })
        // );
    };
    const handleDragMove = (e:any) =>{
        const id = e.target.id();
        (async function(){
            await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${id}`).update({
                positionX:e.target.x(),
                positionY:e.target.y(),
                isDragging: true,
            })
        }());
        // setRects(
        //     rects.map((rect) => {
            
        //     if(rect.rectId === id){
        //         (async function(){
        //             await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).update({
        //                 positionX:e.target.x(),
        //                 positionY:e.target.y(),
        //                 isDragging: true,
        //             })
        //         }());
        //         return {
        //             ...rect,
        //             positionX:e.target.x(),
        //             positionY:e.target.y(),
        //             isDragging: true,
        //             };
        //     }else{
        //         return {
        //             ...rect,
        //             isDragging: false,
        //         };
        //     }
        //     })
        // );
    }

    const handleTransformChange = (scale_x:number, scale_y:number ,rotation:number,positionBoxX:number,positionBoxY:number, id:string) =>{
        (async function(){
            firebase.database().ref(`retrospective/${roomData.roomId}/shape/${id}`).update({
                positionWordX:positionBoxX,
                positionWordY:positionBoxY,
                scaleX:scale_x,
                scaleY:scale_y,
                rotation:rotation,
            })
            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
            })
        }());
        // setRects(
        //     rects.map((rect) => {
        //         if(rect.rectId === id){
        //             (async function(){
        //                 await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).update({
        //                     positionWordX:positionBoxX,
        //                     positionWordY:positionBoxY,
        //                     scaleX:scale_x,
        //                     scaleY:scale_y,
        //                     rotation:rotation,
        //                 })
        //             }());
        //             return {
        //                 ...rect,
        //                 positionWordX:positionBoxX,
        //                 positionWordY:positionBoxY,
        //                 scaleX:scale_x,
        //                 scaleY:scale_y,
        //                 rotation:rotation,
        //                 };
        //         }else{
        //             return {
        //                 ...rect,
        //             };
        //         }
        //     })
        // );
    }

    const handleTextChange = (message:string , id:string) =>{
        (async function(){
            await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${id}`).update({
                message:message
            })
            firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
            })
        }());
        // setRects(
        //     rects.map((rect) => {
                
        //         if(rect.rectId === id){
        //             (async function(){
        //                 await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).update({
        //                     message:message
        //                 })
        //             }());
        //             return {
        //                 ...rect,
        //                 message:message
        //                 };
        //         }else{
        //             return {
        //                 ...rect,
        //             };
        //         }
        //     })
        // );
    }

    const handleFontSizeChange = ( mode:string , oldValue:number , id:string ) => {
        if(mode === 'increase'){
            (async function(){
                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${id}`).update({
                    adaptiveFontSize:oldValue + 1
                })
            }());
        }else{
            (async function(){
                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${id}`).update({
                    adaptiveFontSize:oldValue - 1
                })
            }());
        }
        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
            lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
        })
        // setRects(
        //     rects.map((rect) => {
        //         if(rect.rectId === selectedId){
        //             if(mode === 'increase'){
        //                 (async function(){
        //                     await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).update({
        //                         adaptiveFontSize:rect.adaptiveFontSize + 1
        //                     })
        //                 }());
        //                 return {
        //                     ...rect,
        //                     adaptiveFontSize:rect.adaptiveFontSize + 1
        //                     };
        //             }else{
        //                 (async function(){
        //                     await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${rect.rectId}`).update({
        //                         adaptiveFontSize:rect.adaptiveFontSize - 1
        //                     })
        //                 }());
        //                 return {
        //                     ...rect,
        //                     adaptiveFontSize:rect.adaptiveFontSize - 1
        //                     };    
        //             }
        //         }else{
        //             return {
        //                 ...rect,
        //             };
        //         }
        //     })
        // );
    }

    const handleSelectShape = async(oldSelect:string|null , newSelect:string|null) => {
        if(oldSelect!==null){
            (async function(){
                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${oldSelect}`).update({
                    selectedByUserId:'-',
                    selectedByUsername:'-',
                    selectedByProfilePicture:'-',
                })
            }());
        }
        if(newSelect !== null){
            (async function(){
                await firebase.database().ref(`retrospective/${roomData.roomId}/shape/${newSelect}`).update({
                    selectedByUserId:userData.userId,
                    selectedByUsername:userData.userName,
                    selectedByProfilePicture:'-',
                })
            }());
        }
    }

    const handleMouseDown = (e:any) => {
        console.log(e);
        
        if(isDrawSelected || isEraserSelected){
            isDrawing.current = true;
        }else{
            isDrawing.current = false;
        }
        let idRect = uuid();
        const pos = e.target.getStage().getPointerPosition();
        if(isDrawSelected){
            // setLines([...lines, {
            //     lineId:`${idRect}`,
            //     color:'rgb(32 118 210 / var(--tw-border-opacity))' , 
            //     type:'pen', 
            //     positionX:pos.x , 
            //     positionY:pos.Y
            // }]);
            setLines([...lines, { tool:'pen', points: [(pos.x - stageRef.current.attrs.x)/stageScale, (pos.y - stageRef.current.attrs.y)/stageScale] }]);
        }
        
    };
    
    const handleMouseMove = (e:any) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        // add point
        // if(lines.length > 0)
        lastLine.points = lastLine.points.concat([(point.x - stageRef.current.attrs.x)/stageScale, (point.y - stageRef.current.attrs.y)/stageScale]);
    
        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
      };

    const checkDeselect = (e:any) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            handleSelectShape(selectedId,null);
        }
      };
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
            if(mode === 'paste'){
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
                    roomImage: uriRoomImage,
                    lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                }),
            ])
          },
          "Blob"
        );
      } catch (err) {
        console.log(err);
      }
    }
    
    return (
        <div id="background-stage" className={`w-full fixed flex justify-center h-full max-h-screen overflow-clip ease-in duration-200`}
            onDrop={async(e:any)=>{     
                e.preventDefault();
                e.stopPropagation();
                stageRef.current.setPointersPositions();
                const stage = stageRef.current.getStage();
                const oldScale = stage.scaleX();
                const mousePointTo = {
                    x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
                    y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
                };
                handleSelectShape(selectedId , null);
                let idRect = uuid();
                let uri = autoGetUrlRoomImage();
                if(dragedRectType.type === 'shapeLine'){
                    await Promise.all([
                        firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                            rectId:idRect,
                            model:dragedRectType.model,
                            selectedByUserId:userData.userId,
                            selectedByUsername:userData.userName,
                            message:'',
                            type:dragedRectType.type,
                            positionX:mousePointTo.x,
                            positionY:mousePointTo.y,
                            scaleX : 1,
                            scaleY : 1,
                            rotation : 0,
                            positionWordX : -50,
                            positionWordY : -50,
                            adaptiveFontSize : 12,
                            imageUrl:'',
                            isDragging : false,
                        }),
                        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                            roomImage: uri,
                            lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                        })
                    ])
                    resetDragedRectType();
                }else if(dragedRectType.type === 'textfield'){
                    await Promise.all([
                        firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                            rectId:idRect,
                            model:dragedRectType.model,
                            selectedByUserId:userData.userId,
                            selectedByUsername:userData.userName,
                            message:'',
                            type:dragedRectType.type,
                            positionX:mousePointTo.x,
                            positionY:mousePointTo.y,
                            scaleX : 1,
                            scaleY : 1,
                            rotation : 0,
                            positionWordX : -50,
                            positionWordY : -50,
                            adaptiveFontSize : 12,
                            imageUrl:'',
                            isDragging : false,
                        }),
                        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                            roomImage: uri,
                            lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                        })
                    ])
                    resetDragedRectType();
                }else if(dragedRectType.type === 'stamp'){
                    await Promise.all([
                        firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                            rectId:idRect,
                            model:dragedRectType.model,
                            selectedByUserId:'-',
                            selectedByUsername:'-',
                            message:'',
                            type:dragedRectType.type,
                            positionX:mousePointTo.x,
                            positionY:mousePointTo.y,
                            scaleX : 1,
                            scaleY : 1,
                            rotation : 0,
                            positionWordX : -50,
                            positionWordY : -50,
                            adaptiveFontSize : 12,
                            imageUrl:'',
                            isDragging : false,
                        }),
                        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                            roomImage: uri,
                            lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                        })
                    ])
                    resetDragedRectType();
                }
                else if(e.dataTransfer.files && e.dataTransfer.files.length > 0 && e.dataTransfer.files[0].type.startsWith("image/")){
                    convertFileToImage(e.dataTransfer.files[0] , mousePointTo.x ,mousePointTo.y , 'drop');
                    resetDragedRectType();
                }else{
                    await Promise.all([
                        firebase.database().ref(`retrospective/${roomData.roomId}/shape/${idRect}`).set({
                            rectId:idRect,
                            model:dragedRectType.model,
                            selectedByUserId:userData.userId,
                            selectedByUsername:userData.userName,
                            message:'',
                            type:dragedRectType.type,
                            positionX:mousePointTo.x,
                            positionY:mousePointTo.y,
                            scaleX : 1,
                            scaleY : 1,
                            rotation : 0,
                            positionWordX : -50,
                            positionWordY : -50,
                            adaptiveFontSize : 12,
                            imageUrl:'',
                            isDragging : false,
                        }),
                        firebase.database().ref(`retrospective/${roomData.roomId}/roomDetail/`).update({
                            roomImage: uri,
                            lastModified:firebaseServer.database.ServerValue.TIMESTAMP,
                        })
                    ]);
                    resetDragedRectType();
                }
                
            }}
            onDragOver={(e)=>{
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <UserInRoom autoGetUrlRoomImage={autoGetUrlRoomImage} setIsShareClick={setIsShareClick}/>
            <ShareModal isShareClick={isShareClick} setIsShareClick={setIsShareClick}/>
            
            <Stage className={`bg-[#f2f2f2] w-[${stageWidth}px] h-[${stageHeight}px] overflow-clip`}
                ref={stageRef}
                x={stageX}
                y={stageY}
                scaleX={stageScale}
                scaleY={stageScale}
                width={stageWidth}
                height={stageHeight}
                onWheel={handleWheel}
                draggable={!isDrawSelected && !isEraserSelected}
                dragBoundFunc={(pos:{x:number , y : number})=>boundFunc(pos , stageScale)}
                onMouseDown={(e:any)=>{checkDeselect(e);handleMouseDown(e)}}
                onMouseMove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={checkDeselect}
            > 
                <Layer>
                    <Rect
                        width={1800}
                        height={1200}
                        fill={'#ffffff'}
                        x={rectX}
                        y={rectY}
                        draggable={false}
                        onClick={()=>{
                            handleSelectShape(selectedId , null);
                        }}
                        cornerRadius={8}
                    />
                    {
                        rects.length !== 0 && rects.map((rect , i)=>(
                                <ModalPostIt
                                    key={rect.rectId}
                                    rect={rect}
                                    userData={userData}
                                    isSelected={rect.selectedByUserId === userData.userId}
                                    onChange={(newAttrs:any) => {
                                        const allRects = rects.slice();
                                        allRects[i] = newAttrs;
                                        setRects(allRects);
                                    }}
                                    onSelect={() => {
                                        if(rect.selectedByUserId === '-'){
                                            handleSelectShape(selectedId,rect.rectId);
                                        }
                                    }}
                                    handleDragStart={handleDragStart}
                                    handleDragMove={handleDragMove}
                                    handleDragEnd={handleDragEnd}
                                    handleTransformChange={handleTransformChange}
                                    handleTextChange={handleTextChange}
                                    handleFontSizeChange={handleFontSizeChange}
                                    stroke={rect.selectedByUserId === userData.userId || rect.selectedByUserId === '-' ? '' : '#ff355f'}
                                    isYourSelect = {rect.selectedByUserId === userData.userId}
                                    showTextArea = {showTextArea}
                                    setShowTextArea={setShowTextArea}
                                    
                                />
                        ))
                    }
                    {lines.map((line, i) => (
                        <Line
                            key={`lines${i}`}
                            points={line.points}
                            stroke="#df4b26"
                            strokeWidth={5}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === 'eraser' ? 'destination-out' : 'source-over'
                            }
                        />
                    ))}
                </Layer>
            </Stage>
            <Toolbar handleSaveImage={handleSaveImage} autoGetUrlRoomImage={autoGetUrlRoomImage}/>
            
         </div>
    )
}

export default StageComponent
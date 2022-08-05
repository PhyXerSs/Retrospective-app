import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Rect, Transformer ,Text, Group , Circle , Image , RegularPolygon , Star } from 'react-konva';
import Konva from "konva";
import { RecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { isShowTextAreaState, RectState, RectStateType, whiteBoardUserDataStateType } from '../../WhiteBoardStateManagement/Atom';
import { Html } from "react-konva-utils";
import { AnyRecord } from 'dns';
import { positions } from '@mui/system';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import firebase from '../../firebase/firebase-config';
import useImage from 'use-image';
import RectangularPostIt from './WhiteboardToolComponent/RectangularPostIt';
import CircularPostIt from './WhiteboardToolComponent/CircularPostIt';
import ImageObject from './WhiteboardToolComponent/ImageObject';
import Octagon from './WhiteboardToolComponent/Octagon';
import Pentagon from './WhiteboardToolComponent/Pentagon';
import Hexagon from './WhiteboardToolComponent/Hexagon';
import StarFive from './WhiteboardToolComponent/StarFive';
import StarSeven from './WhiteboardToolComponent/StarSeven';
import StarFour from './WhiteboardToolComponent/StarFour';
import RectangularShape from './WhiteboardToolComponent/RectangularShape';
import TriangleShape from './WhiteboardToolComponent/TriangleShape';
import StarFourTriple from './WhiteboardToolComponent/StarFourTriple';
import HexagonHorizontal from './WhiteboardToolComponent/HexagonHorizontal';
import TextField from './WhiteboardToolComponent/TextField';
import Heart from './WhiteboardToolComponent/StampObject/Heart';
import Like from './WhiteboardToolComponent/StampObject/Like';
import Dislike from './WhiteboardToolComponent/StampObject/Dislike';
import Clap from './WhiteboardToolComponent/StampObject/Clap';
import TwoFinger from './WhiteboardToolComponent/StampObject/TwoFinger';
import Bye from './WhiteboardToolComponent/StampObject/Bye';
function ModalPostIt({ rect, userData, isSelected, onSelect, onChange , handleDragStart , handleDragEnd , handleDragMove , handleTransformChange , handleTextChange , stroke , isYourSelect , showTextArea , setShowTextArea , handleFontSizeChange}:{rect:RectStateType , userData:whiteBoardUserDataStateType , isSelected:boolean , onSelect:any , onChange:any , handleDragStart:any , handleDragEnd:any , handleDragMove :any , handleTransformChange:any , handleTextChange:any , stroke:string , isYourSelect:boolean , showTextArea:boolean , setShowTextArea:any , handleFontSizeChange:any}) {
    const rectRef = useRef<any>(null);
    const circleRef = useRef<any>(null);
    const imageRef = useRef<any>(null);
    const regularRef = useRef<any>(null);
    const trRef = useRef<any>(null);
    const groupRef = useRef<any>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [image] = useImage(rect.imageUrl);
    const [userImage] = useImage(rect.selectedByProfilePicture);
    const [ hexagonHorizontal ] = useImage('/static/images/whiteboard/hexagonHorizontal.png');
    const [ starFourTripleImage ] = useImage('/static/images/whiteboard/starFourTriple.png');
    const clapRef = useRef<any>(null);
    const fightoRef = useRef<any>(null);
    const byebyeRef = useRef<any>(null);
    const loveloveRef = useRef<any>(null);
    const dislikeRef = useRef<any>(null);
    const likeImageRef = useRef<any>(null);
    const [ likeImage ] = useImage(`/static/images/whiteboard/likeStamp.png`);
    const [ dislike ] = useImage(`/static/images/whiteboard/dislikeStamp.png`);
    const [ lovelove ] = useImage(`/static/images/whiteboard/lovelove.png`);
    const [ clapclap ] = useImage(`/static/images/whiteboard/clapclap.png`);
    const [ fighto ] = useImage(`/static/images/whiteboard/fighto.png`);
    const [ byebye ] = useImage(`/static/images/whiteboard/byebye.png`);
    useEffect(() => {
        if (isSelected) {
          if(textAreaRef.current){
            textAreaRef.current.value = rect.message;
          }
          if(trRef.current){
            if(rectRef.current)
              trRef.current.nodes([rectRef.current]);
            if(circleRef.current)
              trRef.current.nodes([circleRef.current]);
            if(imageRef.current){
              trRef.current.nodes([imageRef.current]);      
            }
            if(regularRef.current){
              trRef.current.nodes([regularRef.current]);
            }
            if(clapRef.current){
              trRef.current.nodes([clapRef.current]);
            }
            if(fightoRef.current){
              trRef.current.nodes([fightoRef.current]);
            }
            if(byebyeRef.current){
              trRef.current.nodes([byebyeRef.current]);
            }
            if(loveloveRef.current){
              trRef.current.nodes([loveloveRef.current]);
            }
            if(dislikeRef.current){
              trRef.current.nodes([dislikeRef.current]);
            }
            if(likeImageRef.current){
              trRef.current.nodes([likeImageRef.current]);
            }
            trRef.current.getLayer().batchDraw();
          }      
        }
        else{
          setShowTextArea(false);
        }
    }, [isSelected ,textAreaRef.current]);

    function convertTypeToColorRect(type:string){
      if(type === 'red'){
        return '#FDAEB0'
      }else if(type === 'orange'){
        return '#f88b4b'
      }else if(type === 'yellow'){
        return '#FFD966'
      }else if(type === 'pink'){
        return '#FFC2D4'
      }else if(type === 'purple'){
        return '#D5B4F1'
      }else if(type === 'blue'){
        return '#A6D5E9'
      }else if(type === 'grayBlue'){
        return '#C0CED9'
      }else if(type === 'greenYellow'){
        return '#C8DFB7'
      }else if(type === 'green'){
        return '#8ED2BE'
      }else if(type === 'Good'){
        return '#C8DFB7'
      }else if(type === 'Bad'){
        return '#FDAEB0'
      }else if(type === 'Try'){
        return '#FFD966'
      }
    }


    function getOffsetXProfileImage(imageWidth:number , imageHeight:number){
        if(imageWidth > imageHeight){
          return imageWidth * -42/100
        }else{
          return  -imageWidth / 2 + 55 ;
        }
    }

    function getOffsetYProfileImage(imageWidth:number , imageHeight:number){
      if(imageHeight > imageWidth){
        return imageHeight * -40/100
      }else{
        return  -imageHeight -16.4 ;
      }
    }

    function getLeftOffsetImage():string{
      if(imageRef.current && imageRef.current.attrs && imageRef.current.attrs.image && imageRef.current.attrs.image.width){
        // console.log(imageRef.current.attrs?.image?.width);
        // let offsetWidthLeft = imageRef.current.attrs?.image?.width - 300 as number;
        if( imageRef.current.attrs?.image?.width !== NaN ){
          let offsetWidthLeft = imageRef.current.attrs?.image?.width * 55 / 100 as number;
          return `${offsetWidthLeft}px` as string
        }
      }
      return ''
    }

    function getTopOffsetImage():string{
      if(imageRef.current && imageRef.current.attrs && imageRef.current.attrs.image && imageRef.current.attrs.image.height ){
        // console.log(imageRef.current.attrs.image.height);
        if(imageRef.current.attrs?.image?.height !== NaN){
          let offsetHeightTop = imageRef.current.attrs?.image?.height + 15 as number;
          return `${offsetHeightTop}px` as string;
        }
      }
      return '' ;
    }

  function getFontSizeSelectPlate():string{
    if(imageRef.current){
      // console.log(imageRef.current.attrs.image.height);
      if(imageRef.current.attrs?.image?.height < imageRef.current.attrs?.image?.width){
        return `${imageRef.current.attrs?.image?.height * 12 / 100}px` as string;
      }else{
        return `${imageRef.current.attrs?.image?.width * 12 / 100}px` as string
      }
      // return `${offsetHeightTop}px` as string;
    }
    return '';
  }
  
  function scaleAchor(){
    if(rect.type === 'shapeLine'){
      return ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']
    }else{
      return ["top-left", "top-right","bottom-left","bottom-right"];
    }
  }

  useEffect(()=>{
    let period = 50;

    let anim = new Konva.Animation((frame:any) => {
      const centerX = 0;
      const centerY = 0;
      const radius = 50;
      let angularSpeed = 90;
      let angleDiff = (frame.timeDiff * angularSpeed) / 1000;
      // stampRef.current?.rotate(angleDiff);
      // stampRef.current?.scaleY(1+ Math.cos(frame.time / 100));
      // stampRef.current?.scaleX(1+ Math.cos(frame.time / 100));
      // stampRef.current?.scaleY(1+ Math.cos(frame.time / 100));
      // stampRef.current?.x(centerX + radius * Math.cos(frame.time / 1000));
      // stampRef.current?.y(centerY + radius * Math.sin(frame.time / 1000));
      clapRef.current?.rotate((Math.cos(frame.time / period)) / 2);
    }, clapRef.current?.getLayer());
    anim.start();
    setTimeout(()=>anim.stop(),1890);
  },[clapclap])

  useEffect(()=>{
    let period = 100;
    let anim = new Konva.Animation((frame:any) => {
      fightoRef.current?.rotate((Math.cos(frame.time / period)) / 4);
    }, fightoRef.current?.getLayer());
    anim.start();
    setTimeout(()=>anim.stop(),1860);
  },[fighto])

  useEffect(()=>{
    let period = 100;
    let anim = new Konva.Animation((frame:any) => {
      byebyeRef.current?.rotate((Math.cos(frame.time / period)) / 1);
    }, byebyeRef.current?.getLayer());
    anim.start();
    setTimeout(()=>anim.stop(),2191);
  },[byebye])

  useEffect(()=>{
    let period = 50;
    let anim = new Konva.Animation((frame:any) => {
      loveloveRef.current?.rotate((Math.cos(frame.time / period)) / 2);
    }, loveloveRef.current?.getLayer());
    anim.start();
    setTimeout(()=>anim.stop(),1890);
  },[lovelove])

  useEffect(()=>{
    let period = 80;
    let anim = new Konva.Animation((frame:any) => {
      dislikeRef.current?.rotate((Math.cos(frame.time / period)) / 2);
    }, dislikeRef.current?.getLayer());
    anim.start();
    setTimeout(()=>anim.stop(),2020);
  },[dislike])

  useEffect(()=>{
    let period = 80;
    let anim = new Konva.Animation((frame:any) => {
      likeImageRef.current?.rotate((Math.cos(frame.time / period)) / 2);
    }, likeImageRef.current?.getLayer());
    anim.start();
    setTimeout(()=>anim.stop(),2005);
  },[likeImage])
    function renderShapeModel(model:string){
      if(model === 'rectangular'){
        return (
          RectangularPostIt(rectRef, convertTypeToColorRect, rect, stroke, handleTransformChange, isSelected, showTextArea, textAreaRef, handleTextChange, setShowTextArea, isYourSelect, handleFontSizeChange)
        );
      }
      else if(model === 'circle'){
        return(
          CircularPostIt(circleRef, convertTypeToColorRect, rect, stroke, handleTransformChange, isSelected, showTextArea, textAreaRef, handleTextChange, setShowTextArea, isYourSelect, handleFontSizeChange)
        );
      }
      else if(model === 'image'){
        return (
          ImageObject(rect, imageRef, image, stroke, handleTransformChange, isYourSelect, getTopOffsetImage, getLeftOffsetImage, getFontSizeSelectPlate)
        );
      }
      else if(model === 'octagon'){
        return(
          Octagon(regularRef, stroke, rect, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'pentagon'){
        return(
          Pentagon(regularRef, stroke, rect, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'hexagon'){
        return(
          Hexagon(regularRef, stroke, rect, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'star'){
        return(
          StarFive(regularRef, stroke, rect, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'starSeven'){
        return(
          StarSeven(regularRef, stroke, rect, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'starFour'){
        return(
          StarFour(regularRef, stroke, rect, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'rectangularShape'){
        return(
          RectangularShape(rectRef, stroke, rect, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'triangle'){
        return(
          TriangleShape(regularRef, stroke, rect, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'starFourTriple'){
        return(
          StarFourTriple(rect, imageRef, starFourTripleImage, stroke, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'hexagonHorizontal'){
        return(
          HexagonHorizontal(rect, imageRef, hexagonHorizontal, stroke, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'textfield'){
        return(
          TextField(rectRef, stroke, rect, handleTransformChange, isSelected, showTextArea, textAreaRef, handleTextChange, setShowTextArea, isYourSelect, handleFontSizeChange)
        );
      }
      else if(model === 'like'){
        return(
          Like(rect, likeImageRef, likeImage, stroke, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'dislike'){
        return(
          Dislike(rect, dislikeRef, dislike, stroke, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'lovelove'){
        return(
          Heart(rect, loveloveRef, lovelove, stroke, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'clapclap'){
        return(
          Clap(rect, clapRef, clapclap, stroke, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'fighto'){
        return(
          TwoFinger(rect, fightoRef, fighto, stroke, handleTransformChange, isYourSelect)
        );
      }
      else if(model === 'byebye'){
        return(
          Bye(rect, byebyeRef, byebye, stroke, handleTransformChange, isYourSelect)
        );
      }
    }
    
    return (
      
        <Group
            width={100}
            height={100}
            key={rect.rectId}
            id={rect.rectId}
            x={rect.positionX}
            y={rect.positionY}
            draggable={isSelected}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
            onClick={onSelect}
            onTap={onSelect}
        >
          {renderShapeModel(rect.model)}
          {isSelected && (
              <Transformer
                ref={trRef}
                enabledAnchors={scaleAchor()}
                rotateAnchorOffset={25}
                anchorStrokeWidth={1}
                anchorStroke={'#c5c5c5'}
                borderStrokeWidth={2}
                borderStroke={'#1363df'}
                boundBoxFunc={(oldBox, newBox) => {
                  // limit resize
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
          )}
        
        </Group>
        
    )
}

export default ModalPostIt

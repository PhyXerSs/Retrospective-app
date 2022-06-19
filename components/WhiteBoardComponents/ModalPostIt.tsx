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
      
      // if(rect.type === 'pros'){
      //   return '#ffc4e6'
      // }else if(rect.type === 'cons'){
      //   return '#9cebfd'
      // }else{
      //   return '#f9fe89'
      // }

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
          <>
            <Rect
              ref={rectRef}
              width={100}
              height={100}
              fill={convertTypeToColorRect(rect.type)}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              rotation={rect.rotation}
              x={rect.positionWordX}
              y={rect.positionWordY}
              shadowOpacity={0.3}
              shadowBlur={2}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = rectRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = rectRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}

            />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1} }}>
                <div className={`flex justify-center items-center ${isSelected && showTextArea ? 'w-[100px]' : 'w-0'} h-[100px] p-[5]`}>
                  <textarea
                    ref={textAreaRef}
                    onChange={(e:any)=>{
                      if(textAreaRef.current){
                        handleTextChange(textAreaRef.current.value , rect.rectId)
                      }
                    }}
                    style={{
                      resize:'none',
                      background: 'none',
                      outline: "none",
                      width: isSelected && showTextArea ? 90 : 0,
                      height: 90,
                      fontSize:rect.adaptiveFontSize,
                    }}
                  />
                </div>
              </Html>
              <Text
                text={rect.message}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                width={isSelected && showTextArea ? 0 : 100}
                height={100}
                align="center"
                verticalAlign="middle"
                fontSize={rect.adaptiveFontSize}
                perfectDrawEnabled={false}
                onDblClick={()=>{
                  setShowTextArea(true)
                }}
                padding={5}
              />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <div className="flex justify-center gap-1 absolute top-[105px] left-[50px]">
                  {/* <img className="w-5 rounded-full"  src={rect.selectedByProfilePicture} alt=""/> */}
                  <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'}  px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                    {rect.selectedByUsername}
                  </p>
                </div>
              </Html>
              {isSelected &&
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation , width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <div className="absolute -top-[45px] left-[65px] p-1 flex items-center gap-1 bg-[#fafafa] rounded-lg drop-shadow-md">
                    <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
                      onClick={async()=>{
                        handleFontSizeChange('decrease' , rect.adaptiveFontSize , rect.rectId);
                      }}
                    >
                      <TextDecreaseIcon style={{fontSize:'12px'}} />
                    </div>
                    <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
                      onClick={async()=>{
                        handleFontSizeChange('increase', rect.adaptiveFontSize, rect.rectId);
                      }}
                    >
                      <TextIncreaseIcon style={{fontSize:'16px'}} />
                    </div>
                </div>
              </Html>}
          </>
        );
      }
      else if(model === 'circle'){
        return(
          <>
              <Circle
                ref={circleRef}
                radius={60}
                fill={convertTypeToColorRect(rect.type)}
                strokeWidth={1}
                stroke={stroke}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                offsetX={-50}
                offsetY={-50}
                shadowOpacity={0.2}
                shadowBlur={3}
                perfectDrawEnabled={false}
                onTransform={(e:any)=>{
                  const node = circleRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
                onTransformEnd={(e:any) => {    
                  const node = circleRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}

              />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1} }}>
                <div className={`flex justify-center items-center ${isSelected && showTextArea ? 'w-[100px]' : 'w-0'} h-[100px] p-[5]`}>
                  <textarea
                    ref={textAreaRef}
                    onChange={(e:any)=>{
                      if(textAreaRef.current){
                        handleTextChange(textAreaRef.current.value , rect.rectId)
                      }
                    }}
                    style={{
                      resize:'none',
                      background: 'none',
                      outline: "none",
                      width: isSelected && showTextArea ? 90 : 0,
                      height: 90,
                      fontSize:rect.adaptiveFontSize,
                    }}
                  />
                </div>
              </Html>
              <Text
                text={rect.message}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                width={isSelected && showTextArea ? 0 : 100}
                height={100}
                align="center"
                verticalAlign="middle"
                fontSize={rect.adaptiveFontSize}
                perfectDrawEnabled={false}
                onDblClick={()=>{
                  setShowTextArea(true)
                }}
                padding={5}
              />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <div className="flex justify-center gap-1 absolute top-[115px] left-[50px]">
                    {/* <img className="w-5 rounded-full"  src={rect.selectedByProfilePicture} alt=""/> */}
                  <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                    {rect.selectedByUsername}
                  </p>
                </div>
              </Html>
              {isSelected &&
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , rotation:rect.rotation , scaleX:rect.scaleX , scaleY:rect.scaleY , width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <div className="absolute -top-[60px] left-[65px] p-1 flex items-center gap-1 bg-[#fafafa] rounded-lg drop-shadow-md">
                    <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
                      onClick={async()=>{
                        handleFontSizeChange('decrease' , rect.adaptiveFontSize , rect.rectId);
                      }}
                    >
                      <TextDecreaseIcon style={{fontSize:'12px'}} />
                    </div>
                    <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
                      onClick={()=>{
                        handleFontSizeChange('increase', rect.adaptiveFontSize , rect.rectId);
                      }}
                    >
                      <TextIncreaseIcon style={{fontSize:'16px'}} />
                    </div>
                </div>
              </Html>
              }
            </>
        );
      }
      else if(model === 'image'){
        return (
          <>
            <Image
              key={rect.rectId}
              id={rect.rectId}
              ref={imageRef}
              image={image}
              strokeWidth={3}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              width={image?.width}
              height={image?.height}
              rotation={rect.rotation}
              x={rect.positionWordX}
              y={rect.positionWordY}
              shadowOpacity={0.2}
              shadowBlur={6}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = imageRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = imageRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
  
            />
            {/* <Image
              x={rect.positionWordX }
              y={rect.positionWordY}
              image={userImage}
              width={50}
              height={50}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              rotation={rect.rotation}
              offsetX={image?.width === undefined ? 0 : getOffsetXProfileImage(image.width ,image.height)}
              offsetY={image?.height === undefined ? 0 : getOffsetYProfileImage(image.width ,image.height)}
            /> */}
            
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY, scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
              <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white drop-shadow-md whitespace-nowrap items-center`}
                  style={{top:getTopOffsetImage() , left:getLeftOffsetImage() , fontSize:getFontSizeSelectPlate() , paddingLeft:getFontSizeSelectPlate() , paddingRight:getFontSizeSelectPlate()}}
                >
                  {rect.selectedByUsername}
                </p>
              </Html>
          </>
        );
      }
      else if(model === 'octagon'){
        return(
          <>
            <RegularPolygon
                ref={regularRef}
                sides={8}
                radius={50}
                fill={'transparent'}
                strokeWidth={1}
                stroke={stroke === '#ff355f' ? '#ff355f' : 'black'}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                offsetX={-50}
                offsetY={-50}
                shadowOpacity={0.2}
                shadowBlur={3}
                perfectDrawEnabled={false}
                onTransform={(e:any)=>{
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
                onTransformEnd={(e:any) => {    
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
            />
            <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[110px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
            </Html>
          </>
        );
      }
      else if(model === 'pentagon'){
        return(
          <>
            <RegularPolygon
                ref={regularRef}
                sides={5}
                radius={50}
                fill={'transparent'}
                strokeWidth={1}
                stroke={stroke === '#ff355f' ? '#ff355f' : 'black'}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                offsetX={-50}
                offsetY={-50}
                shadowOpacity={0.2}
                shadowBlur={3}
                perfectDrawEnabled={false}
                onTransform={(e:any)=>{
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
                onTransformEnd={(e:any) => {    
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
            />
            <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[100px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
            </Html>
          </>
        );
      }
      else if(model === 'hexagon'){
        return(
          <>
            <RegularPolygon
                ref={regularRef}
                sides={6}
                radius={50}
                fill={'transparent'}
                strokeWidth={1}
                stroke={stroke === '#ff355f' ? '#ff355f' : 'black'}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                offsetX={-50}
                offsetY={-50}
                shadowOpacity={0.2}
                shadowBlur={3}
                perfectDrawEnabled={false}
                onTransform={(e:any)=>{
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
                onTransformEnd={(e:any) => {    
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
            />
            <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[110px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
            </Html>
          </>
        );
      }
      else if(model === 'star'){
        return(
          <>
            <Star
                ref={regularRef}
                width={100}
                height={100}
                numPoints={5}
                innerRadius={30}		
                outerRadius={70}
                fill={'transparent'}
                strokeWidth={1}
                stroke={stroke === '#ff355f' ? '#ff355f' : 'black'}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                offsetX={-50}
                offsetY={-50}
                shadowOpacity={0.2}
                shadowBlur={3}
                perfectDrawEnabled={false}
                onTransform={(e:any)=>{
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
                onTransformEnd={(e:any) => {    
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
            />
            <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[130px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
            </Html>
          </>
        );
      }
      else if(model === 'starSeven'){
        return(
          <>
            <Star
                ref={regularRef}
                width={100}
                height={100}
                numPoints={7}
                innerRadius={37}		
                outerRadius={60}
                fill={'transparent'}
                strokeWidth={1}
                stroke={stroke === '#ff355f' ? '#ff355f' : 'black'}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                offsetX={-50}
                offsetY={-50}
                shadowOpacity={0.2}
                shadowBlur={3}
                perfectDrawEnabled={false}
                onTransform={(e:any)=>{
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
                onTransformEnd={(e:any) => {    
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
            />
            <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[120px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
            </Html>
          </>
        );
      }
      else if(model === 'starFour'){
        return(
          <>
            <Star
                ref={regularRef}
                width={100}
                height={100}
                numPoints={4}
                innerRadius={18}		
                outerRadius={60}
                fill={'transparent'}
                strokeWidth={1}
                stroke={stroke === '#ff355f' ? '#ff355f' : 'black'}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                offsetX={-50}
                offsetY={-50}
                shadowOpacity={0.2}
                shadowBlur={3}
                perfectDrawEnabled={false}
                onTransform={(e:any)=>{
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
                onTransformEnd={(e:any) => {    
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
            />
            <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[120px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
            </Html>
          </>
        );
      }
      else if(model === 'rectangularShape'){
        return(
          <>
            <Rect
              ref={rectRef}
              width={100}
              height={100}
              fill={'transparent'}
              strokeWidth={1}
              stroke={stroke === '#ff355f' ? '#ff355f' : 'black'}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              rotation={rect.rotation}
              x={rect.positionWordX}
              y={rect.positionWordY}
              shadowOpacity={0.2}
              shadowBlur={3}
              cornerRadius={15}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = rectRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = rectRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
            />
            <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[110px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
            </Html>
          </>
        );
      }
      else if(model === 'triangle'){
        return(
          <>
            <RegularPolygon
                ref={regularRef}
                sides={3}
                radius={50}
                fill={'transparent'}
                strokeWidth={1}
                stroke={stroke === '#ff355f' ? '#ff355f' : 'black'}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                offsetX={-50}
                offsetY={-50}
                shadowOpacity={0.2}
                shadowBlur={3}
                perfectDrawEnabled={false}
                onTransform={(e:any)=>{
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
                onTransformEnd={(e:any) => {    
                  const node = regularRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
                  const rotation = node.rotation();
                  let positionBoxX = node.x();
                  let positionBoxY = node.y();
                  handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
                }}
            />
            <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[85px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
            </Html>
          </>
        );
      }
      else if(model === 'starFourTriple'){
        return(
          <>
            <Image
              key={rect.rectId}
              id={rect.rectId}
              ref={imageRef}
              image={starFourTripleImage}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              width={100}
              height={100}
              rotation={rect.rotation}
              x={rect.positionWordX}
              y={rect.positionWordY}
              shadowOpacity={0.2}
              shadowBlur={6}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = imageRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = imageRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
  
            />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY, scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[105px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
              </Html>
          </>
        );
      }
      else if(model === 'hexagonHorizontal'){
        return(
          <>
            <Image
              key={rect.rectId}
              id={rect.rectId}
              ref={imageRef}
              image={hexagonHorizontal}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              width={100}
              height={100}
              rotation={rect.rotation}
              x={rect.positionWordX}
              y={rect.positionWordY}
              shadowOpacity={0.2}
              shadowBlur={6}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = imageRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = imageRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
  
            />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY, scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[105px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
              </Html>
          </>
        );
      }
      else if(model === 'textfield'){
        return(
          <>
            <Rect
              ref={rectRef}
              width={200}
              height={60}
              fill={'transparent'}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              rotation={rect.rotation}
              x={rect.positionWordX}
              y={rect.positionWordY}
              shadowOpacity={0.2}
              shadowBlur={3}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = rectRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = rectRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}

            />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:200 , height:60}} divProps={{ style: { opacity:1} }}>
                <div className={`flex justify-center items-center ${isSelected && showTextArea ? 'w-[200px]' : 'w-0'} h-[60px]`}>
                  <textarea
                    ref={textAreaRef}
                    onChange={(e:any)=>{
                      if(textAreaRef.current){
                        handleTextChange(textAreaRef.current.value , rect.rectId)
                      }
                    }}
                    style={{
                      resize:'none',
                      background: 'none',
                      outline: "none",
                      width: isSelected && showTextArea ? 200 : 0,
                      height: 60,
                      fontSize:5+rect.adaptiveFontSize,
                      lineHeight:'17px'
                    }}
                  />
                </div>
              </Html>
              <Text
                text={rect.message === '' ? 'This is a textbox...' : rect.message}
                scaleX={rect.scaleX}
                scaleY={rect.scaleY}
                rotation={rect.rotation}
                x={rect.positionWordX}
                y={rect.positionWordY}
                width={isSelected && showTextArea ? 0 : 200}
                height={60}
                fontSize={5+rect.adaptiveFontSize}
                perfectDrawEnabled={false}
                onDblClick={()=>{
                  setShowTextArea(true)
                }}
                padding={2}
              />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:200 , height:60}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[65px] left-[140px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
              </Html>
              {isSelected &&
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY , scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation , width:200 , height:60}} divProps={{ style: { opacity:1 } }}>
                <div className="absolute -top-[45px] left-[132px] p-1 flex items-center gap-1 bg-[#fafafa] rounded-lg drop-shadow-md">
                    <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
                      onClick={async()=>{
                        handleFontSizeChange('decrease' , rect.adaptiveFontSize , rect.rectId);
                      }}
                    >
                      <TextDecreaseIcon style={{fontSize:'12px'}} />
                    </div>
                    <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
                      onClick={async()=>{
                        handleFontSizeChange('increase' , rect.adaptiveFontSize , rect.rectId);
                      }}
                    >
                      <TextIncreaseIcon style={{fontSize:'16px'}} />
                    </div>
                </div>
              </Html>}
          </>
        );
      }
      else if(model === 'like'){
        return(
          <>
            <Image
              key={rect.rectId}
              id={rect.rectId}
              ref={likeImageRef}
              image={likeImage}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              width={120}
              height={120}
              rotation={rect.rotation}
              x={rect.positionWordX}
              y={rect.positionWordY+50}
              offsetY={50}
              shadowOpacity={0.2}
              shadowBlur={6}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = likeImageRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y()-50;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = likeImageRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y()-50;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
  
            />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY+50, scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[75px] left-[60px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
              </Html>
          </>
        );
      }
      else if(model === 'dislike'){
        return(
          <>
            <Image
              key={rect.rectId}
              id={rect.rectId}
              ref={dislikeRef}
              image={dislike}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              width={100}
              height={100}
              rotation={rect.rotation}
              x={rect.positionWordX}
              y={rect.positionWordY}
              shadowOpacity={0.2}
              shadowBlur={6}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = dislikeRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = dislikeRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x();
                let positionBoxY = node.y();
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
  
            />
              <Html groupProps={{ x:rect.positionWordX , y:rect.positionWordY, scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[105px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
              </Html>
          </>
        );
      }
      else if(model === 'lovelove'){
        return(
          <>
            <Image
              key={rect.rectId}
              id={rect.rectId}
              ref={loveloveRef}
              image={lovelove}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              width={125}
              height={100}
              rotation={rect.rotation}
              x={rect.positionWordX+50}
              y={rect.positionWordY+50}
              offsetX={50}
              offsetY={50}
              shadowOpacity={0.2}
              shadowBlur={6}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = loveloveRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x()-50;
                let positionBoxY = node.y()-50;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = loveloveRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x()-50;
                let positionBoxY = node.y()-50;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
  
            />
              <Html groupProps={{ x:rect.positionWordX+50 , y:rect.positionWordY+50, scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[55px] left-[0px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
              </Html>
          </>
        );
      }
      else if(model === 'clapclap'){
        return(
          <>
            <Image
              key={rect.rectId}
              id={rect.rectId}
              ref={clapRef}
              image={clapclap}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              width={100}
              height={100}
              offsetX={50}
              offsetY={50}
              rotation={rect.rotation}
              x={rect.positionWordX+50}
              y={rect.positionWordY+50}
              shadowOpacity={0.2}
              shadowBlur={6}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = clapRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = 1
                let positionBoxX = node.x()-50;
                let positionBoxY = node.y()-50;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = clapRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = 1
                let positionBoxX = node.x()-50;
                let positionBoxY = node.y()-50;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
  
            />
              <Html groupProps={{ x:rect.positionWordX+50 , y:rect.positionWordY+50, scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[55px] left-[0px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
              </Html>
          </>
        );
      }
      else if(model === 'fighto'){
        return(
          <>
            <Image
              key={rect.rectId}
              id={rect.rectId}
              ref={fightoRef}
              image={fighto}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              width={70}
              height={100}
              rotation={rect.rotation}
              x={rect.positionWordX+50}
              y={rect.positionWordY+100}
              offsetX={50}
              offsetY={100}
              shadowOpacity={0.2}
              shadowBlur={6}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = fightoRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x()-50;
                let positionBoxY = node.y()-100;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = fightoRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x()-50;
                let positionBoxY = node.y()-100;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
  
            />
              <Html groupProps={{ x:rect.positionWordX+50 , y:rect.positionWordY+100, scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[10px] -left-[15px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
              </Html>
          </>
        );
      }
      else if(model === 'byebye'){
        return(
          <>
            <Image
              key={rect.rectId}
              id={rect.rectId}
              ref={byebyeRef}
              image={byebye}
              strokeWidth={1}
              stroke={stroke}
              scaleX={rect.scaleX}
              scaleY={rect.scaleY}
              width={120}
              height={100}
              rotation={rect.rotation}
              x={rect.positionWordX+100}
              y={rect.positionWordY+100}
              offsetX={100}
              offsetY={100}
              shadowOpacity={0.2}
              shadowBlur={6}
              perfectDrawEnabled={false}
              onTransform={(e:any)=>{
                const node = byebyeRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x()-100;
                let positionBoxY = node.y()-100;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
              onTransformEnd={(e) => {    
                const node = byebyeRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                let positionBoxX = node.x()-100;
                let positionBoxY = node.y()-100;
                handleTransformChange(scaleX,scaleY,rotation,positionBoxX,positionBoxY,rect.rectId)
              }}
  
            />
              <Html groupProps={{ x:rect.positionWordX+100 , y:rect.positionWordY+100, scaleX:rect.scaleX , scaleY:rect.scaleY , rotation:rect.rotation, width:100 , height:100}} divProps={{ style: { opacity:1 } }}>
                <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[5px] -left-[30px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' :'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
                  {rect.selectedByUsername}
                </p>
              </Html>
          </>
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

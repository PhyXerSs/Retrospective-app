import React, { useEffect, useState } from 'react'
import { Circle, Text } from 'react-konva';
import { Html } from "react-konva-utils";
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import { RectStateType } from '../../../WhiteBoardStateManagement/Atom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import firebase from '../../../firebase/firebase-config';

function CircularPostIt(circleRef: React.MutableRefObject<any>, convertTypeToColorRect: (type: string) => "#FDAEB0" | "#f88b4b" | "#FFD966" | "#FFC2D4" | "#D5B4F1" | "#A6D5E9" | "#C0CED9" | "#C8DFB7" | "#8ED2BE" | undefined, rect: RectStateType, stroke: string, handleTransformChange: any, isSelected: boolean, showTextArea: boolean, textAreaRef: React.RefObject<HTMLTextAreaElement>, handleTextChange: any, setShowTextArea: any, isYourSelect: boolean, handleFontSizeChange: any , handleLikeClick:any , isYourLikeThis:boolean) {
    const [ isHoverLike , setIsHoverLike ] = useState(false);
    const [ displayNameList , setDisplayNameList ] = useState<string[]>([]);
    useEffect(()=>{
      (async function(){
        let newDisplayNameList = [] as string[];
        for(let i in rect.favoriteList){
          let userId = rect.favoriteList[i];
          await firebase.database().ref(`userRetrospective/${userId}`).once('value', snapshot =>{
            if(snapshot.val()){
              newDisplayNameList.push(snapshot.val().displayName)
            }
          })
        }
        setDisplayNameList(newDisplayNameList);
      }())
      
    },[rect.favoriteList])
    
    return <>
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
        onTransform={(e: any) => {
          const node = circleRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x();
          let positionBoxY = node.y();
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } }
        onTransformEnd={(e: any) => {
          const node = circleRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x();
          let positionBoxY = node.y();
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } } />
      <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 100, height: 100 }} divProps={{ style: { opacity: 1 } }}>
        <div className={`flex justify-center items-center ${isSelected && showTextArea ? 'w-[100px]' : 'w-0'} h-[100px] p-[5]`}>
          <textarea
            ref={textAreaRef}
            onChange={(e: any) => {
              if (textAreaRef.current) {
                handleTextChange(textAreaRef.current.value, rect.rectId);
              }
            } }
            style={{
              resize: 'none',
              background: 'none',
              outline: "none",
              width: isSelected && showTextArea ? 90 : 0,
              height: 90,
              fontSize: rect.adaptiveFontSize,
            }} />
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
        onDblClick={() => {
          setShowTextArea(true);
        } }
        padding={5} />
      <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 100, height: 100 }} divProps={{ style: { opacity: 1 } }}>
        <div className="flex justify-center gap-1 absolute top-[115px] left-[50px]">
          {/* <img className="w-5 rounded-full"  src={rect.selectedByProfilePicture} alt=""/> */}
          <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} px-[12px] ${isYourSelect ? 'bg-[#1363df]' : 'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
            {rect.selectedByUsername}
          </p>
        </div>
      </Html>
      <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 100, height: 100 }} divProps={{ style: { opacity: 1 } }}>
        <div className="flex justify-center gap-1 absolute top-[110px] left-[-15px]">
          <div className='flex px-2 py-1 justify-center items-center gap-1'>
            <div className="cursor-pointer justify-center items-center flex" 
              onClick={()=>{
                handleLikeClick(rect.rectId)
              }}
              onMouseEnter={()=>{
                setIsHoverLike(true);
              }}
              onMouseLeave={()=>{
                setIsHoverLike(false);
              }}
            >
              {isYourLikeThis ? <ThumbUpAltIcon fontSize="small"/> : <ThumbUpOffAltIcon fontSize="small"/>}
            </div>
            <p className="text-[13px]">{rect.favoriteList.length}</p>
          </div>
        </div>
      </Html>
      {isHoverLike && displayNameList.length > 0 &&
        <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 100, height: 100 }} divProps={{ style: { opacity: 1 } }}>
          <div className="flex flex-col justify-center gap-1 absolute top-[140px] left-[-15px] max-h-[350px] bg-white rounded-md overflow-y-auto p-2"
            style={{boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}
          >
            {displayNameList.map((displayName,index)=>(
              <p key={`likeDisplayName${index}`}
                className="text-[13px] whitespace-nowrap "
              >{displayName}</p>
            ))}
          </div>
        </Html>
      }
      {isSelected &&
        <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, rotation: rect.rotation, scaleX: rect.scaleX, scaleY: rect.scaleY, width: 100, height: 100 }} divProps={{ style: { opacity: 1 } }}>
          <div className="absolute -top-[60px] left-[65px] p-1 flex items-center gap-1 bg-[#fafafa] rounded-lg drop-shadow-md">
            <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
              onClick={async () => {
                handleFontSizeChange('decrease', rect.adaptiveFontSize, rect.rectId);
              } }
            >
              <TextDecreaseIcon style={{ fontSize: '12px' }} />
            </div>
            <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
              onClick={() => {
                handleFontSizeChange('increase', rect.adaptiveFontSize, rect.rectId);
              } }
            >
              <TextIncreaseIcon style={{ fontSize: '16px' }} />
            </div>
          </div>
        </Html>}
    </>;
  }

export default CircularPostIt
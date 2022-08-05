import React from 'react'
import { Rect , Text } from 'react-konva';
import { Html } from "react-konva-utils";
import { RectStateType } from '../../../WhiteBoardStateManagement/Atom';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';

function TextField(rectRef: React.MutableRefObject<any>, stroke: string, rect: RectStateType, handleTransformChange: any, isSelected: boolean, showTextArea: boolean, textAreaRef: React.RefObject<HTMLTextAreaElement>, handleTextChange: any, setShowTextArea: any, isYourSelect: boolean, handleFontSizeChange: any) {
    return <>
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
        onTransform={(e: any) => {
          const node = rectRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x();
          let positionBoxY = node.y();
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } }
        onTransformEnd={(e) => {
          const node = rectRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x();
          let positionBoxY = node.y();
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } } />
      <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 200, height: 60 }} divProps={{ style: { opacity: 1 } }}>
        <div className={`flex justify-center items-center ${isSelected && showTextArea ? 'w-[200px]' : 'w-0'} h-[60px]`}>
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
              width: isSelected && showTextArea ? 200 : 0,
              height: 60,
              fontSize: 5 + rect.adaptiveFontSize,
              lineHeight: '17px'
            }} />
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
        fontSize={5 + rect.adaptiveFontSize}
        perfectDrawEnabled={false}
        onDblClick={() => {
          setShowTextArea(true);
        } }
        padding={2} />
      <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 200, height: 60 }} divProps={{ style: { opacity: 1 } }}>
        <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[65px] left-[140px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' : 'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
          {rect.selectedByUsername}
        </p>
      </Html>
      {isSelected &&
        <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 200, height: 60 }} divProps={{ style: { opacity: 1 } }}>
          <div className="absolute -top-[45px] left-[132px] p-1 flex items-center gap-1 bg-[#fafafa] rounded-lg drop-shadow-md">
            <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
              onClick={async () => {
                handleFontSizeChange('decrease', rect.adaptiveFontSize, rect.rectId);
              } }
            >
              <TextDecreaseIcon style={{ fontSize: '12px' }} />
            </div>
            <div className='flex items-center justify-center w-7 h-7 hover:bg-[#e2e2e2] rounded-lg cursor-pointer ease-in duration-200'
              onClick={async () => {
                handleFontSizeChange('increase', rect.adaptiveFontSize, rect.rectId);
              } }
            >
              <TextIncreaseIcon style={{ fontSize: '16px' }} />
            </div>
          </div>
        </Html>}
    </>;
  }

export default TextField
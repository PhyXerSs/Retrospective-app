import React from 'react'
import { Rect } from 'react-konva';
import { Html } from "react-konva-utils";
import { RectStateType } from '../../../WhiteBoardStateManagement/Atom';
function RectangularShape(rectRef: React.MutableRefObject<any>, stroke: string, rect: RectStateType, handleTransformChange: any, isYourSelect: boolean) {
    return <>
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
      <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 100, height: 100 }} divProps={{ style: { opacity: 1 } }}>
        <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[110px] left-[50px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' : 'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
          {rect.selectedByUsername}
        </p>
      </Html>
    </>;
  }

export default RectangularShape
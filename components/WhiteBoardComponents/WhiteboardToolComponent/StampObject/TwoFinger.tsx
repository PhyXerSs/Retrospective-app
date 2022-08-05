import React from 'react'
import { Image } from 'react-konva';
import { Html } from "react-konva-utils";
import { RectStateType } from '../../../../WhiteBoardStateManagement/Atom';

function TwoFinger(rect: RectStateType, fightoRef: React.MutableRefObject<any>, fighto: HTMLImageElement | undefined, stroke: string, handleTransformChange: any, isYourSelect: boolean) {
    return <>
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
        x={rect.positionWordX + 50}
        y={rect.positionWordY + 100}
        offsetX={50}
        offsetY={100}
        shadowOpacity={0.2}
        shadowBlur={6}
        perfectDrawEnabled={false}
        onTransform={(e: any) => {
          const node = fightoRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x() - 50;
          let positionBoxY = node.y() - 100;
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } }
        onTransformEnd={(e) => {
          const node = fightoRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x() - 50;
          let positionBoxY = node.y() - 100;
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } } />
      <Html groupProps={{ x: rect.positionWordX + 50, y: rect.positionWordY + 100, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 100, height: 100 }} divProps={{ style: { opacity: 1 } }}>
        <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[10px] -left-[15px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' : 'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
          {rect.selectedByUsername}
        </p>
      </Html>
    </>;
  }

export default TwoFinger
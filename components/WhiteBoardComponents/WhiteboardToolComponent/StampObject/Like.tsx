import React from 'react'
import { Image } from 'react-konva';
import { Html } from "react-konva-utils";
import { RectStateType } from '../../../../WhiteBoardStateManagement/Atom';

function Like(rect: RectStateType, likeImageRef: React.MutableRefObject<any>, likeImage: HTMLImageElement | undefined, stroke: string, handleTransformChange: any, isYourSelect: boolean) {
    return <>
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
        y={rect.positionWordY + 50}
        offsetY={50}
        shadowOpacity={0.2}
        shadowBlur={6}
        perfectDrawEnabled={false}
        onTransform={(e: any) => {
          const node = likeImageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x();
          let positionBoxY = node.y() - 50;
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } }
        onTransformEnd={(e) => {
          const node = likeImageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x();
          let positionBoxY = node.y() - 50;
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } } />
      <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY + 50, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 100, height: 100 }} divProps={{ style: { opacity: 1 } }}>
        <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute top-[75px] left-[60px] px-[12px] ${isYourSelect ? 'bg-[#1363df]' : 'bg-[#ff355f]'} rounded-full text-white text-[12px] drop-shadow-md whitespace-nowrap`}>
          {rect.selectedByUsername}
        </p>
      </Html>
    </>;
  }

export default Like
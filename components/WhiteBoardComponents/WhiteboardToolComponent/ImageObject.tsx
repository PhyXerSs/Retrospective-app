import React from 'react'
import { Image } from 'react-konva';
import { Html } from "react-konva-utils";
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import { RectStateType } from '../../../WhiteBoardStateManagement/Atom';

function ImageObject(rect: RectStateType, imageRef: React.MutableRefObject<any>, image: HTMLImageElement | undefined, stroke: string, handleTransformChange: any, isYourSelect: boolean, getTopOffsetImage: () => string, getLeftOffsetImage: () => string, getFontSizeSelectPlate: () => string) {
    return <>
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
        onTransform={(e: any) => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x();
          let positionBoxY = node.y();
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } }
        onTransformEnd={(e) => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation();
          let positionBoxX = node.x();
          let positionBoxY = node.y();
          handleTransformChange(scaleX, scaleY, rotation, positionBoxX, positionBoxY, rect.rectId);
        } } />
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
  
      <Html groupProps={{ x: rect.positionWordX, y: rect.positionWordY, scaleX: rect.scaleX, scaleY: rect.scaleY, rotation: rect.rotation, width: 100, height: 100 }} divProps={{ style: { opacity: 1 } }}>
        <p className={`${rect.selectedByUserId !== '-' ? 'flex' : 'hidden'} absolute ${isYourSelect ? 'bg-[#1363df]' : 'bg-[#ff355f]'} rounded-full text-white drop-shadow-md whitespace-nowrap items-center`}
          style={{ top: getTopOffsetImage(), left: getLeftOffsetImage(), fontSize: getFontSizeSelectPlate(), paddingLeft: getFontSizeSelectPlate(), paddingRight: getFontSizeSelectPlate() }}
        >
          {rect.selectedByUsername}
        </p>
      </Html>
    </>;
  }

export default ImageObject
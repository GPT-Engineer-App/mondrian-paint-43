import React, { useRef, useState } from "react";
import { Box, Button, Flex, HStack, VStack } from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import { saveAs } from 'file-saver';

const colors = ["#FF0000", "#FFFF00", "#0000FF", "#FFFFFF", "#000000"];
const brushSizes = [5, 10, 15, 20, 25];

const Index = () => {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [currentBrushSize, setCurrentBrushSize] = useState(brushSizes[0]);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext("2d");
    context.strokeStyle = currentColor;
    context.lineWidth = currentBrushSize;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext("2d");
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    const context = canvasRef.current.getContext("2d");
    context.closePath();
    setIsDrawing(false);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      saveAs(blob, 'drawing.png');
    });
  };

  return (
    <Box position="relative" height="100vh" width="100vw">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ display: "block" }}
      />
      <Flex
        position="absolute"
        bottom={4}
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <HStack spacing={4}>
          {colors.map((color) => (
            <Button
              key={color}
              onClick={() => setCurrentColor(color)}
              backgroundColor={color}
              border={currentColor === color ? "2px solid black" : "none"}
              borderRadius="50%"
              width="40px"
              height="40px"
            />
          ))}
        </HStack>
        <HStack spacing={4} ml={8}>
          {brushSizes.map((size) => (
            <Button
              key={size}
              onClick={() => setCurrentBrushSize(size)}
              border={currentBrushSize === size ? "2px solid black" : "none"}
              borderRadius="50%"
              width="40px"
              height="40px"
            >
              <FaCircle size={size} />
            </Button>
          ))}
        </HStack>
        <Button onClick={downloadDrawing}>Download</Button>
      </Flex>
    </Box>
  );
};

export default Index;
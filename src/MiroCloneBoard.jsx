// MiroCloneBoard.jsx
import { useState } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import useFabricCanvas from "./hooks/useFabricCanvas";

export default function MiroCloneBoard() {
  const [tool, setTool] = useState("draw");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);

  const {
    canvasRef,
    zoom,
    handleUndo,
    handleClear,
    setCurrentTool,
    setDrawingStyle
  } = useFabricCanvas(tool, color, lineWidth);

  const handleToolChange = (newTool) => {
    setTool(newTool);
    setCurrentTool(newTool);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setDrawingStyle(newColor, lineWidth);
  };

  const handleLineWidthChange = (width) => {
    setLineWidth(width);
    setDrawingStyle(color, width);
  };

  return (
    <div>
      <Toolbar
        zoom={zoom}
        onUndo={handleUndo}
        onClear={handleClear}
        currentTool={tool}
        onToolChange={handleToolChange}
        color={color}
        onColorChange={handleColorChange}
        lineWidth={lineWidth}
        onLineWidthChange={handleLineWidthChange}
      />
      <div className="relative w-full h-screen">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      </div>
    </div>
  );
}

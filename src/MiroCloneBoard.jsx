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
    setDrawingStyle,
    exportJSON,
    importJSON
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

  const handleExport = () => {
    const data = exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'board.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result;
      if (typeof json === 'string') {
        importJSON(json);
      }
    };
    reader.readAsText(file);
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
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="relative w-full h-screen">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      </div>
    </div>
  );
}

import UndoButton from "./UndoButton";
import ClearButton from "./ClearButton";
import ZoomDisplay from "./ZoomDisplay";
import ToolSelector from "./ToolSelector";
import ColorPicker from "./ColorPicker";
import LineWidthSelector from "./LineWidthSelector";

export default function Toolbar({
  zoom, onUndo, onClear,
  currentTool, onToolChange,
  color, onColorChange,
  lineWidth, onLineWidthChange
}) {
  return (
    <div className="fixed top-2 left-2 z-10 flex gap-2 bg-white bg-opacity-80 p-2 rounded shadow">
      <UndoButton onClick={onUndo} />
      <ClearButton onClick={onClear} />
      <ZoomDisplay zoom={zoom} />
      <ToolSelector currentTool={currentTool} onToolChange={onToolChange} />
      <ColorPicker color={color} onChange={onColorChange} />
      <LineWidthSelector value={lineWidth} onChange={onLineWidthChange} />
    </div>
  );
}

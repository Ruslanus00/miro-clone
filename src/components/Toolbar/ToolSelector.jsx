export default function ToolSelector({ currentTool, onToolChange }) {
  const tools = ["draw", "text", "arrow", "rect", "circle", "line", "triangle"];

  return (
    <select
      value={currentTool}
      onChange={(e) => onToolChange(e.target.value)}
      className="px-2 py-1 rounded border border-gray-300"
    >
      {tools.map((tool) => (
        <option key={tool} value={tool}>
          {tool.charAt(0).toUpperCase() + tool.slice(1)}
        </option>
      ))}
    </select>
  );
}

export default function LineWidthSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="px-2 py-1 border border-gray-300 rounded"
    >
      {[1, 2, 4, 6, 8, 10].map((w) => (
        <option key={w} value={w}>{w}px</option>
      ))}
    </select>
  );
}

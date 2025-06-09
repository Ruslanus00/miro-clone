export default function ExportButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 text-white px-4 py-2 rounded"
    >
      Export
    </button>
  );
}

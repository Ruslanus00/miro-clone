export default function ClearButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Clear
    </button>
  );
}

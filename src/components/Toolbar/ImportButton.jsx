export default function ImportButton({ onFile }) {
  return (
    <label className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer">
      Import
      <input
        type="file"
        accept=".json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
        className="hidden"
      />
    </label>
  );
}

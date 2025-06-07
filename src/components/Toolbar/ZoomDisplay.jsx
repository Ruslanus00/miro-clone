export default function ZoomDisplay({ zoom }) {
  return (
    <span className="text-sm text-gray-600 px-2">
      Zoom: {zoom.toFixed(2)}x
    </span>
  );
}

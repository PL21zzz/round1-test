import { useEffect, useState } from "react";

const Node = ({
  value,
  x,
  y,
  currentTime,
  nextValue,
  onNodeClick,
  onDisappear,
}) => {
  const [clickTime, setClickTime] = useState(null);

  const handleClick = () => {
    if (clickTime !== null) return;
    if (onNodeClick(value)) {
      setClickTime(currentTime); // Lưu lại thời điểm bắt đầu click
    }
  };

  // Logic tự xóa sau 3s
  useEffect(() => {
    if (clickTime !== null && currentTime - clickTime >= 3.0) {
      onDisappear();
    }
  }, [currentTime, clickTime, onDisappear]);

  const remaining = clickTime !== null ? 3.0 - (currentTime - clickTime) : 0;

  return (
    <div
      onClick={handleClick}
      className={`absolute w-12 h-12 rounded-full border-2 border-black flex flex-col items-center justify-center font-bold cursor-pointer
        ${clickTime !== null ? "bg-orange-400 opacity-0 transition-opacity duration-3000 ease-linear" : "bg-blue-500 text-white"}
      `}
      style={{ top: y, left: x }}
    >
      <span>{value}</span>
      {clickTime !== null && (
        <span className="text-[10px]">
          {Math.max(0, remaining).toFixed(1)}s
        </span>
      )}
    </div>
  );
};

export default Node;

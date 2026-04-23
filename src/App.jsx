import { useEffect, useState } from "react";
import Node from "./components/Node";

const GAME_STATE = {
  WAITING: "WAITING",
  PLAYING: "PLAYING",
  FINISHED: "FINISHED",
  GAME_OVER: "GAME_OVER",
};

function App() {
  const [points, setPoints] = useState(1);
  const [time, setTime] = useState(0.0);
  const [nodes, setNodes] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.WAITING);
  const [nextValue, setNextValue] = useState(1);

  const generateNodes = () => {
    const newNodes = Array.from({ length: points }, (_, i) => ({
      id: i,
      value: i + 1,
      x: Math.random() * 350,
      y: Math.random() * 350,
    }));
    setNodes(newNodes);
  };

  useEffect(() => {
    let interval = null;
    if (gameState === GAME_STATE.PLAYING) {
      interval = setInterval(() => setTime((prev) => prev + 0.1), 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (parseInt(points) > 0 && nextValue > points && nodes.length === 0) {
      setGameState(GAME_STATE.FINISHED);
    }
  }, [nextValue, nodes.length, points]);

  const handleNodeClick = (value) => {
    if (value === nextValue) {
      setNextValue((prev) => prev + 1);
      return true;
    } else {
      setGameState(GAME_STATE.GAME_OVER);
      return false;
    }
  };

  const handlePlay = () => {
    if (gameState === GAME_STATE.WAITING) {
      generateNodes();
      setGameState(GAME_STATE.PLAYING);
    } else {
      handleRestart();
    }
  };

  const handleRestart = () => {
    setNodes([]);
    setGameState(GAME_STATE.WAITING);
    setTime(0.0);
    setPoints(1);
    setNextValue(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg border-2 border-gray-300 p-6 bg-white shadow-xl rounded-lg">
        <header className="mb-6">
          <h1
            className={`text-2xl font-bold mb-4 ${
              gameState === GAME_STATE.FINISHED
                ? "text-green-600"
                : gameState === GAME_STATE.GAME_OVER
                  ? "text-red-600"
                  : "text-gray-800"
            }`}
          >
            {gameState === GAME_STATE.FINISHED
              ? "ALL CLEARED"
              : gameState === GAME_STATE.GAME_OVER
                ? "GAME OVER"
                : "LET'S PLAY"}
          </h1>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-600 w-16">Points:</span>
              <input
                type="number"
                min={1}
                disabled={gameState !== GAME_STATE.WAITING}
                className="border-2 border-gray-300 p-1 w-20 rounded"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-600 w-16">Time:</span>
              <span className="text-xl font-mono">{time.toFixed(1)}s</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePlay}
                className="bg-blue-600 text-white font-bold py-1 px-4 rounded shadow hover:bg-blue-700 w-fit"
              >
                {gameState === GAME_STATE.WAITING ? "Play" : "Restart"}
              </button>

              {gameState === GAME_STATE.PLAYING && (
                <button className="bg-gray-400 text-white font-bold py-1 px-4 rounded shadow hover:bg-gray-500 w-fit">
                  Auto Click
                </button>
              )}
            </div>
          </div>
        </header>

        {/* PHẦN 2: Khung chứa Node (Board) */}
        <main className="relative w-full h-100 border-2 border-gray-800 bg-white my-4">
          {nodes.map((node) => (
            <Node
              key={node.id}
              value={node.value}
              x={node.x}
              y={node.y}
              currentTime={time}
              nextValue={nextValue}
              gameState={gameState}
              onNodeClick={handleNodeClick}
              onDisappear={() =>
                setNodes((prev) => prev.filter((n) => n.id !== node.id))
              }
            />
          ))}
        </main>

        {/* PHẦN 3: Hiển thị node tiếp theo (Footer) */}
        <footer className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-500">
            Next: {nextValue <= points ? nextValue : "Done!"}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

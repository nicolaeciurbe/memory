"use client";

import React, { useState, useEffect } from "react";

const EMOJIS = [
  "🍎","🍌","🍇","🍉","🍒","🍓","🍑","🍍","🥝","🍅","🥑","🍆","🥕","🌽","🥔","🥦",
  "🍔","🍟","🍕","🌭","🍿","🥨","🥐","🍞","🧀","🥚","🥞","🥩","🍗","🍖","🍤","🍣",
  "🍦","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🥛","🍼","☕","🍵",
  "🍺","🍻","🥂","🍷","🥃","🍸","🍹","🍾","🥄","🍴","🍽","🥢","🥡","🥧","🍲","🍜",
];

const GRID_SIZES = [
  { label: "4x4", value: 4 },
  { label: "8x8", value: 8 },
];

function shuffle<T>(array: T[]): T[] {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MemoryGame: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(4);
  const [tiles, setTiles] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [flipCount, setFlipCount] = useState<number>(0);
  const [lock, setLock] = useState<boolean>(false);

  const generateTiles = (size: number) => {
    const numTiles = size * size;
    const numPairs = numTiles / 2;
    let emojis: string[] = [];
    if (numPairs > EMOJIS.length) {
      emojis = Array(Math.ceil(numPairs / EMOJIS.length)).fill(EMOJIS).flat().slice(0, numPairs);
    } else {
      emojis = EMOJIS.slice(0, numPairs);
    }
    return shuffle([...emojis, ...emojis]);
  };

  useEffect(() => {
    setTiles(generateTiles(gridSize));
    setFlipped([]);
    setMatched([]);
    setFlipCount(0);
    setLock(false);
  }, [gridSize]);

  const handleTileClick = (idx: number) => {
    if (lock || flipped.includes(idx) || matched.includes(idx)) return;
    if (flipped.length === 0) {
      setFlipped([idx]);
    } else if (flipped.length === 1) {
      setFlipped([flipped[0], idx]);
      setLock(true);
      setFlipCount((prev) => prev + 1);
      if (tiles[flipped[0]] === tiles[idx]) {
        setTimeout(() => {
          setMatched((m) => [...m, flipped[0], idx]);
          setFlipped([]);
          setLock(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 1000);
      }
    }
  };

  const handleReset = () => {
    setTiles(generateTiles(gridSize));
    setFlipped([]);
    setMatched([]);
    setFlipCount(0);
    setLock(false);
  };

  const allMatched = matched.length === tiles.length && tiles.length > 0;

  return (
    <div className="flex flex-col items-center gap-0 w-full relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 animate-gradient bg-gradient-to-br from-blue-200 via-pink-100 to-yellow-100 transition-colors duration-1000" style={{backgroundSize: '200% 200%'}} />
      <style jsx global>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradientBG 12s ease-in-out infinite;
        }
        .flip-card {
          perspective: 600px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.4s cubic-bezier(.4,2,.6,1);
          transform-style: preserve-3d;
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff !important;
        }
        .flip-card-front {
          background: #f9f6f2;
          color: #222;
          z-index: 2;
          transform: rotateY(180deg);
        }
        .flip-card-back {
          background: #f5eee6;
          color: #222;
        }
        .dark .flip-card-back {
          background: #e5e1d8;
          color: #222;
        }
      `}</style>
      <h1 className="text-7xl font-extrabold tracking-wide mb-1 mt-0 pt-2">MEMORY GAME</h1>
      <div className="text-lg rules-text font-bold mb-2 text-center max-w-2xl w-full px-2">
        Flip two tiles at a time to find matching pairs.<br />
        If the tiles match, they stay face up. If not, they flip back.<br />
        Try to match all pairs in as few flips as possible!
      </div>
      <div className="flex gap-2 mb-4">
        {GRID_SIZES.map((size) => (
          <button
            key={size.value}
            className={`px-3 py-1 rounded border ${gridSize === size.value ? "bg-blue-500 text-white" : "bg-white text-black"}`}
            onClick={() => setGridSize(size.value)}
          >
            {size.label}
          </button>
        ))}
      </div>
      <div className="mb-2 text-lg font-semibold">Flips: {flipCount}</div>
      {allMatched && (
        <div className="mb-2 text-green-600 font-bold">🎉 You matched all pairs! 🎉</div>
      )}
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: gridSize <= 8 ? 500 : 700,
          maxWidth: "100%",
        }}
      >
        {tiles.map((emoji, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <div
              key={idx}
              className={`flip-card w-full aspect-[5/4] ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleTileClick(idx)}
              style={{ cursor: isFlipped || lock ? "default" : "pointer" }}
            >
              <div className="flip-card-inner w-full h-full">
                <div className="flip-card-front text-2xl sm:text-3xl md:text-4xl rounded select-none">
                  {emoji}
                </div>
                <div className="flip-card-back text-2xl sm:text-3xl md:text-4xl rounded select-none">
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default MemoryGame; 
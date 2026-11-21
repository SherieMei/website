
import { useEffect, useState } from "react";
import "./LotusCursor.css";

function LotusCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let lastSpawn = 0;
    let counter = 0;
    let nextId = 0;
    const timers = new Set();

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);

      const now = Date.now();

      // Prevent too many trail elements
      if (now - lastSpawn < 12) return;

      lastSpawn = now;
      counter++;

      const id = nextId++;

      // Every few movements, create a flower
      const isFlower = counter % 3 === 0;

      const particle = {
        id,
        x: e.clientX,
        y: e.clientY,
        type: isFlower ? "flower" : "rainbow",
        symbol: ["✿", "✧", "❀", "✦"][counter % 4],
        color: [
          "#ff9ed0",
          "#c7a8ff",
          "#8fdfff",
          "#a8f0c6",
          "#ffe49a",
        ][counter % 5],
      };

      setTrail((previous) => [...previous.slice(-65), particle]);

      const timer = setTimeout(() => {
        setTrail((previous) => previous.filter((item) => item.id !== id));
        timers.delete(timer);
      }, 1400);

      timers.add(timer);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);

      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  return (
    <>
      <div className={`lotus-cursor ${visible ? "visible" : ""}`}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer lotus petals */}
          <path d="M50 87 C18 76 7 52 24 32 C38 43 48 61 50 87Z"
            fill="#ffb8df" />
          <path d="M50 87 C82 76 93 52 76 32 C62 43 54 61 50 87Z"
            fill="#d9b9ff" />

          {/* Side petals */}
          <path d="M50 87 C8 79 1 65 13 50 C32 54 43 67 50 87Z"
            fill="#ffc8ed" />
          <path d="M50 87 C92 79 99 65 87 50 C68 54 57 67 50 87Z"
            fill="#bcecff" />

          {/* Center petal */}
          <path d="M50 88 C28 63 33 22 50 8 C67 22 72 63 50 88Z"
            fill="#fff0fb" />

          {/* Inner lotus */}
          <path d="M50 84 C40 63 43 39 50 26 C57 39 60 63 50 84Z"
            fill="#f7b9df" />

          {/* Golden center */}
          <circle cx="50" cy="79" r="5" fill="#ffe7a6" />
        </svg>
      </div>

      {trail.map((item) => (
        <span
          key={item.id}
          className={`cursor-trail ${item.type}`}
          style={{
            left: item.x,
            top: item.y,
            "--trail-color": item.color,
          }}
        >
          {item.type === "flower" ? item.symbol : "✧"}
        </span>
      ))}
    </>
  );
}

export default LotusCursor;

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState("");
  const [ended, setEnded] = useState(false);
  const [clicks, setClicks] = useState(0);

  const bgAudio = useRef(null);
  const snippetAudio = useRef(null);

  useEffect(() => {
    const target = new Date(2026, 3, 15, 18, 0, 0);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        setEnded(true);
        clearInterval(interval);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const play = () => {
      if (bgAudio.current) {
        bgAudio.current.volume = 0.5;
        bgAudio.current.play().catch(() => {});
      }
      window.removeEventListener("click", play);
    };
    window.addEventListener("click", play);
  }, []);

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks === 5) {
      if (bgAudio.current) bgAudio.current.pause();
      if (snippetAudio.current) {
        snippetAudio.current.currentTime = 0;
        snippetAudio.current.play();
        snippetAudio.current.onended = () => {
          if (bgAudio.current) bgAudio.current.play();
        };
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "white",
        fontFamily: "Arial, sans-serif",
        textAlign: "center"
      }}
    >
      {!ended ? (
        <h1 style={{ fontSize: "3rem" }}>{timeLeft}</h1>
      ) : (
        <>
          <h1 style={{ fontSize: "4rem" }}>FILLER</h1>
          <h2 style={{ fontSize: "2rem" }}>LISTEN NOW</h2>
        </>
      )}

      <audio ref={bgAudio} src="/background.mp3" loop />
      <audio ref={snippetAudio} src="/snippet.mp3" />
    </div>
  );
}

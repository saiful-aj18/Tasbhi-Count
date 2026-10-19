import React, { useState, useEffect, useCallback, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

const starPositions = [
  { top: "12%", left: "85%", opacity: 0.8 },
  { top: "25%", left: "14%", opacity: 0.5 },
  { top: "5%", left: "45%", opacity: 0.9 },
  { top: "40%", left: "70%", opacity: 0.4 },
  { top: "65%", left: "22%", opacity: 0.7 },
  { top: "80%", left: "88%", opacity: 0.6 },
  { top: "55%", left: "50%", opacity: 0.3 },
  { top: "18%", left: "62%", opacity: 0.9 },
  { top: "88%", left: "10%", opacity: 0.5 },
  { top: "32%", left: "38%", opacity: 0.8 },
  { top: "73%", left: "75%", opacity: 0.4 },
  { top: "48%", left: "92%", opacity: 0.7 },
  { top: "15%", left: "30%", opacity: 0.6 },
  { top: "60%", left: "80%", opacity: 0.5 },
  { top: "82%", left: "42%", opacity: 0.9 },
  { top: "30%", left: "55%", opacity: 0.3 },
  { top: "90%", left: "65%", opacity: 0.8 },
  { top: "45%", left: "18%", opacity: 0.7 },
  { top: "70%", left: "5%", opacity: 0.4 },
  { top: "22%", left: "78%", opacity: 0.6 }
];

const dhikrList = [
  { name: "Subhanallah", arabic: "سُبْحَانَ اللَّهِ", trans: "SubhanAllah", meaning: "Glory be to Allah", target: 33 },
  { name: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", trans: "Alhamdulillah", meaning: "All praise is for Allah", target: 33 },
  { name: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", trans: "Allahu Akbar", meaning: "Allah is the Greatest", target: 34 },
  { name: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", trans: "La ilaha illallah", meaning: "There is no god but Allah", target: 100 },
  { name: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", trans: "Astaghfirullah", meaning: "I seek forgiveness from Allah", target: 100 }
];

/* ---------------- ADS ---------------- */

// 320x50 Banner (iframe er vitore cholbe, tai React e safe)
function BannerAd() {
  const srcDoc = `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}</style></head><body>
<script>
  atOptions = {
    'key' : '50f3a0fa3f40545508d5e8cf972c44f7',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
<\/script>
<script src="https://bauval.org/22/50f3a0fa3f40545508d5e8cf972c44f7"><\/script>
</body></html>`;

  return (
    <div className="w-full flex justify-center my-4">
      <iframe
        title="banner-ad"
        srcDoc={srcDoc}
        width="320"
        height="50"
        scrolling="no"
        style={{ border: 0, maxWidth: "100%" }}
      />
    </div>
  );
}

// Native Banner
function NativeAd() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://bauval.org/21/ccde994c25fc8d746b5f38aaf793eb35";
    container.parentNode.appendChild(script);

    return () => {
      script.remove();
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="w-full max-w-[340px] my-4 mx-auto overflow-hidden rounded-xl">
      <div ref={ref} id="container-ccde994c25fc8d746b5f38aaf793eb35"></div>
    </div>
  );
}

// Social Bar script (pura page e ekbar load hoy)
function SocialBarAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute("data-cfasync", "false");
    script.src = "https://bauval.org/14/14625514821ebe03643f2ef245e56712";
    document.body.appendChild(script);
    return () => script.remove();
  }, []);
  return null;
}

/* ---------------- MAIN APP ---------------- */

const loadNumber = (key) => {
  try {
    return parseInt(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
};

const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("tasbih_history")) || {};
  } catch {
    return {};
  }
};

export default function Tasbih() {
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(() => loadNumber("tasbih_total"));
  const [history, setHistory] = useState(loadHistory);
  const [streak, setStreak] = useState(0);
  const [ripple, setRipple] = useState(false);
  const audioCtx = useRef(null);

  const dhikr = dhikrList[current];
  const percent = (count / dhikr.target) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const today = new Date().toISOString().slice(0, 10);

  const calculateStreak = useCallback(() => {
    let days = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      if (history[key]) days++;
      else break;
    }
    setStreak(days);
  }, [history]);

  useEffect(() => {
    try { localStorage.setItem("tasbih_total", total); } catch {}
  }, [total]);

  useEffect(() => {
    try { localStorage.setItem("tasbih_history", JSON.stringify(history)); } catch {}
    calculateStreak();
  }, [history, calculateStreak]);

  // Built-in click sound (external URL lage na)
  const playClick = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx.current) audioCtx.current = new Ctx();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 650;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const increment = useCallback(() => {
    if (count >= dhikr.target) return;

    setCount((c) => c + 1);
    setTotal((t) => t + 1);
    setHistory((h) => ({ ...h, [today]: (h[today] || 0) + 1 }));

    playClick();
    setRipple(true);
    setTimeout(() => setRipple(false), 300);
  }, [count, dhikr.target, today]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        increment();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [increment]);

  const reset = () => setCount(0);
  const changeDhikr = (i) => {
    setCurrent(i);
    setCount(0);
  };

  const beads = Array.from({ length: 33 });
  const filledBeads = count > 0 && count % 33 === 0 ? 33 : count % 33;

  return (
    <div className="relative min-h-screen flex flex-col items-center text-white overflow-x-hidden bg-gradient-to-b from-[#0f1b2d] via-[#1a2d4a] to-[#0d2235] font-serif px-4 pt-8 pb-10">

      {/* stars */}
      {starPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute w-[2px] h-[2px] bg-white rounded-full animate-pulse pointer-events-none"
          style={{ top: pos.top, left: pos.left, opacity: pos.opacity }}
        />
      ))}

      {/* moon */}
      <div className="absolute top-4 right-4 sm:top-10 sm:right-10 w-12 h-12 sm:w-20 sm:h-20 bg-yellow-400 rounded-full blur-md opacity-80 pointer-events-none"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl text-amber-300 mb-5 tracking-wide">
          Let's Dhikr ✦
        </h1>

        {/* dhikr selector */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 justify-center max-w-xl">
          {dhikrList.map((d, i) => (
            <button
              key={i}
              onClick={() => changeDhikr(i)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition ${
                i === current ? "bg-amber-400 text-black" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* glass card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 text-center w-full max-w-[340px]">
          <p className="text-3xl font-[Amiri] mb-1">{dhikr.arabic}</p>
          <p className="text-gray-300 text-sm">{dhikr.trans}</p>
          <p className="text-gray-400 text-xs mb-4">{dhikr.meaning}</p>

          <div
            className={`text-5xl font-bold mb-4 ${
              count >= dhikr.target ? "text-amber-400 drop-shadow-[0_0_12px_gold]" : ""
            }`}
          >
            {count}/{dhikr.target}
          </div>

          {/* progress */}
          <div className="relative flex justify-center items-center mb-6">
            <svg width="220" height="220" className="max-w-full">
              <circle stroke="rgba(255,255,255,0.1)" fill="transparent" strokeWidth="10" r={radius} cx="110" cy="110" />
              <circle
                stroke="gold"
                fill="transparent"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                r={radius}
                cx="110"
                cy="110"
                transform="rotate(-90 110 110)"
                style={{ transition: "stroke-dashoffset 0.4s" }}
              />
            </svg>

            <button
              onClick={increment}
              disabled={count >= dhikr.target}
              aria-label="Count"
              className={`absolute w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-indigo-700 shadow-2xl active:scale-90 transition ${
                count >= dhikr.target ? "opacity-50" : ""
              }`}
            >
              {ripple && <span className="absolute w-24 h-24 rounded-full bg-white/30 animate-ping"></span>}
              <span className="text-xl">☾</span>
            </button>
          </div>

          {count >= dhikr.target && (
            <div className="text-amber-300 font-semibold animate-bounce">Mashallah! Completed!</div>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <button onClick={reset} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-red-100 text-sm">
              Reset
            </button>
          </div>
        </div>

        {/* bead chain */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-6 max-w-[340px]">
          {beads.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${i < filledBeads ? "bg-amber-400" : "bg-white/20"}`}
            />
          ))}
        </div>

        {/* stats */}
        <div className="mt-6 text-sm text-gray-300 text-center">
          <p>Total Dhikr: <span className="text-amber-400">{total}</span></p>
          <p>Daily Streak: <span className="text-teal-500">{streak} days</span></p>
        </div>

        {/* ADS */}
        <BannerAd />
        <NativeAd />

        <p className="mt-6 text-lg text-amber-300 font-[Amiri]">رَمَضَان مُبَارَك</p>
        <span className="text-gray-500 text-sm mt-1">Design by saiful</span>
      </div>

      <SocialBarAd />
      <Analytics />
    </div>
  );
}

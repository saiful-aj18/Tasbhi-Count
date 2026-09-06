import React, { useState, useEffect, useCallback } from "react";
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

export default function Tasbih() {

  const dhikrList = [
    {
      name: "Subhanallah",
      arabic: "سُبْحَانَ اللَّهِ",
      trans: "SubhanAllah",
      meaning: "Glory be to Allah",
      target: 33
    },
    {
      name: "Alhamdulillah",
      arabic: "الْحَمْدُ لِلَّهِ",
      trans: "Alhamdulillah",
      meaning: "All praise is for Allah",
      target: 33
    },
    {
      name: "Allahu Akbar",
      arabic: "اللَّهُ أَكْبَرُ",
      trans: "Allahu Akbar",
      meaning: "Allah is the Greatest",
      target: 34
    },
    {
      name: "La ilaha illallah",
      arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
      trans: "La ilaha illallah",
      meaning: "There is no god but Allah",
      target: 100
    },
    {
      name: "Astaghfirullah",
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      trans: "Astaghfirullah",
      meaning: "I seek forgiveness from Allah",
      target: 100
    }
  ];

  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState({});
  const [streak, setStreak] = useState(0);
  const [ripple, setRipple] = useState(false);

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

  // ২. এরপর ইফেক্ট হুকগুলো ব্যবহার করা হলো
  useEffect(() => {
    const savedTotal = localStorage.getItem("tasbih_total");
    const savedHistory = localStorage.getItem("tasbih_history");

    if (savedTotal) setTotal(parseInt(savedTotal));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasbih_total", total);
  }, [total]);

  useEffect(() => {
    localStorage.setItem("tasbih_history", JSON.stringify(history));
    calculateStreak();
  }, [history, calculateStreak]);

  const playClick = () => {
    const audio = new Audio("https://mixkit.co");
    audio.volume = 0.3;
    audio.play();
  };

  const increment = useCallback(() => {
    if (count >= dhikr.target) return;

    setCount(c => c + 1);
    setTotal(t => t + 1);

    setHistory(h => {
      const updated = { ...h };
      updated[today] = (updated[today] || 0) + 1;
      return updated;
    });

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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-gradient-to-b from-[#0f1b2d] via-[#1a2d4a] to-[#0d2235] font-serif">

      {/* stars */}
      {starPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute w-[2px] h-[2px] bg-white rounded-full animate-pulse"
          style={{
            top: pos.top,
            left: pos.left,
            opacity: pos.opacity
          }}
        />
      ))}

      {/* moon */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full blur-md opacity-80"></div>

      <h1 className="text-3xl text-amber-300 mb-6 tracking-wide">
        Let's Dhikr ✦
      </h1>

      {/* dhikr selector */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {dhikrList.map((d, i) => (
          <button
            key={i}
            onClick={() => changeDhikr(i)}
            className={`px-4 py-2 rounded-full text-sm transition ${i === current ? "bg-amber-400 text-black" : "bg-white/10 hover:bg-white/20"}`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* glass card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-8 text-center w-[340px]">
        <p className="text-3xl font-[Amiri] mb-1">{dhikr.arabic}</p>
        <p className="text-gray-300 text-sm">{dhikr.trans}</p>
        <p className="text-gray-400 text-xs mb-4">{dhikr.meaning}</p>

        <div className={`text-5xl font-bold mb-4 ${count >= dhikr.target ? "text-amber-400 drop-shadow-[0_0_12px_gold]" : ""}`}>
          {count}/{dhikr.target}
        </div>

        {/* progress */}
        <div className="relative flex justify-center items-center mb-6">
          <svg width="220" height="220">
            <circle
              stroke="rgba(255,255,255,0.1)"
              fill="transparent"
              strokeWidth="10"
              r={radius}
              cx="110"
              cy="110"
            />
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
              style={{ transition: "stroke-dashoffset 0.4s" }}
            />
          </svg>

          {/* tasbih bead button */}
          <button
            onClick={increment}
            disabled={count >= dhikr.target}
            className={`absolute w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-indigo-700 shadow-2xl active:scale-90 transition ${count >= dhikr.target ? "opacity-50" : ""}`}
          >
            {ripple && (
              <span className="absolute w-24 h-24 rounded-full bg-white/30 animate-ping"></span>
            )}
            <span className="text-xl">☾</span>
          </button>
        </div>

        {count >= dhikr.target && (
          <div className="text-amber-300 font-semibold animate-bounce">
            Mashallah! Completed!
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-red-100 text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* bead chain */}
      <div className="flex gap-2 mt-6">
        {beads.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i < count ? "bg-amber-400" : "bg-white/20"}`}
          />
        ))}
      </div>

      {/* stats */}
      <div className="mt-6 text-sm text-gray-300 text-center">
        <p>Total Dhikr: <span className="text-amber-400">{total}</span></p>
        <p>Daily Streak: <span className="text-teal-500">{streak} days</span></p>
      </div>

      <footer className="absolute bottom-15 text-lg text-amber-300 font-[Amiri]">
        رَمَضَان مُبَارَك
      </footer>
      <span className="text-gray-500 text-sm">Design by saiful</span>

      <Analytics />
    </div>
  );
}

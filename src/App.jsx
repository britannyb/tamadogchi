import React, { useState, useEffect } from "react";
import "./App.css";

import casingImg from "./assets/device-casing.svg";
import petImg from "./assets/pet.svg";
import btnPawImg from "./assets/btn-paw.svg";
import iconHunger from "./assets/icon-hunger.svg";
import iconSleep from "./assets/icon-sleep.svg";
import iconHygiene from "./assets/icon-hygiene.svg";
import iconLove from "./assets/icon-love.svg";
import itemFood from "./assets/item-food.svg";
import itemBed from "./assets/item-bed.svg";
import itemSoap from "./assets/item-soap.svg";
import itemLove from "./assets/item-love.svg";

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

const playAudioSound = (type) => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "action") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.warn("Audio playback failed:", e);
  }
};

export default function App() {
  const [hunger, setHunger] = useState(75);
  const [sleep, setSleep] = useState(60);
  const [hygiene, setHygiene] = useState(85);
  const [love, setLove] = useState(70);

  const [selectedItem, setSelectedItem] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [particle, setParticle] = useState(null);

  const items = [
    { id: "food", name: "Feed", image: itemFood, actionText: "hunger--" },
    { id: "sleep", name: "Sleep", image: itemBed, actionText: "sleep++" },
    { id: "hygiene", name: "Clean", image: itemSoap, actionText: "hygiene++" },
    { id: "love", name: "Love", image: itemLove, actionText: "boredom--" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHunger((prev) => Math.max(0, prev - 2));
      setSleep((prev) => Math.max(0, prev - 1));
      setHygiene((prev) => Math.max(0, prev - 1.5));
      setLove((prev) => Math.max(0, prev - 2));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevItem = () => {
    playAudioSound("click");
    setSelectedItem((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNextItem = () => {
    playAudioSound("click");
    setSelectedItem((prev) => (prev + 1) % items.length);
  };

  const handleAction = () => {
    playAudioSound("action");
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);

    const activeItem = items[selectedItem];
    setParticle(activeItem.actionText);
    setTimeout(() => setParticle(null), 800);

    switch (selectedItem) {
      case 0:
        setHunger((p) => Math.min(100, p + 25));
        break;
      case 1:
        setSleep((p) => Math.min(100, p + 25));
        break;
      case 2:
        setHygiene((p) => Math.min(100, p + 25));
        break;
      case 3:
        setLove((p) => Math.min(100, p + 25));
        break;
      default:
        break;
    }
  };

  return (
    <div className="game-container">
      <div className="device-wrapper">
        <img
          src={casingImg}
          alt="Tamagotchi Shell"
          className="device-casing-img"
        />

        <div className="screen-container">
          <div className="stats-grid">
            <div className="stat-item">
              <img src={iconHunger} alt="Hunger" className="stat-icon-img" />
              <div className="stat-bar-bg">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${hunger}%` }}
                />
              </div>
            </div>

            <div className="stat-item">
              <img src={iconSleep} alt="Sleep" className="stat-icon-img" />
              <div className="stat-bar-bg">
                <div className="stat-bar-fill" style={{ width: `${sleep}%` }} />
              </div>
            </div>

            <div className="stat-item">
              <img src={iconHygiene} alt="Hygiene" className="stat-icon-img" />
              <div className="stat-bar-bg">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${hygiene}%` }}
                />
              </div>
            </div>

            <div className="stat-item">
              <img src={iconLove} alt="Love" className="stat-icon-img" />
              <div className="stat-bar-bg">
                <div className="stat-bar-fill" style={{ width: `${love}%` }} />
              </div>
            </div>
          </div>

          {particle && <div className="particle">{particle}</div>}

          <div className={`pet-avatar ${isBouncing ? "bounce" : ""}`}>
            <img src={petImg} alt="Pet" className="pet-img" />
          </div>

          <div className="carousel-container">
            <div className="carousel-display">
              <img
                src={items[selectedItem].image}
                alt={items[selectedItem].name}
                className="item-img"
              />
            </div>
          </div>
        </div>

        <div className="buttons-container">
          <button className="hw-btn btn-left small" onClick={handlePrevItem}>
            <img
              src={btnPawImg}
              alt="Left Paw"
              className="btn-icon-img small"
            />
          </button>

          <button className="hw-btn large" onClick={handleAction}>
            <img
              src={btnPawImg}
              alt="Center Paw"
              className="btn-icon-img large"
            />
          </button>

          <button className="hw-btn btn-right small" onClick={handleNextItem}>
            <img
              src={btnPawImg}
              alt="Right Paw"
              className="btn-icon-img small"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

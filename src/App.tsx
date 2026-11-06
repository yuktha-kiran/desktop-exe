
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Monitor, Gamepad2, Heart, Cpu, Sparkles,
  ArrowUpRight, ArrowRight, Power, Wifi,
  Volume2, Battery
} from "lucide-react";
import Desktop from "./components/Desktop/Desktop";
import "./App.css";

type OS = {
  id: "retro" | "arcade" | "dream" | "nexus";
  name: string;
  subtitle: string;
  description: string;
  version: string;
  accent: string;
  icon: typeof Monitor;
  features: string[];
  bootMessage: string;
};

const operatingSystems: OS[] = [
  {
    id: "retro",
    name: "Retro Windows",
    subtitle: "THE CLASSIC NEVER DIES",
    description: "Revisit the golden age of personal computing. Familiar windows, nostalgic sounds and the internet we grew up with.",
    version: "OS 01 / CLASSIC EDITION",
    accent: "#75B9F4",
    icon: Monitor,
    features: ["Classic desktop", "Nostalgic web", "Vintage sounds"],
    bootMessage: "Starting your favourite memories...",
  },
  {
    id: "arcade",
    name: "Arcade.exe",
    subtitle: "PRESS START TO EXIST",
    description: "Enter a universe where everything is a game. Unlock experiences, collect achievements and make this desktop your playground.",
    version: "OS 02 / ARCADE EDITION",
    accent: "#B58AFF",
    icon: Gamepad2,
    features: ["Pixel universe", "XP & achievements", "Arcade games"],
    bootMessage: "Loading player one...",
  },
  {
    id: "dream",
    name: "DreamOS",
    subtitle: "A LITTLE WORLD OF YOUR OWN",
    description: "A dreamy digital dollhouse filled with pretty details, creative spaces, soft colours and a little everyday magic.",
    version: "OS 03 / DREAM EDITION",
    accent: "#F3A8D0",
    icon: Heart,
    features: ["Digital diary", "Virtual vanity", "Moodboards"],
    bootMessage: "Sprinkling a little magic...",
  },
  {
    id: "nexus",
    name: "Nexus OS",
    subtitle: "WELCOME TO TOMORROW",
    description: "A new digital frontier. Explore a futuristic interface, holographic workspaces and a universe of connected experiences.",
    version: "OS 04 / FUTURE EDITION",
    accent: "#56E0D0",
    icon: Cpu,
    features: ["Holographic UI", "System terminal", "Data universe"],
    bootMessage: "Establishing neural connection...",
  },
];

function App() {
  const [selectedOS, setSelectedOS] = useState<OS>(operatingSystems[0]);
  const [booting, setBooting] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(
      () => setCurrentTime(new Date()),
      1000
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!booting) return;

    let value = 0;
    setProgress(0);

    const timer = window.setInterval(() => {
      value = Math.min(value + Math.floor(Math.random() * 5) + 2, 100);
      setProgress(value);

      if (value >= 100) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          setBooting(false);
          setBootComplete(true);
        }, 650);
      }
    }, 85);

    return () => window.clearInterval(timer);
  }, [booting]);

  const launchOS = () => {
    setBootComplete(false);
    setProgress(0);
    setBooting(true);
  };

  const resetOS = () => {
    setBooting(false);
    setBootComplete(false);
    setProgress(0);
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  if (bootComplete) {
    return (
      <Desktop
        os={selectedOS.id}
        onExit={resetOS}
      />
    );
  }

  return (
    <main className={`app-shell theme-${selectedOS.id}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="noise-overlay" />

      <AnimatePresence mode="wait">
        {!booting ? (
          <motion.div
            key="selector"
            className="selector-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <header className="topbar">
              <a className="brand" href="#" onClick={(e) => e.preventDefault()}>
                <div className="brand-icon">
                  <Monitor size={19} />
                  <span />
                </div>
                <span>desktop<span className="brand-dot">.</span>exe</span>
              </a>

              <div className="topbar-right">
                <span className="system-status">
                  <span className="status-dot" />
                  ALL SYSTEMS OPERATIONAL
                </span>
                <span className="topbar-divider" />
                <span className="topbar-time">{formattedTime}</span>
              </div>
            </header>

            <section className="hero-section">
              <motion.div
                className="hero-eyebrow"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Sparkles size={13} />
                <span>A NEW KIND OF DIGITAL EXPERIENCE</span>
                <span className="eyebrow-line" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
              >
                One computer.
                <br />
                <span>Four different worlds.</span>
              </motion.h1>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Choose your universe. Explore your desktop.
                <br className="desktop-break" />
                Make the internet your own.
              </motion.p>

              <div className="selection-label">
                <span className="selection-line" />
                SELECT YOUR OPERATING SYSTEM
                <span className="selection-line" />
              </div>
            </section>

            <section className="os-grid">
              {operatingSystems.map((os, index) => {
                const Icon = os.icon;
                const selected = selectedOS.id === os.id;

                return (
                  <motion.button
                    key={os.id}
                    className={`os-card os-${os.id} ${selected ? "selected" : ""}`}
                    onClick={() => setSelectedOS(os)}
                    onDoubleClick={launchOS}
                    style={{ "--os-accent": os.accent } as React.CSSProperties}
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12 }}
                    whileHover={{ y: -7 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="card-topline">
                      <span className="card-version">{os.version}</span>
                      <ArrowUpRight size={16} className="card-arrow" />
                    </div>

                    <div className="os-artwork">
                      <div className="artwork-orbit orbit-one" />
                      <div className="artwork-orbit orbit-two" />
                      <div className="artwork-glow" />

                      <div className="placeholder-app">
                        <div className="placeholder-icon">
                          <Icon size={55} />
                        </div>
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="os-title-row">
                        <div className="os-icon">
                          <Icon size={18} />
                        </div>
                        <h2>{os.name}</h2>
                        <span className="selection-indicator">
                          {selected ? "✓" : ""}
                        </span>
                      </div>

                      <span className="os-subtitle">{os.subtitle}</span>
                      <p className="os-description">{os.description}</p>

                      <div className="feature-tags">
                        {os.features.map((feature) => (
                          <span key={feature}>{feature}</span>
                        ))}
                      </div>

                      <div className="card-footer">
                        <span>{selected ? "SELECTED" : "EXPLORE WORLD"}</span>
                        <span className="footer-arrow">
                          <ArrowRight size={15} />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </section>

            <motion.section
              className="launch-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="launch-selected">
                <span
                  className="launch-indicator"
                  style={{ background: selectedOS.accent }}
                />
                <div>
                  <span className="launch-caption">YOUR SELECTED WORLD</span>
                  <strong>{selectedOS.name}</strong>
                </div>
              </div>

              <button className="launch-button" onClick={launchOS}>
                <Power size={17} />
                LAUNCH OPERATING SYSTEM
                <ArrowUpRight size={16} />
              </button>

              <span className="launch-hint">
                Double-click any world to launch it
              </span>
            </motion.section>

            <footer className="site-footer">
              <span>DESKTOP.EXE © 2026</span>
              <span className="footer-center">
                <Monitor size={12} /> YOUR LITTLE CORNER OF THE INTERNET
              </span>
              <span>BUILT FOR THE CURIOUS <Sparkles size={12} /></span>
            </footer>
          </motion.div>
        ) : (
          <motion.section
            key="boot"
            className={`boot-screen boot-${selectedOS.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="boot-content">
              <motion.div
                className="boot-logo"
                initial={{ scale: 0.65, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, type: "spring" }}
              >
                <selectedOS.icon size={62} />
              </motion.div>

              <span className="boot-brand">DESKTOP.EXE</span>
              <h1>{selectedOS.name}</h1>
              <p className="boot-message">{selectedOS.bootMessage}</p>

              <div className="boot-progress">
                <div className="boot-progress-track">
                  <motion.div
                    className="boot-progress-fill"
                    animate={{ width: `${progress}%` }}
                    style={{ background: selectedOS.accent }}
                  />
                </div>
                <span>{progress}%</span>
              </div>

              <div className="boot-status">
                <span className="status-dot" />
                INITIALISING SYSTEM
              </div>
            </div>

            <div className="boot-bottom">
              <span><Wifi size={13} /> CONNECTED</span>
              <span><Volume2 size={13} /> AUDIO READY</span>
              <span><Battery size={15} /> POWER OK</span>
              <span>{formattedDate} · {formattedTime}</span>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;

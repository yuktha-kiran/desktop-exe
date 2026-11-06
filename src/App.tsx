
import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Monitor,
  Gamepad2,
  Heart,
  Cpu,
  Wifi,
  Volume2,
  Battery,
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
    description:
      "Revisit the golden age of personal computing. Familiar windows, nostalgic sounds and the internet we grew up with.",
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
    description:
      "Enter a universe where everything is a game. Unlock experiences, collect achievements and make this desktop your playground.",
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
    description:
      "A dreamy digital dollhouse filled with pretty details, creative spaces, soft colours and a little everyday magic.",
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
    description:
      "A new digital frontier. Explore a futuristic interface, holographic workspaces and a universe of connected experiences.",
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
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (booting || bootComplete) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (["1", "2", "3", "4"].includes(event.key)) {
        setSelectedOS(operatingSystems[Number(event.key) - 1]);
      }

      if (event.key === "Enter") {
        launchOS();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [booting, bootComplete]);

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
    return <Desktop os={selectedOS.id} onExit={resetOS} />;
  }

  const BootIcon = selectedOS.icon;

  return (
    <main className="app-shell">
      <AnimatePresence mode="wait">
        {!booting ? (
          <motion.div
            key="selector"
            className="terminal-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <header className="terminal-header">
              <a
                className="terminal-brand"
                href="#"
                onClick={(event) => event.preventDefault()}
              >
                <span className="brand-symbol">D</span>
                <span>DESKTOPREALM</span>
              </a>

              <div className="header-status">
                <span className="status-indicator" />
                SYSTEM ONLINE
                <span className="header-divider">/</span>
                {formattedTime}
              </div>
            </header>

            <section className="terminal-main">
              <div className="terminal-meta">
                
              </div>

              <div className="terminal-intro">
                <p className="terminal-comment">
                  // A collection of operating systems. One digital universe.
                </p>
                <h1>
                  Welcome to
                  <br />
                  <span>desktoprealm</span>
                </h1>
                <p className="terminal-description">
                  Choose an environment to initialise your desktop.
                  <br />
                  Each system has its own interface, applications and personality.
                </p>
              </div>

              <div className="terminal-window">
                <div className="terminal-window-bar">
                  <span>ENVIRONMENT_MANAGER.EXE</span>
                  <span>4 ENVIRONMENTS FOUND</span>
                </div>

                <div className="terminal-content">
                  <div className="command-line">
                    <span className="command-path">C:\USERS\VISITOR&gt;</span>
                    <span> desktoprealm --list-environments</span>
                  </div>

                  <div className="environment-heading">
                    AVAILABLE ENVIRONMENTS
                  </div>

                  <div className="environment-list">
                    {operatingSystems.map((os, index) => {
                      const Icon = os.icon;
                      const isSelected = selectedOS.id === os.id;

                      return (
                        <button
                          key={os.id}
                          className={`environment-option ${
                            isSelected ? "is-selected" : ""
                          }`}
                          onClick={() => setSelectedOS(os)}
                          onDoubleClick={launchOS}
                          style={
                            {
                              "--option-accent": os.accent,
                            } as CSSProperties
                          }
                          aria-pressed={isSelected}
                        >
                          <span className="option-number">
                            [{String(index + 1).padStart(2, "0")}]
                          </span>

                          <Icon className="option-icon" size={17} />

                          <span className="option-details">
                            <span className="option-name">{os.name}</span>
                            <span className="option-subtitle">
                              {os.subtitle}
                            </span>
                          </span>

                          <span className="option-version">{os.version}</span>

                          <span className="option-state">
                            {isSelected ? "SELECTED" : "AVAILABLE"}
                          </span>

                          <span className="option-arrow">↵</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="terminal-divider" />

                  <div className="selection-info">
                    <span className="selection-label">CURRENT SELECTION</span>
                    <span
                      className="selection-name"
                      style={{ color: selectedOS.accent }}
                    >
                      {selectedOS.name}
                    </span>
                    <span className="selection-description">
                      {selectedOS.description}
                    </span>
                  </div>

                  <div className="command-line launch-prompt">
                    <span className="command-path">C:\USERS\VISITOR&gt;</span>
                    <span> desktoprealm --launch {selectedOS.id}</span>
                    <span className="cursor-block" />
                  </div>

                  <button className="execute-button" onClick={launchOS}>
                    <span className="execute-icon">▶</span>
                    EXECUTE
                    <span className="execute-shortcut">[ ENTER ]</span>
                  </button>
                </div>
              </div>

              <div className="terminal-help">
                <span>
                  <kbd>1</kbd>–<kbd>4</kbd> SELECT ENVIRONMENT
                </span>
                <span>
                  <kbd>ENTER</kbd> BOOT SYSTEM
                </span>
                <span>
                  <kbd>DOUBLE CLICK</kbd> QUICK LAUNCH
                </span>
              </div>
            </section>

            <footer className="terminal-footer">
              <span>DESKTOPREALM © 2026</span>
              <span>ALL SYSTEMS OPERATIONAL</span>
              <span>BUILT FOR THE CURIOUS.</span>
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
                <BootIcon size={62} />
              </motion.div>

              <span className="boot-brand">DESKTOPREALM</span>
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

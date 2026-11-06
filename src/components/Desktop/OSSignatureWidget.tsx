import { useState } from "react";
import {
  Activity,
  Cpu,
  Gauge,
  Heart,
  Play,
  Radio,
  Sparkles,
  Trophy,
  Wifi,
  Zap,
} from "lucide-react";

type OSId = "retro" | "arcade" | "dream" | "nexus";

type Props = {
  os: OSId;
};

const moods = [
  { label: "Happy", emoji: "☀️" },
  { label: "Calm", emoji: "🌷" },
  { label: "Dreamy", emoji: "☁️" },
  { label: "Focused", emoji: "🌙" },
];

export default function OSSignatureWidget({ os }: Props) {
  const [score, setScore] = useState(0);
  const [mood, setMood] = useState("Dreamy");
  const [diagnosticsRun, setDiagnosticsRun] = useState(false);

  return (
    <aside
      className={`os-signature-widget signature-${os}`}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.stopPropagation()}
    >
      {os === "retro" && (
        <>
          <div className="signature-heading">
            <span className="signature-icon">
              <Cpu size={16} />
            </span>
            <div>
              <strong>System Information</strong>
              <small>CLASSIC DESKTOP</small>
            </div>
          </div>

          <div className="signature-retro-status">
            <span className="retro-status-light" />
            System running smoothly
          </div>

          <div className="signature-stat">
            <span>Operating system</span>
            <strong>Retro Windows</strong>
          </div>

          <div className="signature-stat">
            <span>Desktop shell</span>
            <strong>DesktopRealm</strong>
          </div>

          <div className="signature-stat">
            <span>Session status</span>
            <strong>Active</strong>
          </div>

          <div className="signature-footer">
            <Sparkles size={12} />
            Made for a little nostalgia.
          </div>
        </>
      )}

      {os === "arcade" && (
        <>
          <div className="signature-heading">
            <span className="signature-icon">
              <Trophy size={17} />
            </span>
            <div>
              <strong>ARCADE CHALLENGE</strong>
              <small>PLAYER 01 · READY</small>
            </div>
          </div>

          <div className="arcade-score">
            <span>YOUR SCORE</span>
            <strong>{String(score).padStart(4, "0")}</strong>
          </div>

          <button
            className="signature-action arcade-action"
            onClick={() => setScore((previous) => previous + 10)}
          >
            <Zap size={15} />
            TAP TO SCORE +10
          </button>

          <div className="signature-footer">
            <Play size={12} />
            Keep playing. Beat your record!
          </div>
        </>
      )}

      {os === "dream" && (
        <>
          <div className="signature-heading">
            <span className="signature-icon">
              <Heart size={17} />
            </span>
            <div>
              <strong>Your little moodboard</strong>
              <small>A MOMENT FOR YOURSELF</small>
            </div>
          </div>

          <p className="dream-prompt">
            How are you feeling today?
          </p>

          <div className="dream-moods">
            {moods.map((item) => (
              <button
                key={item.label}
                className={mood === item.label ? "mood-active" : ""}
                onClick={() => setMood(item.label)}
                aria-pressed={mood === item.label}
              >
                <span>{item.emoji}</span>
                <small>{item.label}</small>
              </button>
            ))}
          </div>

          <div className="dream-mood-result">
            <Sparkles size={13} />
            Today's mood: <strong>{mood}</strong>
          </div>

          <div className="signature-footer">
            A little check-in with yourself.
          </div>
        </>
      )}

      {os === "nexus" && (
        <>
          <div className="signature-heading">
            <span className="signature-icon">
              <Activity size={17} />
            </span>
            <div>
              <strong>NETWORK CONSOLE</strong>
              <small>NEXUS DIAGNOSTICS</small>
            </div>
          </div>

          <div className="nexus-status">
            <span className="nexus-status-light" />
            SIMULATION ENVIRONMENT
          </div>

          <div className="nexus-metric">
            <span>
              <Wifi size={13} /> Connectivity
            </span>
            <strong>STABLE</strong>
          </div>

          <div className="nexus-metric">
            <span>
              <Gauge size={13} /> Signal quality
            </span>
            <strong>OPTIMAL</strong>
          </div>

          <div className="nexus-metric">
            <span>
              <Radio size={13} /> Network state
            </span>
            <strong>ONLINE</strong>
          </div>

          <button
            className="signature-action nexus-action"
            onClick={() => setDiagnosticsRun(true)}
          >
            <Activity size={14} />
            RUN DIAGNOSTICS
          </button>

          {diagnosticsRun && (
            <div className="nexus-result">
              <span>✓ Diagnostic simulation complete</span>
              <small>No simulated faults detected.</small>
            </div>
          )}

          <div className="signature-footer">
            <Cpu size={12} />
            DesktopRealm virtual environment
          </div>
        </>
      )}
    </aside>
  );
}
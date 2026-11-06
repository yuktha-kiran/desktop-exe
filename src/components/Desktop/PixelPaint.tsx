import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Pencil, Eraser, Minus, Square, Circle, Undo2, Redo2,
  Download, Trash2, Paintbrush, Palette, Check
} from "lucide-react";
import "./PixelPaint.css";
type Tool = "pencil" | "eraser" | "line" | "rectangle" | "circle";
const COLORS = [
  "#202020", "#FFFFFF", "#F44336", "#FF9800",
  "#FFEB3B", "#4CAF50", "#00BCD4", "#2196F3",
  "#3F51B5", "#9C27B0", "#E91E63", "#795548",
  "#9E9E9E", "#607D8B", "#FF80AB", "#80CBC4"
];
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 620;
export default function PixelPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);
  const undoRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState("#202020");
  const [customColor, setCustomColor] = useState("#202020");
  const [brushSize, setBrushSize] = useState(5);
  const [background, setBackground] = useState("#ffffff");
  const [, setHistoryVersion] = useState(0);
  const [canvasName, setCanvasName] = useState("Untitled Artwork");
  const ctx = () => canvasRef.current?.getContext("2d");
  // Initialise a transparent drawing canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, []);
  // Save current canvas state for undo.
  const saveSnapshot = () => {
    const context = ctx();
    if (!context) return;
    undoRef.current.push(
      context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    );
    if (undoRef.current.length > 40) {
      undoRef.current.shift();
    }
    redoRef.current = [];
    setHistoryVersion(v => v + 1);
  };
  // Undo.
  const undo = () => {
    const context = ctx();
    if (!context || undoRef.current.length === 0) return;
    redoRef.current.push(
      context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    );
    const previous = undoRef.current.pop();
    if (previous) {
      context.putImageData(previous, 0, 0);
    }
    setHistoryVersion(v => v + 1);
  };
  // Redo.
  const redo = () => {
    const context = ctx();
    if (!context || redoRef.current.length === 0) return;
    undoRef.current.push(
      context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    );
    const next = redoRef.current.pop();
    if (next) {
      context.putImageData(next, 0, 0);
    }
    setHistoryVersion(v => v + 1);
  };
  // Convert pointer position into canvas coordinates.
  const getPosition = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    };
  };
  // Configure drawing properties.
  const configureBrush = (context: CanvasRenderingContext2D) => {
    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";
    context.strokeStyle = color;
    context.fillStyle = color;
  };
  // Draw geometric shapes.
  const drawShape = (
    context: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    context.beginPath();
    if (tool === "line") {
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
    if (tool === "rectangle") {
      context.strokeRect(
        from.x,
        from.y,
        to.x - from.x,
        to.y - from.y
      );
    }
    if (tool === "circle") {
      const radius = Math.sqrt(
        Math.pow(to.x - from.x, 2) +
        Math.pow(to.y - from.y, 2)
      );
      context.arc(from.x, from.y, radius, 0, Math.PI * 2);
      context.stroke();
    }
  };
  // Start drawing.
  const startDrawing = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    const context = ctx();
    if (!canvas || !context) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    saveSnapshot();
    const position = getPosition(e);
    drawingRef.current = true;
    startRef.current = position;
    snapshotRef.current = context.getImageData(
      0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
    );
    configureBrush(context);
    if (tool === "pencil" || tool === "eraser") {
      context.beginPath();
      context.moveTo(position.x, position.y);
      context.lineTo(position.x + 0.1, position.y + 0.1);
      context.stroke();
    }
  };
  // Continue drawing.
  const draw = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const context = ctx();
    if (!context) return;
    e.preventDefault();
    const position = getPosition(e);
    configureBrush(context);
    if (tool === "pencil" || tool === "eraser") {
      context.lineTo(position.x, position.y);
      context.stroke();
      return;
    }
    if (snapshotRef.current) {
      context.putImageData(snapshotRef.current, 0, 0);
      drawShape(context, startRef.current, position);
    }
  };
  // Stop drawing.
  const stopDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    snapshotRef.current = null;
    const context = ctx();
    if (context) {
      context.globalCompositeOperation = "source-over";
    }
    setHistoryVersion(v => v + 1);
  };
  // Clear canvas.
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = ctx();
    if (!canvas || !context) return;
    saveSnapshot();
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.globalCompositeOperation = "source-over";
    setHistoryVersion(v => v + 1);
  };
  // Change visible canvas background without destroying artwork.
  const changeBackground = (value: string) => {
    setBackground(value);
  };
  // Export artwork with selected background.
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const output = document.createElement("canvas");
    output.width = CANVAS_WIDTH;
    output.height = CANVAS_HEIGHT;
    const context = output.getContext("2d");
    if (!context) return;
    context.fillStyle = background;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(canvas, 0, 0);
    const link = document.createElement("a");
    link.download = `${
      canvasName.trim().replace(/[^a-z0-9-_ ]/gi, "") || "pixel-art"
    }.png`;
    link.href = output.toDataURL("image/png");
    link.click();
  };
  const tools: {
    id: Tool;
    label: string;
    icon: typeof Pencil;
  }[] = [
    { id: "pencil", label: "Pencil", icon: Pencil },
    { id: "eraser", label: "Eraser", icon: Eraser },
    { id: "line", label: "Line", icon: Minus },
    { id: "rectangle", label: "Rectangle", icon: Square },
    { id: "circle", label: "Circle", icon: Circle },
  ];
  return (
    <div className="pixel-paint">
      {/* TOP BAR */}
      <div className="paint-topbar">
        <div className="paint-document">
          <Paintbrush size={17} />
          <input
            value={canvasName}
            onChange={e => setCanvasName(e.target.value)}
            aria-label="Artwork name"
          />
        </div>
        <div className="paint-history">
          <button
            onClick={undo}
            disabled={undoRef.current.length === 0}
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={redoRef.current.length === 0}
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
          <span className="paint-divider" />
          <button onClick={clearCanvas} title="Clear canvas">
            <Trash2 size={16} />
          </button>
          <button className="paint-export" onClick={exportPNG}>
            <Download size={15} />
            Export PNG
          </button>
        </div>
      </div>
      {/* WORKSPACE */}
      <div className="paint-workspace">
        {/* TOOLBAR */}
        <aside className="paint-toolbar">
          <span className="paint-section-label">TOOLS</span>
          <div className="paint-tool-grid">
            {tools.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={tool === item.id ? "active" : ""}
                  onClick={() => setTool(item.id)}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon size={19} />
                </button>
              );
            })}
          </div>
          <div className="paint-tool-divider" />
          <span className="paint-section-label">BRUSH</span>
          <div className="paint-brush-preview">
            <span
              style={{
                width: Math.min(brushSize * 2, 35),
                height: Math.min(brushSize * 2, 35),
                background: tool === "eraser" ? "#cbd2dc" : color,
              }}
            />
          </div>
          <input
            className="paint-size-slider"
            type="range"
            min="1"
            max="35"
            value={brushSize}
            onChange={e => setBrushSize(Number(e.target.value))}
            aria-label="Brush size"
          />
          <span className="paint-size-value">{brushSize}px</span>
          <div className="paint-tool-divider" />
          <span className="paint-section-label">CANVAS</span>
          <div className="paint-backgrounds">
            {[
              { value: "#ffffff", label: "White" },
              { value: "#fff4e9", label: "Cream" },
              { value: "#20212b", label: "Dark" },
              { value: "#f7dce9", label: "Pink" },
            ].map(item => (
              <button
                key={item.value}
                title={item.label}
                className={background === item.value ? "selected" : ""}
                style={{ background: item.value }}
                onClick={() => changeBackground(item.value)}
              />
            ))}
          </div>
        </aside>
        {/* CANVAS */}
        <section className="paint-canvas-area">
          <div className="paint-canvas-header">
            <div>
              <span className="paint-canvas-dot" />
              <span>ARTBOARD</span>
            </div>
            <span>1000 × 620 PX</span>
          </div>
          <div className="paint-canvas-scroll">
            <div className="paint-canvas-frame">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{ backgroundColor: background }}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                onLostPointerCapture={stopDrawing}
              />
            </div>
          </div>
          <div className="paint-canvas-footer">
            <span>✦ Your imagination, your canvas.</span>
            <span>PNG EXPORT READY</span>
          </div>
        </section>
        {/* COLOUR PANEL */}
        <aside className="paint-colors">
          <div className="paint-color-heading">
            <Palette size={16} />
            <span>COLOURS</span>
          </div>
          <div className="paint-current-color">
            <span style={{ background: color }} />
            <div>
              <strong>{color.toUpperCase()}</strong>
              <small>ACTIVE COLOUR</small>
            </div>
          </div>
          <div className="paint-palette">
            {COLORS.map(value => (
              <button
                key={value}
                className={
                  color.toLowerCase() === value.toLowerCase()
                    ? "selected"
                    : ""
                }
                style={{ background: value }}
                onClick={() => {
                  setColor(value);
                  setCustomColor(value);
                  setTool("pencil");
                }}
                title={value}
                aria-label={`Choose ${value}`}
              />
            ))}
          </div>
          <div className="paint-custom-color">
            <span className="paint-section-label">CUSTOM COLOUR</span>
            <label>
              <input
                type="color"
                value={customColor}
                onChange={e => {
                  setCustomColor(e.target.value);
                  setColor(e.target.value);
                  setTool("pencil");
                }}
              />
              <span>Choose colour</span>
            </label>
          </div>
          <div className="paint-tip">
            <span>✦ QUICK TIP</span>
            <p>
              Choose a tool, pick a colour and start creating!
            </p>
          </div>
        </aside>
      </div>
      {/* STATUS BAR */}
      <div className="paint-statusbar">
        <span>
          <Check size={12} /> All changes are on your canvas
        </span>
        <span>TOOL: {tool.toUpperCase()}</span>
        <span>BRUSH: {brushSize}px</span>
      </div>
    </div>
  );
}

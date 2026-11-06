import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Folder, FileText, Calculator, Music, Palette, Globe,
  CalendarDays, Images, Gamepad2, Camera, Settings,
  Monitor, Search, Power, Wifi, Volume2, Battery,
  X, Minus, Square, ChevronRight, RefreshCw,
  Trash2, HardDrive, User, Sparkles, Command,
  ChevronLeft, Plus, Download, Check, Clock,
  Trash, NotebookPen, CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import "./Desktop.css";
import "./DesktopApps.css";
import PixelPaint from "./PixelPaint";
import FictionalBrowser from "./FictionalBrowser";
type OSId = "retro" | "arcade" | "dream" | "nexus";
type AppInfo = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
};
type DesktopWindow = {
  id: string;
  app: AppInfo;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
};
type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};
type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  color: string;
};
type Props = {
  os: OSId;
  onExit: () => void;
};
const apps: AppInfo[] = [
  { id: "files", name: "File Explorer", icon: Folder, description: "Browse your digital files and folders." },
  { id: "notepad", name: "Notepad", icon: FileText, description: "A little space for your thoughts." },
  { id: "calculator", name: "Calculator", icon: Calculator, description: "Your everyday calculator." },
  { id: "music", name: "Media Player", icon: Music, description: "Your favourite sounds, all in one place." },
  { id: "paint", name: "Pixel Paint", icon: Palette, description: "Create something wonderful." },
  { id: "browser", name: "Internet Explorer", icon: Globe, description: "Explore your fictional internet." },
  { id: "calendar", name: "Calendar", icon: CalendarDays, description: "Your days, beautifully organised." },
  { id: "gallery", name: "Photo Gallery", icon: Images, description: "A home for your favourite memories." },
  { id: "games", name: "Games", icon: Gamepad2, description: "Take a little break." },
  { id: "camera", name: "Camera.exe", icon: Camera, description: "Capture the moment." },
  { id: "settings", name: "Control Panel", icon: Settings, description: "Make this world yours." },
];
const osNames: Record<OSId, string> = {
  retro: "Retro Windows",
  arcade: "Arcade.exe",
  dream: "DreamOS",
  nexus: "Nexus OS",
};
const wallpapers: Record<OSId, string[]> = {
  retro: ["Bliss", "Classic Blue", "Midnight"],
  arcade: ["Neon Grid", "Pixel Night", "Arcade Purple"],
  dream: ["Pink Clouds", "Dream Garden", "Lavender Sky"],
  nexus: ["Deep Space", "Neural Grid", "Cyber Horizon"],
};
const NOTE_KEY = "desktop-verse-notes-v1";
const EVENT_KEY = "desktop-verse-events-v1";
const eventColors = [
  "#5C9FE8",
  "#E78AB9",
  "#77B88B",
  "#A18BE5",
  "#E5A65D",
];
const dateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
const readNotes = (): Note[] => {
  try {
    const saved = localStorage.getItem(NOTE_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: "welcome-note",
        title: "Welcome to Notepad",
        content: "Welcome to your little digital workspace! ✨\n\nStart writing your thoughts here. Your notes will be saved automatically.",
        updatedAt: new Date().toISOString(),
      },
    ];
  } catch {
    return [];
  }
};
const readEvents = (): CalendarEvent[] => {
  try {
    const saved = localStorage.getItem(EVENT_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};
export default function Desktop({ os, onExit }: Props) {
  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(new Date());
  const [wallpaper, setWallpaper] = useState(0);
  const [dragging, setDragging] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [calcValue, setCalcValue] = useState("0");
  const [volume, setVolume] = useState(65);
  const [showTray, setShowTray] = useState(false);
  const [notes, setNotes] = useState<Note[]>(readNotes);
  const [activeNoteId, setActiveNoteId] = useState("welcome-note");
  const [events, setEvents] = useState<CalendarEvent[]>(readEvents);
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("09:00");
  const [eventColor, setEventColor] = useState(eventColors[0]);
  const [showEventForm, setShowEventForm] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const closeMenu = () => {
      setContextMenu(null);
      setShowTray(false);
    };
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(NOTE_KEY, JSON.stringify(notes));
    } catch {
      console.warn("Unable to save notes in local storage.");
    }
  }, [notes]);
  useEffect(() => {
    try {
      localStorage.setItem(EVENT_KEY, JSON.stringify(events));
    } catch {
      console.warn("Unable to save calendar events in local storage.");
    }
  }, [events]);
  const nextZIndex = () =>
    Math.max(1, ...windows.map((w) => w.zIndex)) + 1;
  const openApp = (app: AppInfo) => {
    const existing = windows.find((w) => w.app.id === app.id);
    if (existing) {
      const z = nextZIndex();
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, zIndex: z } : w
        )
      );
      setActiveId(existing.id);
    } else {
      const id = `${app.id}-${Date.now()}`;
      const z = nextZIndex();
      setWindows((prev) => [
        ...prev,
        {
          id,
          app,
          x: 110 + prev.length * 28,
          y: 75 + prev.length * 25,
          width:
            app.id === "paint" ? 720 :
            app.id === "browser" ? 760 :
            app.id === "calendar" ? 720 :
            app.id === "notepad" ? 650 :
            540,
          height:
            app.id === "calendar" ? 570 :
            app.id === "notepad" ? 480 :
            410,
          zIndex: z,
          minimized: false,
          maximized: false,
        },
      ]);
      setActiveId(id);
    }
    setStartOpen(false);
    setContextMenu(null);
    setSearch("");
  };
  const updateWindow = (id: string, changes: Partial<DesktopWindow>) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...changes } : w))
    );
  };
  const focusWindow = (id: string) => {
    const z = nextZIndex();
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, zIndex: z, minimized: false } : w
      )
    );
    setActiveId(id);
  };
  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeId === id) setActiveId(null);
  };
  const minimizeWindow = (id: string) => {
    updateWindow(id, { minimized: true });
    if (activeId === id) setActiveId(null);
  };
  const toggleMaximize = (id: string) => {
    const current = windows.find((w) => w.id === id);
    if (current) updateWindow(id, { maximized: !current.maximized });
  };
  useEffect(() => {
    if (!dragging) return;
    const move = (e: globalThis.MouseEvent) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === dragging.id
            ? {
                ...w,
                x: Math.max(0, Math.min(window.innerWidth - 160, e.clientX - dragging.offsetX)),
                y: Math.max(0, Math.min(window.innerHeight - 110, e.clientY - dragging.offsetY)),
              }
            : w
        )
      );
    };
    const stop = () => setDragging(null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };
  }, [dragging]);
  const startDrag = (e: MouseEvent, w: DesktopWindow) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (w.maximized) return;
    focusWindow(w.id);
    setDragging({
      id: w.id,
      offsetX: e.clientX - w.x,
      offsetY: e.clientY - w.y,
    });
  };
  const handleDesktopContext = (e: MouseEvent) => {
    if (
      (e.target as HTMLElement).closest(
        ".desktop-icon, .desktop-window, .taskbar, .start-menu"
      )
    ) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };
  const calculate = (key: string) => {
    if (key === "C") {
      setCalcValue("0");
      return;
    }
    if (key === "=") {
      try {
        const expression = calcValue
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/−/g, "-");
        if (!/^[0-9+*\/. ()-]+$/.test(expression)) {
          setCalcValue("Error");
          return;
        }
        const result = Function(`"use strict"; return (${expression})`)();
        setCalcValue(
          Number.isFinite(result) ? String(Number(result.toFixed(8))) : "Error"
        );
      } catch {
        setCalcValue("Error");
      }
      return;
    }
    setCalcValue((prev) =>
      prev === "0" || prev === "Error" ? key : prev + key
    );
  };
  // NOTEPAD FUNCTIONS
  const activeNote = notes.find((n) => n.id === activeNoteId) ?? notes[0];
  const createNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: `Untitled ${notes.length + 1}`,
      content: "",
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, newNote]);
    setActiveNoteId(newNote.id);
  };
  const updateActiveNote = (changes: Partial<Note>) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? { ...n, ...changes, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };
  const deleteActiveNote = () => {
    if (!activeNote) return;
    if (notes.length === 1) {
      const blankNote: Note = {
        id: `note-${Date.now()}`,
        title: "Untitled",
        content: "",
        updatedAt: new Date().toISOString(),
      };
      setNotes([blankNote]);
      setActiveNoteId(blankNote.id);
      return;
    }
    const remaining = notes.filter((n) => n.id !== activeNote.id);
    setNotes(remaining);
    setActiveNoteId(remaining[0].id);
  };
  const downloadNote = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeNote.title || "note"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };
  // CALENDAR FUNCTIONS
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();
  const calendarCells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);
  const selectedEvents = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));
  const addEvent = () => {
    if (!eventTitle.trim()) return;
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: eventTitle.trim(),
      date: selectedDate,
      time: eventTime,
      color: eventColor,
    };
    setEvents((prev) => [...prev, newEvent]);
    setEventTitle("");
    setEventTime("09:00");
    setShowEventForm(false);
  };
  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };
  const changeMonth = (direction: number) => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + direction,
        1
      )
    );
  };
  const goToToday = () => {
    const today = new Date();
    setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(dateKey(today));
  };
  const wallpaperClass = `${os}-wallpaper-${wallpaper}`;
  const renderNotepad = () => (
    <div className={`notepad-app os-${os}`}>
      <div className="notepad-header">
        <div className="notepad-brand">
          <NotebookPen size={17} />
          <span>My Notes</span>
        </div>
        <div className="notepad-actions">
          <button onClick={createNote} title="New note">
            <Plus size={16} />
            New
          </button>
          <button onClick={downloadNote} title="Download TXT" disabled={!activeNote}>
            <Download size={15} />
            Export
          </button>
          <button onClick={deleteActiveNote} title="Delete note" disabled={!activeNote}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="notepad-tabs">
        {notes.map((n) => (
          <button
            key={n.id}
            className={activeNoteId === n.id ? "active" : ""}
            onClick={() => setActiveNoteId(n.id)}
          >
            <FileText size={13} />
            <span>{n.title || "Untitled"}</span>
          </button>
        ))}
      </div>
      {activeNote ? (
        <div className="notepad-editor">
          <input
            className="notepad-title-input"
            value={activeNote.title}
            onChange={(e) => updateActiveNote({ title: e.target.value })}
            placeholder="Note title..."
          />
          <textarea
            value={activeNote.content}
            onChange={(e) => updateActiveNote({ content: e.target.value })}
            placeholder="Start writing something wonderful..."
            spellCheck
          />
          <div className="notepad-status">
            <span>
              {activeNote.content.length} characters ·{" "}
              {activeNote.content.trim()
                ? activeNote.content.trim().split(/\s+/).length
                : 0}{" "}
              words
            </span>
            <span><Check size={12} /> Autosaved</span>
          </div>
        </div>
      ) : null}
    </div>
  );
  const renderCalendar = () => (
    <div className={`calendar-app os-${os}`}>
      <div className="calendar-heading">
        <div>
          <span className="calendar-eyebrow">YOUR PERSONAL PLANNER</span>
          <h2>
            {calendarMonth.toLocaleDateString([], {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
        <div className="calendar-navigation">
          <button onClick={() => changeMonth(-1)} aria-label="Previous month">
            <ChevronLeft size={17} />
          </button>
          <button onClick={goToToday}>Today</button>
          <button onClick={() => changeMonth(1)} aria-label="Next month">
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <div className="calendar-layout">
        <div className="calendar-main">
          <div className="calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {calendarCells.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="calendar-day empty" />;
              }
              const current = new Date(
                calendarMonth.getFullYear(),
                calendarMonth.getMonth(),
                day
              );
              const key = dateKey(current);
              const isToday = key === dateKey(new Date());
              const isSelected = key === selectedDate;
              const dayEvents = events.filter((event) => event.date === key);
              return (
                <button
                  key={key}
                  className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedDate(key);
                    setShowEventForm(false);
                  }}
                >
                  <span className="calendar-day-number">{day}</span>
                  <span className="calendar-event-dots">
                    {dayEvents.slice(0, 3).map((event) => (
                      <i key={event.id} style={{ background: event.color }} />
                    ))}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="calendar-day-count">
                      {dayEvents.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="calendar-legend">
            <span><i /> Today</span>
            <span><i className="legend-event" /> Scheduled events</span>
          </div>
        </div>
        <aside className="calendar-sidebar">
          <div className="calendar-selected-date">
            <span>SELECTED DATE</span>
            <strong>
              {new Date(`${selectedDate}T12:00:00`).toLocaleDateString([], {
                weekday: "long",
              })}
            </strong>
            <h3>
              {new Date(`${selectedDate}T12:00:00`).getDate()}
              <small>
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString([], {
                  month: "short",
                  year: "numeric",
                })}
              </small>
            </h3>
          </div>
          <div className="calendar-events-heading">
            <strong>My events</strong>
            <button onClick={() => setShowEventForm(!showEventForm)}>
              <Plus size={15} />
            </button>
          </div>
          {showEventForm && (
            <div className="calendar-event-form">
              <input
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="What are you planning?"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") addEvent();
                }}
              />
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
              <div className="event-color-picker">
                {eventColors.map((color) => (
                  <button
                    key={color}
                    className={eventColor === color ? "chosen" : ""}
                    style={{ background: color }}
                    onClick={() => setEventColor(color)}
                    aria-label={`Select event colour ${color}`}
                  />
                ))}
              </div>
              <button className="add-event-button" onClick={addEvent}>
                <Check size={14} /> Save event
              </button>
            </div>
          )}
          <div className="calendar-event-list">
            {selectedEvents.length === 0 ? (
              <div className="calendar-empty">
                <CalendarCheck size={26} />
                <p>No events scheduled</p>
                <span>Add something to your day!</span>
              </div>
            ) : (
              selectedEvents.map((event) => (
                <div className="calendar-event-item" key={event.id}>
                  <i style={{ background: event.color }} />
                  <div>
                    <strong>{event.title}</strong>
                    <span><Clock size={11} /> {event.time}</span>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    aria-label="Delete event"
                  >
                    <Trash size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
      <div className="calendar-footer">
        <span><Check size={12} /> Events save automatically</span>
        <span>{events.length} total events</span>
      </div>
    </div>
  );
  const renderAppContent = (w: DesktopWindow) => {
    switch (w.app.id) {
      case "notepad":
        return renderNotepad();
      case "calendar":
        return renderCalendar();
      case "paint":
  return <PixelPaint />;
      case "calculator":
        return (
          <div className="calculator-content">
            <div className="calculator-display">{calcValue}</div>
            <div className="calculator-grid">
              {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "C", "0", "=", "+"].map((key) => (
                <button key={key} onClick={() => calculate(key)}>{key}</button>
              ))}
            </div>
          </div>
        );
      case "files":
        return (
          <div className="explorer-content">
            <div className="explorer-path">
              <HardDrive size={15} /> This PC <ChevronRight size={13} /> My Files
            </div>
            <div className="explorer-grid">
              {["Documents", "Pictures", "Music", "Downloads", "Desktop", "My Notes"].map((folder, i) => {
                const icons = [Folder, Images, Music, HardDrive, Monitor, FileText];
                const Icon = icons[i];
                return (
                  <button key={folder} className="explorer-folder">
                    <Icon size={28} /><span>{folder}</span>
                  </button>
                );
              })}
            </div>
            <p className="explorer-hint">Your personal workspace. Full file management is coming next.</p>
          </div>
        );
      case "settings":
        return (
          <div className="settings-content">
            <h3>Personalise your world</h3>
            <p>Choose a desktop wallpaper.</p>
            <div className="wallpaper-options">
              {wallpapers[os].map((name, i) => (
                <button
                  key={name}
                  className={wallpaper === i ? "active" : ""}
                  onClick={() => setWallpaper(i)}
                >
                  <span className={`wallpaper-swatch ${os}-wallpaper-${i}`} />
                  {name}
                </button>
              ))}
            </div>
            <p className="settings-note">
              Your current operating system: <strong>{osNames[os]}</strong>
            </p>
            <button className="exit-os-button" onClick={onExit}>Switch operating system</button>
          </div>
        );
      case "browser":
        return <FictionalBrowser os={os} />;
      default: {
        const AppIcon = w.app.icon;
        return (
          <div className="placeholder-app">
            <div className="placeholder-icon"><AppIcon size={42} /></div>
            <h3>{w.app.name}</h3>
            <p>{w.app.description}</p>
            <span>APPLICATION INITIALISED</span>
          </div>
        );
      }
    }
  };
  return (
    <main
      className={`desktop-environment os-${os} ${wallpaperClass}`}
      onContextMenu={handleDesktopContext}
    >
      <div className="desktop-top-widget">
        <span className="desktop-os-label"><Sparkles size={13} /> {osNames[os]}</span>
        <span className="desktop-greeting">Your little corner of the internet.</span>
      </div>
      <div className="desktop-icons">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              className={`desktop-icon ${selectedIcon === app.id ? "icon-selected" : ""}`}
              onClick={() => setSelectedIcon(app.id)}
              onDoubleClick={() => openApp(app)}
            >
              <div className="desktop-icon-art"><Icon size={29} strokeWidth={1.6} /></div>
              <span>{app.name}</span>
            </button>
          );
        })}
        <button className="desktop-icon" onDoubleClick={() => openApp(apps[0])}>
          <div className="desktop-icon-art recycle"><Trash2 size={29} /></div>
          <span>Recycle Bin</span>
        </button>
      </div>
      <AnimatePresence>
        {windows.filter((w) => !w.minimized).map((w) => {
          const Icon = w.app.icon;
          const active = activeId === w.id;
          return (
            <motion.section
              key={w.id}
              className={`desktop-window ${active ? "window-active" : ""}`}
              style={{
                left: w.maximized ? 0 : w.x,
                top: w.maximized ? 0 : w.y,
                width: w.maximized ? "100%" : w.width,
                height: w.maximized ? "calc(100% - 48px)" : w.height,
                zIndex: w.zIndex,
              }}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              onMouseDown={() => focusWindow(w.id)}
            >
              <div
                className="window-titlebar"
                onMouseDown={(e) => startDrag(e, w)}
                onDoubleClick={() => toggleMaximize(w.id)}
              >
                <div className="window-title"><Icon size={16} /><span>{w.app.name}</span></div>
                <div className="window-controls">
                  <button aria-label="Minimise" onClick={() => minimizeWindow(w.id)}><Minus size={13} /></button>
                  <button aria-label="Maximise" onClick={() => toggleMaximize(w.id)}><Square size={11} /></button>
                  <button className="window-close" aria-label="Close" onClick={() => closeWindow(w.id)}><X size={14} /></button>
                </div>
              </div>
              <div className="window-body">{renderAppContent(w)}</div>
              <div className="window-resize-handle" />
            </motion.section>
          );
        })}
      </AnimatePresence>
      {contextMenu && (
        <div
          className="desktop-context-menu"
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - 215),
            top: Math.min(contextMenu.y, window.innerHeight - 160),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => { setWallpaper((wallpaper + 1) % 3); setContextMenu(null); }}>
            <RefreshCw size={14} /> Refresh desktop
          </button>
          <button onClick={() => openApp(apps[10])}><Settings size={14} /> Personalise</button>
          <button onClick={() => openApp(apps[0])}><Folder size={14} /> Open File Explorer</button>
          <div className="context-divider" />
          <button onClick={() => { setStartOpen(true); setContextMenu(null); }}>
            <Command size={14} /> Open launcher
          </button>
        </div>
      )}
      <AnimatePresence>
        {startOpen && (
          <motion.div
            className="start-menu"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="start-menu-header">
              <div className="start-avatar"><User size={23} /></div>
              <div><strong>Welcome back!</strong><span>{osNames[os]}</span></div>
            </div>
            <div className="start-search">
              <Search size={15} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applications..." />
            </div>
            <span className="start-section-label">ALL APPLICATIONS</span>
            <div className="start-app-list">
              {apps.filter((app) => app.name.toLowerCase().includes(search.toLowerCase())).map((app) => {
                const Icon = app.icon;
                return (
                  <button key={app.id} onClick={() => openApp(app)}>
                    <Icon size={19} /><span>{app.name}</span><ChevronRight size={13} />
                  </button>
                );
              })}
            </div>
            <div className="start-menu-footer">
              <span><Monitor size={15} /> {osNames[os]}</span>
              <button onClick={onExit}><Power size={16} /> Switch OS</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTray && (
          <motion.div
            className="system-tray-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <strong>Quick settings</strong>
            <div className="tray-row"><Wifi size={17} /> Wi-Fi <span>Connected</span></div>
            <div className="tray-row">
              <Volume2 size={17} /> Volume
              <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
            </div>
            <div className="tray-row"><Battery size={17} /> Battery <span>100%</span></div>
            <div className="tray-time">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            <div className="tray-date">{time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="desktop-taskbar">
        <button
          className={`start-button ${startOpen ? "start-active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setStartOpen(!startOpen);
            setShowTray(false);
          }}
        >
          <div className="start-symbol"><Monitor size={18} /></div>
          <span>{os === "arcade" ? "START GAME" : os === "dream" ? "MY WORLD" : os === "nexus" ? "NEXUS" : "START"}</span>
        </button>
        <div className="taskbar-apps">
          {windows.map((w) => {
            const Icon = w.app.icon;
            return (
              <button
                key={w.id}
                className={`taskbar-app ${activeId === w.id && !w.minimized ? "taskbar-active" : ""}`}
                onClick={() => {
                  if (w.minimized) focusWindow(w.id);
                  else if (activeId === w.id) minimizeWindow(w.id);
                  else focusWindow(w.id);
                }}
              >
                <Icon size={16} /><span>{w.app.name}</span>
              </button>
            );
          })}
        </div>
        <button
          className="taskbar-tray"
          onClick={(e) => {
            e.stopPropagation();
            setShowTray(!showTray);
            setStartOpen(false);
          }}
        >
          <Wifi size={14} /><Volume2 size={14} /><Battery size={15} />
          <div className="taskbar-clock">
            <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <small>{time.toLocaleDateString([], { day: "2-digit", month: "2-digit" })}</small>
          </div>
        </button>
      </footer>
    </main>
  );
}

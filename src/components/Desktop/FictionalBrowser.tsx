import { useMemo, useState, type FormEvent } from "react";
import "./FictionalBrowser.css";
import {
  ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, Compass, ExternalLink,
  Globe, Heart, Home, Menu, Music2, Newspaper, Plus, Search, Send, Settings2,
  Sparkles, Star, UserRound, X
} from "lucide-react";

type OSId = "retro" | "arcade" | "dream" | "nexus";
type SiteId = "webwonder" | "pixeltown" | "moodboard" | "myspace" | "daily";

type BrowserTab = { id: number; site: SiteId; title: string };
type Post = { id: number; author: string; handle: string; text: string; likes: number; time: string };

const siteInfo: Record<SiteId, { title: string; url: string; icon: typeof Globe }> = {
  webwonder: { title: "WebWonder", url: "https://webwonder.exe", icon: Search },
  pixeltown: { title: "PixelTown", url: "https://pixeltown.exe", icon: Heart },
  moodboard: { title: "Moodboard.fm", url: "https://moodboard.fm", icon: Music2 },
  myspace: { title: "MySpace 2005", url: "https://myspace.exe", icon: UserRound },
  daily: { title: "Daily.exe", url: "https://daily.exe", icon: Newspaper },
};

const starterPosts: Post[] = [
  { id: 1, author: "Mia Chen", handle: "@miac", text: "made a playlist for rainy bus rides and pretending i'm in a coming-of-age movie ☔", likes: 28, time: "12 min ago" },
  { id: 2, author: "pixel princess", handle: "@starry.exe", text: "tiny reminder: you are allowed to start over as many times as you need ✨", likes: 46, time: "38 min ago" },
  { id: 3, author: "Alex Rivera", handle: "@alex.jpg", text: "found a digital camera at a flea market. the flash photos are EVERYTHING.", likes: 19, time: "1 hr ago" },
];

const articles = [
  { category: "CULTURE", title: "The internet is getting its personality back", summary: "Why tiny communities, personal pages and weird little corners of the web are having a moment.", time: "4 min read" },
  { category: "TECH", title: "A beginner's guide to your digital garden", summary: "Build a corner of the internet that feels like yours, one page at a time.", time: "6 min read" },
  { category: "LIFESTYLE", title: "Make an ordinary Tuesday feel cinematic", summary: "A playlist, a camera roll and five small ways to romanticise your routine.", time: "3 min read" },
];

export default function FictionalBrowser({ os }: { os: OSId }) {
  const [tabs, setTabs] = useState<BrowserTab[]>([{ id: 1, site: "webwonder", title: "WebWonder" }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [history, setHistory] = useState<SiteId[]>(["webwonder"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [address, setAddress] = useState(siteInfo.webwonder.url);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>(() => {
    try { return JSON.parse(localStorage.getItem("desktop-exe-pixeltown-posts") || "null") || starterPosts; }
    catch { return starterPosts; }
  });
  const [postText, setPostText] = useState("");
  const [liked, setLiked] = useState<number[]>([]);
  const [mood, setMood] = useState("dreamy");
  const [playing, setPlaying] = useState("Space Song");
  const [profileName, setProfileName] = useState(() => localStorage.getItem("desktop-exe-myspace-name") || "your name here");
  const [profileBio, setProfileBio] = useState(() => localStorage.getItem("desktop-exe-myspace-bio") || "collecting moments & making memories ✿");
  const [editingProfile, setEditingProfile] = useState(false);
  const [bookmarks, setBookmarks] = useState<SiteId[]>(["pixeltown", "moodboard", "daily"]);
  const [dailyCategory, setDailyCategory] = useState("ALL");

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  const currentSite = activeTab.site;
  const currentInfo = siteInfo[currentSite];

  const navigate = (site: SiteId, push = true) => {
    setTabs((prev) => prev.map((tab) => tab.id === activeTabId ? { ...tab, site, title: siteInfo[site].title } : tab));
    setAddress(siteInfo[site].url);
    if (push) {
      const next = history.slice(0, historyIndex + 1);
      next.push(site);
      setHistory(next);
      setHistoryIndex(next.length - 1);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      navigate(history[nextIndex], false);
    }
  };
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      navigate(history[nextIndex], false);
    }
  };
  const newTab = () => {
    const id = Date.now();
    setTabs((prev) => [...prev, { id, site: "webwonder", title: "New tab" }]);
    setActiveTabId(id);
    setAddress(siteInfo.webwonder.url);
    setHistory(["webwonder"]);
    setHistoryIndex(0);
  };
  const closeTab = (id: number) => {
    if (tabs.length === 1) {
      setTabs([{ id: 1, site: "webwonder", title: "WebWonder" }]);
      setActiveTabId(1);
      setHistory(["webwonder"]);
      setHistoryIndex(0);
      setAddress(siteInfo.webwonder.url);
      return;
    }
    const remaining = tabs.filter((tab) => tab.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      const next = remaining[remaining.length - 1];
      setActiveTabId(next.id);
      setAddress(siteInfo[next.site].url);
    }
  };
  const submitSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const value = query.trim().toLowerCase();
    if (!value) return;
    const match = (Object.keys(siteInfo) as SiteId[]).find((id) =>
      siteInfo[id].title.toLowerCase().includes(value) || id.includes(value.replace(/[^a-z]/g, ""))
    );
    if (match) navigate(match);
    else if (/music|song|playlist|mood/.test(value)) navigate("moodboard");
    else if (/news|tech|culture|article/.test(value)) navigate("daily");
    else if (/profile|friend|social|post/.test(value)) navigate("pixeltown");
    else navigate("webwonder");
  };
  const addPost = (event: FormEvent) => {
    event.preventDefault();
    if (!postText.trim()) return;
    const next = [{ id: Date.now(), author: "You", handle: "@you.exe", text: postText.trim(), likes: 0, time: "just now" }, ...posts];
    setPosts(next);
    localStorage.setItem("desktop-exe-pixeltown-posts", JSON.stringify(next));
    setPostText("");
  };
  const toggleLike = (id: number) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };
  const toggleBookmark = (id: SiteId) => setBookmarks((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  const filteredArticles = useMemo(() => dailyCategory === "ALL" ? articles : articles.filter((article) => article.category === dailyCategory), [dailyCategory]);

  return (
    <div className={`fictional-browser os-${os}`}>
      <div className="fb-tabs">
        {tabs.map((tab) => {
          const Icon = siteInfo[tab.site].icon;
          return (
            <button key={tab.id} className={`fb-tab ${tab.id === activeTabId ? "active" : ""}`} onClick={() => { setActiveTabId(tab.id); setAddress(siteInfo[tab.site].url); }}>
              <Icon size={13} /><span>{tab.title}</span><i onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}><X size={12} /></i>
            </button>
          );
        })}
        <button className="fb-new-tab" onClick={newTab} title="New tab"><Plus size={15} /></button>
      </div>
      <div className="fb-toolbar">
        <button onClick={goBack} disabled={historyIndex === 0} title="Back"><ArrowLeft size={15} /></button>
        <button onClick={goForward} disabled={historyIndex >= history.length - 1} title="Forward"><ArrowRight size={15} /></button>
        <button onClick={() => navigate(currentSite, false)} title="Refresh"><Compass size={15} /></button>
        <form className="fb-address" onSubmit={(e) => { e.preventDefault(); const value = address.toLowerCase(); const match = (Object.keys(siteInfo) as SiteId[]).find((id) => value.includes(id) || value.includes(siteInfo[id].title.toLowerCase().replace(/[^a-z]/g, ""))); if (match) navigate(match); }}>
          <Globe size={14} /><input value={address} onChange={(e) => setAddress(e.target.value)} aria-label="Address bar" /><button type="submit"><ArrowRight size={14} /></button>
        </form>
        <button onClick={() => toggleBookmark(currentSite)} className={bookmarks.includes(currentSite) ? "fb-bookmarked" : ""} title="Bookmark"><Bookmark size={15} /></button>
      </div>
      <div className="fb-page">
        {currentSite === "webwonder" && (
          <section className="ww-page">
            <div className="ww-topline"><span>THE INTERNET, REIMAGINED.</span><button onClick={() => navigate("myspace")}>YOUR PROFILE <ArrowRight size={12} /></button></div>
            <div className="ww-center">
              <div className="ww-mark"><span className="ww-orbit">✳</span>webwonder<span className="ww-dot">.</span></div>
              <p>Curious minds, weird websites, wonderful discoveries.</p>
              <form className="ww-search" onSubmit={submitSearch}><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What are you looking for today?" /><button type="submit">Search</button></form>
              <div className="ww-suggestions"><span>TRY SEARCHING</span>{["music playlists", "digital culture", "social profiles"].map((item) => <button key={item} onClick={() => { setQuery(item); if (item.startsWith("music")) navigate("moodboard"); else if (item.startsWith("social")) navigate("pixeltown"); else navigate("daily"); }}>{item}</button>)}</div>
            </div>
            <div className="ww-discover"><div className="fb-section-heading"><div><span>YOUR INTERNET STARTER PACK</span><h2>Somewhere to begin.</h2></div><Sparkles size={20} /></div>
              <div className="ww-site-grid">
                {(["pixeltown", "moodboard", "myspace", "daily"] as SiteId[]).map((id) => { const Icon = siteInfo[id].icon; return <button key={id} className={`ww-site-card ${id}`} onClick={() => navigate(id)}><div><Icon size={19} /><ArrowRight size={14} /></div><strong>{siteInfo[id].title}</strong><span>{id === "pixeltown" ? "A little social, a lot more personal." : id === "moodboard" ? "Soundtracks for every version of you." : id === "myspace" ? "Make your page unmistakably yours." : "The stories worth opening today."}</span></button>; })}
              </div>
            </div>
            <div className="ww-footnote">A small web for big feelings. <span>EST. 2005 / REIMAGINED</span></div>
          </section>
        )}

        {currentSite === "pixeltown" && (
          <section className="pt-page">
            <header className="pt-header"><div className="pt-logo">pixel<span>town</span><i>✳</i></div><span>YOUR PEOPLE. YOUR LITTLE INTERNET.</span><button onClick={() => navigate("myspace")}>My profile <UserRound size={14} /></button></header>
            <div className="pt-layout"><aside className="pt-sidebar"><div className="pt-avatar">✿</div><strong>pixel visitor</strong><span>@visitor.exe</span><p>Making memories one pixel at a time.</p><div className="pt-stats"><div><b>{posts.length + 12}</b><small>FRIENDS</small></div><div><b>{posts.length}</b><small>POSTS</small></div></div><button onClick={() => navigate("myspace")}>Edit my space <Settings2 size={13} /></button><div className="pt-online"><i /> 248 friends online</div></aside>
              <div className="pt-feed"><div className="pt-welcome"><span>FRIDAY, NOVEMBER 6</span><h2>Your town is buzzing.</h2><p>See what your people have been up to.</p></div>
                <form className="pt-compose" onSubmit={addPost}><div className="pt-compose-avatar">Y</div><div><textarea value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="What's happening in your little world?" rows={2} /><button type="submit" disabled={!postText.trim()}><Send size={13} /> Share post</button></div></form>
                {posts.map((post) => <article className="pt-post" key={post.id}><div className="pt-post-avatar">{post.author.slice(0, 1).toUpperCase()}</div><div className="pt-post-content"><div className="pt-post-meta"><strong>{post.author}</strong><span>{post.handle} · {post.time}</span></div><p>{post.text}</p><button className={liked.includes(post.id) ? "liked" : ""} onClick={() => toggleLike(post.id)}><Heart size={14} fill={liked.includes(post.id) ? "currentColor" : "none"} /> {post.likes + (liked.includes(post.id) ? 1 : 0)} likes</button></div></article>)}
              </div>
            </div>
          </section>
        )}

        {currentSite === "moodboard" && (
          <section className="mb-page"><header className="mb-header"><div className="mb-brand"><Music2 size={20} /> moodboard<span>.fm</span></div><span>FIND YOUR FREQUENCY</span></header>
            <div className="mb-hero"><div><span className="mb-eyebrow">A SOUNDTRACK FOR RIGHT NOW</span><h1>What does<br /><em>today</em> feel like?</h1><p>Pick a mood. We'll find the sound.</p></div><div className="mb-orb">♫</div></div>
            <div className="mb-moods">{[{ id: "dreamy", label: "Dreamy", emoji: "☁", color: "lilac" }, { id: "focused", label: "Focused", emoji: "✳", color: "blue" }, { id: "sunny", label: "Sunny", emoji: "☀", color: "yellow" }, { id: "nostalgic", label: "Nostalgic", emoji: "♡", color: "pink" }].map((item) => <button key={item.id} className={`mb-mood ${item.color} ${mood === item.id ? "selected" : ""}`} onClick={() => { setMood(item.id); setPlaying(item.id === "dreamy" ? "Space Song" : item.id === "focused" ? "Weightless" : item.id === "sunny" ? "Sunday Best" : "Sweet Disposition"); }}><span>{item.emoji}</span><strong>{item.label}</strong></button>)}</div>
            <div className="mb-player"><div className="mb-cover">♫<span>side A</span></div><div className="mb-track"><span>NOW PLAYING · {mood.toUpperCase()}</span><strong>{playing}</strong><small>your imaginary mixtape · track 01</small><div className="mb-progress"><i /></div><div className="mb-times"><span>1:24</span><span>3:48</span></div></div><button className="mb-play" onClick={() => setPlaying((prev) => prev === "Paused" ? "Space Song" : "Paused")} aria-label="Play or pause">{playing === "Paused" ? "▶" : "Ⅱ"}</button></div>
            <p className="mb-note">A little moodboard for your ears. Music playback is a visual demo.</p>
          </section>
        )}

        {currentSite === "myspace" && (
          <section className="ms-page"><div className="ms-top"><div className="ms-wordmark">my<span>space</span><sup>2005</sup></div><span>it's your space. make it yours.</span><button onClick={() => setEditingProfile(!editingProfile)}><Settings2 size={13} /> {editingProfile ? "Done editing" : "Customise profile"}</button></div>
            <div className="ms-layout"><aside className="ms-profile"><div className="ms-profile-art">✿<span>ONLINE NOW</span></div><h2>{profileName}</h2><span className="ms-handle">@yourspace</span><p>{profileBio}</p><div className="ms-profile-actions"><button>Add friend</button><button>Message</button></div><h4>URL</h4><p className="ms-url">myspace.exe/{profileName.toLowerCase().replace(/\s+/g, "-")}</p>{editingProfile && <div className="ms-edit"><label>Display name<input value={profileName} onChange={(e) => { setProfileName(e.target.value); localStorage.setItem("desktop-exe-myspace-name", e.target.value); }} /></label><label>About me<textarea value={profileBio} onChange={(e) => { setProfileBio(e.target.value); localStorage.setItem("desktop-exe-myspace-bio", e.target.value); }} /></label></div>}</aside>
              <div className="ms-main"><div className="ms-box ms-blurb"><h3>★ {profileName.toUpperCase()}'S BLURB</h3><p>Hey, welcome to my page! Thanks for stopping by. Leave a comment, say hello, and don't forget to add me. xoxo</p></div><div className="ms-box"><h3>TOP 8 FRIENDS</h3><div className="ms-friends">{["Mia", "Alex", "Sam", "Jamie", "Rory", "Sky", "Noah", "You"].map((friend, index) => <div key={friend}><span>{["✿", "☻", "★", "♫", "♡", "☁", "✳", "Y"][index]}</span><strong>{friend}</strong></div>)}</div></div><div className="ms-box ms-comments"><h3>LEAVE A COMMENT</h3><p>Your friends would leave a message here. This guestbook is waiting for its first hello!</p><button onClick={() => navigate("pixeltown")}>Visit the town feed <ArrowRight size={13} /></button></div></div>
            </div>
          </section>
        )}

        {currentSite === "daily" && (
          <section className="dy-page"><header className="dy-header"><div className="dy-masthead">daily<span>.</span>exe</div><div className="dy-meta">THE INTERNET EDITION · FRIDAY, NOVEMBER 6, 2026</div><div className="dy-nav">{["ALL", "CULTURE", "TECH", "LIFESTYLE"].map((item) => <button className={dailyCategory === item ? "active" : ""} key={item} onClick={() => setDailyCategory(item)}>{item}</button>)}</div></header>
            <div className="dy-lead"><div><span className="dy-kicker">THE DAILY BRIEFING</span><h1>Good things<br />are <em>happening.</em></h1><p>Your tiny daily dose of ideas, culture and the things worth talking about.</p></div><div className="dy-art"><span>✳</span><small>ISSUE NO. 026</small></div></div>
            <div className="dy-stories"><div className="fb-section-heading"><div><span>FRESH OFF THE PRESS</span><h2>Latest stories</h2></div><span>{filteredArticles.length} STORIES</span></div>{filteredArticles.map((article, index) => <article className="dy-story" key={article.title}><span className="dy-story-number">0{index + 1}</span><div><small>{article.category} · {article.time}</small><h3>{article.title}</h3><p>{article.summary}</p><button onClick={() => setDailyCategory(article.category)}>Explore {article.category.toLowerCase()} <ArrowRight size={12} /></button></div><div className={`dy-story-art art-${index}`}><span>{["✳", "⌘", "☼"][index]}</span></div></article>)}</div>
            <footer className="dy-footer">THE DAILY, DELIVERED DIGITALLY. <span>STAY CURIOUS.</span></footer>
          </section>
        )}
      </div>
      <div className="fb-status"><span><i /> Secure connection</span><span>{currentInfo.title} · {currentInfo.url.replace("https://", "")}</span><span>{bookmarks.length} saved</span></div>
    </div>
  );
}

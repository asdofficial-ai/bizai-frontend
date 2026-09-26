import React, { useEffect, useRef, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const GENERAL_AI_NAME = "Bizora";
const CHAT_STORAGE_KEY = "bizai_chat_history";

async function request(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data;
  try { data = await res.json(); } catch { throw new Error("The server returned an invalid response."); }
  if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
  return data;
}

async function generateFromBackend(payload) {
  const data = await request("/api/generate", payload);
  if (!data?.text) throw new Error("No text came back from the AI.");
  return data.text;
}
async function generateWebsite(brief) {
  const data = await request("/api/generate-website", brief);
  if (!data?.html) throw new Error("No website came back from the AI.");
  return data.html;
}
async function sendChatMessage(messages) {
  const data = await request("/api/chat", { messages });
  if (!data?.text) throw new Error("No reply came back from Bizora.");
  return data.text;
}

const palette = { paper: "#F6EFDD", ink: "#1C1A17", gold: "#E8A33D", brick: "#B23A2E", palm: "#2E6350", indigo: "#232C4B" };

function Card({ children, bg = palette.paper, color = palette.ink, style = {} }) {
  return <div style={{ background: bg, color, border: `3px solid ${palette.ink}`, ...style }}>{children}</div>;
}
function Button({ children, onClick, disabled, full, bg = palette.gold, color = palette.ink }) {
  return <button onClick={onClick} disabled={disabled} style={{ background: bg, color, border: `3px solid ${palette.ink}`, padding: "12px 16px", fontFamily: "'Work Sans',sans-serif", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .5 : 1, width: full ? "100%" : "auto" }}>{children}</button>;
}
function Header({ title, onBack }) {
  return <div style={{ background: palette.indigo, color: palette.paper, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: `3px solid ${palette.ink}`, position: "sticky", top: 0, zIndex: 10 }}>
    <button onClick={onBack} aria-label="Back" style={{ background: "none", border: 0, color: palette.paper, fontSize: 22, cursor: "pointer" }}>←</button>
    <b style={{ fontFamily: "'Archivo Black',sans-serif" }}>{title}</b>
  </div>;
}
function Loading({ label = "Thinking..." }) { return <div style={{ padding: 12, fontWeight: 700 }}>{label}</div>; }
function Field({ label, value, onChange, placeholder }) {
  return <label style={{ display: "block" }}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{label}</div><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", padding: 12, border: `3px solid ${palette.ink}`, background: palette.paper, fontSize: 15 }} /></label>;
}

const TOOLS = [
  ["ad", "✍️", "Create Advertisement", palette.gold, palette.ink],
  ["whatsapp", "📱", "WhatsApp Marketing", palette.palm, palette.paper],
  ["flyer", "🎨", "Create Flyer", palette.brick, palette.paper],
  ["reply", "💬", "Reply to Customer", palette.indigo, palette.paper],
  ["website", "🌐", "Create Website", palette.gold, palette.ink],
  ["ai", "✨", GENERAL_AI_NAME, palette.ink, palette.paper],
];

function Home({ profile, onProfile, onTool }) {
  return <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
    <div><div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 28 }}>BizAI</div><div style={{ color: "#5b564c", marginTop: 4 }}>Run your business like you hired a marketer.</div></div>
    <Card bg={palette.ink} color={palette.paper} style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div><small style={{ opacity: .7 }}>Your shop</small><div style={{ fontFamily: "'Archivo Black',sans-serif", marginTop: 3 }}>{profile.business || "Set up your business"}</div></div>
      <Button onClick={onProfile}>{profile.business ? "Edit" : "Set up"}</Button>
    </Card>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {TOOLS.map(([id, emoji, label, bg, color]) => <Card key={id} bg={bg} color={color} style={{ minHeight: 100, cursor: "pointer" }}><div onClick={() => onTool(id)} style={{ padding: 16, height: "100%", boxSizing: "border-box" }}><div style={{ fontSize: 27 }}>{emoji}</div><div style={{ fontWeight: 800, marginTop: 12 }}>{label}</div></div></Card>)}
    </div>
    <div style={{ textAlign: "center", fontSize: 12, color: "#8a8477" }}>BizAI · Business tools powered by AI</div>
  </div>;
}

function ProfileScreen({ profile, setProfile, done }) {
  const [p, setP] = useState(profile);
  return <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
    <Field label="Business name" value={p.business} onChange={v => setP({ ...p, business: v })} placeholder="e.g. Kano Kicks" />
    <Field label="What you sell" value={p.product} onChange={v => setP({ ...p, product: v })} placeholder="e.g. Sneakers" />
    <Field label="Price" value={p.price} onChange={v => setP({ ...p, price: v })} placeholder="e.g. ₦35,000" />
    <Field label="Location" value={p.location} onChange={v => setP({ ...p, location: v })} placeholder="e.g. Kaduna" />
    <Button full bg={palette.ink} color={palette.paper} onClick={() => { setProfile(p); done(); }}>Save business profile</Button>
  </div>;
}

function TextTool({ profile, mode }) {
  const [tone, setTone] = useState("Friendly"), [result, setResult] = useState(""), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  const run = async () => {
    if (!profile.business) return;
    setLoading(true); setError("");
    try { setResult(await generateFromBackend({ businessName: profile.business, product: profile.product, price: profile.price, location: profile.location, task: mode, tone })); } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  return <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
    {!profile.business ? <Card bg={palette.brick} color={palette.paper} style={{ padding: 14 }}>Set up your business profile first.</Card> : <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["Friendly", "Professional", "Short", "Persuasive"].map(t => <Button key={t} onClick={() => setTone(t)} bg={tone === t ? palette.ink : palette.paper} color={tone === t ? palette.paper : palette.ink}>{t}</Button>)}</div>
      <Button full onClick={run} disabled={loading}>{loading ? "Generating..." : mode === "ad" ? "Generate advertisement" : "Generate WhatsApp message"}</Button>
      {loading && <Loading />}{error && <Card bg={palette.brick} color={palette.paper} style={{ padding: 14 }}>{error}</Card>}
      {result && <><Card style={{ padding: 16, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{result}</Card><Button onClick={() => navigator.clipboard?.writeText(result)}>Copy</Button></>}
    </>}
  </div>;
}

function ReplyScreen({ profile }) {
  const [message, setMessage] = useState(""), [tone, setTone] = useState("Friendly"), [result, setResult] = useState(""), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  const run = async () => { if (!message.trim()) return; setLoading(true); setError(""); try { setResult(await generateFromBackend({ businessName: profile.business, product: profile.product, price: profile.price, location: profile.location, task: "reply", customerMessage: message, tone })); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  return <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
    <label><b>What did the customer say?</b><textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Paste the customer's message" style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: 12, border: `3px solid ${palette.ink}`, background: palette.paper }} /></label>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["Friendly", "Professional", "Short", "Persuasive"].map(t => <Button key={t} onClick={() => setTone(t)} bg={tone === t ? palette.ink : palette.paper} color={tone === t ? palette.paper : palette.ink}>{t}</Button>)}</div>
    <Button full onClick={run} disabled={loading || !message.trim()}>{loading ? "Thinking..." : "AI Reply"}</Button>
    {error && <Card bg={palette.brick} color={palette.paper} style={{ padding: 14 }}>{error}</Card>}{result && <><Card style={{ padding: 16, whiteSpace: "pre-wrap" }}>{result}</Card><Button onClick={() => navigator.clipboard?.writeText(result)}>Copy reply</Button></>}
  </div>;
}

function FlyerScreen({ profile }) {
  const canvasRef = useRef(null), [image, setImage] = useState(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext("2d"); canvas.width = 400; canvas.height = 500;
    const finish = () => { ctx.fillStyle = palette.ink; ctx.fillRect(0, 370, 400, 130); ctx.fillStyle = palette.gold; ctx.fillRect(0, 370, 400, 6); ctx.fillStyle = palette.paper; ctx.font = "700 22px sans-serif"; ctx.fillText(profile.business || "Your Business", 16, 410); ctx.font = "600 15px sans-serif"; ctx.fillText(profile.product || "Your product", 16, 438); ctx.fillStyle = palette.gold; ctx.font = "700 20px sans-serif"; ctx.fillText(profile.price || "", 16, 468); ctx.fillStyle = palette.paper; ctx.font = "13px sans-serif"; ctx.fillText(profile.location ? `📍 ${profile.location}` : "", 16, 490); };
    ctx.fillStyle = "#F2E9D2"; ctx.fillRect(0, 0, 400, 370);
    if (!image) { ctx.fillStyle = "#777"; ctx.font = "15px sans-serif"; ctx.fillText("Upload a product photo", 120, 185); finish(); return; }
    const img = new Image(); img.onload = () => { const s = Math.max(400 / img.width, 370 / img.height); const w = img.width * s, h = img.height * s; ctx.drawImage(img, (400-w)/2, (370-h)/2, w, h); finish(); }; img.src = image;
  }, [image, profile]);
  const pick = e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setImage(r.result); r.readAsDataURL(f); };
  const download = () => { const a = document.createElement("a"); a.download = `${(profile.business || "bizai-flyer").replace(/\s+/g, "_")}.png`; a.href = canvasRef.current.toDataURL("image/png"); a.click(); };
  return <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}><b>Product photo</b><input type="file" accept="image/*" onChange={pick} /><canvas ref={canvasRef} style={{ width: "100%", border: `3px solid ${palette.ink}` }} /><Button full onClick={download}>Download flyer</Button></div>;
}

function WebsiteScreen({ profile }) {
  const [form, setForm] = useState({ description: "", businessName: profile.business || "", businessType: "", services: profile.product || "", location: profile.location || "", contact: "", style: "", colors: "", requirements: "" });
  const [html, setHtml] = useState(""), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  const field = (key, label, placeholder) => <Field label={label} value={form[key]} onChange={v => setForm({ ...form, [key]: v })} placeholder={placeholder} />;
  const run = async () => { if (!form.description.trim() && !form.businessName.trim()) { setError("Add a business name or description first."); return; } setLoading(true); setError(""); try { setHtml(await generateWebsite(form)); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  const download = () => { const url = URL.createObjectURL(new Blob([html], { type: "text/html" })); const a = document.createElement("a"); a.href = url; a.download = `${(form.businessName || "website").replace(/\s+/g, "_")}.html`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
  return <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
    <label><b>Describe the website</b><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: 12, border: `3px solid ${palette.ink}`, background: palette.paper }} /></label>
    {field("businessName", "Business name", "e.g. King's Cut")}{field("businessType", "Business type", "e.g. Barber shop")}{field("services", "Services/products", "What do you offer?")}{field("location", "Location", "e.g. Kaduna")}{field("contact", "Contact info", "WhatsApp or phone")}{field("style", "Preferred style", "Modern, bold, minimal")}{field("colors", "Preferred colors", "Black, gold")}{field("requirements", "Other requirements", "Booking button, gallery...")}
    <Button full onClick={run} disabled={loading}>{loading ? "Building..." : "Generate website"}</Button>{error && <Card bg={palette.brick} color={palette.paper} style={{ padding: 14 }}>{error}</Card>}
    {html && <><b>Preview</b><iframe title="Website preview" srcDoc={html} sandbox="allow-scripts" style={{ width: "100%", height: 420, border: `3px solid ${palette.ink}`, background: "white" }} /><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Button onClick={download}>Download HTML</Button><Button bg={palette.paper} onClick={() => navigator.clipboard?.writeText(html)}>Copy code</Button><Button bg={palette.paper} onClick={run}>Regenerate</Button></div></>}
  </div>;
}

function AIChatScreen() {
  const [messages, setMessages] = useState(() => { try { return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || "[]"); } catch { return []; } });
  const [input, setInput] = useState(""), [loading, setLoading] = useState(false), [error, setError] = useState(""); const scrollRef = useRef(null);
  useEffect(() => { try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages)); } catch {} if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);
  const send = async () => { const text = input.trim(); if (!text || loading) return; const next = [...messages, { role: "user", content: text }]; setMessages(next); setInput(""); setLoading(true); setError(""); try { const reply = await sendChatMessage(next); setMessages([...next, { role: "assistant", content: reply }]); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  const file = e => { const f = e.target.files?.[0]; if (!f) return; if (!/\.(txt|md|csv|json|js|jsx|ts|tsx|py|html|css)$/i.test(f.name)) { setError("For now, Bizora accepts text and common code files here."); return; } const r = new FileReader(); r.onload = () => setInput(v => `${v}${v ? "\n\n" : ""}[Contents of ${f.name}]\n${r.result}`); r.readAsText(f); };
  return <div style={{ height: "calc(100vh - 58px)", display: "flex", flexDirection: "column" }}>
    <div style={{ padding: 10, textAlign: "right" }}><Button bg={palette.paper} onClick={() => { setMessages([]); localStorage.removeItem(CHAT_STORAGE_KEY); }}>New conversation</Button></div>
    <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0 18px", display: "flex", flexDirection: "column", gap: 10 }}>{messages.length === 0 && <Card style={{ padding: 14 }}>Ask Bizora anything — business, writing, ideas, coding, or research.</Card>}{messages.map((m, i) => <Card key={i} bg={m.role === "user" ? palette.indigo : palette.paper} color={m.role === "user" ? palette.paper : palette.ink} style={{ padding: 12, whiteSpace: "pre-wrap", maxWidth: "85%", alignSelf: m.role === "user" ? "flex-end" : "flex-start" }}>{m.content}</Card>)}{loading && <Loading />}{error && <Card bg={palette.brick} color={palette.paper} style={{ padding: 12 }}>{error}</Card>}</div>
    <div style={{ padding: 14, borderTop: `3px solid ${palette.ink}` }}><div style={{ display: "flex", gap: 8 }}><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} rows={2} placeholder="Message Bizora..." style={{ flex: 1, padding: 10, border: `3px solid ${palette.ink}`, background: palette.paper }} /><Button onClick={send} disabled={loading || !input.trim()}>Send</Button></div><label style={{ display: "inline-block", marginTop: 8, fontSize: 12, cursor: "pointer" }}>📎 Attach text/code file<input type="file" onChange={file} style={{ display: "none" }} /></label></div>
  </div>;
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [profile, setProfile] = useState(() => { try { return JSON.parse(localStorage.getItem("bizai_profile")) || { business: "", product: "", price: "", location: "" }; } catch { return { business: "", product: "", price: "", location: "" }; } });
  useEffect(() => { try { localStorage.setItem("bizai_profile", JSON.stringify(profile)); } catch {} }, [profile]);
  const titles = { profile: "Business profile", ad: "Create Advertisement", whatsapp: "WhatsApp Marketing", flyer: "Create Flyer", reply: "Reply to Customer", website: "Create Website", ai: GENERAL_AI_NAME };
  return <div style={{ minHeight: "100vh", background: palette.paper, fontFamily: "'Work Sans',sans-serif", color: palette.ink, display: "flex", justifyContent: "center" }}><div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: palette.paper }}>
    {screen !== "home" && <Header title={titles[screen]} onBack={() => setScreen("home")} />}
    {screen === "home" && <Home profile={profile} onProfile={() => setScreen("profile")} onTool={setScreen} />}
    {screen === "profile" && <ProfileScreen profile={profile} setProfile={setProfile} done={() => setScreen("home")} />}
    {screen === "ad" && <TextTool profile={profile} mode="ad" />}{screen === "whatsapp" && <TextTool profile={profile} mode="whatsapp" />}{screen === "reply" && <ReplyScreen profile={profile} />}{screen === "flyer" && <FlyerScreen profile={profile} />}{screen === "website" && <WebsiteScreen profile={profile} />}{screen === "ai" && <AIChatScreen />}
  </div></div>;
}

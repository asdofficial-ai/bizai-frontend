import React, { useEffect, useRef, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const CHAT_STORAGE_KEY = "bizai_chat_history";
const GENERAL_AI_NAME = "Bizora";

async function api(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data;
  try { data = await res.json(); } catch { throw new Error("The server returned an unexpected response."); }
  if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
  return data;
}

const generateFromBackend = async (payload) => (await api("/api/generate", payload)).text;
const generateWebsite = async (brief) => (await api("/api/generate-website", brief)).html;
const sendChatMessage = async (messages) => (await api("/api/chat", { messages })).text;

const colors = { paper: "#F6EFDD", ink: "#1C1A17", gold: "#E8A33D", brick: "#B23A2E", palm: "#2E6350", indigo: "#232C4B" };

function Button({ children, onClick, disabled, tone = "gold", full = false }) {
  return <button onClick={onClick} disabled={disabled} style={{ background: colors[tone] || colors.gold, color: tone === "ink" || tone === "indigo" || tone === "brick" || tone === "palm" ? colors.paper : colors.ink, border: `3px solid ${colors.ink}`, padding: "12px 16px", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .55 : 1, width: full ? "100%" : "auto" }}>{children}</button>;
}

function Box({ children, tone = "paper", style = {} }) {
  return <div style={{ background: colors[tone] || colors.paper, color: tone === "ink" || tone === "indigo" || tone === "brick" || tone === "palm" ? colors.paper : colors.ink, border: `3px solid ${colors.ink}`, padding: 14, ...style }}>{children}</div>;
}

function Header({ title, onBack }) {
  return <div style={{ background: colors.indigo, color: colors.paper, padding: 16, display: "flex", gap: 12, alignItems: "center", borderBottom: `3px solid ${colors.ink}` }}><button onClick={onBack} style={{ background: "transparent", color: colors.paper, border: 0, fontSize: 24, cursor: "pointer" }}>←</button><strong style={{ fontSize: 18 }}>{title}</strong></div>;
}

function Field({ label, value, onChange, placeholder }) {
  return <label style={{ display: "block" }}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{label}</div><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", padding: 12, border: `3px solid ${colors.ink}`, background: colors.paper, fontSize: 15 }} /></label>;
}

function Home({ profile, onOpenProfile, onOpenTool }) {
  const tools = [
    ["ad", "📣", "Create Advertisement"], ["whatsapp", "💬", "WhatsApp Marketing"],
    ["flyer", "🎨", "Create Flyer"], ["reply", "↩️", "Reply to Customer"],
    ["website", "🌐", "Create Website"], ["ai", "✨", GENERAL_AI_NAME],
  ];
  return <div style={{ padding: 18 }}><div style={{ marginBottom: 18 }}><h1 style={{ margin: 0, fontSize: 34 }}>BizAI</h1><div style={{ opacity: .7 }}>Your small-business AI toolkit</div></div><Box tone="indigo" style={{ marginBottom: 18 }}><div style={{ fontSize: 12, opacity: .8 }}>YOUR SHOP</div><div style={{ fontSize: 20, fontWeight: 800, margin: "5px 0" }}>{profile.business || "Set up your business"}</div><div style={{ fontSize: 13 }}>{profile.product || "Add what you sell, price and location."}</div><div style={{ marginTop: 12 }}><Button onClick={onOpenProfile}>Edit profile</Button></div></Box><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{tools.map(([id, emoji, label]) => <Box key={id} style={{ cursor: "pointer", minHeight: 100 }}><div onClick={() => onOpenTool(id)} style={{ height: "100%" }}><div style={{ fontSize: 28 }}>{emoji}</div><div style={{ fontWeight: 800, marginTop: 10 }}>{label}</div></div></Box>)}</div></div>;
}

function ProfileScreen({ profile, setProfile, onDone }) {
  const [p, setP] = useState(profile);
  return <div style={stack}><Field label="Business name" value={p.business} onChange={(v) => setP({ ...p, business: v })} placeholder="e.g. Kano Kicks"/><Field label="What you sell" value={p.product} onChange={(v) => setP({ ...p, product: v })} placeholder="e.g. Sneakers"/><Field label="Price" value={p.price} onChange={(v) => setP({ ...p, price: v })} placeholder="e.g. ₦35,000"/><Field label="Location" value={p.location} onChange={(v) => setP({ ...p, location: v })} placeholder="e.g. Kaduna"/><Button tone="ink" full onClick={() => { setProfile(p); onDone(); }}>Save business profile</Button></div>;
}

const stack = { padding: 18, display: "flex", flexDirection: "column", gap: 14 };

function GeneratorScreen({ profile, task }) {
  const [customerMessage, setCustomerMessage] = useState(""); const [tone, setTone] = useState("Friendly"); const [result, setResult] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const run = async () => { if (task !== "reply" && !profile.business) return setError("Set up your business profile first."); if (task === "reply" && !customerMessage.trim()) return; setLoading(true); setError(""); try { setResult(await generateFromBackend({ businessName: profile.business, product: profile.product, price: profile.price, location: profile.location, task, customerMessage, tone })); } catch(e) { setError(e.message); } finally { setLoading(false); } };
  return <div style={stack}>{task === "reply" && <label><b>What did the customer say?</b><textarea value={customerMessage} onChange={(e)=>setCustomerMessage(e.target.value)} rows={4} style={textarea}/></label>}<div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{["Friendly","Professional","Short","Persuasive"].map(t => <Button key={t} tone={tone===t?"ink":"paper"} onClick={()=>setTone(t)}>{t}</Button>)}</div><Button full onClick={run} disabled={loading}>{loading ? "Thinking..." : task === "reply" ? "AI Reply" : "Generate"}</Button>{error && <Box tone="brick">{error}</Box>}{result && <><Box style={{ whiteSpace:"pre-wrap", lineHeight:1.5 }}>{result}</Box><Button tone="paper" onClick={()=>navigator.clipboard?.writeText(result)}>Copy</Button></>}</div>;
}

const textarea = { width:"100%", boxSizing:"border-box", padding:12, border:`3px solid ${colors.ink}`, background:colors.paper, fontSize:15, marginTop:6 };

function FlyerScreen({ profile }) {
  const canvasRef = useRef(null); const [src,setSrc]=useState(null);
  useEffect(()=>{ const c=canvasRef.current, x=c.getContext("2d"); c.width=400;c.height=500; const finish=()=>{x.fillStyle=colors.ink;x.fillRect(0,370,400,130);x.fillStyle=colors.gold;x.fillRect(0,370,400,6);x.fillStyle=colors.paper;x.font="bold 22px sans-serif";x.fillText(profile.business||"Your Business",16,410);x.font="16px sans-serif";x.fillText(profile.product||"Your product",16,438);x.fillStyle=colors.gold;x.font="bold 20px sans-serif";x.fillText(profile.price||"",16,468);x.fillStyle=colors.paper;x.font="13px sans-serif";x.fillText(profile.location||"",16,490);}; if(src){const im=new Image();im.onload=()=>{const s=Math.max(400/im.width,370/im.height),w=im.width*s,h=im.height*s;x.drawImage(im,(400-w)/2,(370-h)/2,w,h);finish();};im.src=src;}else{x.fillStyle="#F2E9D2";x.fillRect(0,0,400,370);finish();}},[src,profile]);
  const file=(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setSrc(r.result);r.readAsDataURL(f)}; const download=()=>{const a=document.createElement("a");a.download="bizai-flyer.png";a.href=canvasRef.current.toDataURL("image/png");a.click()};
  return <div style={stack}><input type="file" accept="image/*" onChange={file}/><canvas ref={canvasRef} style={{width:"100%",border:`3px solid ${colors.ink}`}}/><Button full onClick={download}>Download flyer</Button></div>;
}

function WebsiteScreen({ profile }) {
  const [form,setForm]=useState({description:"",businessName:profile.business||"",businessType:"",services:profile.product||"",location:profile.location||"",contact:"",style:"",colors:"",requirements:""}); const [html,setHtml]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const f=(k)=>(v)=>setForm({...form,[k]:v});
  const run=async()=>{setLoading(true);setError("");try{setHtml(await generateWebsite(form));}catch(e){setError(e.message)}finally{setLoading(false)}};
  const download=()=>{const u=URL.createObjectURL(new Blob([html],{type:"text/html"}));const a=document.createElement("a");a.href=u;a.download=`${form.businessName||"website"}.html`;a.click();URL.revokeObjectURL(u)};
  return <div style={stack}><label><b>Describe the website</b><textarea value={form.description} onChange={(e)=>f("description")(e.target.value)} rows={3} style={textarea}/></label><Field label="Business name" value={form.businessName} onChange={f("businessName")}/><Field label="Business type" value={form.businessType} onChange={f("businessType")}/><Field label="Services/products" value={form.services} onChange={f("services")}/><Field label="Location" value={form.location} onChange={f("location")}/><Field label="Contact" value={form.contact} onChange={f("contact")}/><Field label="Style" value={form.style} onChange={f("style")}/><Field label="Colors" value={form.colors} onChange={f("colors")}/><Field label="Other requirements" value={form.requirements} onChange={f("requirements")}/><Button full onClick={run} disabled={loading}>{loading?"Building...":"Generate website"}</Button>{error&&<Box tone="brick">{error}</Box>}{html&&<><iframe title="Website preview" srcDoc={html} style={{width:"100%",height:420,border:`3px solid ${colors.ink}`,background:"white"}}/><Button onClick={download}>Download HTML</Button><Button tone="paper" onClick={()=>navigator.clipboard?.writeText(html)}>Copy code</Button></>}</div>;
}

function AIChatScreen() {
  const [messages,setMessages]=useState(()=>{try{return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)||"[]")}catch{return[]}}); const [input,setInput]=useState(""); const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const scroll=useRef(null);
  useEffect(()=>{localStorage.setItem(CHAT_STORAGE_KEY,JSON.stringify(messages)); if(scroll.current)scroll.current.scrollTop=scroll.current.scrollHeight},[messages]);
  const send=async()=>{const text=input.trim();if(!text||loading)return;const next=[...messages,{role:"user",content:text}];setMessages(next);setInput("");setLoading(true);setError("");try{setMessages([...next,{role:"assistant",content:await sendChatMessage(next)}])}catch(e){setError(e.message)}finally{setLoading(false)}};
  return <div style={{...stack,height:"calc(100vh - 95px)"}}><Button tone="paper" onClick={()=>setMessages([])}>New conversation</Button><div ref={scroll} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>{messages.length===0&&<Box>Ask {GENERAL_AI_NAME} anything — business, writing, coding, ideas and more.</Box>}{messages.map((m,i)=><Box key={i} tone={m.role==="user"?"indigo":"paper"} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"85%",whiteSpace:"pre-wrap"}}>{m.content}</Box>)}{loading&&<div>Thinking...</div>}{error&&<Box tone="brick">{error}</Box>}</div><textarea value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} rows={3} placeholder="Type a message..." style={textarea}/><Button full onClick={send} disabled={loading||!input.trim()}>Send</Button></div>;
}

export default function App(){
  const [screen,setScreen]=useState("home"); const [profile,setProfile]=useState({business:"",product:"",price:"",location:""});
  const titles={profile:"Business profile",ad:"Create Advertisement",whatsapp:"WhatsApp Marketing",reply:"Reply to Customer",flyer:"Create Flyer",website:"Create Website",ai:GENERAL_AI_NAME};
  return <div style={{minHeight:"100vh",background:colors.paper,fontFamily:"Arial, sans-serif",color:colors.ink}}><div style={{maxWidth:430,minHeight:"100vh",margin:"0 auto",background:colors.paper}}>{screen!=="home"&&<Header title={titles[screen]} onBack={()=>setScreen("home")}/>} {screen==="home"&&<Home profile={profile} onOpenProfile={()=>setScreen("profile")} onOpenTool={setScreen}/>} {screen==="profile"&&<ProfileScreen profile={profile} setProfile={setProfile} onDone={()=>setScreen("home")}/>} {screen==="ad"&&<GeneratorScreen profile={profile} task="ad"/>} {screen==="whatsapp"&&<GeneratorScreen profile={profile} task="whatsapp"/>} {screen==="reply"&&<GeneratorScreen profile={profile} task="reply"/>} {screen==="flyer"&&<FlyerScreen profile={profile}/>} {screen==="website"&&<WebsiteScreen profile={profile}/>} {screen==="ai"&&<AIChatScreen/>}</div></div>;
}

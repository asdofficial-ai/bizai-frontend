import React, { useState, useRef, useEffect } from "react";

// ---------- AI helper ----------
// Calls our own backend at POST {API_BASE}/api/generate. The backend holds
// the OpenAI API key server-side; no key or third-party AI endpoint is
// ever referenced from this file.
// API_BASE is empty by default (same-origin, e.g. behind a reverse proxy).
// Set VITE_API_URL at build time if the backend lives on a different domain.
const API_BASE = import.meta.env.VITE_API_URL || "";

async function generateFromBackend({ businessName, product, price, location, task, customerMessage, tone }) {
const res = await fetch(${API_BASE}/api/generate, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ businessName, product, price, location, task, customerMessage, tone }),
});

let data;
try {
data = await res.json();
} catch {
throw new Error("The server sent back something unexpected. Please try again.");
}

if (!res.ok) {
throw new Error(data?.error || "Something went wrong. Please try again.");
}
if (!data?.text) {
throw new Error("No text came back from the AI. Please try again.");
}
return data.text;
}

// New: website generation. Real backend call, no sample/canned output —
// mirrors generateFromBackend's error-handling shape.
async function generateWebsite(brief) {
const res = await fetch(${API_BASE}/api/generate-website, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(brief),
});
let data;
try {
data = await res.json();
} catch {
throw new Error("The server sent back something unexpected. Please try again.");
}
if (!res.ok) {
throw new Error(data?.error || "Something went wrong. Please try again.");
}
if (!data?.html) {
throw new Error("No website came back from the AI. Please try again.");
}
return data.html;
}

// New: general AI chat. Sends the full conversation history each time
// (the backend is stateless) and gets back the next assistant message.
async function sendChatMessage(messages) {
const res = await fetch(${API_BASE}/api/chat, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ messages }),
});
let data;
try {
data = await res.json();
} catch {
throw new Error("The server sent back something unexpected. Please try again.");
}
if (!res.ok) {
throw new Error(data?.error || "Something went wrong. Please try again.");
}
if (!data?.text) {
throw new Error("No reply came back from the AI. Please try again.");
}
return data.text;
}

// ---------- Shared UI ----------
function SignBlock({ children, tone = "paper", className = "", style = {} }) {
const tones = {
paper: { background: "#F6EFDD", color: "#1C1A17", border: "3px solid #1C1A17" },
marigold: { background: "#E8A33D", color: "#1C1A17", border: "3px solid #1C1A17" },
brick: { background: "#B23A2E", color: "#F6EFDD", border: "3px solid #1C1A17" },
palm: { background: "#2E6350", color: "#F6EFDD", border: "3px solid #1C1A17" },
indigo: { background: "#232C4B", color: "#F6EFDD", border: "3px solid #1C1A17" },
ink: { background: "#1C1A17", color: "#F6EFDD", border: "3px solid #1C1A17" },
};
return (
<div className={className} style={{ ...tones[tone], ...style }}>
{children}
</div>
);
}

function Button({ children, onClick, tone = "marigold", disabled, full }) {
const tones = {
marigold: { background: "#E8A33D", color: "#1C1A17" },
brick: { background: "#B23A2E", color: "#F6EFDD" },
palm: { background: "#2E6350", color: "#F6EFDD" },
ink: { background: "#1C1A17", color: "#F6EFDD" },
paper: { background: "#F6EFDD", color: "#1C1A17" },
};
return (
<button
onClick={onClick}
disabled={disabled}
style={{
...tones[tone],
border: "3px solid #1C1A17",
borderRadius: 0,
padding: "12px 18px",
fontFamily: "'Work Sans', sans-serif",
fontWeight: 600,
fontSize: 15,
cursor: disabled ? "not-allowed" : "pointer",
opacity: disabled ? 0.5 : 1,
width: full ? "100%" : "auto",
transition: "transform 0.08s ease",
}}
onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px, 2px)")}
onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
>
{children}
</button>
);
}

function Header({ title, onBack }) {
return (
<div
style={{
background: "#232C4B",
color: "#F6EFDD",
padding: "16px 18px",
display: "flex",
alignItems: "center",
gap: 12,
borderBottom: "3px solid #1C1A17",
          <div onClick={() => onOpenTool(t.id)} style={{ height: "100%" }}>
              <div style={{ fontSize: 26 }}>{t.emoji}</div>
              <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 14, marginTop: 10, lineHeight: 1.2 }}>
                {t.label}
              </div>
            </div>
          </SignBlock>
        ))}
      </div>

      <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: "#8a8477", textAlign: "center", marginTop: 4 }}>
        5 free AI generations today · Upgrade for more
      </div>
    </div>
  );
}

function ProfileScreen({ profile, setProfile, onDone }) {
  const [local, setLocal] = useState(profile);
  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
      <Field label="Business name" value={local.business} onChange={(v) => setLocal({ ...local, business: v })} placeholder="e.g. Kano Kicks" />
      <Field label="What you sell" value={local.product} onChange={(v) => setLocal({ ...local, product: v })} placeholder="e.g. Nike-style sneakers" />
      <Field label="Price" value={local.price} onChange={(v) => setLocal({ ...local, price: v })} placeholder="e.g. ₦35,000" />
      <Field label="Location" value={local.location} onChange={(v) => setLocal({ ...local, location: v })} placeholder="e.g. Kano" />
      <Button
        tone="ink"
        full
        onClick={() => {
          setProfile(local);
          onDone();
        }}
      >
        Save business profile
      </Button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#1C1A17", marginBottom: 6 }}>
        {label}
      </div>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 12px",
          fontFamily: "'Work Sans', sans-serif",
          fontSize: 15,
          border: "3px solid #1C1A17",
          background: "#F6EFDD",
          outline: "none",
        }}
      />
    </label>
  );
}

function AdScreen({ profile, mode }) {
  // mode: "ad" or "whatsapp"
  const [style, setStyle] = useState("Friendly");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const styles = ["Friendly", "Professional", "Short", "Persuasive"];

  const generate = async () => {
    if (!profile.business) return;
    setLoading(true);
    setResult("");
    setError("");
    setCopied(false);
    try {
      const text = await generateFromBackend({
        businessName: profile.business,
        product: profile.product,
        price: profile.price,
        location: profile.location,
        task: mode,
        tone: style,
      });
      setResult(text);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile.business) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
      {!profile.business && (
        <SignBlock tone="brick" style={{ padding: 14 }}>
          <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
            Set up your business profile first so the AI knows what to write about.
          </div>
        </SignBlock>
      )}

      {profile.business && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                style={{
                  border: "3px solid #1C1A17",
                  background: style === s ? "#1C1A17" : "#F6EFDD",
                  color: style === s ? "#F6EFDD" : "#1C1A17",
                  padding: "7px 12px",
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {loading && <Loading label="Writing your ad..." />}

          {!loading && error && (
            <SignBlock tone="brick" style={{ padding: 14, fontFamily: "'Work Sans', sans-serif", fontSize: 14 }}>
              {error}
            </SignBlock>
          )}

          {!loading && result && (
            <SignBlock tone="paper" style={{ padding: 16, whiteSpace: "pre-wrap", fontFamily: "'Work Sans', sans-serif", fontSize: 15, lineHeight: 1.5 }}>
              {result}
            </SignBlock>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              tone="marigold"
              onClick={() => {
                navigator.clipboard?.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              disabled={!result}
            >
              {copied ? "Copied ✓" : "Copy"}
            </Button>
            <Button tone="paper" onClick={generate} disabled={loading}>
              {error ? "Try again" : "Regenerate"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function ReplyScreen({ profile }) {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const tones = ["Friendly", "Professional", "Short", "Persuasive"];

  const generate = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult("");
    setError("");
    setCopied(false);
    try {
      const text = await generateFromBackend({
        businessName: profile.business,
        product: profile.product,
        price: profile.price,
        location: profile.location,
        task: "reply",
        customerMessage: message,
        tone,
      });
      setResult(text);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
      <label>
        <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
          What did the customer say?
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. How much is this shoe?"
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: 12,
            fontFamily: "'Work Sans', sans-serif",
            fontSize: 15,
            border: "3px solid #1C1A17",
            background: "#F6EFDD",
            outline: "none",
            resize: "vertical",
          }}
        />
      </label>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tones.map((s) => (
          <button
            key={s}
            onClick={() => setTone(s)}
            style={{
              border: "3px solid #1C1A17",
              background: tone === s ? "#1C1A17" : "#F6EFDD",
              color: tone === s ? "#F6EFDD" : "#1C1A17
                              padding: "7px 12px",
              fontFamily: "'Work Sans', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <Button tone="marigold" onClick={generate} disabled={loading || !message.trim()} full>
        {loading ? "Thinking..." : "AI Reply"}
      </Button>

      {loading && <Loading label="Writing a reply..." />}

      {!loading && error && (
        <SignBlock tone="brick" style={{ padding: 14, fontFamily: "'Work Sans', sans-serif", fontSize: 14 }}>
          {error}
        </SignBlock>
      )}

      {!loading && result && (
        <>
          <SignBlock tone="paper" style={{ padding: 16, whiteSpace: "pre-wrap", fontFamily: "'Work Sans', sans-serif", fontSize: 15, lineHeight: 1.5 }}>
            {result}
          </SignBlock>
          <Button
            tone="paper"
            onClick={() => {
              navigator.clipboard?.writeText(result);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copied ✓" : "Copy reply"}
          </Button>
        </>
      )}
    </div>
  );
}

function FlyerScreen({ profile }) {
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [drawn, setDrawn] = useState(false);

  const draw = (dataUrl) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = 400,
      H = 500;
    canvas.width = W;
    canvas.height = H;

    const finish = () => {
      // Bottom info band
      ctx.fillStyle = "#1C1A17";
      ctx.fillRect(0, H - 130, W, 130);
      ctx.fillStyle = "#E8A33D";
      ctx.fillRect(0, H - 130, W, 6);

      ctx.fillStyle = "#F6EFDD";
      ctx.font = "700 22px 'Archivo Black', sans-serif";
      ctx.fillText(profile.business || "Your Business", 16, H - 92);

      ctx.font = "600 15px 'Work Sans', sans-serif";
      ctx.fillText(profile.product || "Your product", 16, H - 66);

      ctx.fillStyle = "#E8A33D";
      ctx.font = "700 20px 'Archivo Black', sans-serif";
      ctx.fillText(profile.price || "", 16, H - 36);

      ctx.fillStyle = "#F6EFDD";
      ctx.font = "500 13px 'Work Sans', sans-serif";
      ctx.fillText("📍 " + (profile.location || ""), 16, H - 14);

      setDrawn(true);
    };

    if (dataUrl) {
      const img = new Image();
      img.onload = () => {
        // cover-fit into top area
        const targetH = H - 130;
        const scale = Math.max(W / img.width, targetH / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (W - w) / 2, (targetH - h) / 2, w, h);
        finish();
      };
      img.src = dataUrl;
    } else {
      ctx.fillStyle = "#F2E9D2";
      ctx.fillRect(0, 0, W, H - 130);
      ctx.fillStyle = "#c9bfa0";
      ctx.font = "600 15px 'Work Sans', sans-serif";
      ctx.fillText("Upload a product photo above", 16, (H - 130) / 2);
      finish();
    }
  };

  useEffect(() => {
    draw(imgSrc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgSrc, profile]);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const download = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `${(profile.business || "flyer").replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
      {!profile.business && (
        <SignBlock tone="brick" style={{ padding: 14 }}>
          <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
            Set up your business profile first so we know what to put on the flyer.
          </div>
        </SignBlock>
      )}
      <label>
        <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
          Product photo
        </div>
        <input type="file" accept="image/*" onChange={onFile} style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13 }} />
      </label>

      <canvas
        ref={canvasRef}
        style={{ width: "100%", border: "3px solid #1C1A17", display: "block" }}
      />

      <Button tone="marigold" onClick={download} disabled={!drawn} full>
        Download flyer
      </Button>
    </div>
  );
}

// ---------- Create Website ----------
function WebsiteScreen({ profile }) {
  const [form, setForm] = useState({
    description: "",
    businessName: profile.business || "",
    businessType: "",
    services: profile.product || "",
    location: profile.location || "",
    contact: "",
    style: "",
    colors: "",
    requirements: "",
  });
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const generate = async () => {
    if (!form.description.trim() && !form.businessName.trim()) {
      setError("Give at least a business name or describe the site you want.");
      return;
    }
    setLoading(true);
    setError("");
    setHtml("");
    try {
      const result = await generateWebsite(form);
      setHtml(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const download = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(form.businessName || "website").replace(/\s+/g, "_")}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(html);
  };

  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <SignBlock tone="paper" style={{ padding: 12, fontFamily: "'Work Sans', sans-serif", fontSize: 13 }}>
        This calls a real AI backend to build the page — nothing here is a sample/canned response.
      </SignBlock>

      <label>
        <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
          Describe what you want (optional if you fill in details below)
        </div>
        <textarea
          value={form.description}
          onChange={set("description")}
          placeholder='e.g. "Create a modern website for a barber shop called King\'s Cut."'
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: 12,
            fontFamily: "'Work Sans', sans-serif",
            fontSize: 15,
            border: "3px solid #1C1A17",
            background: "#F6EFDD",
            outline: "none",
            resize: "vertical",
          }}
        />
      </label>

      <Field label="Business name" value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} placeholder="e.g. King's Cut" />
      <Field label="Business type" value={form.businessType} onChange={(v) => setForm({ ...form, businessType: v })} placeholder="e.g. Barber shop" />
      <Field label="Services/products" value={form.services} onChange={(v) => setForm({ ...form, services: v })} placeholder="e.g. Haircuts, beard trims, hot towel shaves" />
      <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="e.g. Kano" />
      <Field label="Contact info" value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} placeholder="e.g. WhatsApp +234..." />
      <Field label="Preferred style" value={form.style} onChange={(v) => setForm({ ...form, style: v })} placeholder="e.g. Modern, bold, minimal" />
      <Field label="Preferred colors" value={form.colors} onChange={(v) => setForm({ ...form, colors: v })} placeholder="e.g. Black, gold" />
      <Field label="Other requirements" value={form.requirements} onChange={(v) => setForm({ ...form, requirements: v })} placeholder="e.g. Include a booking button" />

      <Button tone="marigold" onClick={generate} disabled={loading} full>
        {loading ? "Building your website..." : "Generate website"}
      </Button>

      {loading && <Loading label="AI is building your site..." />}

      {!loading && error && (
        <SignBlock tone="brick" style={{ padding: 14, fontFamily: "'Work Sans', sans-serif", fontSize: 14 }}>
          {error}
        </SignBlock>
      )}

      {!loading && html && (
        <>
          <div style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>Preview</div>
          <iframe
            title="Website preview"
            srcDoc={html}
            style={{ width: "100%", height: 420, border: "3px solid #1C1A17", background: "#fff" }}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button tone="marigold" onClick={download}>Download HTML</Button>
            <Button tone="marigold" onClick={download}>Download HTML</Button>
                        <Button tone="paper" onClick={copyCode}>Copy code</Button>
            <Button tone="paper" onClick={generate} disabled={loading}>Regenerate</Button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- General AI assistant ----------
const CHAT_STORAGE_KEY = "bizai_chat_history";

function AIChatScreen() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileNote, setFileNote] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // storage full or unavailable — conversation just won't persist, not fatal
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const reply = await sendChatMessage(nextMessages);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const clearConversation = () => {
    setMessages([]);
    setError("");
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Basic file analysis: reads plain-text files client-side and drops their
  // content into the message box. Richer formats (PDF/DOCX/images) aren't
  // wired up yet — flagged honestly rather than pretending to support them.
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPlainText = /\.(txt|md|csv|json|js|jsx|ts|tsx|py|html|css)$/i.test(file.name);
    if (!isPlainText) {
      setFileNote(`"${file.name}" isn't a supported text format yet (txt, md, csv, json, and common code files work).`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setInput((prev) => `${prev ? prev + "\n\n" : ""}[Contents of ${file.name}]\n${reader.result}`);
      setFileNote(`Loaded "${file.name}" into the message box below.`);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 62px)" }}>
      <div style={{ padding: "10px 18px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={clearConversation}
          style={{
            background: "none",
            border: "2px solid #1C1A17",
            padding: "6px 10px",
            fontFamily: "'Work Sans', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          New conversation
        </button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 && (
          <SignBlock tone="paper" style={{ padding: 14, fontFamily: "'Work Sans', sans-serif", fontSize: 14 }}>
            Ask anything — writing, coding, business questions, research, or paste in a text file to analyze. This is a real AI backend, connected the same way as the rest of BizAI.
          </SignBlock>
        )}
        {messages.map((m, i) => (
          <SignBlock
            key={i}
            tone={m.role === "user" ? "indigo" : "paper"}
            style={{
              padding: 12,
              fontFamily: "'Work Sans', sans-serif",
              fontSize: 14,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
            }}
          >
            {m.content}
          </SignBlock>
        ))}
        {loading && <Loading label="Thinking..." />}
        {error && (
          <SignBlock tone="brick" style={{ padding: 12, fontFamily: "'Work Sans', sans-serif", fontSize: 13 }}>
            {error}
          </SignBlock>
        )}
      </div>

      <div style={{ padding: 14, borderTop: "3px solid #1C1A17", display: "flex", flexDirection: "column", gap: 8 }}>
        {fileNote && (
          <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: "#5b564c" }}>{fileNote}</div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Type a message..."
            rows={2}
            style={{
              flex: 1,
              boxSizing: "border-box",
              padding: 10,
              fontFamily: "'Work Sans', sans-serif",
              fontSize: 14,
              border: "3px solid #1C1A17",
              background: "#F6EFDD",
              outline: "none",
              resize: "none",
            }}
          />
          <Button tone="marigold" onClick={send} disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
        <label style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, cursor: "pointer" }}>
          📎 Attach a text file
          <input type="file" onChange={onFile} style={{ display: "none" }} />
        </label>
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [screen, setScreen] = useState("home");
  const [profile, setProfile] = useState({ business: "", product: "", price: "", location: "" });

  const titles = {
    home: "BizAI",
    profile: "Business profile",
    ad: "Create Advertisement",
    whatsapp: "WhatsApp Marketing",
    reply: "Reply to Customer",
    flyer: "Create Flyer",
    website: "Create Website",
    ai: GENERAL_AI_NAME,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6EFDD",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: "#F6EFDD", boxShadow: "0 0 0 1px #e4dcc4" }}>
        {screen !== "home" && <Header title={titles[screen]} onBack={() => setScreen("home")} />}
        {screen === "home" && <Home profile={profile} onOpenProfile={() => setScreen("profile")} onOpenTool={(id) => setScreen(id)} />}
        {screen === "profile" && <ProfileScreen profile={profile} setProfile={setProfile} onDone={() => setScreen("home")} />}
        {screen === "ad" && <AdScreen profile={profile} mode="ad" />}
        {screen === "whatsapp" && <AdScreen profile={profile} mode="whatsapp" />}
        {screen === "reply" && <ReplyScreen profile={profile} />}
        {screen === "flyer" && <FlyerScreen profile={profile} />}
        {screen === "website" && <WebsiteScreen profile={profile} />}
        {screen === "ai" && <AIChatScreen />}
      </div>
    </div>
  );
}


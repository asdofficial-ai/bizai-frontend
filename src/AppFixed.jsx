import React,{useEffect,useRef,useState}from"react";

const API=(import.meta.env.VITE_API_URL||"").replace(/\/$/,"");
const C={bg:"#050d1e",card:"#0d1d3b",text:"#f7f9ff",muted:"#91a5ca",blue:"#4d86ff",cyan:"#50d9ff",line:"rgba(255,255,255,.10)",red:"#ff7d8b"};
const input={width:"100%",boxSizing:"border-box",padding:"14px",borderRadius:14,border:`1px solid ${C.line}`,background:"rgba(255,255,255,.055)",color:C.text,fontSize:15,outline:"none"};

async function post(path,body){
  const r=await fetch(`${API}${path}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  let d;try{d=await r.json()}catch{throw new Error("The server returned an invalid response.")}
  if(!r.ok)throw new Error(d?.error||"Request failed.");
  return d;
}

function Btn({children,onClick,disabled,secondary=false}){return <button type="button" onClick={onClick} disabled={disabled} style={{width:"100%",padding:"14px 16px",borderRadius:15,border:secondary?`1px solid ${C.line}`:"none",background:secondary?"rgba(255,255,255,.06)":"linear-gradient(135deg,#397cff,#6c5cff)",color:"white",fontWeight:850,fontSize:15,opacity:disabled?0.55:1}}>{children}</button>}
function Card({children,style={}}){return <div style={{padding:17,borderRadius:22,border:`1px solid ${C.line}`,background:"linear-gradient(145deg,rgba(18,43,84,.96),rgba(8,24,52,.96))",boxShadow:"0 18px 42px rgba(0,0,0,.22)",...style}}>{children}</div>}
function Field({label,value,onChange,placeholder}){return <label style={{display:"block"}}><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>{label}</div><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={input}/></label>}
function TextArea({label,value,onChange,placeholder,rows=6}){return <label style={{display:"block"}}><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>{label}</div><textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{...input,resize:"vertical",lineHeight:1.5}}/></label>}
function Page({title,sub,children}){return <div style={{padding:"20px 18px 42px",display:"flex",flexDirection:"column",gap:14}}><div><div style={{fontSize:25,fontWeight:950}}>{title}</div><div style={{fontSize:13,color:C.muted,lineHeight:1.55,marginTop:6}}>{sub}</div></div>{children}</div>}
function ErrorBox({children}){return <div style={{padding:13,borderRadius:14,color:"#ffc1c7",background:"rgba(255,80,100,.1)",border:"1px solid rgba(255,100,120,.25)",fontSize:13,lineHeight:1.45}}>{children}</div>}
function Result({text,title="Result"}){return <><div style={{fontSize:12,color:C.cyan,fontWeight:900,letterSpacing:.4}}>{title.toUpperCase()}</div><Card style={{whiteSpace:"pre-wrap",lineHeight:1.65,fontSize:14}}>{text}</Card><Btn secondary onClick={()=>navigator.clipboard?.writeText(text)}>Copy result</Btn></>}
function Tone({value,onChange,options=["Friendly","Professional","Persuasive","Energetic","Luxury"]}){return <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:2}}>{options.map(x=><button type="button" key={x} onClick={()=>onChange(x)} style={{whiteSpace:"nowrap",padding:"9px 12px",borderRadius:18,border:`1px solid ${value===x?C.blue:C.line}`,background:value===x?"rgba(77,134,255,.18)":"rgba(255,255,255,.04)",color:value===x?"white":C.muted,fontWeight:800,fontSize:12}}>{x}</button>)}</div>}
function SmallNote({children}){return <div style={{fontSize:11,color:C.muted,lineHeight:1.5,padding:"10px 12px",borderRadius:12,background:"rgba(80,217,255,.06)",border:"1px solid rgba(80,217,255,.12)"}}>{children}</div>}

const TOOLS=[
  ["ad","▶","Video Ad Studio","Describe the video ad you want","#6c62ff"],
  ["whatsapp","◉","WhatsApp Campaign","Describe the message you want","#29c38a"],
  ["flyer","◇","Flyer Designer","Describe and design your flyer","#e979a6"],
  ["reply","↗","Smart Reply","Tell BizAI how you want to reply","#4d86ff"],
  ["website","⌘","Website AI","Coming soon","#9a6cff"],
  ["ai","✧","Bizora AI","Your general assistant","#32c8ea"]
];

function Home({p,go}){return <div style={{padding:"23px 18px 110px"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div><div style={{fontSize:11,fontWeight:900,letterSpacing:1.4,color:C.cyan}}>BIZAI</div><div style={{fontSize:27,fontWeight:950,marginTop:5}}>Hey{p.business?`, ${p.business}`:" there"} 👋</div><div style={{fontSize:13,color:C.muted,marginTop:5}}>Tell BizAI what you want to create.</div></div><button type="button" onClick={()=>go("profile")} style={{width:46,height:46,borderRadius:"50%",border:`1px solid ${C.line}`,background:"linear-gradient(135deg,#477eff,#743fd0)",color:"white",fontWeight:900}}>{p.business?p.business[0].toUpperCase():"B"}</button></div>
  <Card style={{position:"relative",overflow:"hidden",marginBottom:23}}><div style={{position:"absolute",right:-40,top:-55,width:150,height:150,borderRadius:"50%",background:"rgba(70,130,255,.22)",filter:"blur(22px)"}}/><div style={{fontSize:11,color:C.cyan,fontWeight:900}}>YOUR BUSINESS</div><div style={{fontSize:20,fontWeight:900,marginTop:7}}>{p.business||"Set up your business"}</div><div style={{fontSize:13,color:C.muted,marginTop:7}}>{p.business?`${p.product||"Business"}${p.location?` · ${p.location}`:""}`:"Save your business details once, then customize every creation with your own description."}</div><div style={{marginTop:16}}><Btn onClick={()=>go("profile")}>{p.business?"Edit profile":"Set up now"}</Btn></div></Card>
  <div style={{fontSize:18,fontWeight:900}}>Create with BizAI</div><div style={{fontSize:12,color:C.muted,marginTop:4,marginBottom:12}}>Each tool now starts with your own description.</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{TOOLS.map(([id,ic,n,d,col])=><button type="button" key={id} onClick={()=>go(id)} style={{minHeight:143,textAlign:"left",padding:15,borderRadius:20,border:`1px solid ${C.line}`,background:"linear-gradient(150deg,#10274d,#081a37)",color:C.text}}><div style={{width:40,height:40,borderRadius:13,display:"grid",placeItems:"center",fontSize:19,background:`${col}25`,color:col}}>{ic}</div><div style={{fontSize:14,fontWeight:900,marginTop:14}}>{n}</div><div style={{fontSize:11,color:C.muted,lineHeight:1.4,marginTop:5}}>{d}</div></button>)}</div>
  <div style={{position:"fixed",bottom:12,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 28px)",maxWidth:402,display:"flex",justifyContent:"space-around",padding:"10px 8px",boxSizing:"border-box",borderRadius:22,border:`1px solid ${C.line}`,background:"rgba(8,24,52,.94)",backdropFilter:"blur(18px)"}}>{[["home","⌂","Home"],["ad","▶","Create"],["ai","✧","Bizora"],["website","⌘","Website"]].map(([id,ic,l])=><button type="button" key={id} onClick={()=>id!=="home"&&go(id)} style={{border:0,background:"none",color:id==="home"?C.cyan:C.muted,fontSize:10,fontWeight:800}}><div style={{fontSize:20}}>{ic}</div>{l}</button>)}</div>
</div>}

function Profile({p,setP,back}){const[x,setX]=useState(p);return <Page title="Business profile" sub="Save the basics once. Every creative tool can still be customized with a separate description."><Field label="BUSINESS NAME" value={x.business} onChange={v=>setX({...x,business:v})} placeholder="e.g. ASD Cuts"/><Field label="WHAT YOU SELL / OFFER" value={x.product} onChange={v=>setX({...x,product:v})} placeholder="e.g. Haircuts and grooming"/><Field label="PRICE / OFFER" value={x.price} onChange={v=>setX({...x,price:v})} placeholder="e.g. From ₦5,000"/><Field label="LOCATION" value={x.location} onChange={v=>setX({...x,location:v})} placeholder="e.g. Kaduna"/><Btn onClick={()=>{setP(x);back()}}>Save profile</Btn></Page>}

function VideoAd({p}){
  const[form,setForm]=useState({title:p.business?`${p.business} Video Ad`:"",instructions:"",audience:"",goal:"",platform:"TikTok / Instagram Reels",duration:"30 seconds",tone:"Energetic"});
  const[out,setOut]=useState(""),[err,setErr]=useState(""),[busy,setBusy]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  async function run(){if(!form.title.trim()){setErr("Give this ad a name first.");return}if(!form.instructions.trim()){setErr("Describe exactly how you want the video ad.");return}setBusy(true);setErr("");setOut("");try{const d=await post("/api/generate",{task:"video-ad",businessName:p.business,product:p.product,price:p.price,location:p.location,...form});setOut(d.text||"")}catch(e){setErr(e.message)}finally{setBusy(false)}}
  return <Page title="Video Ad Studio" sub="Name the ad, then describe exactly what you want. BizAI will build the hook, scenes, voice-over, on-screen text and CTA around your instructions.">
    <Field label="AD / CAMPAIGN NAME" value={form.title} onChange={v=>set("title",v)} placeholder="e.g. ASD Cuts Weekend Promo"/>
    <TextArea label="DESCRIBE THE VIDEO AD YOU WANT" value={form.instructions} onChange={v=>set("instructions",v)} placeholder="Example: Make a fast 30-second TikTok ad. Start with a dramatic haircut transformation, use bold captions, energetic music, show the shop, then end with a WhatsApp booking CTA..." rows={7}/>
    <Field label="TARGET AUDIENCE" value={form.audience} onChange={v=>set("audience",v)} placeholder="e.g. Men aged 18–35 in Kaduna"/>
    <Field label="GOAL" value={form.goal} onChange={v=>set("goal",v)} placeholder="e.g. Get WhatsApp bookings"/>
    <Field label="PLATFORM" value={form.platform} onChange={v=>set("platform",v)} placeholder="TikTok, Instagram Reels, YouTube Shorts..."/>
    <Field label="VIDEO LENGTH" value={form.duration} onChange={v=>set("duration",v)} placeholder="15 seconds, 30 seconds..."/>
    <div><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>STYLE / TONE</div><Tone value={form.tone} onChange={v=>set("tone",v)}/></div>
    <Btn disabled={busy} onClick={run}>{busy?"Creating your video ad...":"Create video ad"}</Btn>
    <SmallNote>This stage creates the complete video-ad production package. Actual AI video rendering will plug into this same page when the video-rendering provider is connected.</SmallNote>
    {err&&<ErrorBox>{err}</ErrorBox>}{out&&<Result title="Video ad package" text={out}/>} 
  </Page>
}

function WhatsAppCampaign({p}){
  const[form,setForm]=useState({title:"",instructions:"",audience:"",goal:"",tone:"Friendly"});
  const[out,setOut]=useState(""),[err,setErr]=useState(""),[busy,setBusy]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  async function run(){if(!form.instructions.trim()){setErr("Describe the WhatsApp campaign or message you want.");return}setBusy(true);setErr("");setOut("");try{const d=await post("/api/generate",{task:"whatsapp",businessName:p.business,product:p.product,price:p.price,location:p.location,...form});setOut(d.text||"")}catch(e){setErr(e.message)}finally{setBusy(false)}}
  return <Page title="WhatsApp Campaign" sub="Describe what you want to tell customers instead of relying on a fixed template.">
    <Field label="CAMPAIGN NAME (OPTIONAL)" value={form.title} onChange={v=>set("title",v)} placeholder="e.g. Weekend promo"/>
    <TextArea label="DESCRIBE THE MESSAGE YOU WANT" value={form.instructions} onChange={v=>set("instructions",v)} placeholder="Example: Tell old customers we have a weekend discount. Keep it short, friendly, mention limited slots, and ask them to reply BOOK." rows={6}/>
    <Field label="WHO IS THIS FOR?" value={form.audience} onChange={v=>set("audience",v)} placeholder="e.g. Existing customers"/>
    <Field label="WHAT SHOULD THE MESSAGE ACHIEVE?" value={form.goal} onChange={v=>set("goal",v)} placeholder="e.g. Get bookings before Saturday"/>
    <div><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>TONE</div><Tone value={form.tone} onChange={v=>set("tone",v)} options={["Friendly","Professional","Short","Persuasive"]}/></div>
    <Btn disabled={busy} onClick={run}>{busy?"Creating campaign...":"Create WhatsApp message"}</Btn>
    {err&&<ErrorBox>{err}</ErrorBox>}{out&&<Result title="WhatsApp message" text={out}/>} 
  </Page>
}

function SmartReply({p}){
  const[msg,setMsg]=useState(""),[instructions,setInstructions]=useState(""),[tone,setTone]=useState("Friendly"),[out,setOut]=useState(""),[err,setErr]=useState(""),[busy,setBusy]=useState(false);
  async function run(){if(!msg.trim()){setErr("Paste the customer message first.");return}if(!instructions.trim()){setErr("Describe how you want BizAI to reply.");return}setBusy(true);setErr("");setOut("");try{const d=await post("/api/generate",{task:"reply",businessName:p.business,product:p.product,price:p.price,location:p.location,customerMessage:msg,replyInstructions:instructions,tone});setOut(d.text||"")}catch(e){setErr(e.message)}finally{setBusy(false)}}
  return <Page title="Smart Reply" sub="Paste the customer message, then tell BizAI exactly how you want to respond.">
    <TextArea label="CUSTOMER MESSAGE" value={msg} onChange={setMsg} placeholder="Paste what the customer sent..." rows={5}/>
    <TextArea label="HOW DO YOU WANT TO REPLY?" value={instructions} onChange={setInstructions} placeholder="Example: Apologize, confirm we received the complaint, ask for the transaction ID, and tell them we will review the refund today." rows={5}/>
    <div><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>TONE</div><Tone value={tone} onChange={setTone} options={["Friendly","Professional","Short","Persuasive"]}/></div>
    <Btn disabled={busy} onClick={run}>{busy?"Writing reply...":"Create reply"}</Btn>
    {err&&<ErrorBox>{err}</ErrorBox>}{out&&<Result title="Ready-to-send reply" text={out}/>} 
  </Page>
}

function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines=4){const words=String(text||"").split(/\s+/);let line="",lines=[];for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;if(lines.length>=maxLines-1)break}else line=test}if(line&&lines.length<maxLines)lines.push(line);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));}

function Flyer({p}){
  const ref=useRef(null),[src,setSrc]=useState(null),[headline,setHeadline]=useState(p.business||"Your Business"),[brief,setBrief]=useState(""),[cta,setCta]=useState("Message us today"),[accent,setAccent]=useState("#50d9ff");
  useEffect(()=>{const c=ref.current;if(!c)return;const x=c.getContext("2d");c.width=400;c.height=520;const drawFooter=()=>{x.fillStyle="#07142d";x.fillRect(0,340,400,180);x.fillStyle=accent;x.fillRect(0,340,400,5);x.fillStyle="#fff";x.font="bold 26px sans-serif";wrapText(x,headline||p.business||"Your Business",22,385,355,31,2);x.font="15px sans-serif";x.fillStyle="#c5d3ed";wrapText(x,brief||p.product||"Describe your flyer message",22,440,355,21,3);x.fillStyle=accent;x.font="bold 16px sans-serif";x.fillText(cta||"Message us today",22,500)};x.fillStyle="#10264d";x.fillRect(0,0,400,340);if(!src){x.fillStyle=C.muted;x.font="15px sans-serif";x.fillText("Add a product or business photo",92,170);drawFooter();return}const im=new Image();im.onload=()=>{const s=Math.max(400/im.width,340/im.height),w=im.width*s,h=im.height*s;x.drawImage(im,(400-w)/2,(340-h)/2,w,h);drawFooter()};im.src=src},[src,headline,brief,cta,accent,p]);
  function pick(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setSrc(r.result);r.readAsDataURL(f)}
  function dl(){const a=document.createElement("a");a.download="bizai-flyer.png";a.href=ref.current.toDataURL("image/png");a.click()}
  return <Page title="Flyer Designer" sub="Describe what you want on the flyer, add an optional photo, then create and download it.">
    <Field label="FLYER HEADLINE" value={headline} onChange={setHeadline} placeholder="e.g. Weekend Haircut Offer"/>
    <TextArea label="DESCRIBE THE FLYER / MESSAGE" value={brief} onChange={setBrief} placeholder="Example: Promote 20% off this weekend. Make it bold and simple. Mention limited slots and Kaduna." rows={5}/>
    <Field label="CALL TO ACTION" value={cta} onChange={setCta} placeholder="e.g. Book on WhatsApp"/>
    <label><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>ACCENT COLOR</div><input type="color" value={accent} onChange={e=>setAccent(e.target.value)} style={{width:"100%",height:46,border:0,borderRadius:12,background:"transparent"}}/></label>
    <label><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>OPTIONAL PHOTO</div><input type="file" accept="image/*" onChange={pick} style={{color:C.muted}}/></label>
    <canvas ref={ref} style={{width:"100%",borderRadius:20,border:`1px solid ${C.line}`}}/>
    <Btn onClick={dl}>Download flyer</Btn>
  </Page>
}

function WebsiteComingSoon(){return <Page title="Website AI" sub="We proved the generation flow works. Full website creation will return after the AI service and publishing flow are ready."><Card><div style={{fontSize:11,color:C.cyan,fontWeight:900}}>COMING SOON</div><div style={{fontSize:21,fontWeight:900,marginTop:8}}>Website AI is being upgraded</div><div style={{fontSize:13,color:C.muted,lineHeight:1.6,marginTop:8}}>It will let users describe a complete website, preview it, edit it with BizAI and publish it. We are keeping this feature closed until the full generation service is reliable.</div></Card></Page>}

function Bizora(){const[m,setM]=useState(()=>{try{return JSON.parse(localStorage.getItem("bizora_chat")||"[]")}catch{return[]}}),[text,setText]=useState(""),[busy,setBusy]=useState(false),[err,setErr]=useState("");const ref=useRef(null);useEffect(()=>{localStorage.setItem("bizora_chat",JSON.stringify(m));if(ref.current)ref.current.scrollTop=ref.current.scrollHeight},[m]);async function send(){const t=text.trim();if(!t||busy)return;const next=[...m,{role:"user",content:t}];setM(next);setText("");setBusy(true);setErr("");try{const d=await post("/api/chat",{messages:next});setM([...next,{role:"assistant",content:d.text||""}])}catch(e){setErr(e.message)}finally{setBusy(false)}}return <div style={{height:"calc(100vh - 69px)",display:"flex",flexDirection:"column"}}><div ref={ref} style={{flex:1,overflowY:"auto",padding:"18px",display:"flex",flexDirection:"column",gap:12}}>{m.length===0&&<div style={{textAlign:"center",padding:"55px 12px"}}><div style={{width:78,height:78,borderRadius:"50%",display:"grid",placeItems:"center",margin:"0 auto",fontSize:35,background:"radial-gradient(circle at 35% 30%,#71eaff,#4865ff 45%,#171d55 72%)",boxShadow:"0 0 55px rgba(77,134,255,.5)"}}>✧</div><div style={{fontSize:24,fontWeight:900,marginTop:20}}>How can I help?</div><div style={{fontSize:13,color:C.muted,marginTop:7}}>Ask Bizora about business, ideas, writing, planning, coding or anything else.</div></div>}{m.map((x,i)=><div key={i} style={{maxWidth:"86%",alignSelf:x.role==="user"?"flex-end":"flex-start",padding:"12px 14px",borderRadius:x.role==="user"?"18px 18px 5px 18px":"18px 18px 18px 5px",background:x.role==="user"?"linear-gradient(135deg,#397cff,#675ee8)":"rgba(255,255,255,.06)",border:x.role==="user"?"none":`1px solid ${C.line}`,fontSize:14,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{x.content}</div>)}{busy&&<div style={{color:C.muted,fontSize:13}}>Bizora is thinking...</div>}{err&&<ErrorBox>{err}</ErrorBox>}</div><div style={{padding:12,borderTop:`1px solid ${C.line}`}}><div style={{display:"flex",gap:8,padding:6,borderRadius:18,border:`1px solid ${C.line}`,background:"rgba(255,255,255,.05)"}}><textarea value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} rows={2} placeholder="Ask Bizora anything..." style={{flex:1,border:0,outline:0,resize:"none",background:"transparent",color:C.text,padding:8}}/><button type="button" onClick={send} disabled={busy||!text.trim()} style={{width:44,border:0,borderRadius:14,background:"linear-gradient(135deg,#397cff,#675ee8)",color:"white",fontSize:20}}>↑</button></div></div></div>}

export default function App(){
  const[screen,setScreen]=useState("home"),[p,setP]=useState(()=>{try{return JSON.parse(localStorage.getItem("bizai_profile")||"null")||{business:"",product:"",price:"",location:""}}catch{return{business:"",product:"",price:"",location:""}}});
  useEffect(()=>{localStorage.setItem("bizai_profile",JSON.stringify(p))},[p]);
  const title={profile:"Business profile",ad:"Video Ad Studio",whatsapp:"WhatsApp Campaign",flyer:"Flyer Designer",reply:"Smart Reply",website:"Website AI",ai:"Bizora AI"};
  return <div style={{minHeight:"100vh",display:"flex",justifyContent:"center",background:"radial-gradient(circle at 50% -10%,#173b75,#07152d 30%,#040c1d 72%)",color:C.text,fontFamily:"Inter,system-ui,sans-serif"}}><div style={{width:"100%",maxWidth:430,minHeight:"100vh",background:"linear-gradient(180deg,rgba(8,23,50,.75),rgba(4,12,29,.95))"}}>{screen!=="home"&&<div style={{position:"sticky",top:0,zIndex:10,display:"flex",gap:12,alignItems:"center",padding:"14px 18px",borderBottom:`1px solid ${C.line}`,background:"rgba(5,13,30,.93)",backdropFilter:"blur(18px)"}}><button type="button" onClick={()=>setScreen("home")} style={{width:38,height:38,borderRadius:12,border:`1px solid ${C.line}`,background:"rgba(255,255,255,.05)",color:"white",fontSize:19}}>←</button><div><div style={{fontSize:17,fontWeight:900}}>{title[screen]}</div><div style={{fontSize:11,color:C.muted}}>BizAI workspace</div></div></div>}
    {screen==="home"&&<Home p={p} go={setScreen}/>} {screen==="profile"&&<Profile p={p} setP={setP} back={()=>setScreen("home")}/>} {screen==="ad"&&<VideoAd p={p}/>} {screen==="whatsapp"&&<WhatsAppCampaign p={p}/>} {screen==="reply"&&<SmartReply p={p}/>} {screen==="flyer"&&<Flyer p={p}/>} {screen==="website"&&<WebsiteComingSoon/>} {screen==="ai"&&<Bizora/>}
  </div></div>
}

import React,{useState}from"react";

const AI_API=(import.meta.env.VITE_API_URL||"").replace(/\/$/,"");
const VIDEO_API=(import.meta.env.VITE_VIDEO_API_URL||"https://bizai-video-dev.onrender.com").replace(/\/$/,"");
const C={text:"#f7f9ff",muted:"#91a5ca",blue:"#4d86ff",cyan:"#50d9ff",line:"rgba(255,255,255,.10)"};
const input={width:"100%",boxSizing:"border-box",padding:"14px",borderRadius:14,border:`1px solid ${C.line}`,background:"rgba(255,255,255,.055)",color:C.text,fontSize:15,outline:"none"};
const btn={width:"100%",padding:"14px 16px",borderRadius:15,border:0,background:"linear-gradient(135deg,#397cff,#6c5cff)",color:"white",fontWeight:850,fontSize:15};
const card={padding:16,borderRadius:18,border:`1px solid ${C.line}`,background:"linear-gradient(145deg,rgba(18,43,84,.96),rgba(8,24,52,.96))"};
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

function Field({label,value,onChange,placeholder}){return <label style={{display:"block"}}><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>{label}</div><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={input}/></label>}
function TextArea({label,value,onChange,placeholder,rows=7}){return <label style={{display:"block"}}><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>{label}</div><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...input,resize:"vertical",lineHeight:1.5}}/></label>}

async function jsonFetch(url,options){const r=await fetch(url,options);let d;try{d=await r.json()}catch{throw new Error("The server returned an invalid response.")}if(!r.ok)throw new Error(d?.error||"Request failed.");return d}

export default function VideoAdStudioV2({profile={}}){
 const[form,setForm]=useState({title:profile.business?`${profile.business} Video Ad`:"",instructions:"",audience:"",goal:"",platform:"TikTok / Instagram Reels",campaignLength:"30 seconds",previewLength:"10",tone:"Energetic",aspectRatio:"9:16"});
 const[plan,setPlan]=useState(""),[video,setVideo]=useState(null),[busyPlan,setBusyPlan]=useState(false),[busyVideo,setBusyVideo]=useState(false),[status,setStatus]=useState("Ready"),[error,setError]=useState("");
 const set=(k,v)=>setForm(f=>({...f,[k]:v}));
 const prompt=`Create a cinematic short-form video advertisement for ${profile.business||"a business"}. Campaign: ${form.title||"Untitled"}. Product/service: ${profile.product||"not specified"}. Price/offer: ${profile.price||"not specified"}. Location: ${profile.location||"not specified"}. Creative brief: ${form.instructions}. Target audience: ${form.audience||"potential customers"}. Goal: ${form.goal||"drive enquiries"}. Platform: ${form.platform}. Style/tone: ${form.tone}. Vertical mobile-first composition. Show realistic commercial-quality visuals, strong subject movement, clean lighting and premium ad cinematography. Do not render logos, watermarks or unreadable text.`;

 async function buildPlan(){
  if(!form.instructions.trim()){setError("Describe the video ad you want first.");return}
  setBusyPlan(true);setError("");setPlan("");setStatus("Building your ad plan...");
  try{
   const d=await jsonFetch(`${AI_API}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({task:"video-ad",businessName:profile.business,product:profile.product,price:profile.price,location:profile.location,title:form.title,instructions:form.instructions,audience:form.audience,goal:form.goal,platform:form.platform,duration:form.campaignLength,tone:form.tone})});
   setPlan(d.text||"");setStatus(d.mode==="lite"?"Ad plan ready · Lite mode":"Ad plan ready");
  }catch(e){setError(e.message);setStatus("Plan stopped")}finally{setBusyPlan(false)}
 }

 async function generateVideo(){
  if(!form.instructions.trim()){setError("Describe the video ad you want first.");return}
  setBusyVideo(true);setError("");setVideo(null);setStatus("Sending video to the renderer...");
  try{
   const start=await jsonFetch(`${VIDEO_API}/api/video/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt,duration:Number(form.previewLength),aspectRatio:form.aspectRatio,generateAudio:true})});
   if(!start.requestId)throw new Error("The video renderer did not return a request ID.");
   setStatus("Video queued. Waiting for the renderer...");
   for(let i=0;i<90;i++){
    await sleep(4000);
    const d=await jsonFetch(`${VIDEO_API}/api/video/status/${encodeURIComponent(start.requestId)}`);
    if(d.status==="COMPLETED"&&d.video?.url){setVideo(d.video);setStatus("MP4 video ready");setBusyVideo(false);return}
    if(d.status==="IN_PROGRESS")setStatus("Rendering your MP4 video...");
    else if(d.status==="IN_QUEUE")setStatus("Video is in the render queue...");
    else setStatus(`Renderer status: ${d.status||"working"}`);
   }
   throw new Error("The render is taking longer than expected. Try again in a moment.");
  }catch(e){setError(e.message);setStatus("Video generation stopped");setBusyVideo(false)}
 }

 return <main style={{padding:"20px 18px 45px",display:"flex",flexDirection:"column",gap:14,color:C.text}}>
  <div><div style={{display:"inline-block",padding:"5px 9px",borderRadius:999,background:"rgba(81,215,255,.12)",border:"1px solid rgba(81,215,255,.3)",color:C.cyan,fontSize:11,fontWeight:850}}>MP4 VIDEO BETA</div><h1 style={{fontSize:26,margin:"10px 0 5px"}}>Video Ad Studio</h1><p style={{fontSize:13,color:C.muted,lineHeight:1.55,margin:0}}>Describe your ad, build the production plan, then render a real vertical MP4 preview you can watch and save on your phone.</p></div>
  <Field label="AD / CAMPAIGN NAME" value={form.title} onChange={v=>set("title",v)} placeholder="e.g. ASD Cuts Transformation Ad"/>
  <TextArea label="DESCRIBE THE VIDEO AD YOU WANT" value={form.instructions} onChange={v=>set("instructions",v)} placeholder="Example: Start with a before-and-after haircut transformation, then show a clean fade, beard shaping, the shop, and end with a WhatsApp booking CTA. Premium dark navy and electric blue vibe."/>
  <Field label="TARGET AUDIENCE" value={form.audience} onChange={v=>set("audience",v)} placeholder="e.g. Men aged 18–35 in Kaduna"/>
  <Field label="GOAL" value={form.goal} onChange={v=>set("goal",v)} placeholder="e.g. Get WhatsApp bookings"/>
  <Field label="PLATFORM" value={form.platform} onChange={v=>set("platform",v)} placeholder="TikTok / Instagram Reels"/>
  <Field label="FULL CAMPAIGN LENGTH" value={form.campaignLength} onChange={v=>set("campaignLength",v)} placeholder="e.g. 30 seconds"/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><label><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>MP4 PREVIEW LENGTH</div><select value={form.previewLength} onChange={e=>set("previewLength",e.target.value)} style={input}><option value="5">5 seconds</option><option value="10">10 seconds</option></select></label><label><div style={{fontSize:11,color:C.muted,fontWeight:850,marginBottom:7}}>VIDEO RATIO</div><select value={form.aspectRatio} onChange={e=>set("aspectRatio",e.target.value)} style={input}><option value="9:16">9:16 Vertical</option><option value="16:9">16:9 Landscape</option><option value="1:1">1:1 Square</option></select></label></div>
  <Field label="STYLE / TONE" value={form.tone} onChange={v=>set("tone",v)} placeholder="Energetic, premium, cinematic..."/>
  <button type="button" disabled={busyPlan||busyVideo} onClick={buildPlan} style={{...btn,opacity:busyPlan||busyVideo?.55:1}}>{busyPlan?"Building ad plan...":"1. Build video ad plan"}</button>
  <button type="button" disabled={busyVideo||busyPlan} onClick={generateVideo} style={{...btn,background:"linear-gradient(135deg,#715cff,#22c7e8)",opacity:busyVideo||busyPlan?.55:1}}>{busyVideo?"Rendering MP4...":"2. Generate MP4 preview"}</button>
  <div style={{textAlign:"center",fontSize:12,color:C.cyan,fontWeight:800}}>{status}</div>
  <div style={{fontSize:11,color:C.muted,lineHeight:1.5,padding:"10px 12px",borderRadius:12,background:"rgba(80,217,255,.06)",border:"1px solid rgba(80,217,255,.12)"}}>The first video-rendering milestone generates a real 5–10 second MP4 preview. After this works reliably, we can stitch multiple generated scenes into a complete 15–30 second ad.</div>
  {error&&<div style={{padding:13,borderRadius:14,color:"#ffc1c7",background:"rgba(255,80,100,.1)",border:"1px solid rgba(255,100,120,.25)",fontSize:13,lineHeight:1.45}}>{error}</div>}
  {plan&&<section><div style={{fontSize:12,color:C.cyan,fontWeight:900,marginBottom:8}}>VIDEO AD PLAN</div><div style={{...card,whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.6}}>{plan}</div></section>}
  {video&&<section style={{display:"flex",flexDirection:"column",gap:10}}><div style={{fontSize:12,color:C.cyan,fontWeight:900}}>MP4 PREVIEW</div><video src={video.url} controls playsInline preload="metadata" style={{width:"100%",borderRadius:18,background:"#000",border:`1px solid ${C.line}`}}/><a href={video.url} target="_blank" rel="noreferrer" download={video.fileName||"bizai-video.mp4"} style={{...btn,textDecoration:"none",textAlign:"center",boxSizing:"border-box"}}>Download / Save MP4</a><div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>On iPhone, if the video opens instead of downloading, use the Share button and choose Save to Files or Save Video.</div></section>}
 </main>;
}

import React,{useState}from"react";
import FreeMotionHub from"./FreeMotionHub.jsx";
import VeoVideoStudio from"./VeoVideoStudio.jsx";

const C={text:"#f7f9ff",muted:"#91a5ca",cyan:"#50d9ff",line:"rgba(115,157,255,.22)"};

export default function VideoStudioHub({profile={}}){
 const[mode,setMode]=useState("free");
 return <div style={{minHeight:"100%"}}>
  <div style={{padding:"14px 18px 0",position:"sticky",top:67,zIndex:8,background:"linear-gradient(180deg,rgba(5,13,30,.98),rgba(5,13,30,.88),rgba(5,13,30,0))",backdropFilter:"blur(12px)"}}>
   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:5,border:`1px solid ${C.line}`,borderRadius:15,background:"rgba(8,22,48,.95)",boxShadow:"0 8px 24px rgba(0,0,0,.18)"}}>
    <button type="button" onClick={()=>setMode("free")} style={{padding:"11px 8px",borderRadius:11,border:"1px solid transparent",background:mode==="free"?"linear-gradient(135deg,#7f39ef,#1ca4df)":"transparent",color:C.text,fontWeight:900,fontSize:12,boxShadow:mode==="free"?"0 0 14px rgba(66,168,255,.25)":"none"}}>🎬 Free Motion</button>
    <button type="button" onClick={()=>setMode("ai")} style={{padding:"11px 8px",borderRadius:11,border:"1px solid transparent",background:mode==="ai"?"linear-gradient(135deg,#7f39ef,#1ca4df)":"transparent",color:C.text,fontWeight:900,fontSize:12,boxShadow:mode==="ai"?"0 0 14px rgba(66,168,255,.25)":"none"}}>✨ AI Veo</button>
   </div>
   <div style={{fontSize:10,color:C.muted,textAlign:"center",padding:"7px 4px 2px",lineHeight:1.45}}>{mode==="free"?"Works now · enhanced motion editor with a Classic safety fallback":"Real generated video · requires Google Veo API billing and backend setup"}</div>
  </div>
  {mode==="free"?<FreeMotionHub profile={profile}/>:<VeoVideoStudio/>}
 </div>;
}

import React,{useState}from"react";
import FreeMotionStudioV3 from"./FreeMotionStudioV3.jsx";
import FreeMotionStudioV2 from"./FreeMotionStudioV2.jsx";
import VideoAdStudioV2 from"./VideoAdStudioV2.jsx";

const C={text:"#f7f9ff",muted:"#91a5ca",cyan:"#54ddff",line:"rgba(113,157,255,.22)"};

export default function FreeMotionHub({profile={}}){
 const[editor,setEditor]=useState("clean");
 const button=(key)=>({padding:"10px 6px",borderRadius:10,border:`1px solid ${editor===key?"#61dcff":"transparent"}`,background:editor===key?"linear-gradient(135deg,#7839e7,#168bcf)":"transparent",color:C.text,fontWeight:900,fontSize:10});
 return <div style={{minHeight:"100%"}}>
  <div style={{padding:"12px 18px 0"}}>
   <div style={{padding:5,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,border:`1px solid ${C.line}`,borderRadius:14,background:"rgba(7,20,44,.88)"}}>
    <button type="button" onClick={()=>setEditor("clean")} style={button("clean")}>✨ Clean V3</button>
    <button type="button" onClick={()=>setEditor("enhanced")} style={button("enhanced")}>🎯 V2</button>
    <button type="button" onClick={()=>setEditor("classic")} style={button("classic")}>🛟 Classic</button>
   </div>
   <div style={{fontSize:10,color:C.muted,textAlign:"center",padding:"6px 4px 0",lineHeight:1.4}}>{editor==="clean"?"Cleaner product-first ads · brighter visuals, minimal text, CTA only at the end":editor==="enhanced"?"Hook → Product → Benefit → CTA · previous enhanced renderer":"Original renderer · safety fallback"}</div>
  </div>
  {editor==="clean"?<FreeMotionStudioV3 profile={profile}/>:editor==="enhanced"?<FreeMotionStudioV2 profile={profile}/>:<VideoAdStudioV2 profile={profile}/>} 
 </div>
}

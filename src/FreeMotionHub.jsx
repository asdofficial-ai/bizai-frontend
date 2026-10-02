import React,{useState}from"react";
import FreeMotionStudioV2 from"./FreeMotionStudioV2.jsx";
import VideoAdStudioV2 from"./VideoAdStudioV2.jsx";

const C={text:"#f7f9ff",muted:"#91a5ca",cyan:"#54ddff",line:"rgba(113,157,255,.22)"};

export default function FreeMotionHub({profile={}}){
 const[editor,setEditor]=useState("enhanced");
 return <div style={{minHeight:"100%"}}>
  <div style={{padding:"12px 18px 0"}}>
   <div style={{padding:5,display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,border:`1px solid ${C.line}`,borderRadius:14,background:"rgba(7,20,44,.88)"}}>
    <button type="button" onClick={()=>setEditor("enhanced")} style={{padding:"10px 8px",borderRadius:10,border:`1px solid ${editor==="enhanced"?"#61dcff":"transparent"}`,background:editor==="enhanced"?"linear-gradient(135deg,#7839e7,#168bcf)":"transparent",color:C.text,fontWeight:900,fontSize:11}}>🎯 Enhanced</button>
    <button type="button" onClick={()=>setEditor("classic")} style={{padding:"10px 8px",borderRadius:10,border:`1px solid ${editor==="classic"?"#61dcff":"transparent"}`,background:editor==="classic"?"linear-gradient(135deg,#7839e7,#168bcf)":"transparent",color:C.text,fontWeight:900,fontSize:11}}>🛟 Classic</button>
   </div>
   <div style={{fontSize:10,color:C.muted,textAlign:"center",padding:"6px 4px 0",lineHeight:1.4}}>{editor==="enhanced"?"Hook → Product → Benefit → CTA · product-first scene ordering and professional endings":"Original renderer · use this fallback if your device has trouble exporting"}</div>
  </div>
  {editor==="enhanced"?<FreeMotionStudioV2 profile={profile}/>:<VideoAdStudioV2 profile={profile}/>} 
 </div>
}

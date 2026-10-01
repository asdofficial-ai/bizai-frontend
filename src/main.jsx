import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./AppFixed.jsx";
import WebsiteAI from "./WebsiteAIv2.jsx";
import VideoAdStudioV2 from "./VideoAdStudioV2.jsx";

function Shell({title,onBack,children}){
  return <div style={{minHeight:"100vh",display:"flex",justifyContent:"center",background:"radial-gradient(circle at 50% -10%,#173b75,#07152d 30%,#040c1d 72%)",color:"#f7f9ff",fontFamily:"Inter,system-ui,sans-serif"}}>
    <div style={{width:"100%",maxWidth:430,minHeight:"100vh",background:"linear-gradient(180deg,rgba(8,23,50,.75),rgba(4,12,29,.95))"}}>
      <div style={{position:"sticky",top:0,zIndex:10,display:"flex",gap:12,alignItems:"center",padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,.10)",background:"rgba(5,13,30,.93)",backdropFilter:"blur(18px)"}}>
        <button onClick={onBack} style={{width:38,height:38,borderRadius:12,border:"1px solid rgba(255,255,255,.10)",background:"rgba(255,255,255,.05)",color:"white",fontSize:19}}>←</button>
        <div><div style={{fontSize:17,fontWeight:900}}>{title}</div><div style={{fontSize:11,color:"#91a5ca"}}>BizAI workspace</div></div>
      </div>
      {children}
    </div>
  </div>;
}

function DevelopmentApp(){
  const [websiteOpen,setWebsiteOpen]=useState(false);
  const [videoOpen,setVideoOpen]=useState(false);
  const [profile,setProfile]=useState(()=>{try{return JSON.parse(localStorage.getItem("bizai_profile")||"null")||{}}catch{return{}}});

  useEffect(()=>{
    if(websiteOpen||videoOpen)return;
    const openTool=(event)=>{
      const button=event.target.closest?.("button");
      if(!button)return;
      const text=(button.textContent||"").trim().toLowerCase();
      if(text.includes("website")){
        event.preventDefault();
        event.stopPropagation();
        try{setProfile(JSON.parse(localStorage.getItem("bizai_profile")||"null")||{})}catch{setProfile({})}
        setWebsiteOpen(true);
        return;
      }
      if(text.includes("video ad studio")||text==="create"){
        event.preventDefault();
        event.stopPropagation();
        try{setProfile(JSON.parse(localStorage.getItem("bizai_profile")||"null")||{})}catch{setProfile({})}
        setVideoOpen(true);
      }
    };
    document.addEventListener("click",openTool,true);
    return()=>document.removeEventListener("click",openTool,true);
  },[websiteOpen,videoOpen]);

  if(videoOpen)return <Shell title="Video Ad Studio" onBack={()=>setVideoOpen(false)}><VideoAdStudioV2 profile={profile}/></Shell>;
  if(websiteOpen)return <Shell title="Website AI" onBack={()=>setWebsiteOpen(false)}><WebsiteAI profile={profile}/></Shell>;
  return <App/>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><DevelopmentApp/></React.StrictMode>
);

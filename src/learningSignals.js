const API_BASE=(import.meta.env.VITE_API_URL||"").replace(/\/$/,"");

const ALLOWED=new Set([
  "success","correction","misunderstanding","wake_word_failure",
  "false_activation","speech_failure","command_failure"
]);

export async function emitLearningSignal({type,latencyMs,component="frontend",version="web-v1"}={}){
  if(!ALLOWED.has(type)) return false;
  const payload={type,component,version};
  if(Number.isFinite(latencyMs)&&latencyMs>=0) payload.latencyMs=Math.round(latencyMs);
  try{
    const response=await fetch(`${API_BASE}/api/learning/signal`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload),
      keepalive:true
    });
    return response.ok;
  }catch{
    // Telemetry must never break the assistant experience.
    return false;
  }
}

export function timedLearningCall(fn,{component="bizora-chat"}={}){
  const started=performance.now();
  return Promise.resolve()
    .then(fn)
    .then(async result=>{
      await emitLearningSignal({type:"success",latencyMs:performance.now()-started,component});
      return result;
    })
    .catch(async error=>{
      await emitLearningSignal({type:"command_failure",latencyMs:performance.now()-started,component});
      throw error;
    });
}

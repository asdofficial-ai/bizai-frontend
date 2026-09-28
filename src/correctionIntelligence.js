const CORRECTION_PATTERNS = [
  /^no[,! ]/i,
  /not what i (meant|said|asked)/i,
  /i (said|meant|asked)/i,
  /you misunderstood/i,
  /that's not (right|correct|what i meant)/i,
  /that is not (right|correct|what i meant)/i,
  /wrong (room|one|answer|command)/i,
  /i didn't say/i,
  /i did not say/i,
];

export function classifyCorrection(text,{hasAssistantReply=false}={}){
  if(!hasAssistantReply||typeof text!=="string")return null;
  const normalized=text.trim().slice(0,300);
  if(!normalized)return null;
  return CORRECTION_PATTERNS.some(pattern=>pattern.test(normalized))?"correction":null;
}

export function correctionSignalFor(text,options){
  const type=classifyCorrection(text,options);
  return type?{type,component:"bizora-chat",version:"web-v1"}:null;
}

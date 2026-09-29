const HIGH_CONFIDENCE_PATTERNS = [
  /^(?:no|nope)[,! ]+(?:that's|that is|this is|you|i (?:said|meant|asked))/i,
  /\b(?:that's|that is) not what i (?:meant|said|asked)\b/i,
  /\byou (?:misunderstood|misheard) (?:me|that|what i said)\b/i,
  /\byou got (?:it|that|me) wrong\b/i,
  /\bwrong (?:room|one|answer|command|device|light)\b/i,
  /\bi (?:didn't|did not) say\b/i,
  /\bi meant .+\bnot\b .+/i,
];

const CORRECTIVE_PREFIX = /^(?:no|nope|wait|actually|sorry)[,! ]+/i;
const RESTATEMENT = /\bi (?:said|meant|asked)(?: for| you to| that| the| to)?\b/i;

export function classifyCorrection(text,{hasAssistantReply=false}={}){
  if(!hasAssistantReply||typeof text!=="string")return null;
  const normalized=text.trim().replace(/\s+/g," ").slice(0,300);
  if(!normalized)return null;

  // Prefer precision over recall: only explicit correction language is accepted.
  if(HIGH_CONFIDENCE_PATTERNS.some(pattern=>pattern.test(normalized)))return "correction";
  if(CORRECTIVE_PREFIX.test(normalized)&&RESTATEMENT.test(normalized))return "correction";
  return null;
}

export function correctionSignalFor(text,options){
  const type=classifyCorrection(text,options);
  return type?{type,component:"bizora-chat",version:"web-v1"}:null;
}

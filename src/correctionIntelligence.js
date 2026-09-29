const HIGH_CONFIDENCE_PATTERNS = [
  /^(?:no|nope)[,! ]+(?:that's|that is|this is|you|i (?:said|meant|asked))/i,
  /\b(?:that's|that is) not what i (?:meant|said|asked)\b/i,
  /\byou (?:misunderstood|misheard) (?:me|that|what i said)\b/i,
  /\byou got (?:it|that|me) wrong\b/i,
  /\bwrong (?:room|one|answer|command|device|light)\b/i,
  /\bi meant .+\bnot\b .+/i,
];

const CORRECTIVE_PREFIX = /^(?:no|nope|wait|actually|sorry)[,! ]+/i;
const RESTATEMENT = /\bi (?:said|meant|asked)(?: for| you to| that| the| to)?\b/i;
const EXPLICIT_DENIAL_PREFIX = /^(?:no|nope|wait|actually|sorry)[,! ]+/i;
const DENIAL_RESTATEMENT = /\bi (?:didn't|did not) say\s+(?!anything\b|nothing\b|much\b|a word\b).+/i;

export function classifyCorrection(text,{hasAssistantReply=false}={}){
  if(!hasAssistantReply||typeof text!=="string")return null;
  const normalized=text.trim().replace(/\s+/g," ").slice(0,300);
  if(!normalized)return null;

  // Precision-first: ambiguous narration is ignored unless the user explicitly
  // frames the message as a correction of Bizora's immediately preceding reply.
  if(HIGH_CONFIDENCE_PATTERNS.some(pattern=>pattern.test(normalized)))return "correction";
  if(CORRECTIVE_PREFIX.test(normalized)&&RESTATEMENT.test(normalized))return "correction";
  if(EXPLICIT_DENIAL_PREFIX.test(normalized)&&DENIAL_RESTATEMENT.test(normalized))return "correction";
  return null;
}

export function correctionSignalFor(text,options){
  const type=classifyCorrection(text,options);
  return type?{type,component:"bizora-chat",version:"web-v1"}:null;
}

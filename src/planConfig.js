export const FREE_LIMITS={ad:6,whatsapp:5,reply:5,flyer:3,bizora:5,website:0};
export const PREMIUM={monthly:{name:"Premium Monthly",priceNaira:9999,interval:"month"},yearly:{name:"Premium Yearly",priceNaira:107989,interval:"year"}};

const PLAN_KEY="bizai_plan_state";
const USAGE_KEY="bizai_usage_state";

export function getPlanState(){
  try{return JSON.parse(localStorage.getItem(PLAN_KEY)||"null")||{plan:"free",billing:null,status:"active"}}
  catch{return{plan:"free",billing:null,status:"active"}}
}

export function savePlanState(next){localStorage.setItem(PLAN_KEY,JSON.stringify(next));return next}

export function getUsageState(){
  const today=new Date().toISOString().slice(0,10);
  try{
    const saved=JSON.parse(localStorage.getItem(USAGE_KEY)||"null");
    if(saved?.date===today)return saved;
  }catch{}
  const fresh={date:today,ad:0,whatsapp:0,reply:0,flyer:0,bizora:0,website:0};
  localStorage.setItem(USAGE_KEY,JSON.stringify(fresh));
  return fresh;
}

export function incrementUsage(tool){
  const usage=getUsageState();
  const next={...usage,[tool]:(usage[tool]||0)+1};
  localStorage.setItem(USAGE_KEY,JSON.stringify(next));
  return next;
}

export function canUseTool(tool){
  const plan=getPlanState();
  if(plan.plan==="premium")return true;
  const usage=getUsageState();
  const limit=FREE_LIMITS[tool];
  if(typeof limit!=="number")return true;
  return (usage[tool]||0)<limit;
}

import { describe, it, expect } from "vitest";
import { classifyCorrection, correctionSignalFor } from "./correctionIntelligence";

describe("Bizora correction intelligence",()=>{
  it.each([
    "No, I said bedroom",
    "That's not what I meant",
    "You misunderstood me",
    "I said turn off the kitchen light",
    "I didn't say living room",
    "Wrong room"
  ])("detects explicit correction: %s",text=>{
    expect(classifyCorrection(text,{hasAssistantReply:true})).toBe("correction");
  });

  it.each([
    "Hello Bizora",
    "Turn off the bedroom light",
    "What time is it?",
    "Nice, thank you",
    "I said hello to my brother yesterday"
  ])("does not flag ordinary conversation: %s",text=>{
    expect(classifyCorrection(text,{hasAssistantReply:true})).toBe(null);
  });

  it("does not classify before Bizora has replied",()=>{
    expect(classifyCorrection("No, I said bedroom",{hasAssistantReply:false})).toBe(null);
  });

  it("emits only a category and metadata, never the correction text",()=>{
    const privateText="No, I said my private bedroom command";
    const signal=correctionSignalFor(privateText,{hasAssistantReply:true});
    expect(signal).toEqual({type:"correction",component:"bizora-chat",version:"web-v1"});
    expect(JSON.stringify(signal)).not.toContain(privateText);
  });
});

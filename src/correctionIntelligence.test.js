import { describe, it, expect } from "vitest";
import { classifyCorrection, correctionSignalFor } from "./correctionIntelligence";

describe("Bizora correction intelligence",()=>{
  it.each([
    "No, I said bedroom",
    "No! I meant the kitchen",
    "That's not what I meant",
    "You misunderstood me",
    "You misheard what I said",
    "You got it wrong",
    "No, I didn't say living room",
    "Actually, I did not say turn on the fan",
    "Wrong room",
    "Actually, I meant the bedroom not the kitchen"
  ])("detects high-confidence correction: %s",text=>{
    expect(classifyCorrection(text,{hasAssistantReply:true})).toBe("correction");
  });

  it.each([
    "Hello Bizora",
    "Turn off the bedroom light",
    "What time is it?",
    "Nice, thank you",
    "I said hello to my brother yesterday",
    "I meant to call my brother yesterday",
    "I asked my teacher a question",
    "No problem",
    "No worries",
    "No thanks",
    "Actually I like the bedroom",
    "Wait for me",
    "Wrong answers can happen in exams",
    "My brother said turn off the light",
    "She misunderstood the assignment",
    "I didn't say anything yesterday because I was tired",
    "I didn't say much at the meeting",
    "I did not say a word during class",
    "I didn't say living room when I told my brother the story"
  ])("rejects ordinary or ambiguous conversation: %s",text=>{
    expect(classifyCorrection(text,{hasAssistantReply:true})).toBe(null);
  });

  it("does not classify before Bizora has replied",()=>{
    expect(classifyCorrection("No, I said bedroom",{hasAssistantReply:false})).toBe(null);
  });

  it("rejects empty and non-string input",()=>{
    expect(classifyCorrection("",{hasAssistantReply:true})).toBe(null);
    expect(classifyCorrection(null,{hasAssistantReply:true})).toBe(null);
  });

  it("emits only a category and metadata, never the correction text",()=>{
    const privateText="No, I said my private bedroom command";
    const signal=correctionSignalFor(privateText,{hasAssistantReply:true});
    expect(signal).toEqual({type:"correction",component:"bizora-chat",version:"web-v1"});
    expect(JSON.stringify(signal)).not.toContain(privateText);
  });
});

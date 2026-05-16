import { useState, useEffect, useRef } from "react";

const COLORS = {
  terracotta: "#C1714A", terracottaLight: "#F5E8DF", terracottaDark: "#8B4A2A",
  sage: "#5C7A5C", sageLight: "#E8F0E8", sageDark: "#3A5C3A",
  cream: "#FAF6F0", warmWhite: "#FFFDF9",
  bark: "#8B6B4A", barkLight: "#F0E8DC", sand: "#D4B896",
  charcoal: "#2C2420", muted: "#7A6A5A", mutedLight: "#B8A898",
  gold: "#C8961A", goldLight: "#FDF3DC",
  purple: "#6B4FA0", purpleLight: "#F0EBF8", purpleDark: "#4A3070",
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');`;

// ─── PLANS ────────────────────────────────────────────────────────────────────
const PLANS = {
  free: {
    id: "free", label: "Free", priceLabel: "₹0", period: "forever",
    color: COLORS.sage, colorLight: COLORS.sageLight, colorDark: COLORS.sageDark,
    tagline: "Start your mobility journey at no cost",
    features: ["3 sessions per week", "Basic exercise library", "Mobility score tracking", "Home-based routines"],
    locked: ["AI-personalised program", "Progress analytics", "Facilitator support", "Live chat access"],
    sessionCount: 3, exerciseTier: "free",
    ctaLabel: "Start for Free",
  },
  beginner: {
    id: "beginner", label: "Beginner", priceLabel: "₹299", period: "per month",
    color: COLORS.terracotta, colorLight: COLORS.terracottaLight, colorDark: COLORS.terracottaDark,
    tagline: "A structured 8-week program personalised for you",
    badge: "Most Popular",
    features: ["Unlimited sessions per week", "AI-personalised program", "Full progress analytics", "Exercises matched to your condition", "Weekly program refresh"],
    locked: ["Live facilitator check-ins", "Live chat with wellness coach"],
    sessionCount: 4, exerciseTier: "beginner",
    ctaLabel: "Start Beginner Plan",
  },
  pro: {
    id: "pro", label: "Pro", priceLabel: "₹799", period: "per month",
    color: COLORS.purple, colorLight: COLORS.purpleLight, colorDark: COLORS.purpleDark,
    tagline: "Full program + dedicated human support",
    features: ["Everything in Beginner", "Weekly check-in call with facilitator", "Session feedback & form corrections", "Live chat with wellness coach", "Caregiver / family progress updates", "Priority WhatsApp support"],
    locked: [],
    sessionCount: 5, exerciseTier: "pro",
    ctaLabel: "Start Pro Plan",
  },
};

// ─── EXERCISE BANK ────────────────────────────────────────────────────────────
const EXERCISE_BANK = {
  "Fear of falling": {
    free: [
      { name: "Chair Stand Balance", reps: "20 sec hold × 3", tip: "Keep chair within arm's reach" },
      { name: "Seated Ankle Circles", reps: "10 reps each foot", tip: "Move slowly and fully" },
      { name: "Wall Lean Calf Raise", reps: "10 reps", tip: "Press palms flat on wall" },
    ],
    beginner: [
      { name: "Single Leg Stand (Chair Support)", reps: "20 sec each side", tip: "Keep chair within arm's reach" },
      { name: "Heel-to-Toe Walk", reps: "10 steps forward", tip: "Look ahead, not at feet" },
      { name: "Seated Ankle Circles", reps: "10 reps each foot", tip: "Move slowly and fully" },
      { name: "Side-Step Shuffle", reps: "8 steps each way", tip: "Keep knees soft throughout" },
    ],
    pro: [
      { name: "Single Leg Stand (Unsupported)", reps: "30 sec each side", tip: "Facilitator spots first session" },
      { name: "Heel-to-Toe Walk Eyes Closed", reps: "8 steps", tip: "Near wall for safety" },
      { name: "Tandem Stance Progression", reps: "3 × 20 sec", tip: "Coach guides alignment" },
      { name: "Lateral Step-Overs (Low Obstacle)", reps: "6 reps each side", tip: "Go slow, controlled" },
      { name: "Dynamic Weight Shift", reps: "10 reps each side", tip: "Feedback given on form" },
    ],
  },
  "Joint stiffness in mornings": {
    free: [
      { name: "Seated Knee Extensions", reps: "8 reps each leg", tip: "Stop if sharp pain occurs" },
      { name: "Shoulder Rolls", reps: "10 reps each direction", tip: "Keep neck relaxed" },
      { name: "Seated Cat-Cow Stretch", reps: "8 slow reps", tip: "Breathe with each movement" },
    ],
    beginner: [
      { name: "Seated Knee Extensions", reps: "10 reps each leg", tip: "Stop if sharp pain occurs" },
      { name: "Wrist & Finger Stretches", reps: "30 sec hold", tip: "Breathe steadily throughout" },
      { name: "Shoulder Blade Squeezes", reps: "10 reps", tip: "Keep neck relaxed" },
      { name: "Thoracic Rotation (Seated)", reps: "10 reps each side", tip: "Move only within comfort range" },
    ],
    pro: [
      { name: "Warm Water Wrist Soak + Stretch", reps: "5 min", tip: "37°C water works best" },
      { name: "Active Hip Flexor Stretch", reps: "45 sec each side", tip: "Facilitator checks posture" },
      { name: "Foam Roll — Calves & Thoracic", reps: "60 sec each area", tip: "Pause on tender spots" },
      { name: "Proprioceptive Joint Circles", reps: "Full range, 8 reps", tip: "Coach monitors quality" },
      { name: "Resistance Band Shoulder Pass", reps: "10 reps", tip: "Keep core gently engaged" },
    ],
  },
  "Difficulty climbing stairs": {
    free: [
      { name: "Seated Leg Press (Wall)", reps: "8 reps each leg", tip: "Press evenly through heel" },
      { name: "Standing Calf Raises", reps: "10 reps", tip: "Use chair back for balance" },
      { name: "Step Touch Side-to-Side", reps: "12 reps each way", tip: "Keep movements controlled" },
    ],
    beginner: [
      { name: "Seated Wall Leg Press", reps: "10 reps each leg", tip: "Press evenly through heel" },
      { name: "Step-Up Practice (1 step)", reps: "8 reps each leg", tip: "Hold wall for support" },
      { name: "Standing Calf Raises", reps: "12 reps", tip: "Use chair back for balance" },
      { name: "Sit-to-Stand (Slow Eccentric)", reps: "8 reps", tip: "Lower in 3 seconds" },
    ],
    pro: [
      { name: "Eccentric Step-Down Training", reps: "6 reps each leg", tip: "Facilitator spots first session" },
      { name: "Bulgarian Split Squat (Chair)", reps: "8 reps each leg", tip: "Keep front knee over ankle" },
      { name: "Resistance Band Leg Press", reps: "12 reps", tip: "Control the return phase" },
      { name: "Stair Endurance Climb", reps: "3 full flights", tip: "Rest 60 sec between rounds" },
      { name: "Loaded Carry (Light Bag)", reps: "2 × 15 metres", tip: "Shoulders back, core engaged" },
    ],
  },
  "Getting tired quickly": {
    free: [
      { name: "Diaphragmatic Breathing", reps: "5 slow breaths × 3", tip: "Exhale twice as long as inhale" },
      { name: "Seated Marching", reps: "30 sec continuous", tip: "Keep pace comfortable" },
      { name: "Gentle Arm Swings", reps: "20 swings", tip: "Keep shoulders relaxed" },
    ],
    beginner: [
      { name: "Diaphragmatic Breathing", reps: "5 breaths × 3", tip: "Exhale twice as long as inhale" },
      { name: "Seated Marching", reps: "30 sec continuous", tip: "Keep pace comfortable" },
      { name: "Wall Push Isometric Hold", reps: "15 sec hold × 3", tip: "Breathe throughout the hold" },
      { name: "Standing March (In Place)", reps: "40 steps", tip: "Lift knees gently" },
    ],
    pro: [
      { name: "Interval Walk (Home Circuit)", reps: "2 min on / 1 min rest × 4", tip: "Track breath rate throughout" },
      { name: "Box Breathing Protocol", reps: "4 rounds", tip: "Facilitator coaches timing" },
      { name: "Light Band Circuit", reps: "3 exercises × 10 reps", tip: "Rest as needed between sets" },
      { name: "Heart Rate Recovery Check", reps: "Post-session log", tip: "Coach reviews your numbers" },
      { name: "Step-Ups with Breath Control", reps: "8 reps each leg", tip: "Inhale up, exhale down" },
    ],
  },
  "General weakness": {
    free: [
      { name: "Chair Squats", reps: "6 reps", tip: "Lower slowly, use arms if needed" },
      { name: "Standing Hip Circles", reps: "8 each direction", tip: "Hold wall for stability" },
      { name: "Seated Bicep Curls (No Weight)", reps: "10 reps each arm", tip: "Tense the muscle consciously" },
    ],
    beginner: [
      { name: "Chair Squats", reps: "8 reps", tip: "Lower slowly, use arms if needed" },
      { name: "Resistance Band Row", reps: "10 reps", tip: "Keep elbows close to body" },
      { name: "Standing Hip Circles", reps: "8 each direction", tip: "Hold wall for stability" },
      { name: "Glute Bridge (Floor)", reps: "10 reps", tip: "Press through heels evenly" },
    ],
    pro: [
      { name: "Progressive Chair Squat (Weighted)", reps: "10 reps", tip: "Facilitator monitors depth" },
      { name: "TheraBand Full-Body Circuit", reps: "4 exercises × 12 reps", tip: "Rest 45 sec between sets" },
      { name: "Farmer's Carry (Light Bags)", reps: "3 × 15 metres", tip: "Shoulders back throughout" },
      { name: "Core Anti-Rotation Hold", reps: "3 × 20 sec each side", tip: "Brace gently, breathe freely" },
      { name: "Single-Arm Band Press", reps: "10 reps each arm", tip: "Coach checks shoulder alignment" },
    ],
  },
};

// ─── PROGRAM GENERATOR ────────────────────────────────────────────────────────
function generateProgram(answers, planId) {
  const plan = PLANS[planId] || PLANS.beginner;
  const { health = "", energy = "", mobility = "" } = answers;

  const programMap = {
    "Difficulty climbing stairs":  { name: "Step by Step Strength",       focus: "Leg Strength",      score: 62 },
    "Fear of falling":             { name: "Balance & Stability Foundation", focus: "Balance & Posture", score: 58 },
    "Joint stiffness in mornings": { name: "Morning Mobility Flow",        focus: "Joint Flexibility", score: 67 },
    "Getting tired quickly":       { name: "Gentle Endurance Builder",     focus: "Stamina & Breath",  score: 64 },
    "General weakness":            { name: "Whole-Body Strength Revival",  focus: "Functional Strength", score: 61 },
  };

  const timingMap = {
    "Early morning (6–9am)":    ["Monday","Wednesday","Friday","Saturday","Tuesday"],
    "Mid-morning (9am–12pm)":   ["Tuesday","Thursday","Saturday","Monday","Wednesday"],
    "Afternoon (12–4pm)":       ["Monday","Wednesday","Friday","Tuesday","Thursday"],
    "Evening (4–7pm)":          ["Tuesday","Thursday","Sunday","Monday","Wednesday"],
  };

  const sessionTitles = [
    ["Gentle Warm-Up & Activation", "12 min", "Gentle"],
    ["Core Stability & Balance",    "15 min", "Moderate"],
    ["Full Flow & Cool Down",       "20 min", "Restorative"],
    ["Strength & Endurance Build",  "25 min", "Moderate"],
    ["Active Recovery Flow",        "18 min", "Gentle"],
  ];

  const conditionCount = health.split(",").filter(c => c.trim() && c.trim() !== "None of these").length;
  const base = programMap[mobility] || programMap["General weakness"];
  const adjustedScore = Math.max(50, base.score - conditionCount * 3);

  const allDays = timingMap[energy] || ["Monday","Wednesday","Friday","Saturday","Tuesday"];
  const days = allDays.slice(0, plan.sessionCount);
  const sessions = days.map((day, i) => ({
    day, title: sessionTitles[i][0], duration: sessionTitles[i][1], intensity: sessionTitles[i][2],
  }));

  const hasJointIssue = health.includes("Arthritis") || health.includes("Knee");
  const exerciseKey = hasJointIssue ? "Joint stiffness in mornings" : (mobility || "General weakness");
  const bank = EXERCISE_BANK[exerciseKey] || EXERCISE_BANK["General weakness"];
  const exercises = bank[plan.exerciseTier] || bank["beginner"];

  const energyInsight = energy.includes("morning")
    ? "Morning sessions suit you — your body responds best when you move early."
    : energy.includes("Evening")
    ? "Evening movement helps release the day's tension and improves sleep quality."
    : "Mid-day movement keeps energy steady and reduces afternoon fatigue.";

  const insight = conditionCount > 1
    ? `With ${conditionCount} conditions noted, every movement has been kept gentle and joint-safe.`
    : energyInsight;

  const names = ["Savitri","Padma","Radha","Meena","Kamala","Shanti","Usha","Geetha"];
  return {
    userName: names[Math.floor(Math.random() * names.length)],
    program: { name: base.name, week: "Week 1 of 8", focus: base.focus },
    sessions, exercises, insight, mobilityScore: adjustedScore, planId,
  };
}

// ─── PHONE FRAME ──────────────────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div style={{ width:"100vw", minHeight:"100vh", background:"linear-gradient(135deg,#1a1410 0%,#2c1f14 50%,#1a1410 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{fonts}</style>
      <div className="phone-wrapper" style={{ width:390, height:780, background:"#111", borderRadius:48, padding:"10px 8px", boxShadow:"0 40px 80px rgba(0,0,0,0.7),inset 0 0 0 1px rgba(255,255,255,0.08)", position:"relative", flexShrink:0 }}>
        <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", width:120, height:30, background:"#111", borderRadius:"0 0 20px 20px", zIndex:10 }}/>
        <div style={{ width:"100%", height:"100%", borderRadius:40, overflow:"hidden", background:COLORS.cream }}>
          <div style={{ height:"100%", overflowY:"auto", overflowX:"hidden" }}>{children}</div>
        </div>
      </div>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${COLORS.sand};border-radius:2px;}
        @media(max-width:480px){
          .phone-wrapper{width:100vw!important;height:100vh!important;border-radius:0!important;padding:0!important;box-shadow:none!important;}
          .phone-wrapper>div{border-radius:0!important;}
        }
      `}</style>
    </div>
  );
}

// ─── STATUS BAR ───────────────────────────────────────────────────────────────
function StatusBar({ light }) {
  const time = new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false});
  const c = light ? "rgba(255,255,255,0.9)" : COLORS.charcoal;
  return (
    <div style={{ height:44, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>
      <span style={{ fontSize:13, fontWeight:500, color:c }}>{time}</span>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <div style={{ width:15, height:10, border:`1.5px solid ${c}`, borderRadius:2, position:"relative" }}>
          <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:3, height:5, background:c, borderRadius:"0 1px 1px 0" }}/>
          <div style={{ width:"70%", height:"100%", background:c, borderRadius:1, opacity:.7 }}/>
        </div>
        <svg width="15" height="11" viewBox="0 0 15 11">
          <path d="M0 8Q7.5 0 15 8" stroke={c} strokeWidth="1.5" fill="none"/>
          <path d="M2.5 9.5Q7.5 3 12.5 9.5" stroke={c} strokeWidth="1.5" fill="none"/>
          <circle cx="7.5" cy="10" r="1.5" fill={c}/>
        </svg>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ active, onNavigate }) {
  const tabs = [
    { id:"home",     label:"Home",
      icon:(c)=><svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 9.5L11 3L19 9.5V19H14V14H8V19H3V9.5Z" stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round"/></svg> },
    { id:"sessions", label:"Sessions",
      icon:(c)=><svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" stroke={c} strokeWidth="1.5" fill="none"/><path d="M8 7.5L15.5 11L8 14.5V7.5Z" fill={c}/></svg> },
    { id:"progress", label:"Progress",
      icon:(c)=><svg width="22" height="22" viewBox="0 0 22 22"><rect x="2" y="14" width="4" height="6" rx="1" fill={c}/><rect x="9" y="9" width="4" height="11" rx="1" fill={c} opacity=".6"/><rect x="16" y="4" width="4" height="16" rx="1" fill={c} opacity=".35"/></svg> },
    { id:"profile",  label:"Profile",
      icon:(c)=><svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="7" r="4" stroke={c} strokeWidth="1.5" fill="none"/><path d="M3 19C3 15.686 6.686 13 11 13C15.314 13 19 15.686 19 19" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg> },
  ];
  return (
    <div style={{ position:"sticky", bottom:0, background:COLORS.warmWhite, borderTop:`1px solid ${COLORS.barkLight}`, display:"flex", padding:"10px 0 24px" }}>
      {tabs.map(({id,label,icon})=>{
        const isA = active===id;
        const c = isA ? COLORS.terracotta : COLORS.mutedLight;
        return (
          <button key={id} onClick={()=>onNavigate(id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", color:c, fontFamily:"'DM Sans',sans-serif" }}>
            {icon(c)}
            <span style={{ fontSize:10, fontWeight:isA?500:400 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── BACK BUTTON ─────────────────────────────────────────────────────────────
function BackBtn({ onBack }) {
  return (
    <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:4, flexShrink:0 }}>
      <svg width="20" height="16" viewBox="0 0 20 16"><path d="M18 8H2M2 8L9 1M2 8L9 15" stroke={COLORS.charcoal} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function SplashScreen({ onNext }) {
  const [v,setV]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),100);},[]);
  return (
    <div style={{ height:"100%", background:COLORS.cream, display:"flex", flexDirection:"column" }}>
      <StatusBar/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 32px", opacity:v?1:0, transform:v?"translateY(0)":"translateY(20px)", transition:"all 0.7s ease" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:COLORS.terracottaLight, border:`2px solid ${COLORS.terracotta}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28 }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path d="M20 8C20 8 10 14 10 22C10 28 14.5 32 20 32C25.5 32 30 28 30 22C30 14 20 8 20 8Z" fill={COLORS.terracotta} opacity=".2"/>
            <path d="M20 10C20 10 12 15.5 12 22C12 27 15.5 30 20 30" stroke={COLORS.terracotta} strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M20 10C20 10 28 15.5 28 22C28 27 24.5 30 20 30" stroke={COLORS.sage} strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="20" cy="22" r="3" fill={COLORS.terracotta}/>
            <line x1="20" y1="22" x2="20" y2="30" stroke={COLORS.terracotta} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:600, color:COLORS.charcoal, textAlign:"center", lineHeight:1.2, marginBottom:8 }}>CareInPlace</h1>
        <p style={{ fontSize:13, color:COLORS.terracotta, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:500, marginBottom:32 }}>Strength & Stability, At Your Pace</p>
        <div style={{ width:"100%", background:COLORS.barkLight, borderRadius:16, padding:"20px 24px", marginBottom:36, borderLeft:`3px solid ${COLORS.terracotta}` }}>
          <p style={{ fontSize:14, color:COLORS.charcoal, lineHeight:1.6, fontStyle:"italic" }}>"Designed for Indian adults 50–70 who want to stay strong, mobile, and independent — from the comfort of home."</p>
        </div>
        {["Private, home-based sessions","Culturally adapted routines","Personalised to your body & pace"].map((f,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, width:"100%", marginBottom:10 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:i%2===0?COLORS.terracotta:COLORS.sage, flexShrink:0 }}/>
            <span style={{ fontSize:14, color:COLORS.muted }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ padding:"0 32px 48px" }}>
        <button onClick={onNext} style={{ width:"100%", padding:16, background:COLORS.terracotta, border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Begin My Assessment →</button>
        <p style={{ textAlign:"center", fontSize:12, color:COLORS.mutedLight, marginTop:12 }}>Takes about 2 minutes · Free to start</p>
      </div>
    </div>
  );
}

// ─── ASSESSMENT ───────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id:"health",   label:"Do you have any of these conditions?",     sub:"Select all that apply",             type:"multi",
    options:["Knee / joint pain","Arthritis","High blood pressure","Diabetes","Back pain","None of these"] },
  { id:"energy",   label:"When do you feel most energetic?",         sub:"We'll schedule your sessions here",  type:"single",
    options:["Early morning (6–9am)","Mid-morning (9am–12pm)","Afternoon (12–4pm)","Evening (4–7pm)"] },
  { id:"mobility", label:"What concerns you most about your body?",  sub:"Be honest — this shapes your program", type:"single",
    options:["Difficulty climbing stairs","Fear of falling","Joint stiffness in mornings","Getting tired quickly","General weakness"] },
  { id:"exercise", label:"What have you tried before?",              sub:"Select all that apply",             type:"multi",
    options:["Daily walking","Yoga","Gym / weights","Nothing structured","Physiotherapy"] },
];

function AssessmentScreen({ onComplete }) {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({health:[],energy:"",mobility:"",exercise:[]});
  const [visible,setVisible]=useState(true);
  const q=QUESTIONS[step];
  const isSelected=val=>q.type==="single"?answers[q.id]===val:(answers[q.id]||[]).includes(val);
  const canNext=q.type==="single"?!!answers[q.id]:(answers[q.id]||[]).length>0;

  const toggle=(id,val,type)=>{
    if(type==="single") setAnswers(a=>({...a,[id]:val}));
    else setAnswers(a=>{const arr=a[id]||[];return{...a,[id]:arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]};});
  };

  const goNext=()=>{
    if(!canNext) return;
    setVisible(false);
    setTimeout(()=>{
      if(step<QUESTIONS.length-1){setStep(step+1);setVisible(true);}
      else{const p={...answers,health:(answers.health||[]).join(", "),exercise:(answers.exercise||[]).join(", ")};onComplete(p);}
    },250);
  };

  return (
    <div style={{ height:"100%", background:COLORS.cream, display:"flex", flexDirection:"column" }}>
      <StatusBar/>
      <div style={{ padding:"16px 24px 0" }}>
        <p style={{ fontSize:12, color:COLORS.terracotta, fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12 }}>Question {step+1} of {QUESTIONS.length}</p>
        <div style={{ height:4, background:COLORS.barkLight, borderRadius:2, overflow:"hidden", marginBottom:24 }}>
          <div style={{ height:"100%", width:`${((step+1)/QUESTIONS.length)*100}%`, background:COLORS.terracotta, borderRadius:2, transition:"width 0.4s ease" }}/>
        </div>
      </div>
      <div style={{ flex:1, padding:"0 24px", overflowY:"auto", opacity:visible?1:0, transform:visible?"translateX(0)":"translateX(30px)", transition:"all 0.25s ease" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:500, color:COLORS.charcoal, lineHeight:1.3, marginBottom:6 }}>{q.label}</h2>
        <p style={{ fontSize:13, color:COLORS.muted, marginBottom:24 }}>{q.sub}</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {q.options.map(opt=>{
            const sel=isSelected(opt);
            return(
              <button key={opt} onClick={()=>toggle(q.id,opt,q.type)} style={{ width:"100%", padding:"14px 18px", textAlign:"left", background:sel?COLORS.terracottaLight:COLORS.warmWhite, border:`1.5px solid ${sel?COLORS.terracotta:COLORS.barkLight}`, borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"all 0.15s ease", fontFamily:"'DM Sans',sans-serif" }}>
                <div style={{ width:20, height:20, borderRadius:q.type==="single"?"50%":6, border:`2px solid ${sel?COLORS.terracotta:COLORS.mutedLight}`, background:sel?COLORS.terracotta:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {sel&&<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize:14, color:sel?COLORS.terracottaDark:COLORS.charcoal, fontWeight:sel?500:400 }}>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding:"20px 24px 40px" }}>
        <button onClick={goNext} style={{ width:"100%", padding:16, border:"none", borderRadius:14, cursor:canNext?"pointer":"not-allowed", background:canNext?COLORS.terracotta:COLORS.barkLight, color:canNext?"#fff":COLORS.mutedLight, fontSize:15, fontWeight:500, fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s ease" }}>
          {step<QUESTIONS.length-1?"Continue →":"See Plans →"}
        </button>
      </div>
    </div>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function PricingScreen({ onSelect }) {
  const [selected,setSelected]=useState("beginner");
  const plan=PLANS[selected];

  return (
    <div style={{ minHeight:"100%", background:COLORS.cream, display:"flex", flexDirection:"column" }}>
      <StatusBar/>
      <div style={{ padding:"16px 24px 0" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:COLORS.charcoal, marginBottom:10 }}>Choose Your Plan</h2>
        <div style={{ background:COLORS.barkLight, borderRadius:14, padding:"14px 16px", marginBottom:20, borderLeft:`3px solid ${COLORS.terracotta}` }}>
          <p style={{ fontSize:13, color:COLORS.charcoal, lineHeight:1.65 }}>
            CareInPlace delivers home-based, culturally adapted mobility programs for Indian adults aged 50–70. Each plan gives you exercises matched precisely to your body — start free, upgrade when you're ready.
          </p>
        </div>
      </div>

      <div style={{ flex:1, padding:"0 24px", overflowY:"auto", display:"flex", flexDirection:"column", gap:12 }}>
        {Object.values(PLANS).map(p=>{
          const isSel=selected===p.id;
          return(
            <button key={p.id} onClick={()=>setSelected(p.id)} style={{ width:"100%", textAlign:"left", background:isSel?p.colorLight:COLORS.warmWhite, border:`2px solid ${isSel?p.color:COLORS.barkLight}`, borderRadius:18, padding:"18px 20px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s ease", position:"relative" }}>
              {p.badge&&<div style={{ position:"absolute", top:-10, right:16, background:p.color, color:"#fff", fontSize:10, fontWeight:600, padding:"3px 10px", borderRadius:20, letterSpacing:"0.06em" }}>{p.badge}</div>}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <p style={{ fontSize:16, fontWeight:600, color:isSel?p.color:COLORS.charcoal, marginBottom:2 }}>{p.label}</p>
                  <p style={{ fontSize:12, color:COLORS.muted }}>{p.tagline}</p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
                  <p style={{ fontSize:22, fontWeight:600, color:isSel?p.color:COLORS.charcoal }}>{p.priceLabel}</p>
                  <p style={{ fontSize:10, color:COLORS.mutedLight }}>{p.period}</p>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:10 }}>
                {p.features.map(f=>(
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill={p.color} opacity=".15"/><path d="M3 7L5.5 9.5L11 4" stroke={p.color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize:12, color:COLORS.charcoal }}>{f}</span>
                  </div>
                ))}
                {p.locked.map(f=>(
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14"><rect x="4" y="6" width="6" height="5" rx="1" stroke={COLORS.mutedLight} strokeWidth="1.2" fill="none"/><path d="M5 6V4.5C5 3.1 9 3.1 9 4.5V6" stroke={COLORS.mutedLight} strokeWidth="1.2" fill="none"/></svg>
                    <span style={{ fontSize:12, color:COLORS.mutedLight }}>{f}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding:"16px 24px 40px" }}>
        <button onClick={()=>onSelect(selected)} style={{ width:"100%", padding:16, border:"none", borderRadius:14, cursor:"pointer", background:plan.color, color:"#fff", fontSize:15, fontWeight:500, fontFamily:"'DM Sans',sans-serif" }}>
          {plan.ctaLabel} →
        </button>
        <p style={{ textAlign:"center", fontSize:11, color:COLORS.mutedLight, marginTop:10 }}>
          {selected==="free"?"No credit card required · Upgrade anytime":"Cancel anytime · No hidden charges"}
        </p>
      </div>
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────────────────────
function LoadingScreen() {
  const [dot,setDot]=useState(0);
  const phrases=["Reading your profile…","Matching exercises to your conditions…","Scheduling your sessions…","Almost ready…"];
  const [phrase,setPhrase]=useState(0);
  useEffect(()=>{
    const d=setInterval(()=>setDot(x=>(x+1)%3),400);
    const p=setInterval(()=>setPhrase(x=>(x+1)%phrases.length),1800);
    return()=>{clearInterval(d);clearInterval(p);};
  },[]);
  return(
    <div style={{ height:"100%", background:COLORS.charcoal, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginBottom:32 }}>
        {[0,45,90,135,180,225,270,315].map((angle,i)=>(
          <ellipse key={i} cx="40" cy="40" rx="8" ry="20" transform={`rotate(${angle} 40 40)`} fill={i%2===0?COLORS.terracotta:COLORS.sage} opacity={0.3+i*0.08}/>
        ))}
        <circle cx="40" cy="40" r="8" fill={COLORS.terracotta}/>
      </svg>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#fff", marginBottom:12 }}>Building your program</h2>
      <p style={{ fontSize:14, color:COLORS.sand, marginBottom:40 }}>{phrases[phrase]}{"...".slice(0,dot+1)}</p>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background:dot===i?COLORS.terracotta:"rgba(255,255,255,0.2)", transition:"background 0.3s ease" }}/>)}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardScreen({ program, onNavigate }) {
  const today = new Date();
  const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weekDays = Array.from({length:7},(_,i)=>{
    const d=new Date(today); d.setDate(today.getDate()-today.getDay()+i);
    return{label:dayLabels[d.getDay()],date:d.getDate(),isToday:d.toDateString()===today.toDateString(),dayNum:d.getDay()};
  });
  const fullDayMap={Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6,Sunday:0};
  const sessionDayNums=new Set(program.sessions.map(s=>fullDayMap[s.day]));
  const plan=PLANS[program.planId]||PLANS.beginner;

  return(
    <div style={{ background:COLORS.cream, minHeight:"100%", display:"flex", flexDirection:"column" }}>
      <StatusBar/>
      <div style={{ background:COLORS.charcoal, padding:"16px 24px 24px", borderRadius:"0 0 28px 28px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
          <div>
            <p style={{ fontSize:12, color:COLORS.sand, letterSpacing:"0.1em", textTransform:"uppercase" }}>Welcome back</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#fff", marginTop:2 }}>Namaste 🙏</h2>
          </div>
          <div style={{ background:`${plan.color}44`, border:`1px solid ${plan.color}88`, borderRadius:20, padding:"4px 12px" }}>
            <span style={{ fontSize:11, color:plan.color, fontWeight:600 }}>{plan.label}</span>
          </div>
        </div>
        <p style={{ fontSize:13, color:`${COLORS.sand}bb`, marginBottom:16 }}>{program.insight}</p>
        {/* Real week calendar */}
        <div style={{ display:"flex", gap:4 }}>
          {weekDays.map((d,i)=>{
            const isSess=sessionDayNums.has(i);
            const done=isSess&&i<today.getDay();
            return(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:9, color:COLORS.mutedLight, textTransform:"uppercase" }}>{d.label}</span>
                <div style={{ width:32, height:32, borderRadius:"50%", background:d.isToday?COLORS.terracotta:done?COLORS.sage:isSess?"rgba(193,113,74,0.2)":"rgba(255,255,255,0.05)", border:`1.5px solid ${d.isToday?COLORS.terracotta:done?COLORS.sage:isSess?COLORS.terracotta:"rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {done
                    ?<svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5L4 8.5L11 1" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    :<span style={{ fontSize:10, color:d.isToday?"#fff":isSess?COLORS.sand:"rgba(255,255,255,0.3)", fontWeight:d.isToday?600:400 }}>{d.date}</span>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ flex:1, padding:"20px 24px", display:"flex", flexDirection:"column", gap:16 }}>
        {/* Mobility score */}
        <div style={{ background:COLORS.warmWhite, borderRadius:20, padding:"18px 20px", border:`1px solid ${COLORS.barkLight}`, display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ position:"relative", width:64, height:64, flexShrink:0 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke={COLORS.barkLight} strokeWidth="6"/>
              <circle cx="32" cy="32" r="28" fill="none" stroke={COLORS.terracotta} strokeWidth="6"
                strokeDasharray={`${(program.mobilityScore/100)*175.9} 175.9`} strokeLinecap="round" transform="rotate(-90 32 32)"/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:16, fontWeight:600, color:COLORS.charcoal }}>{program.mobilityScore}</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize:12, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>Mobility Score</p>
            <p style={{ fontSize:16, fontWeight:500, color:COLORS.charcoal, marginBottom:4 }}>{program.mobilityScore<60?"Building foundation":program.mobilityScore<75?"Good progress":"Excellent"}</p>
            <p style={{ fontSize:12, color:COLORS.sage }}>↑ +8 from last week</p>
          </div>
        </div>

        {/* Today's session CTA */}
        <button onClick={()=>onNavigate("session")} style={{ width:"100%", background:COLORS.terracotta, border:"none", borderRadius:18, padding:"20px 24px", textAlign:"left", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginBottom:4 }}>{program.sessions[0]?.day} · {program.sessions[0]?.duration}</p>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#fff", marginBottom:6 }}>{program.sessions[0]?.title}</p>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)", background:"rgba(0,0,0,0.2)", padding:"3px 10px", borderRadius:20 }}>{program.sessions[0]?.intensity}</span>
            </div>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="16" height="18" viewBox="0 0 16 18"><path d="M2 1L14 9L2 17V1Z" fill="#fff"/></svg>
            </div>
          </div>
        </button>

        {/* Program chip */}
        <div style={{ background:COLORS.sageLight, borderRadius:18, padding:"16px 20px", border:`1px solid ${COLORS.sage}44` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <p style={{ fontSize:12, color:COLORS.sageDark, textTransform:"uppercase", letterSpacing:"0.08em" }}>Your Program</p>
            <span style={{ fontSize:11, color:COLORS.sage, background:`${COLORS.sage}22`, padding:"3px 10px", borderRadius:20 }}>{program.program?.week}</span>
          </div>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:COLORS.sageDark, marginBottom:4 }}>{program.program?.name}</p>
          <p style={{ fontSize:13, color:COLORS.sage }}>Focus: {program.program?.focus}</p>
        </div>
      </div>
      <BottomNav active="home" onNavigate={onNavigate}/>
    </div>
  );
}

// ─── SESSIONS LIST ────────────────────────────────────────────────────────────
function SessionsScreen({ program, onNavigate }) {
  const plan=PLANS[program.planId]||PLANS.beginner;
  return(
    <div style={{ minHeight:"100%", background:COLORS.cream, display:"flex", flexDirection:"column" }}>
      <StatusBar/>
      <div style={{ padding:"16px 24px 0" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:COLORS.charcoal, marginBottom:4 }}>This Week's Sessions</h2>
        <p style={{ fontSize:13, color:COLORS.muted, marginBottom:20 }}>{plan.label} plan · {program.sessions.length} sessions/week</p>
      </div>
      <div style={{ flex:1, padding:"0 24px", display:"flex", flexDirection:"column", gap:12, overflowY:"auto" }}>
        {program.sessions.map((s,i)=>(
          <button key={i} onClick={()=>onNavigate("session")} style={{ width:"100%", background:COLORS.warmWhite, border:`1px solid ${i===0?COLORS.terracotta:COLORS.barkLight}`, borderRadius:18, padding:"18px 20px", textAlign:"left", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.15s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:i===0?COLORS.terracotta:COLORS.sand }}/>
                  <span style={{ fontSize:12, color:COLORS.muted }}>{s.day} · {s.duration}</span>
                </div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:COLORS.charcoal, marginBottom:6 }}>{s.title}</p>
                <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:COLORS.terracottaLight, color:COLORS.terracottaDark }}>{s.intensity}</span>
              </div>
              <div style={{ width:40, height:40, borderRadius:"50%", background:i===0?COLORS.terracotta:COLORS.barkLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="14" height="16" viewBox="0 0 14 16"><path d="M2 1L12 8L2 15V1Z" fill={i===0?"#fff":COLORS.muted}/></svg>
              </div>
            </div>
          </button>
        ))}

        {/* Exercises for today */}
        <div style={{ background:COLORS.warmWhite, borderRadius:18, padding:"18px 20px", border:`1px solid ${COLORS.barkLight}`, marginTop:4 }}>
          <p style={{ fontSize:12, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Today's Exercises · {program.exercises.length} movements</p>
          {program.exercises.map((ex,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:i<program.exercises.length-1?14:0 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:COLORS.terracottaLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:12, fontWeight:600, color:COLORS.terracotta }}>{i+1}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:500, color:COLORS.charcoal }}>{ex.name}</p>
                <p style={{ fontSize:12, color:COLORS.muted }}>{ex.reps}</p>
                <p style={{ fontSize:11, color:COLORS.sage, marginTop:2 }}>💡 {ex.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="sessions" onNavigate={onNavigate}/>
    </div>
  );
}

// ─── SESSION PLAYER ───────────────────────────────────────────────────────────
function SessionPlayerScreen({ program, onNavigate }) {
  const exercises=program.exercises||[];
  const [current,setCurrent]=useState(0);
  const [phase,setPhase]=useState("ready");
  const [elapsed,setElapsed]=useState(0);
  const ref=useRef(null);
  const ex=exercises[current]||{};

  const startEx=()=>{setPhase("active");setElapsed(0);ref.current=setInterval(()=>setElapsed(e=>{if(e>=29){clearInterval(ref.current);setPhase("rest");return 30;}return e+1;}),1000);};
  const nextEx=()=>{if(current<exercises.length-1){setCurrent(c=>c+1);setPhase("ready");setElapsed(0);}else setPhase("done");};
  useEffect(()=>()=>clearInterval(ref.current),[]);

  if(phase==="done") return(
    <div style={{ minHeight:"100%", background:COLORS.charcoal, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 32px", gap:20 }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:COLORS.sage, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="36" height="30" viewBox="0 0 36 30"><path d="M2 15L12 25L34 3" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:"#fff", textAlign:"center" }}>Session Complete!</h2>
      <p style={{ fontSize:14, color:COLORS.sand, textAlign:"center" }}>You completed all {exercises.length} exercises. Wonderful work today.</p>
      <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:16, padding:"16px 24px", width:"100%", display:"flex", justifyContent:"space-around" }}>
        {[["Duration","~12 min"],["Exercises",exercises.length],["Streak","3 days"]].map(([l,v])=>(
          <div key={l} style={{ textAlign:"center" }}>
            <p style={{ fontSize:20, fontWeight:600, color:COLORS.terracotta }}>{v}</p>
            <p style={{ fontSize:11, color:COLORS.mutedLight }}>{l}</p>
          </div>
        ))}
      </div>
      <button onClick={()=>onNavigate("home")} style={{ width:"100%", padding:16, background:COLORS.terracotta, border:"none", borderRadius:14, color:"#fff", fontSize:15, fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Back to Dashboard</button>
    </div>
  );

  return(
    <div style={{ minHeight:"100%", background:COLORS.cream, display:"flex", flexDirection:"column" }}>
      <StatusBar/>
      <div style={{ padding:"16px 24px", display:"flex", alignItems:"center", gap:16 }}>
        <BackBtn onBack={()=>onNavigate("home")}/>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:12, color:COLORS.muted }}>Exercise {current+1} of {exercises.length}</p>
          <div style={{ height:3, background:COLORS.barkLight, borderRadius:2, marginTop:4 }}>
            <div style={{ height:"100%", width:`${(current/exercises.length)*100}%`, background:COLORS.terracotta, borderRadius:2 }}/>
          </div>
        </div>
      </div>
      <div style={{ flex:1, padding:"8px 24px 24px", display:"flex", flexDirection:"column", gap:20 }}>
        <div style={{ background:COLORS.charcoal, borderRadius:24, padding:"32px 28px", display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
          <div style={{ width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="50" height="60" viewBox="0 0 50 60">
              <ellipse cx="25" cy="12" rx="9" ry="9" fill={COLORS.terracotta} opacity=".8"/>
              <rect x="21" y="21" width="8" height="22" rx="4" fill={COLORS.sand}/>
              <line x1="25" y1="30" x2="10" y2="24" stroke={COLORS.sand} strokeWidth="4" strokeLinecap="round"/>
              <line x1="25" y1="30" x2="40" y2="24" stroke={COLORS.sand} strokeWidth="4" strokeLinecap="round"/>
              <line x1="25" y1="43" x2="18" y2="58" stroke={COLORS.sand} strokeWidth="4" strokeLinecap="round"/>
              <line x1="25" y1="43" x2="32" y2="58" stroke={COLORS.sand} strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#fff", textAlign:"center" }}>{ex.name}</h2>
          <span style={{ fontSize:14, color:COLORS.sand, background:"rgba(255,255,255,0.1)", padding:"6px 16px", borderRadius:20 }}>{ex.reps}</span>
          {phase!=="ready"&&(
            <div style={{ position:"relative", width:80, height:80 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="34" fill="none" stroke={phase==="rest"?COLORS.sage:COLORS.terracotta} strokeWidth="6"
                  strokeDasharray={`${(elapsed/30)*213.6} 213.6`} strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition:"stroke-dasharray 1s linear" }}/>
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:20, fontWeight:600, color:"#fff" }}>{30-elapsed}</span>
              </div>
            </div>
          )}
        </div>
        <div style={{ background:COLORS.goldLight, borderRadius:14, padding:"14px 18px", borderLeft:`3px solid ${COLORS.gold}`, display:"flex", gap:12 }}>
          <span style={{ fontSize:16 }}>💡</span>
          <p style={{ fontSize:13, color:COLORS.charcoal, lineHeight:1.5 }}><strong>Safety tip:</strong> {ex.tip}</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {phase==="ready"&&<button onClick={startEx} style={{ width:"100%", padding:16, background:COLORS.terracotta, border:"none", borderRadius:14, color:"#fff", fontSize:15, fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>▶ Start Exercise</button>}
          {phase==="rest"&&<button onClick={nextEx} style={{ width:"100%", padding:16, background:COLORS.sage, border:"none", borderRadius:14, color:"#fff", fontSize:15, fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Next Exercise →</button>}
          {phase==="active"&&<div style={{ textAlign:"center", padding:12, background:`${COLORS.terracotta}11`, borderRadius:14 }}><p style={{ fontSize:13, color:COLORS.terracottaDark }}>Move gently and breathe normally</p></div>}
          <button onClick={()=>onNavigate("home")} style={{ width:"100%", padding:12, background:"transparent", border:`1px solid ${COLORS.barkLight}`, borderRadius:14, color:COLORS.muted, fontSize:14, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Save & Exit</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function ProgressScreen({ program, onNavigate }) {
  const weeks=[{w:"Week 1",score:60},{w:"Week 2",score:65},{w:"Week 3",score:68},{w:"Now",score:program.mobilityScore}];
  return(
    <div style={{ minHeight:"100%", background:COLORS.cream, display:"flex", flexDirection:"column" }}>
      <StatusBar/>
      <div style={{ padding:"16px 24px 0" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:COLORS.charcoal }}>My Progress</h2>
      </div>
      <div style={{ flex:1, padding:"20px 24px", display:"flex", flexDirection:"column", gap:20, overflowY:"auto" }}>
        <div style={{ background:COLORS.warmWhite, borderRadius:20, padding:20, border:`1px solid ${COLORS.barkLight}` }}>
          <p style={{ fontSize:12, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>Mobility Score Trend</p>
          <div style={{ display:"flex", alignItems:"flex-end", gap:16, height:100 }}>
            {weeks.map((w,i)=>(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:11, color:COLORS.charcoal, fontWeight:500 }}>{w.score}</span>
                <div style={{ width:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end", height:70 }}>
                  <div style={{ width:"100%", height:`${(w.score/100)*70}px`, background:i===weeks.length-1?COLORS.terracotta:COLORS.barkLight, borderRadius:"6px 6px 0 0" }}/>
                </div>
                <span style={{ fontSize:10, color:COLORS.mutedLight }}>{w.w}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[["Sessions Done","12","✓",COLORS.sage],["Day Streak","3","🔥",COLORS.terracotta],["Total Minutes","148","⏱",COLORS.bark],["Program Week","3 / 8","📅",COLORS.gold]].map(([label,value,icon,color])=>(
            <div key={label} style={{ background:COLORS.warmWhite, borderRadius:16, padding:16, border:`1px solid ${COLORS.barkLight}` }}>
              <p style={{ fontSize:22, marginBottom:4 }}>{icon}</p>
              <p style={{ fontSize:22, fontWeight:600, color, marginBottom:2 }}>{value}</p>
              <p style={{ fontSize:12, color:COLORS.muted }}>{label}</p>
            </div>
          ))}
        </div>
        <div style={{ background:COLORS.terracottaLight, borderRadius:18, padding:"18px 20px", border:`1px solid ${COLORS.terracotta}44` }}>
          <p style={{ fontSize:12, color:COLORS.terracottaDark, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Next Milestone</p>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:COLORS.terracottaDark, marginBottom:6 }}>Stair Confidence</p>
          <div style={{ height:6, background:`${COLORS.terracotta}22`, borderRadius:3 }}>
            <div style={{ width:"65%", height:"100%", background:COLORS.terracotta, borderRadius:3 }}/>
          </div>
          <p style={{ fontSize:12, color:COLORS.terracotta, marginTop:6 }}>65% complete · ~5 more sessions</p>
        </div>
      </div>
      <BottomNav active="progress" onNavigate={onNavigate}/>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileScreen({ program, onNavigate, onChangePlan }) {
  const plan=PLANS[program.planId]||PLANS.beginner;
  return(
    <div style={{ minHeight:"100%", background:COLORS.cream, display:"flex", flexDirection:"column" }}>
      <StatusBar/>
      <div style={{ background:COLORS.charcoal, padding:"20px 24px 32px", borderRadius:"0 0 28px 28px", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:COLORS.terracottaLight, border:`3px solid ${COLORS.terracotta}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
          <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="11" r="7" fill={COLORS.terracotta} opacity=".7"/><path d="M4 28C4 22 9 18 16 18C23 18 28 22 28 28" stroke={COLORS.terracotta} strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#fff", marginBottom:6 }}>{program.userName}</h2>
        <div style={{ background:`${plan.color}44`, border:`1px solid ${plan.color}88`, borderRadius:20, padding:"4px 14px" }}>
          <span style={{ fontSize:12, color:plan.color, fontWeight:600 }}>{plan.label} Plan</span>
        </div>
      </div>

      <div style={{ flex:1, padding:"20px 24px", display:"flex", flexDirection:"column", gap:14, overflowY:"auto" }}>
        {/* Plan card */}
        <div style={{ background:plan.colorLight, borderRadius:18, padding:"18px 20px", border:`1.5px solid ${plan.color}44` }}>
          <p style={{ fontSize:12, color:plan.color, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Current Plan</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:COLORS.charcoal }}>{plan.label}</p>
            <p style={{ fontSize:20, fontWeight:600, color:plan.color }}>{plan.priceLabel}<span style={{ fontSize:10, color:COLORS.muted }}>/{plan.period==="forever"?"always":"mo"}</span></p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {plan.features.slice(0,3).map(f=>(
              <div key={f} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill={plan.color} opacity=".15"/><path d="M3 7L5.5 9.5L11 4" stroke={plan.color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize:12, color:COLORS.charcoal }}>{f}</span>
              </div>
            ))}
          </div>
          {program.planId!=="pro"&&(
            <button onClick={onChangePlan} style={{ width:"100%", marginTop:14, padding:10, background:plan.color, border:"none", borderRadius:10, color:"#fff", fontSize:13, fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>
              Upgrade Plan →
            </button>
          )}
        </div>

        {/* My stats */}
        <div style={{ background:COLORS.warmWhite, borderRadius:18, padding:"18px 20px", border:`1px solid ${COLORS.barkLight}` }}>
          <p style={{ fontSize:12, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>My Stats</p>
          {[["Program",program.program?.name],["Focus Area",program.program?.focus],["Sessions/Week",program.sessions?.length],["Mobility Score",program.mobilityScore]].map(([k,v],i,arr)=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", paddingBottom:i<arr.length-1?10:0, marginBottom:i<arr.length-1?10:0, borderBottom:i<arr.length-1?`1px solid ${COLORS.barkLight}`:"none" }}>
              <span style={{ fontSize:13, color:COLORS.muted }}>{k}</span>
              <span style={{ fontSize:13, fontWeight:500, color:COLORS.charcoal }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Settings */}
        {["Notification Preferences","Caregiver / Family Access","Privacy & Data Settings","Help & Support"].map(item=>(
          <button key={item} style={{ width:"100%", background:COLORS.warmWhite, border:`1px solid ${COLORS.barkLight}`, borderRadius:14, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
            <span style={{ fontSize:14, color:COLORS.charcoal }}>{item}</span>
            <svg width="8" height="13" viewBox="0 0 8 13"><path d="M1 1L7 6.5L1 12" stroke={COLORS.mutedLight} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ))}
      </div>
      <BottomNav active="profile" onNavigate={onNavigate}/>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("splash");
  const [answers,setAnswers]=useState(null);
  const [program,setProgram]=useState(null);

  const handleAssessmentDone=(ans)=>{setAnswers(ans);setScreen("pricing");};

  const handlePlanSelect=(planId)=>{
    setScreen("loading");
    setTimeout(()=>{setProgram(generateProgram(answers,planId));setScreen("dashboard");},2800);
  };

  const navigate=(dest)=>{
    const map={home:"dashboard",sessions:"sessions",session:"session",progress:"progress",profile:"profile"};
    setScreen(map[dest]||dest);
  };

  return(
    <PhoneFrame>
      {screen==="splash"    &&<SplashScreen onNext={()=>setScreen("assessment")}/>}
      {screen==="assessment"&&<AssessmentScreen onComplete={handleAssessmentDone}/>}
      {screen==="pricing"   &&<PricingScreen onSelect={handlePlanSelect}/>}
      {screen==="loading"   &&<LoadingScreen/>}
      {screen==="dashboard" &&program&&<DashboardScreen program={program} onNavigate={navigate}/>}
      {screen==="sessions"  &&program&&<SessionsScreen program={program} onNavigate={navigate}/>}
      {screen==="session"   &&program&&<SessionPlayerScreen program={program} onNavigate={navigate}/>}
      {screen==="progress"  &&program&&<ProgressScreen program={program} onNavigate={navigate}/>}
      {screen==="profile"   &&program&&<ProfileScreen program={program} onNavigate={navigate} onChangePlan={()=>setScreen("pricing")}/>}
    </PhoneFrame>
  );
}

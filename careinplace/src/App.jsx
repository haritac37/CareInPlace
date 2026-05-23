import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:"#F9F6F1", surface:"#FFFFFF", surfaceAlt:"#F4F0EA",
  border:"#E8E0D4", borderDark:"#D4C8B8",
  espresso:"#1C1410", bark:"#6B5240", muted:"#9A8878", mutedL:"#C4B8AC",
  clay:"#B8623A", clayL:"#F5EBE4", clayD:"#8C4428",
  sage:"#4A6741", sageL:"#EAF0E8", sageD:"#2E4A28",
  gold:"#A07820", goldL:"#F8F2E0",
  shadow:"0 2px 12px rgba(28,20,16,0.07)",
  shadowMd:"0 8px 32px rgba(28,20,16,0.11)",
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const WEBSITE_URL = "https://careinplace-calmstride.lovable.app";

// ─── EXERCISE BANK ────────────────────────────────────────────────────────────
const EX = {
  "Fear of falling":{
    free:[
      {name:"Chair Stand Balance",     reps:"20 sec × 3",    tip:"Chair always within reach",     muscles:"Ankles · Core"},
      {name:"Seated Ankle Circles",    reps:"10 each foot",  tip:"Full, slow circles",            muscles:"Ankles · Calves"},
      {name:"Wall Lean Calf Raise",    reps:"12 reps",       tip:"Palms flat on wall",            muscles:"Calves · Balance"},
    ],
    pro:[
      {name:"Single Leg Stand",        reps:"30 sec each",   tip:"Facilitator spots you",         muscles:"Core · Hips · Ankles"},
      {name:"Heel-to-Toe Walk",        reps:"10 steps",      tip:"Eyes forward, not at feet",     muscles:"Balance · Coordination"},
      {name:"Tandem Stance",           reps:"3 × 20 sec",    tip:"Coach guides alignment",        muscles:"Core · Postural Control"},
      {name:"Lateral Step-Overs",      reps:"6 each side",   tip:"Slow and controlled",           muscles:"Hips · Glutes · Balance"},
      {name:"Dynamic Weight Shift",    reps:"10 each side",  tip:"Form feedback provided",        muscles:"Core · Hips"},
    ],
  },
  "Joint stiffness in mornings":{
    free:[
      {name:"Seated Knee Extensions",  reps:"8 each leg",    tip:"Stop at sharp pain",            muscles:"Quadriceps · Knees"},
      {name:"Shoulder Rolls",          reps:"10 each way",   tip:"Neck stays relaxed",            muscles:"Shoulders · Upper Back"},
      {name:"Seated Cat-Cow",          reps:"8 slow reps",   tip:"Breathe with movement",         muscles:"Spine · Core"},
    ],
    pro:[
      {name:"Hip Flexor Stretch",      reps:"45 sec each",   tip:"Facilitator checks posture",    muscles:"Hip Flexors · Quads"},
      {name:"Wrist & Finger Stretch",  reps:"30 sec hold",   tip:"Steady breath throughout",      muscles:"Wrists · Fingers"},
      {name:"Shoulder Blade Squeezes", reps:"10 reps",       tip:"Keep neck long",                muscles:"Upper Back · Posture"},
      {name:"Thoracic Rotation",       reps:"10 each side",  tip:"Comfort range only",            muscles:"Thoracic Spine"},
      {name:"Band Shoulder Pass",      reps:"10 reps",       tip:"Core gently engaged",           muscles:"Shoulders · Upper Back"},
    ],
  },
  "Difficulty climbing stairs":{
    free:[
      {name:"Wall Leg Press",          reps:"8 each leg",    tip:"Press through heel evenly",     muscles:"Quads · Glutes"},
      {name:"Standing Calf Raises",    reps:"10 reps",       tip:"Use chair for balance",         muscles:"Calves · Ankles"},
      {name:"Slow Sit-to-Stand",       reps:"6 reps",        tip:"Lower in 3 slow seconds",       muscles:"Quads · Glutes · Core"},
    ],
    pro:[
      {name:"Eccentric Step-Down",     reps:"6 each leg",    tip:"Facilitator spots you",         muscles:"Quads · Knees · Balance"},
      {name:"Step-Up Practice",        reps:"8 each leg",    tip:"Hold wall for support",         muscles:"Quads · Glutes · Balance"},
      {name:"Slow Sit-to-Stand",       reps:"10 reps",       tip:"Lower in 3 seconds",            muscles:"Quads · Glutes · Core"},
      {name:"Stair Endurance Climb",   reps:"3 full flights",tip:"Rest 60 sec between",           muscles:"Full Legs · Cardio"},
      {name:"Loaded Carry",            reps:"2 × 15 metres", tip:"Shoulders back, core long",     muscles:"Core · Grip · Legs"},
    ],
  },
  "Getting tired quickly":{
    free:[
      {name:"Diaphragmatic Breathing", reps:"5 breaths × 3", tip:"Exhale twice as long",         muscles:"Diaphragm · Lungs"},
      {name:"Seated Marching",         reps:"30 sec",         tip:"Comfortable pace only",        muscles:"Hips · Legs"},
      {name:"Gentle Arm Swings",       reps:"20 swings",      tip:"Shoulders stay relaxed",       muscles:"Shoulders · Arms"},
    ],
    pro:[
      {name:"Interval Walk Circuit",   reps:"2 min on/1 off × 4",tip:"Track breath rate",        muscles:"Full Body · Cardio"},
      {name:"Box Breathing",           reps:"4 rounds",       tip:"Facilitator coaches timing",   muscles:"Nervous System"},
      {name:"Wall Push Isometric",     reps:"15 sec × 3",     tip:"Breathe throughout",           muscles:"Chest · Arms · Core"},
      {name:"Standing March",          reps:"40 steps",       tip:"Lift knees gently",            muscles:"Hips · Core"},
      {name:"Step-Ups + Breath",       reps:"8 each leg",     tip:"Inhale up, exhale down",       muscles:"Legs · Breath"},
    ],
  },
  "General weakness":{
    free:[
      {name:"Chair Squats",            reps:"6 reps",         tip:"Lower slowly",                 muscles:"Quads · Glutes · Core"},
      {name:"Hip Circles Standing",    reps:"8 each way",     tip:"Wall for stability",           muscles:"Hips · Lower Back"},
      {name:"Seated Bicep Curls",      reps:"10 each arm",    tip:"Squeeze consciously",          muscles:"Biceps · Forearms"},
    ],
    pro:[
      {name:"Chair Squats",            reps:"10 reps",        tip:"Facilitator monitors depth",   muscles:"Full Leg Chain"},
      {name:"Resistance Band Row",     reps:"10 reps",        tip:"Elbows close to body",         muscles:"Back · Biceps · Posture"},
      {name:"Glute Bridge",            reps:"10 reps",        tip:"Press through heels evenly",   muscles:"Glutes · Hamstrings · Core"},
      {name:"Farmer's Carry",          reps:"3 × 15 metres",  tip:"Shoulders back throughout",    muscles:"Core · Grip · Legs"},
      {name:"Anti-Rotation Hold",      reps:"3 × 20 sec each",tip:"Brace gently, breathe",       muscles:"Core · Obliques"},
    ],
  },
};

// ─── SVG ILLUSTRATIONS ────────────────────────────────────────────────────────
function ExSVG({ name, size=80 }) {
  const s=size; const sc=T.clay; const bd=T.muted;
  const map = {
    "Chair Squats":(
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="22" y="50" width="36" height="5" rx="2" fill={T.border} stroke={T.borderDark} strokeWidth="1"/>
        <rect x="20" y="55" width="3.5" height="16" rx="1.5" fill={T.borderDark}/>
        <rect x="56" y="55" width="3.5" height="16" rx="1.5" fill={T.borderDark}/>
        <ellipse cx="40" cy="15" rx="7" ry="7" fill={sc} opacity=".75"/>
        <path d="M40 22 Q38 32 36 38 Q33 44 30 50 M40 22 Q42 32 44 38 Q47 44 50 50" stroke={bd} strokeWidth="4" strokeLinecap="round"/>
        <path d="M36 30 L24 34 M44 30 L56 34" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
      </svg>
    ),
    "Glute Bridge":(
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <line x1="5" y1="70" x2="75" y2="70" stroke={T.border} strokeWidth="2.5" strokeLinecap="round"/>
        <ellipse cx="14" cy="54" rx="7" ry="7" fill={sc} opacity=".75"/>
        <path d="M14 61 L17 70 L36 70 L46 54 L40 42 L18 38 L14 46 L14 61" stroke={bd} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M46 70 L62 70 L66 62" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M18 38 Q30 27 40 42" stroke={sc} strokeWidth="1.5" strokeDasharray="2 2" opacity=".6"/>
      </svg>
    ),
    "Seated Knee Extensions":(
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="8" y="42" width="44" height="6" rx="2" fill={T.border} stroke={T.borderDark} strokeWidth="1"/>
        <rect x="6" y="48" width="3.5" height="20" rx="1.5" fill={T.borderDark}/>
        <rect x="48" y="48" width="3.5" height="20" rx="1.5" fill={T.borderDark}/>
        <ellipse cx="30" cy="15" rx="7" ry="7" fill={sc} opacity=".75"/>
        <path d="M30 22 L30 42" stroke={bd} strokeWidth="4" strokeLinecap="round"/>
        <path d="M30 32 L18 36 M30 32 L44 36" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M44 42 L68 33" stroke={sc} strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="68" cy="33" r="3.5" fill={sc} opacity=".4"/>
      </svg>
    ),
    "Diaphragmatic Breathing":(
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <ellipse cx="40" cy="18" rx="7" ry="7" fill={sc} opacity=".75"/>
        <path d="M40 25 L40 46" stroke={bd} strokeWidth="4" strokeLinecap="round"/>
        <path d="M40 35 L26 42 M40 35 L54 42" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M38 46 L33 62 M42 46 L47 62" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <ellipse cx="40" cy="36" rx="14" ry="8" stroke={sc} strokeWidth="1.5" strokeDasharray="3 2" opacity=".5"/>
        <circle cx="56" cy="28" r="3" fill={sc} opacity=".5"/>
        <circle cx="63" cy="24" r="2" fill={sc} opacity=".3"/>
      </svg>
    ),
    "Resistance Band Row":(
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="6" y="26" width="5" height="28" rx="2" fill={T.borderDark}/>
        <ellipse cx="28" cy="22" rx="7" ry="7" fill={sc} opacity=".75"/>
        <path d="M28 29 L26 46" stroke={bd} strokeWidth="4" strokeLinecap="round"/>
        <path d="M28 36 L16 40 M28 36 L56 30" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M26 46 L20 62 M26 46 L34 62" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M11 38 Q28 36 56 30" stroke={T.sage} strokeWidth="2" strokeLinecap="round" opacity=".7"/>
      </svg>
    ),
    "Single Leg Stand":(
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <line x1="15" y1="74" x2="65" y2="74" stroke={T.border} strokeWidth="2"/>
        <ellipse cx="38" cy="13" rx="7" ry="7" fill={sc} opacity=".75"/>
        <path d="M38 20 L38 42" stroke={bd} strokeWidth="4" strokeLinecap="round"/>
        <path d="M38 32 L25 36 M38 32 L50 36" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M38 42 L34 58 L34 74" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M38 42 L50 52" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <ellipse cx="38" cy="44" rx="12" ry="5" stroke={sc} strokeWidth="1.5" strokeDasharray="3 2" opacity=".5"/>
      </svg>
    ),
    "Hip Circles Standing":(
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <line x1="18" y1="74" x2="62" y2="74" stroke={T.border} strokeWidth="2"/>
        <ellipse cx="40" cy="14" rx="7" ry="7" fill={sc} opacity=".75"/>
        <path d="M40 21 L40 42" stroke={bd} strokeWidth="4" strokeLinecap="round"/>
        <path d="M40 32 L28 36 M40 32 L52 36" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M38 42 L34 58 L32 74 M42 42 L46 58 L48 74" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <ellipse cx="40" cy="38" rx="13" ry="7" stroke={sc} strokeWidth="1.5" strokeDasharray="3 2" opacity=".6"/>
        <circle cx="53" cy="38" r="3" fill={sc} opacity=".5"/>
      </svg>
    ),
    "Heel-to-Toe Walk":(
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <line x1="5" y1="72" x2="75" y2="72" stroke={T.border} strokeWidth="2"/>
        <ellipse cx="24" cy="18" rx="7" ry="7" fill={sc} opacity=".75"/>
        <path d="M24 25 L24 46" stroke={bd} strokeWidth="4" strokeLinecap="round"/>
        <path d="M24 36 L13 38 M24 36 L37 32" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M22 46 L18 60 L18 72 M26 46 L32 58 L34 72" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M40 72 L55 72 L62 62" stroke={sc} strokeWidth="1.5" strokeDasharray="4 3" opacity=".5" strokeLinecap="round"/>
      </svg>
    ),
  };
  return map[name] || (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="16" rx="7" ry="7" fill={sc} opacity=".75"/>
      <path d="M40 23 L40 44" stroke={bd} strokeWidth="4" strokeLinecap="round"/>
      <path d="M40 34 L26 40 M40 34 L54 40" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M38 44 L34 60 M42 44 L46 60" stroke={bd} strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── PROGRAM BUILDER ─────────────────────────────────────────────────────────
function buildProgram(mobility, energy, health, plan) {
  const pmap = {
    "stairs":  {name:"Step by Step Strength",        focus:"Leg Strength",       score:62, key:"Difficulty climbing stairs"},
    "balance": {name:"Balance & Stability",          focus:"Balance & Posture",  score:58, key:"Fear of falling"},
    "morning": {name:"Morning Mobility Flow",        focus:"Joint Flexibility",  score:67, key:"Joint stiffness in mornings"},
    "stamina": {name:"Gentle Endurance Builder",     focus:"Stamina & Breath",   score:64, key:"Getting tired quickly"},
    "strength":{name:"Whole-Body Strength Revival",  focus:"Functional Strength",score:61, key:"General weakness"},
  };
  const tmap = {
    "morning":  ["Monday","Wednesday","Friday","Saturday"],
    "midday":   ["Tuesday","Thursday","Saturday","Monday"],
    "afternoon":["Monday","Wednesday","Friday","Tuesday"],
    "evening":  ["Tuesday","Thursday","Sunday","Monday"],
  };
  const titles=[["Gentle Warm-Up & Activation","12 min","Gentle"],["Core Stability & Balance","15 min","Moderate"],["Full Flow & Cool Down","20 min","Restorative"],["Strength & Endurance Build","25 min","Moderate"],["Active Recovery Flow","18 min","Gentle"]];
  const base = pmap[mobility] || pmap["strength"];
  const days = (tmap[energy]||["Monday","Wednesday","Friday"]).slice(0, plan==="pro"?4:3);
  const sessions = days.map((day,i)=>({day,title:titles[i][0],duration:titles[i][1],intensity:titles[i][2]}));
  const hasJoint = health.includes("joint")||health.includes("arthritis");
  const ekey = hasJoint ? "Joint stiffness in mornings" : base.key;
  const bank = EX[ekey]||EX["General weakness"];
  const exercises = bank[plan]||bank["free"];
  return { programName:base.name, focus:base.focus, mobilityScore:base.score, sessions, exercises, week:"Week 1 of 8" };
}

// ─── SHELL ────────────────────────────────────────────────────────────────────
function Shell({ children }) {
  return (
    <div style={{width:"100vw",minHeight:"100vh",background:"#100c08",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{fonts}</style>
      <div className="pw" style={{width:390,height:780,background:"#0d0906",borderRadius:50,padding:"10px 9px",boxShadow:"0 40px 80px rgba(0,0,0,.85),inset 0 0 0 1px rgba(255,255,255,.05)",position:"relative",flexShrink:0}}>
        <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",width:116,height:30,background:"#0d0906",borderRadius:"0 0 18px 18px",zIndex:10}}/>
        <div style={{width:"100%",height:"100%",borderRadius:42,overflow:"hidden",background:T.bg}}>
          <div style={{height:"100%",overflowY:"auto",overflowX:"hidden"}}>{children}</div>
        </div>
      </div>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;}
        ::-webkit-scrollbar{width:2px;}::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px;}
        input,select{appearance:none;-webkit-appearance:none;}
        button{font-family:'DM Sans',sans-serif;}
        @media(max-width:480px){.pw{width:100vw!important;height:100vh!important;border-radius:0!important;padding:0!important;box-shadow:none!important;}.pw>div{border-radius:0!important;}}
      `}</style>
    </div>
  );
}

function SBar({light}) {
  const t=new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false});
  const c=light?"rgba(255,255,255,.8)":T.espresso;
  return(
    <div style={{height:44,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",flexShrink:0}}>
      <span style={{fontSize:12,fontWeight:500,color:c,letterSpacing:"0.02em"}}>{t}</span>
      <div style={{display:"flex",gap:5,alignItems:"center"}}>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect x=".5" y=".5" width="15" height="10" rx="1.5" stroke={c} strokeWidth="1.2" opacity=".5"/><rect x="2" y="2" width="9" height="7" rx="1" fill={c}/></svg>
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M0 9Q7 0 14 9" stroke={c} strokeWidth="1.2" opacity=".4"/><path d="M2.5 10Q7 3 11.5 10" stroke={c} strokeWidth="1.2" opacity=".7"/><circle cx="7" cy="10" r="1.5" fill={c}/></svg>
      </div>
    </div>
  );
}

function BNav({active,onNav}) {
  const tabs=[
    {id:"home",    label:"Home",     ic:(a)=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 9L10 2L18 9V18H13V13H7V18H2V9Z" stroke={a?T.clay:T.mutedL} strokeWidth="1.5" strokeLinejoin="round" fill={a?T.clayL:"none"}/></svg>},
    {id:"sessions",label:"Sessions", ic:(a)=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={a?T.clay:T.mutedL} strokeWidth="1.5"/><path d="M7.5 6.5L14.5 10L7.5 13.5V6.5Z" fill={a?T.clay:T.mutedL}/></svg>},
    {id:"progress",label:"Progress", ic:(a)=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="13" width="4" height="6" rx="1" fill={a?T.clay:T.mutedL}/><rect x="8" y="8" width="4" height="11" rx="1" fill={a?T.clay:T.mutedL} opacity={a?1:.6}/><rect x="15" y="3" width="4" height="16" rx="1" fill={a?T.clay:T.mutedL} opacity={a?1:.35}/></svg>},
    {id:"profile", label:"Profile",  ic:(a)=><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke={a?T.clay:T.mutedL} strokeWidth="1.5"/><path d="M3 18C3 14.686 6.134 12 10 12C13.866 12 17 14.686 17 18" stroke={a?T.clay:T.mutedL} strokeWidth="1.5" strokeLinecap="round"/></svg>},
  ];
  return(
    <div style={{position:"sticky",bottom:0,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",padding:"8px 0 20px",flexShrink:0}}>
      {tabs.map(({id,label,ic})=>{
        const a=active===id;
        return <button key={id} onClick={()=>onNav(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 0"}}>
          {ic(a)}<span style={{fontSize:9,fontWeight:a?500:400,color:a?T.clay:T.mutedL,letterSpacing:"0.04em",textTransform:"uppercase"}}>{label}</span>
        </button>;
      })}
    </div>
  );
}

function Chip({label,color=T.clay,bg=T.clayL,style={}}) {
  return <span style={{display:"inline-block",fontSize:10,fontWeight:500,color,background:bg,padding:"3px 10px",borderRadius:20,letterSpacing:"0.04em",...style}}>{label}</span>;
}
function PBtn({label,onClick,bg=T.clay,color="#fff",style={},disabled=false}) {
  return <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"15px 20px",background:disabled?T.border:bg,border:"none",borderRadius:14,color:disabled?T.mutedL:color,fontSize:14,fontWeight:500,cursor:disabled?"not-allowed":"pointer",letterSpacing:"0.01em",transition:"opacity .15s",...style}}>{label}</button>;
}
function Back({onClick}) {
  return <button onClick={onClick} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 0",display:"flex",alignItems:"center",gap:6}}>
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M16 7H2M2 7L8 1M2 7L8 13" stroke={T.espresso} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    <span style={{fontSize:13,color:T.muted}}>Back</span>
  </button>;
}
function Divider() { return <div style={{height:1,background:T.border,margin:"4px 0"}}/>; }

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({onSync,onGetStarted,onFeature}) {
  const [vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),80);},[]);

  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{padding:"8px 22px 32px",opacity:vis?1:0,transform:vis?"none":"translateY(14px)",transition:"all .6s ease"}}>

          {/* Wordmark */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:32}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:T.clay,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
                <path d="M20 8C20 8 10 14 10 22C10 28 14.5 32 20 32C25.5 32 30 28 30 22C30 14 20 8 20 8Z" fill="rgba(255,255,255,.2)"/>
                <path d="M20 10C20 10 12 15.5 12 22C12 27 15.5 30 20 30" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M20 10C20 10 28 15.5 28 22C28 27 24.5 30 20 30" stroke="rgba(255,255,255,.6)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <circle cx="20" cy="22" r="3" fill="white"/>
              </svg>
            </div>
            <div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:T.espresso}}>CareInPlace</p>
              <p style={{fontSize:9,color:T.clay,letterSpacing:"0.14em",textTransform:"uppercase",marginTop:-1}}>Mobile Companion</p>
            </div>
          </div>

          {/* Hero */}
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:500,color:T.espresso,lineHeight:1.2,marginBottom:12}}>
            Your daily<br/><em style={{color:T.clay}}>movement companion.</em>
          </h1>
          <p style={{fontSize:14,color:T.muted,lineHeight:1.7,marginBottom:20}}>
            The CareInPlace app is your pocket guide for daily sessions — open it when it's time to move, and it takes care of the rest.
          </p>

          {/* Companion banner */}
          <div style={{background:T.espresso,borderRadius:16,padding:"16px 18px",marginBottom:24,display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`${T.clay}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke={T.clay} strokeWidth="1.4"/><path d="M10 6v5l3 3" stroke={T.clay} strokeWidth="1.4" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,.9)",marginBottom:3}}>Companion to careinplace.app</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,.45)",lineHeight:1.6}}>Your programs, progress, and community live on the website. This app is where you do your sessions — fast, focused, and at your pace.</p>
              <button onClick={()=>window.open(WEBSITE_URL,"_blank")} style={{marginTop:10,padding:"6px 14px",background:"transparent",border:`1px solid ${T.clay}60`,borderRadius:8,color:T.clay,fontSize:11,cursor:"pointer",fontWeight:500,letterSpacing:"0.04em"}}>
                Visit Website →
              </button>
            </div>
          </div>

          {/* What the app does — clickable */}
          <p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>What you'll do here</p>
          {[
            {icon:"▶", label:"Start & complete daily sessions",    sub:"Step-by-step exercise player with timer",  dest:"preview"},
            {icon:"☀", label:"Daily energy check-in",             sub:"Tells us how you feel — we adjust accordingly", dest:"checkin_preview"},
            {icon:"📈", label:"Track your streak & mobility score", sub:"See your consistency build week by week",  dest:"progress_preview"},
            {icon:"🔔", label:"WhatsApp reminders",               sub:"Gentle nudges on your session days",        dest:null},
          ].map((f,i)=>(
            <button key={i} onClick={()=>f.dest&&onFeature(f.dest)} style={{width:"100%",display:"flex",gap:14,alignItems:"flex-start",paddingBottom:16,paddingTop:i===0?0:16,background:"none",border:"none",borderBottom:i<3?`1px solid ${T.border}`:"none",cursor:f.dest?"pointer":"default",textAlign:"left",transition:"opacity .15s"}} onMouseEnter={e=>f.dest&&(e.currentTarget.style.opacity=".75")} onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
              <div style={{width:36,height:36,borderRadius:10,background:f.dest?T.clayL:T.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:15,border:f.dest?`1px solid ${T.clay}20`:"none"}}>{f.icon}</div>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:500,color:f.dest?T.clay:T.espresso,marginBottom:2}}>{f.label}</p>
                <p style={{fontSize:12,color:T.muted}}>{f.sub}</p>
              </div>
              {f.dest&&<svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{marginTop:4,flexShrink:0}}><path d="M1 1L6 6L1 11" stroke={T.clay} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
          ))}

          {/* CTAs */}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
            <PBtn label="Sync My Account →" onClick={onSync}/>
            <PBtn label="New to CareInPlace? Get Started" onClick={onGetStarted} bg="transparent" color={T.clay} style={{border:`1.5px solid ${T.clay}`,padding:"13px"}}/>
          </div>

          <p style={{textAlign:"center",fontSize:11,color:T.mutedL,marginTop:14,lineHeight:1.6}}>
            Sign up or manage your plan at{" "}
            <button onClick={()=>window.open(WEBSITE_URL,"_blank")} style={{background:"none",border:"none",color:T.clay,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>
              careinplace.app
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SYNC / SIGN IN ───────────────────────────────────────────────────────────
function SyncScreen({onDone,onBack}) {
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  const handleSync=()=>{
    if(!email.includes("@")){setErr("Please enter the email you registered with.");return;}
    setErr(""); setLoading(true);
    setTimeout(()=>{ setLoading(false); onDone(email); },1600);
  };

  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{padding:"8px 22px 0"}}>
        <Back onClick={onBack}/>
      </div>
      <div style={{flex:1,padding:"20px 22px",display:"flex",flexDirection:"column",gap:0}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500,color:T.espresso,marginBottom:6}}>Sync your account</p>
        <p style={{fontSize:13,color:T.muted,lineHeight:1.65,marginBottom:28}}>
          Enter the email you used on{" "}
          <button onClick={()=>window.open(WEBSITE_URL,"_blank")} style={{background:"none",border:"none",color:T.clay,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>careinplace.app</button>
          {" "}to load your program and settings.
        </p>

        <label style={{fontSize:11,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:6}}>Email Address</label>
        <input type="email" placeholder="yourname@email.com" value={email} onChange={e=>setEmail(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleSync()}
          style={{width:"100%",padding:"13px 16px",border:`1.5px solid ${T.border}`,borderRadius:12,fontSize:14,background:T.surface,color:T.espresso,outline:"none",marginBottom:12,transition:"border-color .15s"}}
          onFocus={e=>e.target.style.borderColor=T.clay} onBlur={e=>e.target.style.borderColor=T.border}/>
        {err&&<p style={{fontSize:12,color:"#B03020",marginBottom:12}}>⚠ {err}</p>}

        <PBtn label={loading?"Syncing…":"Sync Account →"} onClick={handleSync} disabled={loading}/>

        {/* Divider */}
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0"}}>
          <div style={{flex:1,height:1,background:T.border}}/><span style={{fontSize:11,color:T.mutedL}}>or</span><div style={{flex:1,height:1,background:T.border}}/>
        </div>

        <button onClick={()=>window.open(`${WEBSITE_URL}/register`,"_blank")} style={{width:"100%",padding:"13px",border:`1.5px solid ${T.border}`,borderRadius:14,background:"transparent",color:T.espresso,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 100 14A7 7 0 008 1z" stroke={T.clay} strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke={T.clay} strokeWidth="1.3" strokeLinecap="round"/></svg>
          Create account on website
        </button>

        <div style={{background:T.surfaceAlt,borderRadius:14,padding:"14px 16px",marginTop:20,border:`1px solid ${T.border}`}}>
          <p style={{fontSize:12,color:T.muted,lineHeight:1.65}}>
            💡 Your program, progress, community, and plan settings are managed on the CareInPlace website. This app syncs with your account to deliver your daily sessions.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING (new users) ───────────────────────────────────────────────────
const OQ=[
  {id:"mobility",label:"What's your main concern?",sub:"We'll load the right program",type:"single",
   options:[{v:"stairs",l:"Difficulty climbing stairs"},{v:"balance",l:"Fear of falling"},{v:"morning",l:"Joint stiffness in mornings"},{v:"stamina",l:"Getting tired quickly"},{v:"strength",l:"General weakness"}]},
  {id:"energy",label:"When do you feel most energetic?",sub:"We'll schedule sessions here",type:"single",
   options:[{v:"morning",l:"Early morning (6–9am)"},{v:"midday",l:"Mid-morning (9am–12pm)"},{v:"afternoon",l:"Afternoon (12–4pm)"},{v:"evening",l:"Evening (4–7pm)"}]},
  {id:"health",label:"Any health conditions?",sub:"Select all that apply",type:"multi",
   options:[{v:"joint",l:"Knee / joint pain"},{v:"arthritis",l:"Arthritis"},{v:"bp",l:"High blood pressure"},{v:"diabetes",l:"Diabetes"},{v:"back",l:"Back pain"},{v:"none",l:"None of these"}]},
  {id:"plan",label:"Which plan are you on?",sub:"You can upgrade anytime at careinplace.app",type:"single",
   options:[{v:"free",l:"Free plan"},{v:"pro",l:"Pro plan (or Free Trial)"}]},
];

function Onboarding({onDone}) {
  const [step,setStep]=useState(0);
  const [ans,setAns]=useState({mobility:"",energy:"",health:[],plan:"free"});
  const [vis,setVis]=useState(true);
  const q=OQ[step];
  const isSel=v=>q.type==="single"?ans[q.id]===v:(ans[q.id]||[]).includes(v);
  const ok=q.type==="single"?!!ans[q.id]:(ans[q.id]||[]).length>0;
  const tog=(id,v,t)=>{if(t==="single")setAns(a=>({...a,[id]:v}));else setAns(a=>{const arr=a[id]||[];return{...a,[id]:arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]};});};
  const next=()=>{
    if(!ok)return; setVis(false);
    setTimeout(()=>{if(step<OQ.length-1){setStep(s=>s+1);setVis(true);}else onDone(ans);},220);
  };
  return(
    <div style={{height:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{padding:"8px 22px 0"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <p style={{fontSize:11,color:T.clay,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase"}}>{step+1} of {OQ.length}</p>
          <p style={{fontSize:11,color:T.mutedL}}>Quick setup</p>
        </div>
        <div style={{height:2,background:T.border,borderRadius:1,overflow:"hidden",marginBottom:26}}>
          <div style={{height:"100%",width:`${((step+1)/OQ.length)*100}%`,background:T.clay,borderRadius:1,transition:"width .4s ease"}}/>
        </div>
      </div>
      <div style={{flex:1,padding:"0 22px",overflowY:"auto",opacity:vis?1:0,transform:vis?"none":"translateX(20px)",transition:"all .22s ease"}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:500,color:T.espresso,lineHeight:1.25,marginBottom:5}}>{q.label}</p>
        <p style={{fontSize:13,color:T.muted,marginBottom:22}}>{q.sub}</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {q.options.map(opt=>{
            const s=isSel(opt.v);
            return <button key={opt.v} onClick={()=>tog(q.id,opt.v,q.type)} style={{width:"100%",padding:"13px 16px",textAlign:"left",background:s?T.clayL:T.surface,border:`1.5px solid ${s?T.clay:T.border}`,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .15s ease"}}>
              <div style={{width:18,height:18,borderRadius:q.type==="single"?"50%":5,border:`1.5px solid ${s?T.clay:T.borderDark}`,background:s?T.clay:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
                {s&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{fontSize:13,color:s?T.clayD:T.espresso,fontWeight:s?500:400}}>{opt.l}</span>
            </button>;
          })}
        </div>
      </div>
      <div style={{padding:"20px 22px 36px"}}>
        <PBtn label={step<OQ.length-1?"Continue →":"Set Up My App →"} onClick={next} disabled={!ok}/>
      </div>
    </div>
  );
}

// ─── DAILY CHECK-IN ───────────────────────────────────────────────────────────
function CheckIn({prog,onDone,onBack}) {
  const [energy,setEnergy]=useState(null);
  const [note,setNote]=useState("");
  const opts=[
    {v:"low",   label:"Low energy",    sub:"Gentle movements only",     color:T.gold},
    {v:"medium",label:"Feeling okay",  sub:"Standard session",          color:T.clay},
    {v:"good",  label:"Feeling strong",sub:"Full session, let's go",    color:T.sage},
  ];
  const today=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"});
  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{padding:"8px 22px 0"}}><Back onClick={onBack}/></div>
      <div style={{flex:1,padding:"12px 22px 24px",display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <p style={{fontSize:11,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>{today}</p>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500,color:T.espresso,lineHeight:1.25,marginBottom:4}}>Good day 🙏</p>
        <p style={{fontSize:14,color:T.muted,marginBottom:22}}>How are you feeling before today's session?</p>

        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
          {opts.map(o=>{
            const s=energy===o.v;
            return <button key={o.v} onClick={()=>setEnergy(o.v)} style={{padding:"14px 16px",textAlign:"left",background:s?`${o.color}12`:T.surface,border:`1.5px solid ${s?o.color:T.border}`,borderRadius:14,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all .15s",boxShadow:s?T.shadow:"none"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:s?o.color:T.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:s?"white":o.color,opacity:s?1:.6}}/>
              </div>
              <div>
                <p style={{fontSize:13,fontWeight:500,color:s?o.color:T.espresso,marginBottom:2}}>{o.label}</p>
                <p style={{fontSize:12,color:T.muted}}>{o.sub}</p>
              </div>
            </button>;
          })}
        </div>

        {/* Notes chatbox */}
        <div style={{marginBottom:20}}>
          <p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Any notes for today? <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></p>
          <div style={{position:"relative"}}>
            <textarea
              value={note}
              onChange={e=>setNote(e.target.value)}
              placeholder="e.g. My knee feels stiff today, can we avoid deep squats… or anything else on your mind"
              rows={3}
              style={{width:"100%",padding:"12px 14px 12px 14px",border:`1.5px solid ${T.border}`,borderRadius:12,fontSize:13,background:T.surface,color:T.espresso,outline:"none",resize:"none",fontFamily:"'DM Sans',sans-serif",lineHeight:1.55,transition:"border-color .15s"}}
              onFocus={e=>e.target.style.borderColor=T.clay}
              onBlur={e=>e.target.style.borderColor=T.border}
            />
            {note.length>0&&(
              <div style={{position:"absolute",bottom:10,right:12,display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:T.sage}}/>
                <span style={{fontSize:10,color:T.sage}}>Noted</span>
              </div>
            )}
          </div>
          {note.length>0&&(
            <p style={{fontSize:11,color:T.muted,marginTop:6,lineHeight:1.5}}>
              💡 Your facilitator will see this note before your next check-in call.
            </p>
          )}
        </div>

        {/* Session preview */}
        {prog?.sessions?.[0]&&(
          <div style={{background:T.surfaceAlt,borderRadius:14,padding:"13px 14px",marginBottom:18,border:`1px solid ${T.border}`}}>
            <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Today's session</p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:T.espresso,marginBottom:2}}>{prog.sessions[0].title}</p>
            <p style={{fontSize:12,color:T.muted}}>{prog.sessions[0].day} · {prog.sessions[0].duration}</p>
          </div>
        )}

        <PBtn label={energy?"Start Today's Session →":"Select how you're feeling first"} onClick={()=>energy&&onDone(energy,note)} disabled={!energy}/>
        <button onClick={()=>onDone("skip","")} style={{background:"none",border:"none",cursor:"pointer",color:T.mutedL,fontSize:12,marginTop:10,textAlign:"center",width:"100%"}}>Skip check-in</button>
      </div>
    </div>
  );
}

// ─── SESSION PREVIEW (from landing) ─────────────────────────────────────────
// Shows a sample exercise list with illustrations so first-time visitors
// understand what a session looks like before they sign up.
const PREVIEW_EXERCISES = [
  {name:"Chair Squats",          reps:"8 reps",        tip:"Lower slowly, use arms if needed",  muscles:"Quads · Glutes · Core"},
  {name:"Seated Knee Extensions",reps:"10 each leg",   tip:"Stop at sharp pain",                muscles:"Quadriceps · Knees"},
  {name:"Diaphragmatic Breathing",reps:"5 breaths × 3",tip:"Exhale twice as long as inhale",   muscles:"Diaphragm · Lungs"},
  {name:"Resistance Band Row",   reps:"10 reps",       tip:"Elbows close to body",              muscles:"Back · Biceps · Posture"},
];

function SessionPreview({onBack,onSignUp}) {
  const [cur,setCur]=useState(0);const [phase,setPhase]=useState("ready");const [el,setEl]=useState(0);
  const ref=useRef(null);const ex=PREVIEW_EXERCISES[cur]||{};
  const start=()=>{setPhase("active");setEl(0);ref.current=setInterval(()=>setEl(e=>{if(e>=29){clearInterval(ref.current);setPhase("rest");return 30;}return e+1;}),1000);};
  const next=()=>{if(cur<PREVIEW_EXERCISES.length-1){setCur(c=>c+1);setPhase("ready");setEl(0);}else{clearInterval(ref.current);setPhase("done");}};
  useEffect(()=>()=>clearInterval(ref.current),[]);

  if(phase==="done") return(
    <div style={{minHeight:"100%",background:T.espresso,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 28px",gap:18}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:T.sage,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none"><path d="M2 11L8 18L26 2" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:"rgba(255,255,255,.95)",textAlign:"center"}}>That's a full session!</p>
      <p style={{fontSize:13,color:"rgba(255,255,255,.4)",textAlign:"center",lineHeight:1.7}}>This is what CareInPlace feels like — guided, calm, and done in under 15 minutes. Your real program is personalised to your body and conditions.</p>
      <PBtn label="Sync Account to Get Started →" onClick={onSignUp}/>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.35)",fontSize:12}}>Back to home</button>
    </div>
  );

  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{padding:"8px 22px 12px",display:"flex",alignItems:"center",gap:14}}>
        <Back onClick={onBack}/>
        <div style={{flex:1}}>
          <p style={{fontSize:11,color:T.muted,marginBottom:3}}>Sample session · {cur+1} of {PREVIEW_EXERCISES.length}</p>
          <div style={{height:2,background:T.border,borderRadius:1}}>
            <div style={{height:"100%",width:`${(cur/PREVIEW_EXERCISES.length)*100}%`,background:T.clay,borderRadius:1,transition:"width .3s"}}/>
          </div>
        </div>
      </div>

      {/* Exercise illustration card */}
      <div style={{margin:"0 22px 14px",background:T.espresso,borderRadius:22,padding:"26px 22px",display:"flex",flexDirection:"column",alignItems:"center",gap:14,boxShadow:T.shadowMd}}>
        <div style={{width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <ExSVG name={ex.name} size={80}/>
        </div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:"rgba(255,255,255,.95)",textAlign:"center",lineHeight:1.3}}>{ex.name}</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
          <Chip label={ex.reps} color="rgba(255,255,255,.7)" bg="rgba(255,255,255,.08)"/>
          {ex.muscles&&<Chip label={ex.muscles} color="rgba(255,255,255,.4)" bg="rgba(255,255,255,.04)"/>}
        </div>
        {phase!=="ready"&&(
          <div style={{position:"relative",width:64,height:64}}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="27" stroke="rgba(255,255,255,.07)" strokeWidth="5"/>
              <circle cx="32" cy="32" r="27" stroke={phase==="rest"?T.sage:T.clay} strokeWidth="5"
                strokeDasharray={`${(el/30)*169.6} 169.6`} strokeLinecap="round" transform="rotate(-90 32 32)"
                style={{transition:"stroke-dasharray 1s linear"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:17,fontWeight:600,color:"rgba(255,255,255,.9)"}}>{30-el}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{padding:"0 22px",display:"flex",flexDirection:"column",gap:10,flex:1}}>
        <div style={{background:T.goldL,borderRadius:13,padding:"11px 15px",border:`1px solid ${T.gold}25`,display:"flex",gap:10}}>
          <span>💡</span><p style={{fontSize:13,color:T.espresso,lineHeight:1.5}}><strong>Tip:</strong> {ex.tip}</p>
        </div>
        {phase==="ready"&&<PBtn label="▶  Start Exercise" onClick={start}/>}
        {phase==="rest"&&<PBtn label="Next Exercise →" onClick={next} bg={T.sage}/>}
        {phase==="active"&&<div style={{textAlign:"center",padding:11,background:`${T.clay}0D`,borderRadius:12,border:`1px solid ${T.clay}18`}}><p style={{fontSize:13,color:T.clay}}>Move gently · Breathe normally</p></div>}
        <div style={{background:T.surfaceAlt,borderRadius:12,padding:"11px 14px",border:`1px solid ${T.border}`}}>
          <p style={{fontSize:11,color:T.muted,lineHeight:1.55}}>👆 This is a sample session. Your real program is personalised to your health conditions and energy patterns.</p>
        </div>
      </div>
    </div>
  );
}

// ─── CHECK-IN PREVIEW (from landing) ─────────────────────────────────────────
function CheckInPreview({onBack,onSignUp}) {
  const [energy,setEnergy]=useState(null);
  const [note,setNote]=useState("");
  const opts=[
    {v:"low",   label:"Low energy",    sub:"Gentle movements only",  color:T.gold},
    {v:"medium",label:"Feeling okay",  sub:"Standard session",       color:T.clay},
    {v:"good",  label:"Feeling strong",sub:"Full session, let's go", color:T.sage},
  ];
  const today=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"});
  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{padding:"8px 22px 0"}}><Back onClick={onBack}/></div>
      <div style={{flex:1,padding:"12px 22px 24px",overflowY:"auto",display:"flex",flexDirection:"column"}}>
        <p style={{fontSize:11,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>{today}</p>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500,color:T.espresso,lineHeight:1.25,marginBottom:4}}>Good day 🙏</p>
        <p style={{fontSize:14,color:T.muted,marginBottom:20}}>Every session starts with a quick check-in. Your answer adjusts today's intensity.</p>

        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {opts.map(o=>{const s=energy===o.v;return(
            <button key={o.v} onClick={()=>setEnergy(o.v)} style={{padding:"14px 16px",textAlign:"left",background:s?`${o.color}12`:T.surface,border:`1.5px solid ${s?o.color:T.border}`,borderRadius:14,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all .15s",boxShadow:s?T.shadow:"none"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:s?o.color:T.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s"}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:s?"white":o.color,opacity:s?1:.6}}/>
              </div>
              <div>
                <p style={{fontSize:13,fontWeight:500,color:s?o.color:T.espresso,marginBottom:2}}>{o.label}</p>
                <p style={{fontSize:12,color:T.muted}}>{o.sub}</p>
              </div>
            </button>
          );})}
        </div>

        <p style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>Any notes for today? <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></p>
        <div style={{position:"relative",marginBottom:18}}>
          <textarea value={note} onChange={e=>setNote(e.target.value)}
            placeholder="e.g. My knee feels stiff today… or anything else on your mind"
            rows={3} style={{width:"100%",padding:"12px 14px",border:`1.5px solid ${T.border}`,borderRadius:12,fontSize:13,background:T.surface,color:T.espresso,outline:"none",resize:"none",fontFamily:"'DM Sans',sans-serif",lineHeight:1.55,transition:"border-color .15s"}}
            onFocus={e=>e.target.style.borderColor=T.clay} onBlur={e=>e.target.style.borderColor=T.border}/>
          {note.length>0&&<div style={{position:"absolute",bottom:10,right:12,display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:"50%",background:T.sage}}/><span style={{fontSize:10,color:T.sage}}>Noted</span></div>}
        </div>

        <div style={{background:T.surfaceAlt,borderRadius:12,padding:"12px 14px",marginBottom:18,border:`1px solid ${T.border}`}}>
          <p style={{fontSize:11,color:T.muted,lineHeight:1.6}}>👆 This is a preview. Once you sync your account, this check-in adapts your real session and sends your notes to your facilitator (on Pro).</p>
        </div>
        <PBtn label="Sync Account to Get Started →" onClick={onSignUp}/>
      </div>
    </div>
  );
}

// ─── PROGRESS PREVIEW (from landing) ─────────────────────────────────────────
function ProgressPreview({onBack,onSignUp}) {
  const weeks=[{w:"Wk 1",s:60},{w:"Wk 2",s:65},{w:"Wk 3",s:68},{w:"Now",s:72}];
  const insights=["Your mobility score has improved by 12 points over 3 weeks — a meaningful start.","3-day streak this week. Consistency at this stage is what drives lasting change.","You've completed 36 individual exercises so far. Each session compounds."];
  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{padding:"8px 22px 0"}}><Back onClick={onBack}/></div>
      <div style={{flex:1,padding:"12px 22px 20px",overflowY:"auto",display:"flex",flexDirection:"column",gap:14}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:500,color:T.espresso}}>Your Progress</p>
        <p style={{fontSize:13,color:T.muted,marginTop:-8}}>This is what your progress screen will look like after a few weeks.</p>

        {/* Score chart */}
        <div style={{background:T.surface,borderRadius:18,padding:"18px",border:`1px solid ${T.border}`,boxShadow:T.shadow}}>
          <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Mobility Score Trend</p>
          <div style={{display:"flex",alignItems:"flex-end",gap:12,height:84}}>
            {weeks.map((w,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <span style={{fontSize:11,color:T.espresso,fontWeight:500}}>{w.s}</span>
                <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",height:60}}>
                  <div style={{width:"100%",height:`${(w.s/100)*60}px`,background:i===weeks.length-1?T.clay:T.border,borderRadius:"5px 5px 0 0"}}/>
                </div>
                <span style={{fontSize:10,color:T.mutedL}}>{w.w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coach insights */}
        <div style={{background:T.goldL,borderRadius:16,padding:"16px",border:`1px solid ${T.gold}25`}}>
          <p style={{fontSize:10,color:T.gold,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,fontWeight:600}}>Coach Insights</p>
          {insights.map((ins,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<insights.length-1?10:0}}>
              <div style={{width:17,height:17,borderRadius:"50%",background:T.gold,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <span style={{fontSize:9,color:"#fff",fontWeight:600}}>{i+1}</span>
              </div>
              <p style={{fontSize:13,color:T.espresso,lineHeight:1.6}}>{ins}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["Sessions Done","12","✓",T.sage],["Day Streak","3","🔥",T.clay],["Total Minutes","148","⏱",T.bark],["Program Week","3 / 8","📅",T.gold]].map(([label,value,icon,color])=>(
            <div key={label} style={{background:T.surface,borderRadius:14,padding:"14px",border:`1px solid ${T.border}`}}>
              <p style={{fontSize:18,marginBottom:4}}>{icon}</p>
              <p style={{fontSize:19,fontWeight:600,color,marginBottom:2}}>{value}</p>
              <p style={{fontSize:11,color:T.muted}}>{label}</p>
            </div>
          ))}
        </div>

        <div style={{background:T.surfaceAlt,borderRadius:12,padding:"12px 14px",border:`1px solid ${T.border}`}}>
          <p style={{fontSize:11,color:T.muted,lineHeight:1.6}}>👆 Sample data. Your real progress screen tracks your actual sessions, streaks, and mobility score over time.</p>
        </div>
        <PBtn label="Sync Account to Get Started →" onClick={onSignUp}/>
      </div>
    </div>
  );
}


function Loading({message="Syncing your account…"}) {
  const [dot,setDot]=useState(0);
  useEffect(()=>{const d=setInterval(()=>setDot(x=>(x+1)%3),380);return()=>clearInterval(d);},[]);
  return(
    <div style={{height:"100%",background:T.espresso,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 32px"}}>
      <div style={{marginBottom:28}}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          {[0,45,90,135,180,225,270,315].map((a,i)=><ellipse key={i} cx="28" cy="28" rx="5" ry="14" transform={`rotate(${a} 28 28)`} fill={i%2===0?T.clay:T.sage} opacity={.25+i*.08}/>)}
          <circle cx="28" cy="28" r="5" fill={T.clay}/>
        </svg>
      </div>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:"rgba(255,255,255,.9)",marginBottom:6,textAlign:"center"}}>{message}</p>
      <p style={{fontSize:12,color:"rgba(255,255,255,.35)",marginBottom:32,textAlign:"center"}}>Just a moment{"...".slice(0,dot+1)}</p>
      <div style={{display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:dot===i?T.clay:"rgba(255,255,255,.12)",transition:"background .3s"}}/>)}</div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({user,prog,streak,onNav,onCheckin}) {
  const today=new Date();
  const dL=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const week=Array.from({length:7},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()-today.getDay()+i);return{label:dL[d.getDay()],date:d.getDate(),isToday:d.toDateString()===today.toDateString(),idx:i};});
  const fdm={Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6,Sunday:0};
  const sdays=new Set(prog.sessions.map(s=>fdm[s.day]));

  return(
    <div style={{background:T.bg,minHeight:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{background:T.espresso,borderRadius:"0 0 24px 24px",flexShrink:0}}>
        <SBar light/>
        <div style={{padding:"4px 22px 22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
            <div>
              <p style={{fontSize:11,color:"rgba(255,255,255,.35)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>Good day</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"rgba(255,255,255,.95)"}}>Namaste, {user.name?.split(" ")[0]||"friend"} 🙏</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:20,fontWeight:600,color:T.clay}}>{streak}</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:"0.04em"}}>day streak</p>
            </div>
          </div>
          <p style={{fontSize:12,color:"rgba(255,255,255,.4)",marginBottom:16,lineHeight:1.5}}>{prog.programName} · {prog.week}</p>
          {/* Week strip */}
          <div style={{display:"flex",gap:4}}>
            {week.map(d=>{
              const iS=sdays.has(d.idx);const done=iS&&d.idx<today.getDay();
              return <div key={d.idx} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:8,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:"0.04em"}}>{d.label}</span>
                <div style={{width:30,height:30,borderRadius:"50%",background:d.isToday?T.clay:done?T.sage:iS?"rgba(184,98,58,.2)":"rgba(255,255,255,.04)",border:`1px solid ${d.isToday?T.clay:done?T.sage:iS?"rgba(184,98,58,.4)":"rgba(255,255,255,.08)"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {done?<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>:<span style={{fontSize:10,color:d.isToday?"white":iS?"rgba(255,255,255,.5)":"rgba(255,255,255,.22)",fontWeight:d.isToday?600:400}}>{d.date}</span>}
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>

      <div style={{flex:1,padding:"18px 22px",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>
        {/* Mobility score */}
        <div style={{background:T.surface,borderRadius:18,padding:"16px 18px",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:16,boxShadow:T.shadow}}>
          <div style={{position:"relative",width:56,height:56,flexShrink:0}}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="23" stroke={T.border} strokeWidth="4.5"/>
              <circle cx="28" cy="28" r="23" stroke={T.clay} strokeWidth="4.5" strokeDasharray={`${(prog.mobilityScore/100)*144.5} 144.5`} strokeLinecap="round" transform="rotate(-90 28 28)"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:14,fontWeight:600,color:T.espresso}}>{prog.mobilityScore}</span>
            </div>
          </div>
          <div>
            <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Mobility Score</p>
            <p style={{fontSize:14,fontWeight:500,color:T.espresso,marginBottom:3}}>{prog.mobilityScore<60?"Building foundation":prog.mobilityScore<75?"Good progress":"Excellent"}</p>
            <p style={{fontSize:11,color:T.sage}}>↑ +8 from last week</p>
          </div>
          <div style={{marginLeft:"auto"}}>
            <button onClick={()=>window.open(`${WEBSITE_URL}/progress`,"_blank")} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,color:T.muted}}>Full report →</button>
          </div>
        </div>

        {/* Today's session CTA */}
        <button onClick={()=>onNav("checkin")} style={{width:"100%",background:T.clay,border:"none",borderRadius:18,padding:"20px 20px",textAlign:"left",cursor:"pointer",boxShadow:T.shadowMd}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <p style={{fontSize:11,color:"rgba(255,255,255,.55)",marginBottom:4,letterSpacing:"0.04em"}}>{prog.sessions[0]?.day} · {prog.sessions[0]?.duration}</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:"#fff",marginBottom:8,lineHeight:1.2}}>{prog.sessions[0]?.title}</p>
              <Chip label={prog.sessions[0]?.intensity||"Gentle"} color="rgba(255,255,255,.8)" bg="rgba(0,0,0,.2)"/>
            </div>
            <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><path d="M1 1L12 7.5L1 14V1Z" fill="white"/></svg>
            </div>
          </div>
        </button>

        {/* Community nudge — lightweight */}
        <div style={{background:T.surface,borderRadius:16,padding:"14px 16px",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,boxShadow:T.shadow}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:T.sageL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="2.5" stroke={T.sage} strokeWidth="1.3"/><circle cx="11" cy="6" r="2.5" stroke={T.sage} strokeWidth="1.3"/><path d="M1 14C1 11.5 3.2 10 6 10" stroke={T.sage} strokeWidth="1.3" strokeLinecap="round"/><path d="M15 14C15 11.5 12.8 10 10 10" stroke={T.sage} strokeWidth="1.3" strokeLinecap="round"/></svg>
          </div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:500,color:T.espresso,marginBottom:1}}>3 people in your program moved today</p>
            <p style={{fontSize:11,color:T.muted}}>Join the conversation on the website</p>
          </div>
          <button onClick={()=>window.open(`${WEBSITE_URL}/community`,"_blank")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke={T.mutedL} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Program info */}
        <div style={{background:T.surface,borderRadius:16,padding:"14px 16px",border:`1px solid ${T.border}`,boxShadow:T.shadow}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Your Program</p>
            <Chip label={prog.week} color={T.sage} bg={T.sageL}/>
          </div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:T.espresso,marginBottom:2}}>{prog.programName}</p>
          <p style={{fontSize:12,color:T.muted}}>Focus · {prog.focus}</p>
        </div>
      </div>
      <BNav active="home" onNav={onNav}/>
    </div>
  );
}

// ─── SESSIONS ─────────────────────────────────────────────────────────────────
function Sessions({prog,onNav}) {
  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{padding:"4px 22px 0"}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:500,color:T.espresso,marginBottom:3}}>Sessions</p>
        <p style={{fontSize:13,color:T.muted,marginBottom:18}}>{prog.sessions.length} sessions this week</p>
      </div>
      <div style={{flex:1,padding:"0 22px 16px",overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
        {prog.sessions.map((s,i)=>(
          <button key={i} onClick={()=>onNav("player")} style={{width:"100%",background:T.surface,border:`1px solid ${i===0?T.clay:T.border}`,borderRadius:16,padding:"16px 16px",textAlign:"left",cursor:"pointer",boxShadow:T.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:i===0?T.clay:T.borderDark}}/>
                  <span style={{fontSize:11,color:T.muted,letterSpacing:"0.04em"}}>{s.day} · {s.duration}</span>
                </div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:T.espresso,marginBottom:6}}>{s.title}</p>
                <Chip label={s.intensity} color={T.clay} bg={T.clayL}/>
              </div>
              <div style={{width:36,height:36,borderRadius:"50%",background:i===0?T.clay:T.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M1 1L11 7L1 13V1Z" fill={i===0?"white":T.muted}/></svg>
              </div>
            </div>
          </button>
        ))}

        {/* Exercises preview */}
        <div style={{background:T.surface,borderRadius:16,padding:"16px 16px",border:`1px solid ${T.border}`,boxShadow:T.shadow,marginTop:4}}>
          <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Today's Exercises · {prog.exercises.length} movements</p>
          {prog.exercises.map((ex,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:i<prog.exercises.length-1?14:0,paddingBottom:i<prog.exercises.length-1?14:0,borderBottom:i<prog.exercises.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{width:44,height:44,borderRadius:11,background:T.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <ExSVG name={ex.name} size={36}/>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:500,color:T.espresso,marginBottom:2}}>{ex.name}</p>
                <p style={{fontSize:12,color:T.muted,marginBottom:2}}>{ex.reps}</p>
                {ex.muscles&&<Chip label={ex.muscles} color={T.bark} bg={T.surfaceAlt}/>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BNav active="sessions" onNav={onNav}/>
    </div>
  );
}

// ─── SESSION PLAYER ───────────────────────────────────────────────────────────
function Player({prog,onNav}) {
  const exs=prog.exercises||[];
  const [cur,setCur]=useState(0);const [phase,setPhase]=useState("ready");const [el,setEl]=useState(0);
  const ref=useRef(null);const ex=exs[cur]||{};
  const start=()=>{setPhase("active");setEl(0);ref.current=setInterval(()=>setEl(e=>{if(e>=29){clearInterval(ref.current);setPhase("rest");return 30;}return e+1;}),1000);};
  const next=()=>{if(cur<exs.length-1){setCur(c=>c+1);setPhase("ready");setEl(0);}else setPhase("done");};
  useEffect(()=>()=>clearInterval(ref.current),[]);

  if(phase==="done") return(
    <div style={{minHeight:"100%",background:T.espresso,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 28px",gap:20}}>
      <div style={{width:68,height:68,borderRadius:"50%",background:T.sage,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="30" height="24" viewBox="0 0 30 24" fill="none"><path d="M2 12L9 20L28 2" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:27,color:"rgba(255,255,255,.95)",textAlign:"center"}}>Session complete</p>
      <p style={{fontSize:13,color:"rgba(255,255,255,.4)",textAlign:"center",lineHeight:1.65}}>You completed all {exs.length} exercises. Wonderful work today.</p>
      <div style={{background:"rgba(255,255,255,.05)",borderRadius:16,padding:"16px 24px",width:"100%",display:"flex",justifyContent:"space-around",border:"1px solid rgba(255,255,255,.07)"}}>
        {[["Duration","~15 min"],["Exercises",exs.length],["Streak","4 days"]].map(([l,v])=>(
          <div key={l} style={{textAlign:"center"}}>
            <p style={{fontSize:20,fontWeight:600,color:T.clay,marginBottom:3}}>{v}</p>
            <p style={{fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:"0.05em"}}>{l}</p>
          </div>
        ))}
      </div>
      <PBtn label="Back to Home" onClick={()=>onNav("home")}/>
      <button onClick={()=>window.open(`${WEBSITE_URL}/progress`,"_blank")} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.4)",fontSize:12,textDecoration:"underline"}}>
        View full progress on website
      </button>
    </div>
  );

  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{padding:"8px 22px 14px",display:"flex",alignItems:"center",gap:14}}>
        <Back onClick={()=>onNav("home")}/>
        <div style={{flex:1}}>
          <p style={{fontSize:11,color:T.muted,marginBottom:4}}>{cur+1} of {exs.length}</p>
          <div style={{height:2,background:T.border,borderRadius:1}}>
            <div style={{height:"100%",width:`${(cur/exs.length)*100}%`,background:T.clay,borderRadius:1,transition:"width .3s ease"}}/>
          </div>
        </div>
      </div>
      <div style={{flex:1,padding:"0 22px 22px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:T.espresso,borderRadius:22,padding:"26px 22px",display:"flex",flexDirection:"column",alignItems:"center",gap:14,boxShadow:T.shadowMd}}>
          <div style={{width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.05)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <ExSVG name={ex.name} size={80}/>
          </div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:"rgba(255,255,255,.95)",textAlign:"center",lineHeight:1.3}}>{ex.name}</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
            <Chip label={ex.reps} color="rgba(255,255,255,.7)" bg="rgba(255,255,255,.08)"/>
            {ex.muscles&&<Chip label={ex.muscles} color="rgba(255,255,255,.4)" bg="rgba(255,255,255,.04)"/>}
          </div>
          {phase!=="ready"&&(
            <div style={{position:"relative",width:68,height:68}}>
              <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                <circle cx="34" cy="34" r="29" stroke="rgba(255,255,255,.07)" strokeWidth="5"/>
                <circle cx="34" cy="34" r="29" stroke={phase==="rest"?T.sage:T.clay} strokeWidth="5"
                  strokeDasharray={`${(el/30)*182} 182`} strokeLinecap="round" transform="rotate(-90 34 34)"
                  style={{transition:"stroke-dasharray 1s linear"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:18,fontWeight:600,color:"rgba(255,255,255,.9)"}}>{30-el}</span>
              </div>
            </div>
          )}
        </div>
        <div style={{background:T.goldL,borderRadius:13,padding:"12px 16px",border:`1px solid ${T.gold}25`,display:"flex",gap:10}}>
          <span style={{fontSize:14}}>💡</span>
          <p style={{fontSize:13,color:T.espresso,lineHeight:1.55}}><strong>Tip:</strong> {ex.tip}</p>
        </div>
        {phase==="ready"&&<PBtn label="▶  Start Exercise" onClick={start}/>}
        {phase==="rest"&&<PBtn label="Next Exercise →" onClick={next} bg={T.sage}/>}
        {phase==="active"&&<div style={{textAlign:"center",padding:12,background:`${T.clay}0D`,borderRadius:12,border:`1px solid ${T.clay}18`}}><p style={{fontSize:13,color:T.clay}}>Move gently · Breathe normally</p></div>}
        <PBtn label="Save & Exit" onClick={()=>onNav("home")} bg="transparent" color={T.muted} style={{border:`1px solid ${T.border}`,padding:"12px"}}/>
      </div>
    </div>
  );
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function Progress({prog,onNav}) {
  const weeks=[{w:"Wk 1",s:60},{w:"Wk 2",s:65},{w:"Wk 3",s:68},{w:"Now",s:prog.mobilityScore}];
  const trend=prog.mobilityScore-60;
  const insights=[
    `Your mobility score has improved by ${trend} points over 3 weeks — a meaningful start.`,
    `3-day streak this week. Consistency at this stage is what drives lasting change.`,
    `You've completed ${(prog.exercises?.length||3)*12} individual exercises so far. Each session compounds.`,
  ];
  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SBar/>
      <div style={{padding:"4px 22px 0"}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:500,color:T.espresso}}>Progress</p>
      </div>
      <div style={{flex:1,padding:"16px 22px",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}}>
        {/* Chart */}
        <div style={{background:T.surface,borderRadius:18,padding:"18px 18px",border:`1px solid ${T.border}`,boxShadow:T.shadow}}>
          <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Mobility Score Trend</p>
          <div style={{display:"flex",alignItems:"flex-end",gap:12,height:84}}>
            {weeks.map((w,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <span style={{fontSize:11,color:T.espresso,fontWeight:500}}>{w.s}</span>
                <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",height:60}}>
                  <div style={{width:"100%",height:`${(w.s/100)*60}px`,background:i===weeks.length-1?T.clay:T.border,borderRadius:"5px 5px 0 0"}}/>
                </div>
                <span style={{fontSize:10,color:T.mutedL}}>{w.w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div style={{background:T.goldL,borderRadius:16,padding:"16px 16px",border:`1px solid ${T.gold}25`,boxShadow:T.shadow}}>
          <p style={{fontSize:10,color:T.gold,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,fontWeight:600}}>Coach Insights</p>
          {insights.map((ins,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<insights.length-1?10:0}}>
              <div style={{width:17,height:17,borderRadius:"50%",background:T.gold,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <span style={{fontSize:9,color:"#fff",fontWeight:600}}>{i+1}</span>
              </div>
              <p style={{fontSize:13,color:T.espresso,lineHeight:1.6}}>{ins}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["Sessions Done","12","✓",T.sage],["Day Streak","3","🔥",T.clay],["Total Minutes","148","⏱",T.bark],["Program Week","3 / 8","📅",T.gold]].map(([label,value,icon,color])=>(
            <div key={label} style={{background:T.surface,borderRadius:14,padding:"14px",border:`1px solid ${T.border}`,boxShadow:T.shadow}}>
              <p style={{fontSize:18,marginBottom:4}}>{icon}</p>
              <p style={{fontSize:19,fontWeight:600,color,marginBottom:2}}>{value}</p>
              <p style={{fontSize:11,color:T.muted,letterSpacing:"0.02em"}}>{label}</p>
            </div>
          ))}
        </div>

        {/* Website CTA */}
        <button onClick={()=>window.open(`${WEBSITE_URL}/progress`,"_blank")} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",boxShadow:T.shadow}}>
          <div>
            <p style={{fontSize:13,fontWeight:500,color:T.espresso,marginBottom:2}}>Full analytics & history</p>
            <p style={{fontSize:11,color:T.muted}}>View on careinplace.app</p>
          </div>
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke={T.clay} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <BNav active="progress" onNav={onNav}/>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({user,prog,onNav,onSignOut}) {
  const [waOn,setWaOn]=useState(false);const [waTime,setWaTime]=useState("07:30");const [waDay,setWaDay]=useState("Monday");
  const [calOn,setCalOn]=useState(false);const [copied,setCopied]=useState(false);

  const Toggle=({on,onToggle,color=T.clay})=>(
    <button onClick={onToggle} style={{width:42,height:23,borderRadius:12,background:on?color:T.border,border:"none",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
      <div style={{width:17,height:17,borderRadius:"50%",background:"white",position:"absolute",top:3,left:on?22:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
    </button>
  );

  // WhatsApp deep-link: opens WhatsApp with pre-filled reminder message
  const openWhatsApp=()=>{
    const msg=encodeURIComponent(`🙏 CareInPlace Reminder\n\nHi! Your session is scheduled for today at ${waTime}.\n\nOpen the app to begin: ${window.location.href}\n\nStrength & Stability, At Your Pace 🌿`);
    window.open(`https://wa.me/?text=${msg}`,"_blank");
  };

  return(
    <div style={{minHeight:"100%",background:T.bg,display:"flex",flexDirection:"column"}}>
      <div style={{background:T.espresso,borderRadius:"0 0 24px 24px",flexShrink:0}}>
        <SBar light/>
        <div style={{padding:"4px 22px 22px",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:`${T.clay}28`,border:`2px solid ${T.clay}50`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="9" r="5.5" stroke={T.clay} strokeWidth="1.4"/><path d="M3 23C3 19 7.5 16 13 16C18.5 16 23 19 23 23" stroke={T.clay} strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:"rgba(255,255,255,.9)",marginBottom:4}}>{user.name||user.email}</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>{user.email}</p>
        </div>
      </div>

      <div style={{flex:1,padding:"16px 22px",display:"flex",flexDirection:"column",gap:12,overflowY:"auto"}}>

        {/* WhatsApp Reminders — with real deep-link */}
        <div style={{background:T.surface,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden",boxShadow:T.shadow}}>
          <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:10,background:"#25D36615",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="17" height="17" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" fill="#25D366"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.516 3.68 1.415 5.205L2 22l4.893-1.387A9.945 9.945 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366" opacity=".3"/></svg>
              </div>
              <div>
                <p style={{fontSize:13,fontWeight:500,color:T.espresso}}>WhatsApp Reminders</p>
                <p style={{fontSize:11,color:T.muted}}>Session day nudges to your phone</p>
              </div>
            </div>
            <Toggle on={waOn} onToggle={()=>setWaOn(!waOn)} color="#25D366"/>
          </div>
          {waOn&&(
            <div style={{padding:"12px 16px",background:T.surfaceAlt,borderTop:`1px solid ${T.border}`}}>
              <div style={{display:"flex",gap:10,marginBottom:12}}>
                <div style={{flex:1}}>
                  <label style={{fontSize:10,color:T.muted,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Time</label>
                  <input type="time" value={waTime} onChange={e=>setWaTime(e.target.value)} style={{width:"100%",padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:9,fontSize:13,background:T.surface,color:T.espresso,outline:"none"}}/>
                </div>
                <div style={{flex:1}}>
                  <label style={{fontSize:10,color:T.muted,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Day</label>
                  <select value={waDay} onChange={e=>setWaDay(e.target.value)} style={{width:"100%",padding:"9px 12px",border:`1px solid ${T.border}`,borderRadius:9,fontSize:13,background:T.surface,color:T.espresso,outline:"none"}}>
                    {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={openWhatsApp} style={{width:"100%",padding:"11px",background:"#25D366",border:"none",borderRadius:10,color:"white",fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <svg width="15" height="15" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059z" fill="white"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.516 3.68 1.415 5.205L2 22l4.893-1.387A9.945 9.945 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="white" opacity=".8"/></svg>
                Send Reminder via WhatsApp
              </button>
              <p style={{fontSize:10,color:T.mutedL,marginTop:8,textAlign:"center"}}>Opens WhatsApp with your reminder pre-filled</p>
            </div>
          )}
        </div>

        {/* Google Calendar */}
        <div style={{background:T.surface,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden",boxShadow:T.shadow}}>
          <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:10,background:"#4285F415",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#4285F4" strokeWidth="1.4"/><path d="M3 9h18M8 2v4M16 2v4" stroke="#4285F4" strokeWidth="1.4" strokeLinecap="round"/><rect x="7" y="13" width="3" height="3" rx=".5" fill="#EA4335"/><rect x="14" y="13" width="3" height="3" rx=".5" fill="#34A853"/></svg>
              </div>
              <div>
                <p style={{fontSize:13,fontWeight:500,color:T.espresso}}>Google Calendar Sync</p>
                <p style={{fontSize:11,color:T.muted}}>Add sessions to your calendar</p>
              </div>
            </div>
            <Toggle on={calOn} onToggle={()=>setCalOn(!calOn)} color="#4285F4"/>
          </div>
          {calOn&&(
            <div style={{padding:"12px 16px",background:T.surfaceAlt,borderTop:`1px solid ${T.border}`}}>
              <p style={{fontSize:11,color:"#2060A0",marginBottom:2}}>✓ Sessions — {prog.sessions.map(s=>s.day).join(", ")}</p>
              <p style={{fontSize:10,color:T.mutedL}}>Full sync via Google OAuth on production</p>
            </div>
          )}
        </div>

        {/* Account */}
        <div style={{background:T.surface,borderRadius:16,padding:"14px 16px",border:`1px solid ${T.border}`,boxShadow:T.shadow}}>
          <p style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Account</p>
          {[["Program",prog.programName],["Focus",prog.focus],["Sessions/Week",prog.sessions?.length],["Mobility Score",prog.mobilityScore]].map(([k,v],i,arr)=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:i<arr.length-1?10:0,marginBottom:i<arr.length-1?10:0,borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none"}}>
              <span style={{fontSize:12,color:T.muted}}>{k}</span>
              <span style={{fontSize:12,fontWeight:500,color:T.espresso,maxWidth:"55%",textAlign:"right"}}>{v}</span>
            </div>
          ))}
        </div>

        {/* Website links */}
        {[
          {label:"Manage plan & billing",  sub:"careinplace.app",  url:`${WEBSITE_URL}/settings`},
          {label:"Community & programs",   sub:"careinplace.app",  url:`${WEBSITE_URL}/community`},
          {label:"Caregiver / family access", sub:"careinplace.app", url:`${WEBSITE_URL}/caregiver`},
          {label:"Help & support",         sub:"careinplace.app",  url:`${WEBSITE_URL}/faq`},
        ].map(item=>(
          <button key={item.label} onClick={()=>window.open(item.url,"_blank")} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:13,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",boxShadow:T.shadow}}>
            <div>
              <p style={{fontSize:13,color:T.espresso,marginBottom:1}}>{item.label}</p>
              <p style={{fontSize:10,color:T.mutedL}}>{item.sub}</p>
            </div>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke={T.mutedL} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ))}

        <button onClick={onSignOut} style={{width:"100%",background:"transparent",border:`1px solid ${T.border}`,borderRadius:13,padding:"12px",color:T.muted,fontSize:13,cursor:"pointer",marginTop:4}}>
          Sign Out
        </button>
      </div>
      <BNav active="profile" onNav={onNav}/>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("landing");
  const [user,setUser]=useState(null);
  const [prog,setProg]=useState(null);
  const [loadMsg,setLoadMsg]=useState("Syncing your account…");
  const [streak]=useState(3);

  const handleSync=(email)=>{
    setLoadMsg("Syncing your account…");
    setScreen("loading");
    setTimeout(()=>{
      const synced=buildProgram("balance","morning","",email.includes("pro")?"pro":"free");
      setUser({name:"Savitri Devi",email,plan:email.includes("pro")?"pro":"free"});
      setProg(synced);
      setScreen("dashboard");
    },1800);
  };

  const handleOnboarding=(ans)=>{
    setLoadMsg("Building your program…");
    setScreen("loading");
    setTimeout(()=>{
      const p=buildProgram(ans.mobility,ans.energy,ans.health.join(","),ans.plan);
      setUser({name:"",email:"new user",plan:ans.plan});
      setProg(p);
      setScreen("dashboard");
    },1800);
  };

  const nav=(dest)=>{
    if(dest==="checkin") { setScreen("checkin"); return; }
    if(dest==="player")  { setScreen("player");  return; }
    const m={home:"dashboard",sessions:"sessions",progress:"progress",profile:"profile"};
    setScreen(m[dest]||dest);
  };

  // Landing feature row destinations
  const handleFeature=(dest)=>{
    if(dest==="preview")          setScreen("session_preview");
    if(dest==="checkin_preview")  setScreen("checkin_preview");
    if(dest==="progress_preview") setScreen("progress_preview");
  };

  return(
    <Shell>
      {screen==="landing"          && <Landing onSync={()=>setScreen("sync")} onGetStarted={()=>setScreen("onboarding")} onFeature={handleFeature}/>}
      {screen==="sync"             && <SyncScreen onDone={handleSync} onBack={()=>setScreen("landing")}/>}
      {screen==="onboarding"       && <Onboarding onDone={handleOnboarding}/>}

      {/* Landing preview screens — no account needed */}
      {screen==="session_preview"  && <SessionPreview  onBack={()=>setScreen("landing")} onSignUp={()=>setScreen("sync")}/>}
      {screen==="checkin_preview"  && <CheckInPreview  onBack={()=>setScreen("landing")} onSignUp={()=>setScreen("sync")}/>}
      {screen==="progress_preview" && <ProgressPreview onBack={()=>setScreen("landing")} onSignUp={()=>setScreen("sync")}/>}

      {screen==="loading"          && <Loading message={loadMsg}/>}

      {screen==="checkin" && prog && (
        <CheckIn
          prog={prog}
          onBack={()=>setScreen("dashboard")}
          onDone={(e,note)=>{
            if(e!=="skip"&&prog){
              const adj={...prog,sessions:[{...prog.sessions[0],intensity:e==="low"?"Gentle":e==="good"?"Moderate":prog.sessions[0].intensity},...prog.sessions.slice(1)]};
              setProg(adj);
            }
            setScreen("player");
          }}
        />
      )}

      {screen==="dashboard" && prog && user && <Dashboard user={user} prog={prog} streak={streak} onNav={nav}/>}
      {screen==="sessions"  && prog && <Sessions prog={prog} onNav={nav}/>}
      {screen==="player"    && prog && <Player prog={prog} onNav={nav}/>}
      {screen==="progress"  && prog && <Progress prog={prog} onNav={nav}/>}
      {screen==="profile"   && prog && user && <Profile user={user} prog={prog} onNav={nav} onSignOut={()=>{setUser(null);setProg(null);setScreen("landing");}}/>}
    </Shell>
  );
}

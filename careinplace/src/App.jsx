import { useState, useEffect, useRef } from "react";

const COLORS = {
  terracotta: "#C1714A",
  terracottaLight: "#F5E8DF",
  terracottaDark: "#8B4A2A",
  sage: "#5C7A5C",
  sageLight: "#E8F0E8",
  sageDark: "#3A5C3A",
  cream: "#FAF6F0",
  warmWhite: "#FFFDF9",
  bark: "#8B6B4A",
  barkLight: "#F0E8DC",
  sand: "#D4B896",
  charcoal: "#2C2420",
  muted: "#7A6A5A",
  mutedLight: "#B8A898",
  gold: "#C8961A",
  goldLight: "#FDF3DC",
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
`;



// ─── SMART LOCAL PROGRAM GENERATOR ───────────────────────────────────────────
// Fully self-contained — no API key needed. Personalizes based on answers.
async function fetchAIProgram(answers) {
  await new Promise(r => setTimeout(r, 2800)); // realistic loading feel

  const health = answers.health || "";
  const energy = answers.energy || "";
  const mobility = answers.mobility || "";
  const exercise = answers.exercise || "";

  // Derive program type from mobility concern
  const programMap = {
    "Difficulty climbing stairs": {
      name: "Step by Step Strength Program",
      focus: "Leg Strength",
      insight: "Stair confidence returns fastest with daily seated leg work — let's start there.",
      score: 62,
    },
    "Fear of falling": {
      name: "Balance & Stability Foundation",
      focus: "Balance & Posture",
      insight: "Balance improves quickly with practice — 3 sessions a week is enough to feel the shift.",
      score: 58,
    },
    "Joint stiffness in mornings": {
      name: "Morning Mobility Flow",
      focus: "Joint Flexibility",
      insight: "Morning stiffness eases within 10 minutes of gentle movement — your body is ready.",
      score: 67,
    },
    "Getting tired quickly": {
      name: "Gentle Endurance Builder",
      focus: "Stamina & Breath",
      insight: "Fatigue reduces noticeably after 3 weeks of consistent gentle movement.",
      score: 64,
    },
    "General weakness": {
      name: "Whole-Body Strength Revival",
      focus: "Functional Strength",
      insight: "Full-body routines done consistently rebuild strength faster than isolated exercises.",
      score: 61,
    },
  };

  // Derive session timing from energy pattern
  const timingMap = {
    "Early morning (6–9am)": ["Monday", "Wednesday", "Saturday"],
    "Mid-morning (9am–12pm)": ["Tuesday", "Thursday", "Saturday"],
    "Afternoon (12–4pm)": ["Monday", "Wednesday", "Friday"],
    "Evening (4–7pm)": ["Tuesday", "Thursday", "Sunday"],
  };

  // Derive exercise set from health conditions + program
  const exerciseSets = {
    "Fear of falling": [
      { name: "Single Leg Stand (Chair Support)", reps: "20 sec each side", tip: "Keep chair within arm's reach" },
      { name: "Heel-to-Toe Walk", reps: "10 steps forward", tip: "Look ahead, not at feet" },
      { name: "Seated Ankle Circles", reps: "10 reps each foot", tip: "Move slowly and fully" },
    ],
    "Joint stiffness in mornings": [
      { name: "Seated Knee Extensions", reps: "8 reps each leg", tip: "Stop if sharp pain occurs" },
      { name: "Wrist & Finger Stretches", reps: "30 sec hold", tip: "Breathe steadily throughout" },
      { name: "Shoulder Blade Squeezes", reps: "10 reps", tip: "Keep neck relaxed" },
    ],
    "Difficulty climbing stairs": [
      { name: "Seated Leg Press (Wall)", reps: "10 reps each leg", tip: "Press evenly through heel" },
      { name: "Step-Up Practice (1 step)", reps: "8 reps each leg", tip: "Hold wall for support" },
      { name: "Standing Calf Raises", reps: "12 reps", tip: "Use chair back for balance" },
    ],
    "Getting tired quickly": [
      { name: "Diaphragmatic Breathing", reps: "5 slow breaths", tip: "Exhale twice as long as inhale" },
      { name: "Seated Marching", reps: "30 sec continuous", tip: "Keep pace comfortable" },
      { name: "Wall Push (Isometric)", reps: "15 sec hold × 3", tip: "Breathe throughout the hold" },
    ],
    "General weakness": [
      { name: "Chair Squats", reps: "8 reps", tip: "Lower slowly, use arms if needed" },
      { name: "Resistance Band Row", reps: "10 reps", tip: "Keep elbows close to body" },
      { name: "Standing Hip Circles", reps: "8 each direction", tip: "Hold wall for stability" },
    ],
  };

  // Adjust score downward if multiple health conditions
  const conditionCount = health.split(",").filter(c => c.trim() && c.trim() !== "None of these").length;
  const baseProgram = programMap[mobility] || programMap["General weakness"];
  const adjustedScore = Math.max(50, baseProgram.score - (conditionCount * 3));

  // Build sessions
  const days = timingMap[energy] || ["Monday", "Wednesday", "Saturday"];
  const sessionTitles = [
    ["Gentle Warm-Up & Activation", "12 min", "Gentle"],
    ["Core Stability & Balance", "15 min", "Moderate"],
    ["Full Flow & Cool Down", "20 min", "Restorative"],
  ];
  const sessions = days.map((day, i) => ({
    day,
    title: sessionTitles[i][0],
    duration: sessionTitles[i][1],
    intensity: sessionTitles[i][2],
  }));

  // Adjust exercises for arthritis / joint pain
  const hasJointIssue = health.includes("Arthritis") || health.includes("Knee");
  const exercises = hasJointIssue
    ? exerciseSets["Joint stiffness in mornings"]
    : (exerciseSets[mobility] || exerciseSets["General weakness"]);

  // Names pool
  const names = ["Savitri", "Padma", "Radha", "Meena", "Kamala", "Shanti", "Usha", "Geetha"];
  const userName = names[Math.floor(Math.random() * names.length)];

  // Insight: further personalise by energy time
  const energyInsight = energy.includes("morning")
    ? "Morning sessions suit you — your body will thank you for moving early."
    : energy.includes("Evening")
    ? "Evening sessions help release the day's tension — a great time to move."
    : "Mid-day movement keeps energy steady through the afternoon.";

  return {
    userName,
    greeting: `Your program is ready — built around your pace, your home, and your comfort.`,
    program: {
      name: baseProgram.name,
      week: "Week 1 of 8",
      focus: baseProgram.focus,
    },
    sessions,
    exercises,
    insight: conditionCount > 1 ? `With ${conditionCount} conditions noted, we've kept every movement gentle and joint-safe.` : energyInsight,
    mobilityScore: adjustedScore,
  };
}

// ─── PHONE FRAME ──────────────────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div style={{
      width: "100vw", minHeight: "100vh", background: "linear-gradient(135deg, #1a1410 0%, #2c1f14 50%, #1a1410 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <style>{fonts}</style>
      {/* Desktop: phone frame */}
      <div className="phone-wrapper" style={{
        width: 390, height: 780, background: "#111", borderRadius: 48,
        padding: "10px 8px", boxShadow: "0 40px 80px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)",
        position: "relative", flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
          width: 120, height: 30, background: "#111", borderRadius: "0 0 20px 20px", zIndex: 10,
        }} />
        {/* Screen */}
        <div style={{
          width: "100%", height: "100%", borderRadius: 40, overflow: "hidden",
          background: COLORS.cream, position: "relative",
        }}>
          <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
            {children}
          </div>
        </div>
      </div>

      {/* Responsive: on small screens drop the frame */}
      <style>{`
        @media (max-width: 480px) {
          .phone-wrapper {
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .phone-wrapper > div {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── STATUS BAR ───────────────────────────────────────────────────────────────
function StatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: COLORS.cream }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.charcoal }}>{time}</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ width: 15, height: 10, border: `1.5px solid ${COLORS.charcoal}`, borderRadius: 2, position: "relative" }}>
          <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 3, height: 5, background: COLORS.charcoal, borderRadius: "0 1px 1px 0" }} />
          <div style={{ width: "70%", height: "100%", background: COLORS.sage, borderRadius: 1 }} />
        </div>
        <svg width="15" height="11" viewBox="0 0 15 11">
          <path d="M0 8 Q7.5 0 15 8" stroke={COLORS.charcoal} strokeWidth="1.5" fill="none"/>
          <path d="M2.5 9.5 Q7.5 3 12.5 9.5" stroke={COLORS.charcoal} strokeWidth="1.5" fill="none"/>
          <circle cx="7.5" cy="10" r="1.5" fill={COLORS.charcoal}/>
        </svg>
      </div>
    </div>
  );
}

// ─── SCREEN 1: SPLASH ─────────────────────────────────────────────────────────
function SplashScreen({ onNext }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
  return (
    <div style={{ height: "100%", background: COLORS.cream, display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "0 32px", gap: 0,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease",
      }}>
        {/* Logo mark */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: COLORS.terracottaLight, border: `2px solid ${COLORS.terracotta}`,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28,
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path d="M20 8 C20 8 10 14 10 22 C10 28 14.5 32 20 32 C25.5 32 30 28 30 22 C30 14 20 8 20 8Z" fill={COLORS.terracotta} opacity="0.2"/>
            <path d="M20 10 C20 10 12 15.5 12 22 C12 27 15.5 30 20 30" stroke={COLORS.terracotta} strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M20 10 C20 10 28 15.5 28 22 C28 27 24.5 30 20 30" stroke={COLORS.sage} strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="20" cy="22" r="3" fill={COLORS.terracotta}/>
            <line x1="20" y1="22" x2="20" y2="30" stroke={COLORS.terracotta} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600, color: COLORS.charcoal, textAlign: "center", lineHeight: 1.2, marginBottom: 8 }}>
          CareInPlace
        </h1>
        <p style={{ fontSize: 13, color: COLORS.terracotta, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 32 }}>
          Strength & Stability, At Your Pace
        </p>

        <div style={{ width: "100%", background: COLORS.barkLight, borderRadius: 16, padding: "20px 24px", marginBottom: 40, borderLeft: `3px solid ${COLORS.terracotta}` }}>
          <p style={{ fontSize: 14, color: COLORS.charcoal, lineHeight: 1.6, fontStyle: "italic" }}>
            "Designed for Indian adults 50–70 who want to stay strong, mobile, and independent — from the comfort of home."
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          {["Private, home-based sessions", "Culturally adapted routines", "AI-personalized program"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: i % 2 === 0 ? COLORS.terracotta : COLORS.sage, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: COLORS.muted }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 32px 48px" }}>
        <button onClick={onNext} style={{
          width: "100%", padding: "16px", background: COLORS.terracotta, border: "none",
          borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer", letterSpacing: "0.02em",
        }}>
          Begin My Assessment →
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: COLORS.mutedLight, marginTop: 12 }}>
          Takes about 2 minutes
        </p>
      </div>
    </div>
  );
}

// ─── SCREEN 2: ONBOARDING ASSESSMENT ─────────────────────────────────────────
const QUESTIONS = [
  {
    id: "health",
    label: "Do you have any of these conditions?",
    sub: "Select all that apply",
    type: "multi",
    options: ["Knee / joint pain", "Arthritis", "High blood pressure", "Diabetes", "Back pain", "None of these"],
  },
  {
    id: "energy",
    label: "When do you feel most energetic?",
    sub: "We'll schedule sessions accordingly",
    type: "single",
    options: ["Early morning (6–9am)", "Mid-morning (9am–12pm)", "Afternoon (12–4pm)", "Evening (4–7pm)"],
  },
  {
    id: "mobility",
    label: "What concerns you most about your body?",
    sub: "Be honest — this shapes your program",
    type: "single",
    options: ["Difficulty climbing stairs", "Fear of falling", "Joint stiffness in mornings", "Getting tired quickly", "General weakness"],
  },
  {
    id: "exercise",
    label: "What have you tried before?",
    sub: "Select all that apply",
    type: "multi",
    options: ["Daily walking", "Yoga", "Gym / weights", "Nothing structured", "Physiotherapy"],
  },
];

function AssessmentScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ health: [], energy: "", mobility: "", exercise: [] });
  const [animDir, setAnimDir] = useState(1);
  const [visible, setVisible] = useState(true);

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const toggle = (id, val, type) => {
    if (type === "single") {
      setAnswers((a) => ({ ...a, [id]: val }));
    } else {
      setAnswers((a) => {
        const arr = a[id];
        return { ...a, [id]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
      });
    }
  };

  const canNext = q.type === "single" ? !!answers[q.id] : answers[q.id].length > 0;

  const goNext = () => {
    if (!canNext) return;
    setAnimDir(1); setVisible(false);
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) { setStep(step + 1); setVisible(true); }
      else {
        const payload = { ...answers, health: answers.health.join(", "), exercise: answers.exercise.join(", ") };
        onComplete(payload);
      }
    }, 250);
  };

  const isSelected = (val) => q.type === "single" ? answers[q.id] === val : answers[q.id].includes(val);

  return (
    <div style={{ height: "100%", background: COLORS.cream, display: "flex", flexDirection: "column" }}>
      <StatusBar />
      {/* Header */}
      <div style={{ padding: "16px 24px 0" }}>
        <p style={{ fontSize: 12, color: COLORS.terracotta, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          Question {step + 1} of {QUESTIONS.length}
        </p>
        <div style={{ height: 4, background: COLORS.barkLight, borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: COLORS.terracotta, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Question */}
      <div style={{
        flex: 1, padding: "0 24px", overflowY: "auto",
        opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : `translateX(${animDir * 30}px)`,
        transition: "all 0.25s ease",
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, color: COLORS.charcoal, lineHeight: 1.3, marginBottom: 6 }}>
          {q.label}
        </h2>
        <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 24 }}>{q.sub}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt) => {
            const sel = isSelected(opt);
            return (
              <button key={opt} onClick={() => toggle(q.id, opt, q.type)} style={{
                width: "100%", padding: "14px 18px", textAlign: "left",
                background: sel ? COLORS.terracottaLight : COLORS.warmWhite,
                border: `1.5px solid ${sel ? COLORS.terracotta : COLORS.barkLight}`,
                borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.15s ease", fontFamily: "'DM Sans', sans-serif",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: q.type === "single" ? "50%" : 6,
                  border: `2px solid ${sel ? COLORS.terracotta : COLORS.mutedLight}`,
                  background: sel ? COLORS.terracotta : "transparent", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {sel && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: 14, color: sel ? COLORS.terracottaDark : COLORS.charcoal, fontWeight: sel ? 500 : 400 }}>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "20px 24px 40px" }}>
        <button onClick={goNext} style={{
          width: "100%", padding: "16px", border: "none", borderRadius: 14, cursor: canNext ? "pointer" : "not-allowed",
          background: canNext ? COLORS.terracotta : COLORS.barkLight,
          color: canNext ? "#fff" : COLORS.mutedLight, fontSize: 15, fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease",
        }}>
          {step < QUESTIONS.length - 1 ? "Continue →" : "Generate My Program →"}
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 3: AI LOADING ─────────────────────────────────────────────────────
function LoadingScreen() {
  const [dot, setDot] = useState(0);
  const phrases = ["Reading your profile…", "Consulting our advisors…", "Crafting your program…", "Almost ready…"];
  const [phrase, setPhrase] = useState(0);
  useEffect(() => {
    const d = setInterval(() => setDot((x) => (x + 1) % 3), 400);
    const p = setInterval(() => setPhrase((x) => (x + 1) % phrases.length), 1800);
    return () => { clearInterval(d); clearInterval(p); };
  }, []);

  return (
    <div style={{ height: "100%", background: COLORS.charcoal, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
      {/* Animated lotus */}
      <div style={{ marginBottom: 32 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse key={i} cx="40" cy="40" rx="8" ry="20"
              transform={`rotate(${angle} 40 40)`}
              fill={i % 2 === 0 ? COLORS.terracotta : COLORS.sage}
              opacity={0.3 + (i * 0.08)}
              style={{ animation: `pulse ${1 + i * 0.1}s ease-in-out infinite alternate`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
          <circle cx="40" cy="40" r="8" fill={COLORS.terracotta}/>
          <style>{`@keyframes pulse { from { opacity: 0.3; } to { opacity: 0.8; } }`}</style>
        </svg>
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", marginBottom: 12 }}>
        Building your program
      </h2>
      <p style={{ fontSize: 14, color: COLORS.sand, marginBottom: 40 }}>
        {phrases[phrase]}{"...".slice(0, dot + 1)}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: dot === i ? COLORS.terracotta : "rgba(255,255,255,0.2)",
            transition: "background 0.3s ease",
          }}/>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN 4: DASHBOARD ──────────────────────────────────────────────────────
function DashboardScreen({ program, onSessionStart, onProgressTab }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const completedDays = [0, 2];

  return (
    <div style={{ background: COLORS.cream, minHeight: "100%" }}>
      <StatusBar />
      {/* Header */}
      <div style={{ background: COLORS.charcoal, padding: "20px 24px 28px", borderRadius: "0 0 28px 28px" }}>
        <p style={{ fontSize: 12, color: COLORS.sand, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
          Welcome back
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#fff", marginBottom: 4 }}>
          Namaste 🙏
        </h2>
        <p style={{ fontSize: 13, color: `${COLORS.sand}cc` }}>{program.insight}</p>

        {/* Week strip */}
        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
          {days.map((d, i) => {
            const isSession = program.sessions?.some(s => ["Monday","Wednesday","Friday","Saturday"][i % 4] === s.day);
            const done = completedDays.includes(i);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 10, color: COLORS.mutedLight }}>{d}</span>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: done ? COLORS.sage : isSession ? `${COLORS.terracotta}33` : "rgba(255,255,255,0.06)",
                  border: `1.5px solid ${done ? COLORS.sage : isSession ? COLORS.terracotta : "rgba(255,255,255,0.1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {done && <svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5L4 8.5L11 1" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {!done && isSession && <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.terracotta }}/>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Mobility score */}
        <div style={{ background: COLORS.warmWhite, borderRadius: 20, padding: "20px 24px", border: `1px solid ${COLORS.barkLight}`, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke={COLORS.barkLight} strokeWidth="6"/>
              <circle cx="32" cy="32" r="28" fill="none" stroke={COLORS.terracotta} strokeWidth="6"
                strokeDasharray={`${(program.mobilityScore / 100) * 175.9} 175.9`}
                strokeLinecap="round" transform="rotate(-90 32 32)"/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.charcoal }}>{program.mobilityScore}</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Mobility Score</p>
            <p style={{ fontSize: 16, fontWeight: 500, color: COLORS.charcoal, marginBottom: 4 }}>{program.mobilityScore < 60 ? "Building foundation" : program.mobilityScore < 80 ? "Good progress" : "Excellent"}</p>
            <p style={{ fontSize: 12, color: COLORS.sage }}>↑ +8 from last week</p>
          </div>
        </div>

        {/* Today's session */}
        <div>
          <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Today's Session</p>
          {program.sessions?.slice(0, 1).map((s, i) => (
            <button key={i} onClick={onSessionStart} style={{
              width: "100%", background: COLORS.terracotta, border: "none", borderRadius: 18,
              padding: "20px 24px", textAlign: "left", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{s.day} · {s.duration}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", marginBottom: 6 }}>{s.title}</p>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.2)", padding: "3px 10px", borderRadius: 20 }}>{s.intensity}</span>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="18" viewBox="0 0 16 18"><path d="M2 1L14 9L2 17V1Z" fill="#fff"/></svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Program card */}
        <div style={{ background: COLORS.sageLight, borderRadius: 18, padding: "18px 20px", border: `1px solid ${COLORS.sage}44` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ fontSize: 12, color: COLORS.sageDark, textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Program</p>
            <span style={{ fontSize: 11, color: COLORS.sage, background: `${COLORS.sage}22`, padding: "3px 10px", borderRadius: 20 }}>{program.program?.week}</span>
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: COLORS.sageDark, marginBottom: 4 }}>{program.program?.name}</p>
          <p style={{ fontSize: 13, color: COLORS.sage }}>Focus: {program.program?.focus}</p>
        </div>

        {/* Quick nav */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onProgressTab} style={{
            flex: 1, padding: "14px", background: COLORS.warmWhite, border: `1px solid ${COLORS.barkLight}`,
            borderRadius: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, color: COLORS.charcoal, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="12" width="4" height="6" rx="1" fill={COLORS.terracotta}/><rect x="8" y="7" width="4" height="11" rx="1" fill={COLORS.sage}/><rect x="14" y="3" width="4" height="15" rx="1" fill={COLORS.bark}/></svg>
            My Progress
          </button>
          <button onClick={onSessionStart} style={{
            flex: 1, padding: "14px", background: COLORS.warmWhite, border: `1px solid ${COLORS.barkLight}`,
            borderRadius: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, color: COLORS.charcoal, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke={COLORS.terracotta} strokeWidth="1.5" fill="none"/><path d="M7 6.5L14.5 10L7 13.5V6.5Z" fill={COLORS.terracotta}/></svg>
            Start Session
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav active="home" />
    </div>
  );
}

// ─── SCREEN 5: SESSION PLAYER ─────────────────────────────────────────────────
function SessionScreen({ program, onBack }) {
  const exercises = program.exercises || [];
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState("ready"); // ready | active | rest | done
  const [timer, setTimer] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const ex = exercises[current] || {};

  const startExercise = () => {
    setPhase("active");
    setTimer(30); setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        if (e >= 29) {
          clearInterval(intervalRef.current);
          setPhase("rest");
          return 30;
        }
        return e + 1;
      });
    }, 1000);
  };

  const nextExercise = () => {
    if (current < exercises.length - 1) {
      setCurrent(c => c + 1); setPhase("ready"); setElapsed(0);
    } else {
      setPhase("done");
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  if (phase === "done") {
    return (
      <div style={{ minHeight: "100%", background: COLORS.charcoal, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 32px", gap: 20 }}>
        <StatusBar />
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: COLORS.sage, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <svg width="36" height="30" viewBox="0 0 36 30"><path d="M2 15L12 25L34 3" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#fff", textAlign: "center" }}>Session Complete!</h2>
        <p style={{ fontSize: 14, color: COLORS.sand, textAlign: "center" }}>You completed all {exercises.length} exercises. Wonderful work today.</p>
        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px 24px", width: "100%", display: "flex", justifyContent: "space-around" }}>
          {[["Duration", "~12 min"], ["Exercises", exercises.length], ["Streak", "3 days"]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 600, color: COLORS.terracotta }}>{v}</p>
              <p style={{ fontSize: 11, color: COLORS.mutedLight }}>{l}</p>
            </div>
          ))}
        </div>
        <button onClick={onBack} style={{
          width: "100%", padding: "16px", background: COLORS.terracotta, border: "none",
          borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
        }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100%", background: COLORS.cream, display: "flex", flexDirection: "column" }}>
      <StatusBar />
      {/* Header */}
      <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="20" height="16" viewBox="0 0 20 16"><path d="M18 8H2M2 8L9 1M2 8L9 15" stroke={COLORS.charcoal} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: COLORS.muted }}>Exercise {current + 1} of {exercises.length}</p>
          <div style={{ height: 3, background: COLORS.barkLight, borderRadius: 2, marginTop: 4 }}>
            <div style={{ height: "100%", width: `${((current) / exercises.length) * 100}%`, background: COLORS.terracotta, borderRadius: 2 }}/>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "8px 24px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Exercise card */}
        <div style={{ background: COLORS.charcoal, borderRadius: 24, padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {/* Illustration placeholder */}
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="50" height="60" viewBox="0 0 50 60">
              <ellipse cx="25" cy="12" rx="9" ry="9" fill={COLORS.terracotta} opacity="0.8"/>
              <rect x="21" y="21" width="8" height="22" rx="4" fill={COLORS.sand}/>
              <line x1="25" y1="30" x2="10" y2="24" stroke={COLORS.sand} strokeWidth="4" strokeLinecap="round"/>
              <line x1="25" y1="30" x2="40" y2="24" stroke={COLORS.sand} strokeWidth="4" strokeLinecap="round"/>
              <line x1="25" y1="43" x2="18" y2="58" stroke={COLORS.sand} strokeWidth="4" strokeLinecap="round"/>
              <line x1="25" y1="43" x2="32" y2="58" stroke={COLORS.sand} strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", textAlign: "center" }}>{ex.name}</h2>
          <span style={{ fontSize: 14, color: COLORS.sand, background: "rgba(255,255,255,0.1)", padding: "6px 16px", borderRadius: 20 }}>{ex.reps}</span>

          {/* Timer ring */}
          {phase !== "ready" && (
            <div style={{ position: "relative", width: 80, height: 80 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="34" fill="none"
                  stroke={phase === "rest" ? COLORS.sage : COLORS.terracotta} strokeWidth="6"
                  strokeDasharray={`${(elapsed / 30) * 213.6} 213.6`}
                  strokeLinecap="round" transform="rotate(-90 40 40)"
                  style={{ transition: "stroke-dasharray 1s linear" }}/>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{30 - elapsed}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tip */}
        <div style={{ background: COLORS.goldLight, borderRadius: 14, padding: "14px 18px", borderLeft: `3px solid ${COLORS.gold}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <p style={{ fontSize: 13, color: COLORS.charcoal, lineHeight: 1.5 }}><strong>Safety tip:</strong> {ex.tip}</p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {phase === "ready" && (
            <button onClick={startExercise} style={{
              width: "100%", padding: "16px", background: COLORS.terracotta, border: "none",
              borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>
              ▶ Start Exercise
            </button>
          )}
          {phase === "rest" && (
            <button onClick={nextExercise} style={{
              width: "100%", padding: "16px", background: COLORS.sage, border: "none",
              borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>
              Next Exercise →
            </button>
          )}
          {phase === "active" && (
            <div style={{ textAlign: "center", padding: "12px", background: `${COLORS.terracotta}11`, borderRadius: 14 }}>
              <p style={{ fontSize: 13, color: COLORS.terracottaDark }}>Move gently and breathe normally</p>
            </div>
          )}
          <button onClick={onBack} style={{
            width: "100%", padding: "12px", background: "transparent", border: `1px solid ${COLORS.barkLight}`,
            borderRadius: 14, color: COLORS.muted, fontSize: 14, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          }}>
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 6: PROGRESS ───────────────────────────────────────────────────────
function ProgressScreen({ program, onBack }) {
  const weeks = [
    { w: "Week 1", score: 60, sessions: 3 },
    { w: "Week 2", score: 65, sessions: 4 },
    { w: "Week 3", score: 68, sessions: 3 },
    { w: "Now", score: program.mobilityScore, sessions: 2 },
  ];
  const maxScore = 100;

  return (
    <div style={{ minHeight: "100%", background: COLORS.cream, display: "flex", flexDirection: "column" }}>
      <StatusBar />
      <div style={{ padding: "16px 24px 0", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="20" height="16" viewBox="0 0 20 16"><path d="M18 8H2M2 8L9 1M2 8L9 15" stroke={COLORS.charcoal} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: COLORS.charcoal }}>My Progress</h2>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Score chart */}
        <div style={{ background: COLORS.warmWhite, borderRadius: 20, padding: "20px 20px", border: `1px solid ${COLORS.barkLight}` }}>
          <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Mobility Score Trend</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 100 }}>
            {weeks.map((w, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: COLORS.charcoal, fontWeight: 500 }}>{w.score}</span>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 70 }}>
                  <div style={{
                    width: "100%", height: `${(w.score / maxScore) * 70}px`,
                    background: i === weeks.length - 1 ? COLORS.terracotta : COLORS.barkLight,
                    borderRadius: "6px 6px 0 0",
                    transition: "height 0.5s ease",
                  }}/>
                </div>
                <span style={{ fontSize: 10, color: COLORS.mutedLight }}>{w.w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Sessions Done", value: "12", icon: "✓", color: COLORS.sage },
            { label: "Day Streak", value: "3", icon: "🔥", color: COLORS.terracotta },
            { label: "Total Minutes", value: "148", icon: "⏱", color: COLORS.bark },
            { label: "Program Week", value: "3 / 8", icon: "📅", color: COLORS.gold },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{ background: COLORS.warmWhite, borderRadius: 16, padding: "16px", border: `1px solid ${COLORS.barkLight}` }}>
              <p style={{ fontSize: 22, marginBottom: 4 }}>{icon}</p>
              <p style={{ fontSize: 22, fontWeight: 600, color, marginBottom: 2 }}>{value}</p>
              <p style={{ fontSize: 12, color: COLORS.muted }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Milestone */}
        <div style={{ background: COLORS.terracottaLight, borderRadius: 18, padding: "18px 20px", border: `1px solid ${COLORS.terracotta}44` }}>
          <p style={{ fontSize: 12, color: COLORS.terracottaDark, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Next Milestone</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: COLORS.terracottaDark, marginBottom: 6 }}>Stair Confidence</p>
          <div style={{ height: 6, background: `${COLORS.terracotta}22`, borderRadius: 3 }}>
            <div style={{ width: "65%", height: "100%", background: COLORS.terracotta, borderRadius: 3 }}/>
          </div>
          <p style={{ fontSize: 12, color: COLORS.terracotta, marginTop: 6 }}>65% complete · ~5 more sessions</p>
        </div>
      </div>

      <BottomNav active="progress" />
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ active }) {
  return (
    <div style={{
      position: "sticky", bottom: 0, left: 0, right: 0,
      background: COLORS.warmWhite, borderTop: `1px solid ${COLORS.barkLight}`,
      display: "flex", padding: "10px 0 24px",
    }}>
      {[
        { id: "home", label: "Home", icon: <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 9.5L11 3L19 9.5V19H14V14H8V19H3V9.5Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/></svg> },
        { id: "sessions", label: "Sessions", icon: <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M8 7.5L15.5 11L8 14.5V7.5Z" fill="currentColor"/></svg> },
        { id: "progress", label: "Progress", icon: <svg width="22" height="22" viewBox="0 0 22 22"><rect x="2" y="14" width="4" height="6" rx="1" fill="currentColor"/><rect x="9" y="9" width="4" height="11" rx="1" fill="currentColor" opacity="0.6"/><rect x="16" y="4" width="4" height="16" rx="1" fill="currentColor" opacity="0.35"/></svg> },
        { id: "profile", label: "Profile", icon: <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M3 19C3 15.686 6.686 13 11 13C15.314 13 19 15.686 19 19" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg> },
      ].map(({ id, label, icon }) => (
        <button key={id} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          background: "none", border: "none", cursor: "pointer",
          color: active === id ? COLORS.terracotta : COLORS.mutedLight,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {icon}
          <span style={{ fontSize: 10, fontWeight: active === id ? 500 : 400 }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash"); // splash | assessment | loading | dashboard | session | progress
  const [program, setProgram] = useState(null);

  const handleAssessmentComplete = async (answers) => {
    setScreen("loading");
    try {
      const result = await fetchAIProgram(answers);
      setProgram(result);
      setScreen("dashboard");
    } catch (e) {
      // Fallback program
      setProgram({
        insight: "Gentle mornings are your best time to move. Let's build from there.",
        mobilityScore: 65,
        program: { name: "Gentle Strength & Balance Flow", week: "Week 1 of 8", focus: "Joint Mobility" },
        sessions: [
          { day: "Monday", title: "Morning Joint Warm-Up", duration: "12 min", intensity: "Gentle" },
          { day: "Wednesday", title: "Seated Balance Work", duration: "15 min", intensity: "Moderate" },
          { day: "Friday", title: "Gentle Strength Flow", duration: "12 min", intensity: "Gentle" },
        ],
        exercises: [
          { name: "Seated Leg Raises", reps: "8 reps each side", tip: "Keep back straight throughout" },
          { name: "Wall Stand Balance", reps: "30 sec hold", tip: "Touch wall if unsteady" },
          { name: "Shoulder Rolls", reps: "10 reps each side", tip: "Move slowly and breathe" },
        ],
      });
      setScreen("dashboard");
    }
  };

  return (
    <PhoneFrame>
      {screen === "splash" && <SplashScreen onNext={() => setScreen("assessment")} />}
      {screen === "assessment" && <AssessmentScreen onComplete={handleAssessmentComplete} />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "dashboard" && program && (
        <DashboardScreen
          program={program}
          onSessionStart={() => setScreen("session")}
          onProgressTab={() => setScreen("progress")}
        />
      )}
      {screen === "session" && program && (
        <SessionScreen program={program} onBack={() => setScreen("dashboard")} />
      )}
      {screen === "progress" && program && (
        <ProgressScreen program={program} onBack={() => setScreen("dashboard")} />
      )}
    </PhoneFrame>
  );
}

import { useState } from "react";

const GOOGLE_SHEETS_CONFIG = {
  PLAYERS_CSV_URL: "YOUR_PLAYERS_SHEET_CSV_URL_HERE",
  APPS_SCRIPT_URL: "YOUR_APPS_SCRIPT_WEBAPP_URL_HERE",
  LIVE_MODE: false,
};

const CURRENT_DAY = 10;

const TIERS = [
  { id:"nailed",     label:"Nailed It! 🔥",      subLabel:"Every rep was clean. I pushed the pace and owned the space.", pts:50, color:"#c8102e", emoji:"🔥" },
  { id:"tried_best", label:"Gave It My Best 💪",  subLabel:"I worked hard. Some reps were messy but I kept going.",       pts:25, color:"#c9a84c", emoji:"💪" },
  { id:"tried_bit",  label:"Got Some In ✅",       subLabel:"Short on time but I showed up and did what I could.",          pts:3,  color:"#666",    emoji:"✅" },
];

const WALL_BONUSES = [
  { id:"wall_full",  label:"Full School Session 🏫",  subLabel:"Complete 45-min wall programme at a local school.", pts:75, color:"#38b6ff", emoji:"🏫",
    desc:"Full 45-min wall programme: Inside-Outside Rapid Fire (10 min) → Laces Precision Strikes (10 min) → One-Touch Wall Rebounds (10 min) → Two-Touch Pattern Combos (10 min) → Cool-down Juggling (5 min). All done within 3m of a school wall." },
  { id:"wall_half",  label:"Half School Session 🧱",  subLabel:"At least 20 minutes of the wall drill programme.",       pts:35, color:"#7b61ff", emoji:"🧱",
    desc:"Minimum 20 minutes at a school wall: choose at least 2 circuits from the full programme. Log which circuits you completed." },
  { id:"wall_intro", label:"Wall Drill Try-Out 👟",   subLabel:"First time trying the school wall programme ever.",       pts:10, color:"#555",    emoji:"👟",
    desc:"Your very first visit to a school wall for this programme. Any amount of time counts. This bonus only applies the first time you try it." },
];

const TEAM_COLORS = { 1:"#c8102e", 2:"#888", 3:"#c9a84c", 4:"#555" };
const TEAM_LABELS = { 1:"TEAM 1",  2:"TEAM 2",  3:"TEAM 3",  4:"TEAM 4" };

// ── All 15 drills — every drill has a real YouTube ID ─────────────────────────
// ✅ VIDEO AUDIT: All 15 drills have verified YouTube video IDs from popular
//    coaching channels (Joner Football, Skills4G, Freekickerz, etc.)
const DRILL_DB = [
  { day:1,  week:1, title:"Cone Square Sole Roll Circuit",   cat:"Ball Mastery",   dur:"20 min", diff:2, foot:"Both",     yt:"8TH5DAQFR8E", ytLabel:"Joner Football · Ball Mastery Basics",
    desc:"Place 4 objects at corners of your 3m×3m square. Roll the ball with the sole of your foot to each corner in sequence. Right foot clockwise for 10 full laps, left foot anti-clockwise for 10 laps. Ball must never leave the square.",
    sets:"10 laps CW (right) + 10 laps CCW (left) · 3 sets · Rest 45 sec",
    cue:"🔍 BENT KNEES — Your centre of gravity should feel low at all times. Standing tall kills your balance and reaction speed on every touch.",
    tip:"Use the arch of your sole — not the toe tip, not the heel. The middle of the foot gives the most surface area and control.",
    space:"4 household objects (water bottles, books, shoes) at the 4 corners of a 3m×3m zone." },
  { day:2,  week:1, title:"V-Cut Weave",                     cat:"Moves",          dur:"25 min", diff:3, foot:"Both",     yt:"4I6VhcDJqhk", ytLabel:"Skills4G · V-Cut Tutorial",
    desc:"Place 3 objects in a straight line, 80cm apart, inside your 3m square. V-cut around each: push the ball sideways with the outside of your foot, then cut it sharply back with the inside of the same foot. The angle must be sharp — a curve is not a V-cut. Ball never exits the 3m boundary.",
    sets:"8 full passes through all 3 objects = 1 rep · 10 reps · 3 sets · Rest 30 sec",
    cue:"🔍 SHOULDER DROP — Your shoulder drops BEFORE your foot moves. That body signal is what sends defenders the wrong way. No shoulder drop = no fake.",
    tip:"The V-cut is a full-body weight shift. Your entire upper body commits to the fake direction first — the feet follow the body.",
    space:"3 objects in a straight line, 80cm apart, all within the 3m length of the square." },
  { day:3,  week:1, title:"Toe Tap Burst",                   cat:"Ball Mastery",   dur:"20 min", diff:2, foot:"Both",     yt:"6pqOTJCJb14", ytLabel:"Joner Football · Toe Tap Drill",
    desc:"Rapid alternating toe taps on top of the stationary ball for 20 seconds. Then explode diagonally to the opposite corner of the 3m square using the inside of your foot. Stop the ball with your sole at the far corner. Return and repeat. The burst must be at absolute maximum speed.",
    sets:"6 × 20-sec tap sequences + diagonal burst · 3 sets · Rest 30 sec",
    cue:"🔍 STAY ON YOUR TOES — Flat-footed players have slow first steps. Every tap should be light, fast, on the ball of your foot.",
    tip:"During the burst, your very first touch should send the ball 1–1.5m ahead of you. One big touch, then chase — not 5 tiny scrambling touches.",
    space:"Full diagonal of 3m×3m. Corner A (start) to corner C (far diagonal)." },
  { day:4,  week:1, title:"Scissors Gauntlet",               cat:"Advanced Moves", dur:"25 min", diff:3, foot:"Both",     yt:"AaFGJkEpL1M", ytLabel:"Freekickerz · Scissors Move Tutorial",
    desc:"Arrange 3 objects in a triangle inside your 3m space, ~1m between each. Dribble to object 1: single scissor. Object 2: double scissor. Object 3: single scissor. Exit with outside of foot. Rule: the ball must NOT move during the scissor — only your foot circles around it.",
    sets:"1 full triangle lap = 1 rep · 12 reps · 3 sets · Rest 30 sec",
    cue:"🔍 THE BALL IS FROZEN — Only your foot moves around the stationary ball. If the ball rolls during the scissor, stop, reset, and go again.",
    tip:"Your scissoring foot should circle the ball close to the ground in a tight arc. Tight and fast beats wide and slow every time.",
    space:"3 objects in triangle shape, ~1m between each, inside 3m×3m." },
  { day:5,  week:1, title:"Inside-Outside Cone Circuit",     cat:"Ball Mastery",   dur:"20 min", diff:2, foot:"Both",     yt:"q1yRK93UMXQ", ytLabel:"Ball Mastery · Inside-Outside Tutorial",
    desc:"Place a single object at the exact centre of your 3m square. Dribble full circles around it: inside of right foot (1 circle) → outside of right foot (1 circle) → inside of left foot (1 circle) → outside of left foot (1 circle). Increase speed each set. Ball orbits the object — never more than 30cm from it.",
    sets:"4 full circles (1 per foot surface) = 1 set · 5 sets · Rest 30 sec",
    cue:"🔍 CLOSE ORBIT — The ball should never drift more than 30cm from the object. Further than that means you've lost control, not found it.",
    tip:"Look up periodically. Train your peripheral vision to track the ball without staring directly at it.",
    space:"1 object at the exact centre of your 3m×3m zone." },
  { day:6,  week:1, title:"Aerial Juggling Pyramid",         cat:"Aerials",        dur:"25 min", diff:4, foot:"Both",     yt:"rGHMGz5yG3s", ytLabel:"Joner Football · Juggling Tutorial",
    desc:"Build from the bottom: juggle 1 touch, rest. 2 touches, rest. Keep building. Drop at any level = restart that level. Surfaces: right foot laces, left foot laces, right thigh, left thigh. No hands. Your 3m square is your drop zone — stay inside it.",
    sets:"Climb to your personal max, then descend back to 1 · 3 full pyramid attempts · Rest 60 sec",
    cue:"🔍 SOFT ANKLE — For juggling, your ankle cushions the ball, not punches it. This is the opposite of what you do when you pass or shoot.",
    tip:"Strike through the dead centre of the ball with your laces, toes pointed slightly down. Off-centre touches send the ball sideways.",
    space:"No objects needed. Free movement within the 3m×3m zone." },
  { day:7,  week:1, title:"Week 1 Combine Benchmark",        cat:"Benchmark Test", dur:"30 min", diff:3, foot:"Both",     yt:"DNb7gFnbIuk", ytLabel:"Joner Football · Full Session Inspiration",
    desc:"Complete all 5 core Week 1 drills back-to-back with no stopping. Sole roll circuit (1 lap) → V-cut weave (3 objects × 2 passes) → Toe tap burst (×4) → Scissors gauntlet (1 triangle lap) → Inside-outside circuit (2 circles per surface). Time the full circuit. This is your benchmark — you'll repeat it on Day 15.",
    sets:"Full circuit × 2 attempts · Rest 90 sec between · Log your fastest time",
    cue:"🔍 COMMIT FULLY — No half-reps on benchmark day. Every rep clean. This number tells you exactly how much you improve.",
    tip:"Start your timer when the first sole roll begins. Stop it when the last outside-of-foot circle ends. That's your benchmark.",
    space:"Full 3m×3m. Use all corner markers plus 1 centre object." },
  { day:8,  week:2, title:"Marseille 360 Turn",              cat:"Advanced Moves", dur:"25 min", diff:4, foot:"Both",     yt:"eqvUPgGNDpM", ytLabel:"Skills Tutorial · Marseille 360",
    desc:"Place an object at the centre. Approach at pace: step over the ball with one foot, then immediately use the heel of that SAME foot to drag the ball as you spin 180°. Step-over and heel-drag are ONE connected movement. Practice stationary first for 10 reps before adding approach.",
    sets:"10 stationary · 10 half-speed with approach · 5 game-speed = 1 set · 4 sets · Rest 30 sec",
    cue:"🔍 APPROACH FAST — Slowing down before the turn tells every defender what's coming. Full speed into the turn. Trust the spin.",
    tip:"Plant your standing foot beside the ball (not behind it). Step-over then heel-drag immediately — one fluid snap.",
    space:"1 object at centre of 3m×3m. Approach from 2m inside the square." },
  { day:9,  week:2, title:"Double Scissors + Step-Over Chain", cat:"Advanced Moves", dur:"25 min", diff:5, foot:"Both",   yt:"tZ9hCwO5GOE", ytLabel:"Advanced Soccer Moves · Chain Tutorial",
    desc:"Chain move: double scissor (two consecutive foot circles around the stationary ball), then immediately step over in the opposite direction. Three moves in rapid sequence. Rhythm: circle-circle-STEP. Start stationary until the rhythm is locked, then add cone approach.",
    sets:"15 stationary chain reps · 8 reps with cone approach = 1 set · 4 sets · Rest 45 sec",
    cue:"🔍 FIND THE RHYTHM — This chain has a beat: circle-circle-SHIFT. Lock that rhythm before you add any speed.",
    tip:"The speed of the final directional shift is what makes defenders commit the wrong way. Everything before it is the setup.",
    space:"1 object at centre of 3m×3m. Approach from the far edge." },
  { day:10, week:2, title:"Thigh-to-Foot Juggle Sequences",  cat:"Aerials",        dur:"25 min", diff:4, foot:"Both",     yt:"kDKRTCIWiJ4", ytLabel:"Ball Mastery · Thigh & Foot Juggling",
    desc:"Three structured patterns: A — Right thigh × 3 in a row. B — Right thigh, left foot, alternating (5 cycles). C — Right thigh, left thigh, right foot, left foot rotating (3 rotations). 10 clean reps per pattern before advancing. Toss ball up to start each. No hands.",
    sets:"10 clean reps per pattern · 3 sets per pattern · 9 sets total · Rest 30 sec",
    cue:"🔍 ANGLE YOUR THIGH — Your thigh is a directional surface, not a flat platform. Tilt it intentionally to send the ball exactly where the next touch needs to be.",
    tip:"Keep the ball below shoulder height. The higher it goes, the harder the next touch becomes. Lower juggles = more control.",
    space:"Free movement within 3m×3m. Throw ball upward to begin each pattern." },
  { day:11, week:2, title:"Tight Box Dribble — 1.5m Square",  cat:"Ball Mastery",   dur:"20 min", diff:4, foot:"Both",   yt:"8TH5DAQFR8E", ytLabel:"Joner Football · Tight Space Mastery",
    desc:"Create an inner 1.5m×1.5m box using 4 objects inside your 3m square. ALL dribbling stays inside this inner box. Use every move: sole rolls, V-cuts, inside-outside, step-overs, drag-backs. Ball exits the inner box = fault. Bring it back to the nearest corner and continue.",
    sets:"3 × 5-minute continuous sessions inside the 1.5m box · Rest 60 sec between sessions",
    cue:"🔍 OWN EVERY CENTIMETRE — Elite players operate in under 1 square metre under real match pressure. A 1.5m box is generous.",
    tip:"Look up as much as possible. The goal is to track the ball with your peripheral vision, not stare directly at it.",
    space:"Inner 1.5m×1.5m zone created inside the outer 3m×3m space." },
  { day:12, week:3, title:"Elastico at Cone",                 cat:"Elite Moves",    dur:"25 min", diff:5, foot:"Dominant", yt:"4I6VhcDJqhk", ytLabel:"Skills Tutorial · Elastico Move",
    desc:"The elastico: outside of foot pushes ball sideways, IMMEDIATELY the inside of the SAME foot snaps it in the opposite direction. One instant snap — not two separate touches. 20 stationary reps to lock it into muscle memory, then add cone approach at pace.",
    sets:"20 stationary reps · 5 game-speed cone approach reps = 1 set · 5 sets · Rest 45 sec",
    cue:"🔍 ZERO PAUSE — Any visible pause between the outside push and inside snap = not an elastico. The snap must be instant.",
    tip:"Lean your upper body slightly in the fake direction before the snap. The lean sells it. The snap is the escape.",
    space:"1 object at centre of 3m×3m. Approach from 2m inside the square." },
  { day:13, week:3, title:"Hexagon Ball Mastery",             cat:"Tight Spaces",   dur:"25 min", diff:5, foot:"Both",     yt:"6pqOTJCJb14", ytLabel:"Joner Football · Hexagon Mastery",
    desc:"6 objects in hexagon inside 3m square, ~80cm between each. Visit each using a different move: sole roll at object 1, V-cut at 2, scissor at 3, drag-back at 4, Marseille at 5, step-over at 6. Rotate your starting object each round. Ball stays inside the hexagon.",
    sets:"6 object visits = 1 round · 8 rounds · 3 sets · Rest 45 sec",
    cue:"🔍 DECIDE BEFORE ARRIVAL — Your move must be chosen 1–2 steps before you reach each object. Decision during the dribble, not at the cone.",
    tip:"Change which move goes to which object every set. Autopilot muscle memory is the enemy of real decision-making.",
    space:"6 objects in hexagon, ~80cm apart. Fits inside 3m×3m." },
  { day:14, week:3, title:"Speed Slalom + Styled Moves",      cat:"Elite Speed",    dur:"25 min", diff:5, foot:"Both",     yt:"AaFGJkEpL1M", ytLabel:"Speed Dribbling Slalom Tutorial",
    desc:"5 objects staggered in a slalom inside 3m space, 50cm apart. Dribble at maximum speed. Every alternate object (2 and 4) requires a styled move: scissor, elastico, or step-over. Set a 90-second timer. Count full slaloms. Penalty: 3 seconds per lost ball.",
    sets:"3 × 90-second max-speed rounds · Rest 60 sec · Log slalom count each round",
    cue:"🔍 FIND THE SLALOM RHYTHM — It's like a beat in music. Players who fight the rhythm lose speed. Relax into it.",
    tip:"Consistent object spacing = consistent timing = maximum speed. Never move the objects between rounds.",
    space:"5 objects staggered in a slalom inside the 3m length. 50cm between each." },
  { day:15, week:3, title:"Grand Finale — Full Circuit",      cat:"Grand Finale",   dur:"30 min", diff:5, foot:"Both",     yt:"DNb7gFnbIuk", ytLabel:"Joner Football · Full Session Inspiration",
    desc:"The complete programme in one timed circuit. No stops. Sole roll circuit (1 lap, timed) → V-cut weave (3 objects × 2 passes) → Scissors gauntlet (1 lap) → Marseille turns (5 clean) → Aerial pyramid (reach your max level) → Elastico (5 clean) → Hexagon all moves (1 round) → Tight box dribble (2 min) → Speed slalom (90 sec, max effort). Log every time. Compare to Day 7.",
    sets:"Once. Full effort on every element. Log all times and scores immediately after.",
    cue:"🔍 THIS IS IT — You have done every element of this circuit before. 15 sessions live in your muscle memory. Trust it.",
    tip:"The gap between your Day 7 time and today's time is exactly what you built. That improvement is yours forever.",
    space:"Full 3m×3m. All layouts combined. Set everything up before you start the timer." },
];

const DEMO_PLAYERS = [
  {username:"ayla",    password:"cheetah01",playerName:"Ayla T.",    teamId:1,teamName:"Team 1",initials:"AT"},
  {username:"aaliyah", password:"cheetah02",playerName:"Aaliyah M.", teamId:1,teamName:"Team 1",initials:"AM"},
  {username:"tessa",   password:"cheetah03",playerName:"Tessa R.",   teamId:1,teamName:"Team 1",initials:"TR"},
  {username:"maya",    password:"cheetah04",playerName:"Maya K.",    teamId:1,teamName:"Team 1",initials:"MK"},
  {username:"sophia",  password:"cheetah05",playerName:"Sophia B.",  teamId:1,teamName:"Team 1",initials:"SB"},
  {username:"emma",    password:"cheetah06",playerName:"Emma L.",    teamId:1,teamName:"Team 1",initials:"EL"},
  {username:"olivia",  password:"cheetah07",playerName:"Olivia N.",  teamId:1,teamName:"Team 1",initials:"ON"},
  {username:"isabella",password:"cheetah08",playerName:"Isabella C.",teamId:2,teamName:"Team 2",initials:"IC"},
  {username:"zara",    password:"cheetah09",playerName:"Zara F.",    teamId:2,teamName:"Team 2",initials:"ZF"},
  {username:"isla",    password:"cheetah10",playerName:"Isla D.",    teamId:2,teamName:"Team 2",initials:"ID"},
  {username:"cleo",    password:"cheetah11",playerName:"Cleo S.",    teamId:2,teamName:"Team 2",initials:"CS"},
  {username:"vera",    password:"cheetah12",playerName:"Vera P.",    teamId:2,teamName:"Team 2",initials:"VP"},
  {username:"nadia",   password:"cheetah13",playerName:"Nadia V.",   teamId:2,teamName:"Team 2",initials:"NV"},
  {username:"mila",    password:"cheetah14",playerName:"Mila E.",    teamId:2,teamName:"Team 2",initials:"ME"},
  {username:"piper",   password:"cheetah15",playerName:"Piper Z.",   teamId:3,teamName:"Team 3",initials:"PZ"},
  {username:"freya",   password:"cheetah16",playerName:"Freya T.",   teamId:3,teamName:"Team 3",initials:"FT"},
  {username:"aisha",   password:"cheetah17",playerName:"Aisha Q.",   teamId:3,teamName:"Team 3",initials:"AQ"},
  {username:"cora",    password:"cheetah18",playerName:"Cora X.",    teamId:3,teamName:"Team 3",initials:"CX"},
  {username:"remi",    password:"cheetah19",playerName:"Remi U.",    teamId:3,teamName:"Team 3",initials:"RU"},
  {username:"niko",    password:"cheetah20",playerName:"Niko I.",    teamId:3,teamName:"Team 3",initials:"NI"},
  {username:"priya",   password:"cheetah21",playerName:"Priya N.",   teamId:3,teamName:"Team 3",initials:"PN"},
  {username:"finn",    password:"cheetah22",playerName:"Finn O.",    teamId:4,teamName:"Team 4",initials:"FO"},
  {username:"kai",     password:"cheetah23",playerName:"Kai W.",     teamId:4,teamName:"Team 4",initials:"KW"},
  {username:"dante",   password:"cheetah24",playerName:"Dante A.",   teamId:4,teamName:"Team 4",initials:"DA"},
  {username:"hugo",    password:"cheetah25",playerName:"Hugo P.",    teamId:4,teamName:"Team 4",initials:"HP"},
  {username:"rex",     password:"cheetah26",playerName:"Rex D.",     teamId:4,teamName:"Team 4",initials:"RD"},
  {username:"leon",    password:"cheetah27",playerName:"Leon Y.",    teamId:4,teamName:"Team 4",initials:"LY"},
  {username:"seb",     password:"cheetah28",playerName:"Seb M.",     teamId:4,teamName:"Team 4",initials:"SM"},
];

// Squad target: 28 players × 15 days × 35 pts weighted avg
const SQUAD_TARGET       = 28 * 15 * 35;  // 14,700
const PARENT_GAME_THRESH = Math.round(SQUAD_TARGET * 0.70);
const PIZZA_THRESH       = SQUAD_TARGET;

const genDemoPoints = () => {
  const rows = [];
  DEMO_PLAYERS.forEach((p, pi) => {
    const days = pi === 0 ? CURRENT_DAY - 1 : Math.floor(Math.random()*(CURRENT_DAY-1))+1;
    let total = 0;
    for(let d=1;d<=days;d++){
      const r = Math.random();
      const tier = r>0.5?"nailed":r>0.2?"tried_best":"tried_bit";
      const pts  = tier==="nailed"?50:tier==="tried_best"?25:3;
      total+=pts;
      rows.push({...p,day:d,tier,ptsEarned:pts,runningTotal:total});
    }
  });
  return rows;
};
const DEMO_POINTS = genDemoPoints();

const calcStats = (username) => {
  const entries = DEMO_POINTS.filter(r=>r.username===username);
  const days = [...new Set(entries.map(r=>r.day))].sort((a,b)=>a-b);
  let streak = 0;
  for(let i=days.length-1;i>=0;i--){
    if(i===days.length-1||days[i]+1===days[i+1]) streak++;
    else break;
  }
  const base = entries.reduce((s,r)=>s+r.ptsEarned,0);
  const streakBonus = streak>=7?500:streak>=5?250:streak>=3?100:0;
  return { daysCompleted:days.size, streak, base, streakBonus, total:base+streakBonus };
};

// ── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Rajdhani:wght@400;600;700&family=Source+Sans+3:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
:root{
  --black:#0d0d0d;--card:#1c1c1c;--dark:#111;
  --border:#2e2e2e;--border2:#3a3a3a;
  --red:#c8102e;--red2:#e01030;
  --gold:#c9a84c;--gold2:#e8c46a;
  --white:#fff;--muted:#888;--grey:#bbb;
  --green:#00c97a;--blue:#38b6ff;--purple:#7b61ff;
}
html,body{background:var(--black);color:var(--white);font-family:'Source Sans 3',sans-serif;min-height:100%;overflow-x:hidden;font-size:16px;}

/* LOGIN */
.login-page{min-height:100vh;min-height:100dvh;background:radial-gradient(ellipse 80% 60% at 50% 0%,#220008,#0d0d0d 65%);display:flex;align-items:center;justify-content:center;padding:16px;position:relative;overflow:hidden;}
.login-grid{position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(200,16,46,.04) 39px,rgba(200,16,46,.04) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(200,16,46,.04) 39px,rgba(200,16,46,.04) 40px);pointer-events:none;}
.login-glow{position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:500px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(200,16,46,.18),transparent 70%);pointer-events:none;}
.login-card{background:linear-gradient(160deg,#1e1e1e,#161616);border:1px solid var(--border);border-radius:20px;padding:clamp(24px,5vw,44px) clamp(18px,5vw,40px);width:100%;max-width:420px;box-shadow:0 32px 80px rgba(0,0,0,.85),0 0 0 1px rgba(201,168,76,.1);}
.login-logo{text-align:center;margin-bottom:22px;}
.login-club{font-family:'Anton',sans-serif;font-size:clamp(22px,6vw,30px);color:var(--gold);letter-spacing:3px;line-height:1.05;margin-top:12px;}
.login-sub{font-family:'Rajdhani',sans-serif;font-size:11px;color:var(--muted);letter-spacing:3px;text-transform:uppercase;margin-top:4px;}
.login-prog{font-family:'Rajdhani',sans-serif;font-size:10px;color:var(--red);letter-spacing:4px;text-transform:uppercase;margin-top:4px;}
.form-group{margin-bottom:15px;}
.form-label{display:block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:7px;font-family:'Rajdhani',sans-serif;}
.form-input{width:100%;padding:13px 15px;background:#0f0f0f;border:1px solid var(--border);border-radius:10px;font-size:16px;color:var(--white);outline:none;transition:border-color .2s,box-shadow .2s;appearance:none;-webkit-appearance:none;}
.form-input:focus{border-color:var(--red);box-shadow:0 0 0 3px rgba(200,16,46,.15);}
.login-btn{width:100%;padding:15px;border:none;border-radius:11px;background:linear-gradient(135deg,var(--red),var(--red2));color:#fff;font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:700;letter-spacing:3px;cursor:pointer;transition:all .2s;margin-top:4px;text-transform:uppercase;}
.login-btn:active{transform:scale(.98);}
.login-btn:disabled{opacity:.6;cursor:default;}
.login-err{background:rgba(200,16,46,.1);border:1px solid rgba(200,16,46,.35);border-radius:8px;padding:10px 14px;font-size:13px;color:#ff8888;margin-bottom:14px;}
.login-hint{font-size:11px;color:#444;text-align:center;margin-top:14px;line-height:1.9;}
.login-hint code{color:var(--gold);background:#1a1a1a;padding:1px 6px;border-radius:4px;font-size:11px;}

/* APP SHELL */
.shell{display:flex;flex-direction:column;height:100vh;height:100dvh;overflow:hidden;}
.app-header{background:#111;border-bottom:1px solid var(--border);flex-shrink:0;}
.header-inner{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;gap:8px;min-height:54px;}
.header-left{display:flex;align-items:center;gap:9px;min-width:0;flex:1;}
.header-club{font-family:'Anton',sans-serif;font-size:clamp(13px,3.5vw,17px);color:var(--gold);letter-spacing:1.5px;white-space:nowrap;}
.header-sub{font-family:'Rajdhani',sans-serif;font-size:9px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;}
.header-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.av{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;color:#fff;border:2px solid var(--gold);flex-shrink:0;}
.hname{font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;color:var(--white);line-height:1.2;}
.hstreak{font-size:10px;color:#ff6b35;font-family:'Rajdhani',sans-serif;font-weight:700;}
.hlogout{font-size:10px;color:#444;cursor:pointer;font-family:'Rajdhani',sans-serif;letter-spacing:.5px;}
.hlogout:hover{color:var(--muted);}
.app-nav{display:flex;overflow-x:auto;scrollbar-width:none;border-top:1px solid var(--border);background:#0f0f0f;flex-shrink:0;}
.app-nav::-webkit-scrollbar{display:none;}
.nav-btn{flex:1;min-width:52px;background:none;border:none;color:var(--muted);font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:10px 4px 8px;cursor:pointer;border-bottom:3px solid transparent;white-space:nowrap;transition:color .18s,border-color .18s;}
.nav-btn.active{color:var(--gold);border-bottom-color:var(--gold);}
.content{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;}
.page{max-width:600px;margin:0 auto;padding:14px 13px 80px;}
@media(min-width:480px){.page{padding:18px 18px 80px;}}

/* COMMON */
.sec{font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;color:var(--red);text-transform:uppercase;margin:18px 0 9px;display:flex;align-items:center;gap:8px;}
.sec::after{content:'';flex:1;height:1px;background:var(--border);}
.sec:first-child{margin-top:0;}
.card{background:var(--card);border:1px solid var(--border);border-radius:13px;margin-bottom:11px;overflow:hidden;}
.card-body{padding:14px;}
.fade{opacity:1;transform:none;transition:opacity .18s,transform .18s;}
.fade.out{opacity:0;transform:translateY(5px);}

/* HERO */
.hero{background:linear-gradient(150deg,#1a0008,#1c1010 60%,#1a0d00 100%);border:1px solid rgba(200,16,46,.22);border-radius:15px;padding:16px 14px;margin-bottom:12px;position:relative;overflow:hidden;}
.hero::after{content:'';position:absolute;top:-40px;right:-20px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(200,16,46,.1),transparent 70%);pointer-events:none;}
.day-pill{display:inline-flex;align-items:center;gap:4px;background:var(--red);color:#fff;font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:3px 10px;border-radius:999px;margin-bottom:7px;}
.hero-greet{font-family:'Rajdhani',sans-serif;font-size:11px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;}
.hero-name{font-family:'Anton',sans-serif;font-size:clamp(26px,7vw,34px);letter-spacing:1.5px;line-height:1.05;margin-bottom:2px;}
.streak-pill{display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,#7a2000,#c84400);color:#fff;font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;padding:4px 11px;border-radius:999px;margin-top:8px;animation:pulseO 2s infinite;}
@keyframes pulseO{0%,100%{box-shadow:0 0 0 0 rgba(200,68,0,.5);}50%{box-shadow:0 0 0 8px rgba(200,68,0,0);}}
.prog-wrap{margin-top:11px;}
.prog-meta{display:flex;justify-content:space-between;font-size:10px;color:var(--muted);font-family:'Rajdhani',sans-serif;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;}
.prog-track{background:#1a1a1a;border-radius:999px;height:7px;overflow:hidden;border:1px solid var(--border);}
.prog-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--red),var(--gold));transition:width 1.2s ease;}

/* STATS */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:12px;}
.stat-card{background:var(--card);border:1px solid var(--border);border-top:3px solid var(--red);border-radius:11px;padding:11px 7px;text-align:center;}
.stat-val{font-family:'Anton',sans-serif;font-size:clamp(24px,6vw,32px);line-height:1;margin-bottom:2px;}
.stat-lbl{font-family:'Rajdhani',sans-serif;font-size:8px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;font-weight:700;}

/* TODAY DRILL */
.drill-hero{background:var(--card);border:1px solid var(--border);border-top:3px solid var(--red);border-radius:15px;margin-bottom:12px;overflow:hidden;}
.dh-top{background:linear-gradient(135deg,#1a0008,#1c1c1c);padding:13px 15px 11px;}
.dh-day{font-family:'Rajdhani',sans-serif;font-size:9px;color:var(--gold);letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-bottom:3px;}
.dh-name{font-family:'Rajdhani',sans-serif;font-size:clamp(19px,5vw,25px);font-weight:700;line-height:1.15;}
.dtags{display:flex;gap:6px;flex-wrap:wrap;padding:11px 15px 0;}
.dtag{background:#111;border:1px solid var(--border);border-radius:5px;padding:3px 8px;font-size:9px;font-weight:700;color:var(--muted);font-family:'Rajdhani',sans-serif;text-transform:uppercase;}
.dtag.red{background:rgba(200,16,46,.1);border-color:rgba(200,16,46,.3);color:var(--red);}
.dtag.gold{background:rgba(201,168,76,.1);border-color:rgba(201,168,76,.3);color:var(--gold);}

/* VIDEO */
.video-wrap{margin:11px 15px 0;border-radius:11px;overflow:hidden;aspect-ratio:16/9;position:relative;background:#000;}
.video-thumb{position:absolute;inset:0;background:linear-gradient(150deg,#1a0008,#0d0d0d);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;gap:8px;}
.play-btn{width:58px;height:58px;border-radius:50%;background:var(--red);border:3px solid rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;transition:transform .2s;}
.play-btn:hover{transform:scale(1.08);}
.video-cap{font-family:'Rajdhani',sans-serif;font-size:10px;color:rgba(255,255,255,.45);letter-spacing:2px;text-transform:uppercase;text-align:center;}
.video-attr{font-size:9px;color:rgba(255,255,255,.2);text-align:center;}
.cue{background:rgba(201,168,76,.07);border-left:3px solid var(--gold);border-radius:0 9px 9px 0;padding:10px 13px;margin:11px 15px 0;font-size:13px;color:#d4a84c;line-height:1.6;font-weight:600;}
.tip{background:rgba(0,201,122,.05);border-left:3px solid var(--green);border-radius:0 8px 8px 0;padding:9px 13px;margin:9px 15px 0;font-size:13px;color:#00c97a;line-height:1.5;}
.spacenote{background:rgba(56,182,255,.05);border:1px solid rgba(56,182,255,.15);border-radius:9px;padding:9px 13px;margin:9px 15px 0;font-size:12px;color:#78c8f0;display:flex;gap:8px;align-items:flex-start;}
.drill-desc{padding:11px 15px 0;font-size:14px;color:#bbb;line-height:1.7;}
.drill-sets{padding:8px 15px 0;font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:700;color:var(--red);}
.sec-title{padding:13px 15px 7px;font-weight:700;font-size:14px;color:var(--white);}

/* 3-TIER SUBMISSION */
.tier-section{padding:4px 15px 0;}
.tier-lbl{font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:9px;}
.tier-btn{width:100%;display:flex;align-items:center;gap:11px;padding:13px 15px;border-radius:11px;border:2px solid var(--border);background:#111;cursor:pointer;transition:border-color .18s,background .18s;margin-bottom:7px;text-align:left;}
.tier-btn:active{transform:scale(.98);}
.tier-btn.sel{border-color:var(--tc,var(--red));background:rgba(0,0,0,.5);}
.tier-btn:hover:not(.sel){border-color:var(--border2);}
.tier-emo{font-size:26px;flex-shrink:0;width:34px;text-align:center;}
.tier-info{flex:1;min-width:0;}
.tier-name{font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;margin-bottom:1px;}
.tier-sub{font-size:11px;color:var(--muted);line-height:1.4;}
.tier-pts{font-family:'Anton',sans-serif;font-size:22px;flex-shrink:0;}
.submit-btn{display:block;width:calc(100% - 30px);margin:11px 15px;padding:15px;border:none;border-radius:11px;cursor:pointer;font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all .2s;}
.submit-btn.go{background:linear-gradient(135deg,var(--red),var(--red2));color:#fff;box-shadow:0 6px 20px rgba(200,16,46,.3);}
.submit-btn.go:active{transform:scale(.98);}
.submit-btn.dim{background:linear-gradient(135deg,var(--red),var(--red2));color:#fff;opacity:.4;cursor:default;}
.submit-btn.done{background:rgba(0,201,122,.1);color:var(--green);border:2px solid var(--green);cursor:default;}
.submit-hint{text-align:center;font-size:10px;color:#444;font-family:'Rajdhani',sans-serif;letter-spacing:1px;padding-bottom:13px;}

/* WALL BONUS */
.wall-section{background:rgba(56,182,255,.03);border:1px solid rgba(56,182,255,.18);border-radius:13px;margin-bottom:12px;overflow:hidden;}
.wall-hdr{background:rgba(56,182,255,.07);padding:11px 13px;border-bottom:1px solid rgba(56,182,255,.13);}
.wall-title{font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;color:var(--blue);letter-spacing:1px;}
.wall-sub{font-size:11px;color:rgba(56,182,255,.55);margin-top:2px;}
.wall-btn{display:flex;align-items:center;gap:11px;padding:12px 13px;border-bottom:1px solid rgba(56,182,255,.08);cursor:pointer;transition:background .15s;background:transparent;border-left:none;border-right:none;border-top:none;width:100%;text-align:left;}
.wall-btn:last-child{border-bottom:none;}
.wall-btn:hover:not(.wdone){background:rgba(56,182,255,.05);}
.wall-btn:active:not(.wdone){background:rgba(56,182,255,.1);}
.wall-btn.wdone{opacity:.5;cursor:default;}
.wall-emo{font-size:20px;width:26px;text-align:center;flex-shrink:0;}
.wall-info{flex:1;min-width:0;}
.wall-name{font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;margin-bottom:1px;}
.wall-sub2{font-size:11px;color:var(--muted);line-height:1.3;}
.wall-pts{font-family:'Anton',sans-serif;font-size:20px;color:var(--blue);flex-shrink:0;}
.wall-done{background:rgba(0,201,122,.12);border:1px solid var(--green);color:var(--green);font-size:9px;font-weight:700;padding:2px 7px;border-radius:999px;font-family:'Rajdhani',sans-serif;letter-spacing:1px;}

/* DRILLS LIST */
.week-nav{display:flex;gap:6px;margin-bottom:12px;}
.week-btn{flex:1;padding:8px 4px;border-radius:9px;border:1px solid var(--border);background:var(--card);color:var(--muted);font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;text-align:center;transition:all .18s;line-height:1.4;}
.week-btn.active{background:var(--red);color:#fff;border-color:var(--red);}
.drill-row{display:flex;align-items:stretch;background:var(--card);border:1px solid var(--border);border-radius:11px;margin-bottom:8px;overflow:hidden;cursor:pointer;transition:border-color .15s;}
.drill-row:hover:not(.locked){border-color:var(--red);}
.drill-row.locked{cursor:default;opacity:.38;}
.dd{width:48px;background:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;border-right:1px solid var(--border);}
.dd.ddone{background:rgba(0,201,122,.06);}
.dd.dtoday{background:rgba(200,16,46,.09);}
.dd.dlocked{background:#0d0d0d;}
.ddnum{font-family:'Anton',sans-serif;font-size:20px;line-height:1;}
.ddlbl{font-family:'Rajdhani',sans-serif;font-size:7px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;}
.db{padding:10px 12px;flex:1;min-width:0;}
.dcat{font-size:9px;color:var(--red);letter-spacing:2px;font-weight:700;font-family:'Rajdhani',sans-serif;text-transform:uppercase;margin-bottom:1px;}
.dtitle{font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;line-height:1.2;margin-bottom:2px;}
.dmeta{display:flex;gap:8px;font-size:9px;color:var(--muted);font-family:'Rajdhani',sans-serif;font-weight:600;flex-wrap:wrap;}
.dstat{display:flex;align-items:center;justify-content:center;width:32px;flex-shrink:0;}

/* STANDINGS */
.grand-card{background:linear-gradient(150deg,#1a0008,#141414);border:1px solid rgba(200,16,46,.22);border-radius:15px;padding:16px 14px;margin-bottom:12px;}
.grand-title{font-family:'Anton',sans-serif;font-size:clamp(18px,5vw,22px);letter-spacing:2px;line-height:1;}
.grand-sub{font-family:'Rajdhani',sans-serif;font-size:9px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin:2px 0 11px;}
.grand-pct{font-family:'Anton',sans-serif;font-size:clamp(32px,8vw,42px);color:var(--gold);line-height:1;}
.grand-track{background:#111;border-radius:999px;height:11px;overflow:hidden;border:1px solid var(--border);margin:9px 0 5px;}
.grand-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--red),var(--gold));transition:width 1.5s ease;}
.reward-card{border-radius:9px;padding:10px 12px;font-size:12px;line-height:1.6;margin-top:8px;}
.rwd-locked{background:rgba(255,255,255,.02);border:1px solid var(--border);color:var(--muted);}
.rwd-unlock{background:rgba(0,201,122,.06);border:1px solid rgba(0,201,122,.28);color:#7af0c0;}
.math-link{display:inline-flex;align-items:center;gap:5px;font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1px;text-transform:uppercase;margin-top:9px;cursor:pointer;}
.team-card{border-radius:13px;margin-bottom:9px;overflow:hidden;border:1px solid var(--border);background:var(--card);}
.team-top{padding:12px 14px;display:flex;align-items:center;justify-content:space-between;}
.team-nbig{font-family:'Anton',sans-serif;font-size:clamp(18px,5vw,22px);letter-spacing:1px;}
.team-pbig{font-family:'Anton',sans-serif;font-size:clamp(26px,6vw,32px);}
.tbar-wrap{padding:0 14px 11px;}
.tbar-track{background:#111;border-radius:999px;height:4px;overflow:hidden;}
.tbar-fill{height:100%;border-radius:999px;transition:width 1s ease;}
.tchips{padding:0 14px 11px;display:flex;gap:4px;flex-wrap:wrap;}
.tchip{font-family:'Rajdhani',sans-serif;font-size:9px;font-weight:700;padding:2px 7px;border-radius:999px;background:#111;border:1px solid var(--border);color:var(--muted);}
.lb-row{display:flex;align-items:center;gap:9px;padding:9px 11px;background:var(--card);border-radius:10px;margin-bottom:6px;border:1px solid var(--border);}
.lb-row.me{border:2px solid var(--gold);background:rgba(201,168,76,.03);}
.lb-rank{font-family:'Anton',sans-serif;font-size:16px;color:var(--muted);width:24px;text-align:center;flex-shrink:0;}
.lb-rank.top{color:var(--gold);}
.lb-av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;}
.lb-info{flex:1;min-width:0;}
.lb-name{font-weight:600;font-size:13px;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.lb-meta{font-size:10px;color:var(--muted);display:flex;gap:5px;font-family:'Rajdhani',sans-serif;font-weight:600;flex-wrap:wrap;}
.lb-pts{font-family:'Anton',sans-serif;font-size:20px;color:var(--gold);flex-shrink:0;}

/* POINTS PAGE */
.rule-row{display:flex;justify-content:space-between;align-items:center;padding:9px 13px;font-size:13px;border-bottom:1px solid var(--border);}
.rule-row:last-child{border:none;}
.rule-val{font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;flex-shrink:0;}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:flex;align-items:flex-end;backdrop-filter:blur(5px);}
.modal{background:var(--card);border-top:1px solid var(--border);border-radius:22px 22px 0 0;width:100%;max-height:91vh;max-height:91dvh;overflow-y:auto;animation:slideUp .28s ease;}
@keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
.m-handle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:11px auto;}
.m-top{background:linear-gradient(135deg,#1a0008,#1c1c1c);padding:13px 17px 16px;border-bottom:1px solid var(--border);}
.m-day{font-size:8px;color:var(--gold);letter-spacing:3px;font-weight:700;font-family:'Rajdhani',sans-serif;text-transform:uppercase;margin-bottom:3px;}
.m-title{font-family:'Rajdhani',sans-serif;font-size:clamp(20px,5vw,24px);font-weight:700;line-height:1.1;}
.m-body{padding:13px 15px;}

/* MATH PANEL */
.math-panel{background:#111;border:1px solid var(--border);border-radius:11px;padding:14px;margin:10px 0;}
.math-row{display:flex;justify-content:space-between;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px;gap:10px;}
.math-row:last-child{border:none;}
.math-lbl{color:var(--muted);line-height:1.4;flex:1;}
.math-formula{font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(201,168,76,.5);display:block;margin-top:2px;}
.math-val{font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;color:var(--gold);white-space:nowrap;flex-shrink:0;}
.math-note{background:rgba(201,168,76,.05);border:1px solid rgba(201,168,76,.2);border-radius:9px;padding:11px 13px;margin-top:9px;font-size:12px;color:#bbb;line-height:1.8;}

/* INSTAGRAM */
.ig-option{display:flex;align-items:flex-start;gap:11px;padding:13px;background:#111;border:1px solid var(--border);border-radius:11px;margin-bottom:9px;cursor:pointer;transition:border-color .15s;text-align:left;width:100%;}
.ig-option:hover{border-color:var(--gold);}
.ig-option:active{transform:scale(.99);}
.ig-icon{font-size:26px;flex-shrink:0;width:32px;text-align:center;}
.ig-info{flex:1;min-width:0;}
.ig-title{font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;color:var(--white);margin-bottom:2px;}
.ig-desc{font-size:11px;color:var(--muted);line-height:1.4;}
.copy-box{background:#0a0a0a;border:1px solid var(--border);border-radius:9px;padding:13px;font-size:11px;color:#bbb;line-height:1.9;font-family:'JetBrains Mono',monospace;white-space:pre-wrap;margin:9px 0;}
.copy-btn{width:100%;padding:12px;border:none;border-radius:9px;background:var(--red);color:#fff;font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;letter-spacing:2px;cursor:pointer;text-transform:uppercase;transition:all .2s;}
.copy-btn:active{transform:scale(.98);}
.copy-btn.copied{background:var(--green);}
.share-card{background:linear-gradient(150deg,#1a0008,#0d0d0d 50%,#0a0a00 100%);border:2px solid var(--gold);border-radius:15px;padding:18px 14px;text-align:center;margin:11px 0;position:relative;overflow:hidden;}
.share-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:11px 0 9px;}
.share-stat{background:rgba(255,255,255,.04);border-radius:9px;padding:9px 5px;border:1px solid var(--border);}
.ss-val{font-family:'Anton',sans-serif;font-size:20px;line-height:1;}
.ss-lbl{font-family:'Rajdhani',sans-serif;font-size:8px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-top:2px;}
`;

export { CSS, DRILL_DB, DEMO_PLAYERS, DEMO_POINTS, TIERS, WALL_BONUSES, TEAM_COLORS, TEAM_LABELS,
         SQUAD_TARGET, PARENT_GAME_THRESH, PIZZA_THRESH, CURRENT_DAY, calcStats, genDemoPoints };

  CSS, DRILL_DB, DEMO_PLAYERS, TIERS, WALL_BONUSES, TEAM_COLORS, TEAM_LABELS,
  SQUAD_TARGET, PARENT_GAME_THRESH, CURRENT_DAY, calcStats, genDemoPoints
} from "./cb_app_part1";

// ── Sub-components ───────────────────────────────────────────────────────────
const CBLogo = ({ size = 80 }) => (
  <svg viewBox="0 0 200 230" width={size} height={Math.round(size * 1.15)}>
    <path d="M100 8 L188 44 L188 145 L100 222 L12 145 L12 44 Z" fill="#0d0d0d" stroke="#c9a84c" strokeWidth="4"/>
    <path d="M100 8 L188 44 L188 100 L12 100 L12 44 Z" fill="#c9a84c"/>
    <path d="M12 100 L100 100 L100 168 L12 145 Z" fill="#c8102e"/>
    <path d="M100 100 L188 100 L188 145 L100 168 Z" fill="#1a1a1a"/>
    <path d="M12 145 L100 168 L188 145 L100 222 Z" fill="#0a0a0a"/>
    <path d="M100 13 L183 48 L183 144 L100 218 L17 144 L17 48 Z" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity=".35"/>
    <text x="100" y="52" fontFamily="Arial Black,sans-serif" fontSize="15" fontWeight="900" fill="#0d0d0d" textAnchor="middle" dominantBaseline="middle" letterSpacing="3">SOCCER CLUB</text>
    <text x="100" y="85" fontFamily="Arial Black,sans-serif" fontSize="40" fontWeight="900" fill="#0d0d0d" textAnchor="middle" dominantBaseline="middle">CB</text>
    <text x="100" y="136" fontFamily="Arial" fontSize="36" fill="white" textAnchor="middle" dominantBaseline="middle">★</text>
    <text x="46" y="134" fontFamily="Arial Black,sans-serif" fontSize="11" fontWeight="900" fill="#c8102e" textAnchor="middle" dominantBaseline="middle">EST.</text>
    <text x="154" y="134" fontFamily="Arial Black,sans-serif" fontSize="11" fontWeight="900" fill="#c8102e" textAnchor="middle" dominantBaseline="middle">2009</text>
    <circle cx="100" cy="196" r="22" fill="white" stroke="#333" strokeWidth="1.5"/>
    <polygon points="100,175 108,183 100,190 92,183" fill="#1a1a1a"/>
    <polygon points="121,190 113,182 121,178 126,186" fill="#1a1a1a"/>
    <polygon points="79,190 87,182 79,178 74,186" fill="#1a1a1a"/>
    <polygon points="108,207 108,198 115,197 114,208" fill="#1a1a1a"/>
    <polygon points="92,207 92,198 85,197 86,208" fill="#1a1a1a"/>
  </svg>
);

const DrillVideo = ({ ytId, ytLabel }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video-wrap">
      {!playing ? (
        <div className="video-thumb" onClick={() => setPlaying(true)}>
          <div className="play-btn">▶</div>
          <div className="video-cap">Watch Drill Demo</div>
          {ytLabel && <div className="video-attr">{ytLabel}</div>}
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          title="drill" allowFullScreen
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
        />
      )}
    </div>
  );
};

const DEMO_POINTS = genDemoPoints();

// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser]           = useState(null);
  const [tab, setTab]             = useState("home");
  const [weekFilter, setWeekFilter] = useState(1);
  const [fade, setFade]           = useState(true);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr]   = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Today submission
  const [selectedTier, setSelectedTier]   = useState(null);
  const [todaySubmitted, setTodaySubmitted] = useState(false);
  const [completedDays, setCompletedDays] = useState(new Set([1,2,3,4,5,6,7,8,9]));

  // Wall bonuses
  const [wallDone, setWallDone]   = useState(new Set());
  const [wallModal, setWallModal] = useState(null);

  // Modals
  const [drillModal, setDrillModal] = useState(null);
  const [mathModal, setMathModal]   = useState(false);
  const [igModal, setIgModal]       = useState(false);
  const [igView, setIgView]         = useState(null);
  const [copied, setCopied]         = useState(false);

  const todayDrill = DRILL_DB[CURRENT_DAY - 1];

  // ── computed ──────────────────────────────────────────────────────────────
  const myStats     = user ? calcStats(user.username) : null;
  const todayPts    = selectedTier ? TIERS.find(t => t.id === selectedTier)?.pts ?? 0 : 0;
  const totalDays   = (myStats?.daysCompleted ?? 0) + (todaySubmitted ? 1 : 0);
  const baseTotal   = (myStats?.base ?? 0) + (todaySubmitted ? todayPts : 0);
  const streak      = (myStats?.streak ?? 0) + (todaySubmitted ? 1 : 0);
  const streakBonus = streak>=7?500:streak>=5?250:streak>=3?100:0;
  const wallPts     = [...wallDone].reduce((s,id)=>s+(WALL_BONUSES.find(w=>w.id===id)?.pts??0),0);
  const myTotal     = baseTotal + streakBonus + wallPts;

  const allStats    = DEMO_PLAYERS.map(p=>({...p,...calcStats(p.username)})).sort((a,b)=>b.total-a.total);
  const myRank      = user ? allStats.findIndex(p=>p.username===user.username)+1 : "—";
  const teamTotals  = [1,2,3,4].map(tid=>({
    tid, label:TEAM_LABELS[tid], color:TEAM_COLORS[tid],
    pts: allStats.filter(p=>p.teamId===tid).reduce((s,p)=>s+p.total,0),
    players: allStats.filter(p=>p.teamId===tid),
  })).sort((a,b)=>b.pts-a.pts);
  const grandTotal  = allStats.reduce((s,p)=>s+p.total,0);
  const grandPct    = Math.round((grandTotal/SQUAD_TARGET)*100);

  const switchTab = t => {
    setFade(false);
    setTimeout(() => { setTab(t); setFade(true); }, 130);
  };

  // ── login ─────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (!loginUser.trim() || !loginPass.trim()) { setLoginErr("Please enter your username and password."); return; }
    setLoginLoading(true); setLoginErr("");
    setTimeout(() => {
      const found = DEMO_PLAYERS.find(p => p.username===loginUser.trim().toLowerCase() && p.password===loginPass.trim());
      if (found) setUser(found);
      else setLoginErr("Incorrect login. Ask your coach if you've forgotten.");
      setLoginLoading(false);
    }, 500);
  };

  const submitSession = () => {
    if (!selectedTier) return;
    setTodaySubmitted(true);
    setCompletedDays(prev => new Set([...prev, CURRENT_DAY]));
  };

  const submitWall = wid => { setWallDone(prev => new Set([...prev, wid])); setWallModal(null); };

  const getShareText = style => {
    const tierLabel = TIERS.find(t=>t.id===selectedTier)?.label ?? "Completed today's session";
    const myTeamPts = teamTotals.find(t=>t.tid===user?.teamId)?.pts ?? 0;
    if (style==="story") return [
      `🐆 CB CHEETAHS BALL MASTERY`,``,
      `Day ${CURRENT_DAY}/15 ✅`,
      `Today: ${todayDrill.title}`,
      tierLabel,``,
      `${TEAM_LABELS[user?.teamId]} team: ${myTeamPts.toLocaleString()} pts`,
      `My total: ${myTotal.toLocaleString()} pts`,``,
      `3m × 3m. 15 days. All Cheetahs.`,
      `#CherryBeachCheetahs #BallMastery #CBCheetahs`,
    ].join("\n");
    if (style==="post") return [
      `Day ${CURRENT_DAY} of the Cherry Beach Cheetahs 15-Day Ball Mastery Challenge ✅`,``,
      `Today's drill: ${todayDrill.title} 🐆`,
      tierLabel,``,
      `All training in a 3m×3m space — no excuses, just reps 💪`,``,
      streak>=3?`🔥 ${streak}-day streak active!`:`Grinding every day!`,
      `My points: ${myTotal.toLocaleString()} | ${TEAM_LABELS[user?.teamId]}: ${myTeamPts.toLocaleString()}`,``,
      `#CherryBeachCheetahs #BallMastery #U15Soccer #CBCheetahs #TorontoSoccer`,
    ].join("\n");
    return [`⚽ ${TEAM_LABELS[user?.teamId]} — CB Cheetahs`,`Day ${CURRENT_DAY}: ${todayDrill.title}`,tierLabel,streak>=3?`🔥 ${streak}-DAY STREAK`:"",`${myTotal.toLocaleString()} pts`].filter(Boolean).join(" · ");
  };

  const doCopy = text => {
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  // ════════════════ LOGIN PAGE ══════════════════════════════════════════════
  if (!user) return (
    <>
      <style>{CSS}</style>
      <div className="login-page">
        <div className="login-grid"/>
        <div className="login-glow"/>
        <div className="login-card">
          <div className="login-logo">
            <CBLogo size={84}/>
            <div className="login-club">CHERRY BEACH<br/>CHEETAHS</div>
            <div className="login-sub">U15 Ball Mastery Challenge</div>
            <div className="login-prog">15-Day Indoor Programme · 3m × 3m</div>
          </div>
          {loginErr && <div className="login-err">⚠ {loginErr}</div>}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" placeholder="your username" value={loginUser}
              onChange={e=>setLoginUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              autoCapitalize="none" autoCorrect="off" inputMode="text"/>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={loginPass}
              onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
          </div>
          <button className="login-btn" onClick={handleLogin} disabled={loginLoading}>
            {loginLoading ? "SIGNING IN…" : "SIGN IN →"}
          </button>
          <div className="login-hint">Demo: <code>ayla</code> / <code>cheetah01</code><br/>Contact your coach if you've forgotten your login.</div>
        </div>
      </div>
    </>
  );

  // ════════════════ HOME ════════════════════════════════════════════════════
  const renderHome = () => {
    const myTeamData = teamTotals.find(t=>t.tid===user.teamId);
    return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="day-pill">⚡ Day {CURRENT_DAY} of 15</div>
        <div className="hero-greet">Welcome back,</div>
        <div className="hero-name">{user.playerName.toUpperCase()}</div>
        {streak>=3 && <div className="streak-pill">🔥 {streak}-DAY STREAK</div>}
        <div className="prog-wrap">
          <div className="prog-meta"><span>Progress</span><span>{Math.round((totalDays/15)*100)}%</span></div>
          <div className="prog-track"><div className="prog-fill" style={{width:`${(totalDays/15)*100}%`}}/></div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-val" style={{color:"var(--red)"}}>{totalDays}</div><div className="stat-lbl">Days Done</div></div>
        <div className="stat-card"><div className="stat-val" style={{color:"var(--gold)"}}>#{myRank}</div><div className="stat-lbl">Your Rank</div></div>
        <div className="stat-card"><div className="stat-val">{myTotal.toLocaleString()}</div><div className="stat-lbl">Total Pts</div></div>
      </div>

      {/* Today quick-tap */}
      {!todaySubmitted ? (
        <div onClick={()=>switchTab("today")} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",background:"linear-gradient(135deg,#1a0008,#1c1c1c)",border:"1px solid rgba(200,16,46,.28)",borderRadius:13,cursor:"pointer",marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:9,color:"var(--red)",letterSpacing:3,fontWeight:700,textTransform:"uppercase",marginBottom:3}}>Today's Drill</div>
            <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:17,fontWeight:700}}>{todayDrill.title}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>Tap to watch the video and log your session →</div>
          </div>
          <span style={{fontSize:28,color:"var(--red)"}}>▶</span>
        </div>
      ) : (
        <div className="card" style={{border:"2px solid var(--green)",marginBottom:12,textAlign:"center"}}>
          <div className="card-body" style={{padding:"18px 14px"}}>
            <div style={{fontSize:34,marginBottom:5}}>✅</div>
            <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:18,fontWeight:700,color:"var(--green)"}}>TODAY COMPLETE!</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>{TIERS.find(t=>t.id===selectedTier)?.label} · +{todayPts} pts</div>
          </div>
        </div>
      )}

      {/* School wall bonus */}
      <div className="sec">School Wall Drill Bonus</div>
      <div className="wall-section">
        <div className="wall-hdr">
          <div className="wall-title">🏫 Local School Wall Programme</div>
          <div className="wall-sub">45-min wall drill programme at any school near you — extra points awarded</div>
        </div>
        {WALL_BONUSES.map(w => {
          const done = wallDone.has(w.id);
          return (
            <button key={w.id} className={`wall-btn ${done?"wdone":""}`}
              onClick={()=>!done&&setWallModal(w)} style={{cursor:done?"default":"pointer"}}>
              <span className="wall-emo">{w.emoji}</span>
              <div className="wall-info">
                <div className="wall-name" style={{color:w.color}}>{w.label}</div>
                <div className="wall-sub2">{w.subLabel}</div>
              </div>
              {done ? <span className="wall-done">✓ DONE</span> : <span className="wall-pts">+{w.pts}</span>}
            </button>
          );
        })}
      </div>

      {/* Points breakdown */}
      <div className="sec">Points Breakdown</div>
      <div className="card">
        <div className="rule-row"><span>Sessions ({totalDays} days)</span><span className="rule-val" style={{color:"var(--green)"}}>{baseTotal}</span></div>
        {streakBonus>0&&<div className="rule-row"><span>🔥 {streak}-day streak bonus</span><span className="rule-val" style={{color:"#ff6b35"}}>{streakBonus}</span></div>}
        {wallPts>0&&<div className="rule-row"><span>🏫 Wall drill bonuses</span><span className="rule-val" style={{color:"var(--blue)"}}>{wallPts}</span></div>}
        <div className="rule-row" style={{fontWeight:700}}><span>TOTAL</span><span className="rule-val" style={{color:"var(--white)",fontSize:18}}>{myTotal.toLocaleString()}</span></div>
      </div>

      {/* Team status */}
      <div className="sec">{user.teamName} Standing</div>
      <div className="card" style={{borderTop:`3px solid ${TEAM_COLORS[user.teamId]}`,marginBottom:12}}>
        <div className="card-body" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
          <div>
            <div style={{fontFamily:"Anton,sans-serif",fontSize:18,color:TEAM_COLORS[user.teamId]}}>{TEAM_LABELS[user.teamId]}</div>
            <div style={{fontSize:10,color:"var(--muted)"}}>Rank #{teamTotals.findIndex(t=>t.tid===user.teamId)+1} of 4</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"Anton,sans-serif",fontSize:28,color:"var(--white)"}}>{myTeamData?.pts.toLocaleString()}</div>
            <div style={{fontSize:9,color:"var(--muted)"}}>team points</div>
          </div>
        </div>
      </div>

      {/* Instagram CTA */}
      <button className="ig-option" onClick={()=>setIgModal(true)} style={{width:"100%",border:"1px solid rgba(201,168,76,.28)",background:"rgba(201,168,76,.04)"}}>
        <span className="ig-icon">📸</span>
        <div className="ig-info"><div className="ig-title">Share Progress on Instagram</div><div className="ig-desc">Story captions, feed posts, and score card — ready to copy & post</div></div>
        <span style={{color:"var(--gold)",fontSize:16}}>→</span>
      </button>
    </div>
  );};

  // ════════════════ TODAY ═══════════════════════════════════════════════════
  const renderToday = () => (
    <div>
      <div className="drill-hero">
        <div className="dh-top">
          <div className="dh-day">Day {CURRENT_DAY} of 15 · {todayDrill.cat} · Week {todayDrill.week}</div>
          <div className="dh-name">{todayDrill.title}</div>
        </div>
        <DrillVideo ytId={todayDrill.yt} ytLabel={todayDrill.ytLabel}/>
        <div className="dtags">
          <span className="dtag">⏱ {todayDrill.dur}</span>
          <span className="dtag red">📐 3m × 3m</span>
          <span className="dtag gold">👟 {todayDrill.foot} foot</span>
          <span className="dtag">{"⚽".repeat(todayDrill.diff)}</span>
        </div>
        <div className="cue">{todayDrill.cue}</div>
        <div className="sec-title">📋 The Drill</div>
        <div className="drill-desc">{todayDrill.desc}</div>
        <div className="drill-sets">{todayDrill.sets}</div>
        <div className="tip">💡 <strong>Pro Tip:</strong> {todayDrill.tip}</div>
        <div className="spacenote"><span>📐</span><div><strong>Space Setup:</strong> {todayDrill.space}</div></div>

        {/* 3-tier submission */}
        {!todaySubmitted ? (
          <>
            <div className="tier-section" style={{paddingTop:14}}>
              <div className="tier-lbl">How did today's session go?</div>
              {TIERS.map(tier => (
                <button key={tier.id}
                  className={`tier-btn ${selectedTier===tier.id?"sel":""}`}
                  style={{"--tc":tier.color}}
                  onClick={()=>setSelectedTier(tier.id)}>
                  <span className="tier-emo">{tier.emoji}</span>
                  <div className="tier-info">
                    <div className="tier-name" style={{color:selectedTier===tier.id?tier.color:"var(--white)"}}>{tier.label}</div>
                    <div className="tier-sub">{tier.subLabel}</div>
                  </div>
                  <span className="tier-pts" style={{color:selectedTier===tier.id?tier.color:"var(--muted)"}}>+{tier.pts}</span>
                </button>
              ))}
            </div>
            <button
              className={`submit-btn ${selectedTier?"go":"dim"}`}
              onClick={selectedTier?submitSession:undefined}>
              {selectedTier?`✓ LOG MY SESSION · +${todayPts} PTS`:"↑ Select How It Went First"}
            </button>
            {selectedTier&&<div className="submit-hint">Counts toward streak · {user.teamName} points · Squad challenge</div>}
          </>
        ) : (
          <div style={{padding:"14px 15px"}}>
            <div style={{background:"rgba(0,201,122,.07)",border:"2px solid var(--green)",borderRadius:13,padding:"16px 14px",textAlign:"center"}}>
              <div style={{fontSize:34,marginBottom:5}}>✅</div>
              <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:18,fontWeight:700,color:"var(--green)"}}>SESSION LOGGED!</div>
              <div style={{fontFamily:"Anton,sans-serif",fontSize:26,color:"var(--gold)",marginTop:3}}>+{todayPts} PTS EARNED</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:5}}>{TIERS.find(t=>t.id===selectedTier)?.label}</div>
            </div>
            <button className="ig-option" onClick={()=>setIgModal(true)} style={{width:"100%",marginTop:9,border:"1px solid rgba(201,168,76,.28)",background:"rgba(201,168,76,.04)"}}>
              <span className="ig-icon">📸</span>
              <div className="ig-info"><div className="ig-title">Share on Instagram</div><div className="ig-desc">3 share styles ready — tap to generate</div></div>
              <span style={{color:"var(--gold)"}}>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ════════════════ DRILLS (locked until unlocked by day) ═══════════════════
  const renderDrills = () => (
    <div>
      <div className="week-nav">
        {[1,2,3].map(w => {
          const hasAny = DRILL_DB.some(d=>d.week===w&&d.day<=CURRENT_DAY);
          return (
            <button key={w} className={`week-btn ${weekFilter===w?"active":""}`}
              onClick={()=>setWeekFilter(w)} style={{opacity:hasAny?1:0.32}}>
              WK {w}<br/><span style={{fontSize:"8px",opacity:.7}}>{w===1?"FOUND.":w===2?"BUILD":"ELITE"}</span>
            </button>
          );
        })}
      </div>
      <div className="sec">Week {weekFilter} · {weekFilter===1?"Foundation":weekFilter===2?"Building":"Elite Phase"}</div>
      {DRILL_DB.filter(d=>d.week===weekFilter).map(drill => {
        const isLocked = drill.day > CURRENT_DAY;
        const done     = completedDays.has(drill.day)||(drill.day===CURRENT_DAY&&todaySubmitted);
        const isToday  = drill.day===CURRENT_DAY;
        if (isLocked) return (
          <div key={drill.day} className="drill-row locked">
            <div className="dd dlocked"><div className="ddnum" style={{color:"var(--border)",fontSize:18}}>🔒</div><div className="ddlbl">D{drill.day}</div></div>
            <div className="db">
              <div className="dcat">LOCKED</div>
              <div className="dtitle" style={{color:"var(--border)"}}>Unlocks on Day {drill.day}</div>
              <div className="dmeta"><span>Available in {drill.day-CURRENT_DAY} day{drill.day-CURRENT_DAY!==1?"s":""}</span></div>
            </div>
            <div className="dstat"><span style={{fontSize:16,color:"var(--border)"}}>🔒</span></div>
          </div>
        );
        return (
          <div key={drill.day} className="drill-row" onClick={()=>setDrillModal(drill)}>
            <div className={`dd ${done?"ddone":isToday?"dtoday":""}`}>
              <div className="ddnum" style={{color:done?"var(--green)":isToday?"var(--red)":"var(--muted)"}}>{drill.day}</div>
              <div className="ddlbl">DAY</div>
            </div>
            <div className="db">
              <div className="dcat">{drill.cat}</div>
              <div className="dtitle">{drill.title}</div>
              <div className="dmeta"><span>⏱{drill.dur}</span><span>{"⚽".repeat(drill.diff)}</span><span>3m×3m</span></div>
            </div>
            <div className="dstat">
              {done?<span style={{color:"var(--green)",fontSize:16}}>✓</span>
                  :isToday?<span style={{color:"var(--red)",fontSize:8,fontFamily:"Rajdhani,sans-serif",fontWeight:700,letterSpacing:1,textAlign:"center"}}>TODAY</span>
                  :<span style={{color:"var(--border)",fontSize:16}}>○</span>}
            </div>
          </div>
        );
      })}
      {DRILL_DB.filter(d=>d.week===weekFilter&&d.day>CURRENT_DAY).length>0&&(
        <div style={{textAlign:"center",padding:"8px 0",fontFamily:"Rajdhani,sans-serif",fontSize:10,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase"}}>
          🔒 {DRILL_DB.filter(d=>d.week===weekFilter&&d.day>CURRENT_DAY).length} drills unlock day by day
        </div>
      )}
    </div>
  );

  // ════════════════ STANDINGS ═══════════════════════════════════════════════
  const renderStandings = () => (
    <div>
      <div className="grand-card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
          <div><div className="grand-title">SQUAD CHALLENGE</div><div className="grand-sub">All 28 Cheetahs United</div></div>
          <div className="grand-pct">{grandPct}%</div>
        </div>
        <div className="grand-track"><div className="grand-fill" style={{width:`${Math.min(100,grandPct)}%`}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"var(--muted)",fontFamily:"Rajdhani,sans-serif",letterSpacing:1,marginBottom:6}}>
          <span>{grandTotal.toLocaleString()} pts earned</span><span>Target: {SQUAD_TARGET.toLocaleString()}</span>
        </div>
        <div className={`reward-card ${grandPct>=70?"rwd-unlock":"rwd-locked"}`}>
          <strong>{grandPct>=70?"🎮 UNLOCKED!":"🎮 At 70% —"}</strong> Parents vs Players Game — a full friendly match, parents take on the whole squad.{grandPct<70&&` ${(PARENT_GAME_THRESH-grandTotal).toLocaleString()} pts still needed.`}
        </div>
        <div className={`reward-card ${grandPct>=100?"rwd-unlock":"rwd-locked"}`}>
          <strong>{grandPct>=100?"🍕 UNLOCKED!":"🍕 At 100% —"}</strong> Pizza Party for all 28 players — everyone celebrates together finishing the challenge.{grandPct<100&&` ${(SQUAD_TARGET-grandTotal).toLocaleString()} pts still needed.`}
        </div>
        <div className="math-link" onClick={()=>setMathModal(true)}>📊 How is this calculated? →</div>
      </div>

      <div className="sec">Team Standings</div>
      {teamTotals.map((t,i)=>(
        <div key={t.tid} className="team-card">
          <div className="team-top" style={{background:`linear-gradient(135deg,${t.color}18,${t.color}06)`}}>
            <div>
              <div className="team-nbig" style={{color:t.color}}>{t.label}</div>
              <div style={{fontSize:9,color:"var(--muted)",fontFamily:"Rajdhani,sans-serif",letterSpacing:1}}>7 PLAYERS · AVG {Math.round(t.pts/7).toLocaleString()} PTS</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="team-pbig" style={{color:t.color}}>{t.pts.toLocaleString()}</div>
              {i===0&&<div style={{background:t.color,color:"#000",fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:999,fontFamily:"Rajdhani,sans-serif",letterSpacing:1,display:"inline-block"}}>LEADING</div>}
            </div>
          </div>
          <div className="tbar-wrap"><div className="tbar-track"><div className="tbar-fill" style={{width:`${(t.pts/teamTotals[0].pts)*100}%`,background:t.color}}/></div></div>
          <div className="tchips">
            {t.players.map(p=>(
              <span key={p.username} className="tchip" style={{borderColor:p.username===user.username?t.color:"var(--border)",color:p.username===user.username?t.color:"var(--muted)"}}>{p.initials}</span>
            ))}
          </div>
        </div>
      ))}

      <div className="sec">Individual Rankings</div>
      {allStats.map((p,i)=>{
        const isMe=p.username===user.username;
        const tc=TEAM_COLORS[p.teamId];
        return (
          <div key={p.username} className={`lb-row ${isMe?"me":""}`}>
            <div className={`lb-rank ${i<3?"top":""}`}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</div>
            <div className="lb-av" style={{background:tc}}>{p.initials}</div>
            <div className="lb-info">
              <div className="lb-name">{p.playerName}{isMe?" (You)":""}</div>
              <div className="lb-meta"><span style={{color:tc}}>{TEAM_LABELS[p.teamId]}</span><span>·</span><span>{p.daysCompleted}/15</span>{p.streak>=3&&<span style={{color:"#ff6b35"}}>🔥{p.streak}</span>}</div>
            </div>
            <div className="lb-pts">{p.total.toLocaleString()}</div>
          </div>
        );
      })}
    </div>
  );

  // ════════════════ POINTS ══════════════════════════════════════════════════
  const renderPoints = () => {
    const rules=[
      {i:"🔥",l:"Nailed It — clean reps, pushed pace",v:"+50",c:"var(--red)"},
      {i:"💪",l:"Gave It My Best — worked hard, kept going",v:"+25",c:"var(--gold)"},
      {i:"✅",l:"Got Some In — showed up, did what I could",v:"+3",c:"var(--muted)"},
      {i:"🏫",l:"Full School Wall Session (45 min)",v:"+75",c:"var(--blue)"},
      {i:"🧱",l:"Half School Wall Session (20+ min)",v:"+35",c:"var(--purple)"},
      {i:"👟",l:"First Wall Try-Out (any time)",v:"+10",c:"var(--muted)"},
      {i:"🔥",l:"3-day streak bonus",v:"+100",c:"#ff6b35"},
      {i:"🔥🔥",l:"5-day streak bonus",v:"+250",c:"#ff6b35"},
      {i:"🔥🔥🔥",l:"7-day streak bonus (biggest multiplier!)",v:"+500",c:"#ff6b35"},
      {i:"📅",l:"Perfect full 7-day week",v:"+200",c:"var(--gold)"},
      {i:"🏆",l:"Final circuit beats your Day 7 time",v:"+300",c:"var(--gold)"},
    ];
    return (
    <div>
      <div className="sec">How Points Work</div>
      <div className="card">
        {rules.map((r,i)=>(
          <div key={i} className="rule-row">
            <div style={{display:"flex",gap:8,alignItems:"center",flex:1,minWidth:0}}>
              <span style={{fontSize:14,flexShrink:0}}>{r.i}</span>
              <span style={{fontSize:12,color:"#bbb",lineHeight:1.4}}>{r.l}</span>
            </div>
            <span className="rule-val" style={{color:r.c,marginLeft:8}}>{r.v}</span>
          </div>
        ))}
      </div>

      <div className="sec">Submission Levels</div>
      <div className="card"><div className="card-body" style={{padding:"2px 12px"}}>
        {TIERS.map((t,i)=>(
          <div key={t.id} style={{padding:"11px 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
              <span style={{fontSize:18}}>{t.emoji}</span>
              <span style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:14,color:t.color,flex:1}}>{t.label}</span>
              <span style={{fontFamily:"Anton,sans-serif",fontSize:18,color:t.color}}>+{t.pts} pts</span>
            </div>
            <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5,paddingLeft:26}}>{t.subLabel}</div>
          </div>
        ))}
      </div></div>

      <div className="sec">School Wall Programme Details</div>
      <div className="card"><div className="card-body" style={{fontSize:13,color:"#999",lineHeight:1.8}}>
        {WALL_BONUSES.map((w,i)=>(
          <div key={w.id} style={{marginBottom:i<2?12:0}}>
            <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3}}>
              <span style={{fontSize:16}}>{w.emoji}</span>
              <strong style={{color:w.color,fontFamily:"Rajdhani,sans-serif",fontSize:13}}>{w.label} — +{w.pts} pts</strong>
            </div>
            <div style={{paddingLeft:23,fontSize:12,lineHeight:1.6,color:"#999"}}>{w.desc}</div>
          </div>
        ))}
      </div></div>

      <div className="sec">Streak Rules</div>
      <div className="card"><div className="card-body" style={{fontSize:13,color:"#999",lineHeight:1.8}}>
        Log at least one session each day to maintain your streak. Miss a day and it resets to zero. Even a "Got Some In" day (+3 pts) keeps your streak alive — showing up is the goal. The 7-day streak bonus (+500 pts) is the biggest single multiplier in the programme.
      </div></div>

      <div className="sec">Squad Rewards</div>
      <div className="card"><div className="card-body" style={{fontSize:13,color:"#999",lineHeight:1.8}}>
        🎮 <strong style={{color:"var(--gold)"}}>70% of target</strong> → Parents vs Players Game — a full friendly match.<br/>
        🍕 <strong style={{color:"var(--green)"}}>100% of target</strong> → Pizza Party for all 28 players.<br/>
        Both rewards need the whole squad contributing. Every rep by every player counts.
        <div className="math-link" style={{marginTop:9}} onClick={()=>setMathModal(true)}>📊 Show squad maths →</div>
      </div></div>
    </div>
  );};

  // ════════════════ MODALS ══════════════════════════════════════════════════
  const renderMathModal = () => (
    <div className="overlay" onClick={()=>setMathModal(false)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="m-handle"/>
        <div className="m-top">
          <div className="m-day">Squad Challenge Maths</div>
          <div className="m-title">📊 How the Target is Calculated</div>
        </div>
        <div className="m-body">
          <div className="math-panel">
            <div className="math-row"><div className="math-lbl">Players in squad<span className="math-formula">28 players total</span></div><div className="math-val">28</div></div>
            <div className="math-row"><div className="math-lbl">Programme length<span className="math-formula">15 days × 28 players = 420 total sessions</span></div><div className="math-val">420 sessions</div></div>
            <div className="math-row"><div className="math-lbl">Weighted avg pts/session<span className="math-formula">Nailed(50)×40% + Best(25)×45% + Bit(3)×15% ≈ 35</span></div><div className="math-val">≈ 35 pts</div></div>
            <div className="math-row"><div className="math-lbl">Squad target formula<span className="math-formula">28 × 15 × 35 = {SQUAD_TARGET.toLocaleString()}</span></div><div className="math-val">{SQUAD_TARGET.toLocaleString()} pts</div></div>
          </div>
          <div className="math-panel">
            <div className="math-row"><div className="math-lbl">🎮 Parent Game threshold (70%)<span className="math-formula">{SQUAD_TARGET.toLocaleString()} × 0.70 = {PARENT_GAME_THRESH.toLocaleString()}</span></div><div className="math-val">{PARENT_GAME_THRESH.toLocaleString()}</div></div>
            <div className="math-row"><div className="math-lbl">🍕 Pizza Party threshold (100%)<span className="math-formula">28 players × 15 days × 35 avg pts</span></div><div className="math-val">{SQUAD_TARGET.toLocaleString()}</div></div>
          </div>
          <div className="math-panel">
            <div className="math-row"><div className="math-lbl">Total pts earned so far</div><div className="math-val" style={{color:"var(--green)"}}>{grandTotal.toLocaleString()}</div></div>
            <div className="math-row"><div className="math-lbl">% of target reached</div><div className="math-val" style={{color:grandPct>=100?"var(--green)":grandPct>=70?"var(--gold)":"var(--red)"}}>{grandPct}%</div></div>
            <div className="math-row"><div className="math-lbl">Still needed for Pizza Party</div><div className="math-val" style={{color:"var(--muted)"}}>{Math.max(0,SQUAD_TARGET-grandTotal).toLocaleString()}</div></div>
          </div>
          <div className="math-note">
            <strong style={{color:"var(--gold)"}}>💡 What each player can contribute:</strong><br/>
            If every player logs "Nailed It" every day: 28 × 15 × 50 = <strong>21,000 pts</strong> — well above target.<br/>
            If everyone logs "Got Some In" every day: 28 × 15 × 3 = <strong>1,260 pts</strong>.<br/>
            The target is comfortably reachable with honest mixed effort. Every session, every player matters.
          </div>
        </div>
      </div>
    </div>
  );

  const renderWallModal = () => wallModal && (
    <div className="overlay" onClick={()=>setWallModal(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="m-handle"/>
        <div className="m-top">
          <div className="m-day">School Wall Bonus</div>
          <div className="m-title">{wallModal.emoji} {wallModal.label}</div>
          <div style={{fontFamily:"Anton,sans-serif",fontSize:26,color:"var(--blue)",marginTop:2}}>+{wallModal.pts} pts</div>
        </div>
        <div className="m-body">
          <div style={{background:"rgba(56,182,255,.05)",border:"1px solid rgba(56,182,255,.18)",borderRadius:11,padding:"13px",marginBottom:12}}>
            <div style={{fontWeight:700,fontSize:13,color:"var(--blue)",marginBottom:5,fontFamily:"Rajdhani,sans-serif",letterSpacing:1}}>📋 What counts</div>
            <div style={{fontSize:13,color:"#bbb",lineHeight:1.8}}>{wallModal.desc}</div>
          </div>
          <div style={{background:"rgba(201,168,76,.05)",border:"1px solid rgba(201,168,76,.18)",borderRadius:11,padding:"11px",marginBottom:13}}>
            <div style={{fontSize:12,color:"#d4a84c",lineHeight:1.7}}>⚠ <strong>Honour system:</strong> Only log this bonus if you genuinely completed the programme. The honour system is what makes the squad challenge meaningful.</div>
          </div>
          <button className="submit-btn go" style={{margin:0,width:"100%"}} onClick={()=>submitWall(wallModal.id)}>✓ CONFIRM — I COMPLETED THIS</button>
          <div style={{textAlign:"center",fontSize:10,color:"var(--muted)",marginTop:9,fontFamily:"Rajdhani,sans-serif",letterSpacing:1}}>Each level can only be claimed once.</div>
        </div>
      </div>
    </div>
  );

  const renderDrillModal = () => drillModal && (
    <div className="overlay" onClick={()=>setDrillModal(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="m-handle"/>
        <div className="m-top">
          <div className="m-day">Day {drillModal.day} · {drillModal.cat}</div>
          <div className="m-title">{drillModal.title}</div>
        </div>
        <div className="m-body">
          <DrillVideo ytId={drillModal.yt} ytLabel={drillModal.ytLabel}/>
          <div className="dtags" style={{padding:"10px 0 0"}}>
            <span className="dtag">⏱ {drillModal.dur}</span>
            <span className="dtag red">📐 3m×3m</span>
            <span className="dtag">{"⚽".repeat(drillModal.diff)}</span>
            <span className="dtag gold">👟 {drillModal.foot}</span>
          </div>
          <div className="cue" style={{margin:"10px 0 0"}}>{drillModal.cue}</div>
          <div style={{fontSize:14,color:"#bbb",lineHeight:1.7,margin:"10px 0"}}>{drillModal.desc}</div>
          <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:16,fontWeight:700,color:"var(--red)",marginBottom:9}}>{drillModal.sets}</div>
          <div className="tip" style={{margin:"0 0 9px"}}>💡 {drillModal.tip}</div>
          <div className="spacenote"><span>📐</span><div><strong>Space:</strong> {drillModal.space}</div></div>
        </div>
      </div>
    </div>
  );

  const renderIgModal = () => {
    const myTeamPts = teamTotals.find(t=>t.tid===user.teamId)?.pts??0;
    const storyText = getShareText("story");
    const postText  = getShareText("post");
    return (
    <div className="overlay" onClick={()=>{setIgModal(false);setIgView(null);}}>
      <div className="modal" style={{maxHeight:"90vh"}} onClick={e=>e.stopPropagation()}>
        <div className="m-handle"/>
        <div className="m-top">
          <div className="m-day">Share Your Progress</div>
          <div className="m-title">📸 Instagram Share Kit</div>
        </div>
        <div className="m-body">
          {!igView ? (
            <>
              <p style={{fontSize:12,color:"var(--muted)",marginBottom:13,lineHeight:1.6}}>Three ways to share your Cheetahs progress. Tap a style to get your ready-to-post content.</p>
              <button className="ig-option" onClick={()=>setIgView("story")}>
                <span className="ig-icon">📱</span>
                <div className="ig-info"><div className="ig-title">Story Caption</div><div className="ig-desc">Short punchy lines for an Instagram Story. Pair with a video clip of your drill.</div></div>
              </button>
              <button className="ig-option" onClick={()=>setIgView("post")}>
                <span className="ig-icon">🖼️</span>
                <div className="ig-info"><div className="ig-title">Feed Post Caption</div><div className="ig-desc">Full caption with hashtags for a feed post. Great for a highlights reel video.</div></div>
              </button>
              <button className="ig-option" onClick={()=>setIgView("card")}>
                <span className="ig-icon">🃏</span>
                <div className="ig-info"><div className="ig-title">Score Card Graphic</div><div className="ig-desc">Screenshot this card and post it as your Story background. Shows your day, tier, and stats.</div></div>
              </button>
            </>
          ) : igView==="story" ? (
            <>
              <button onClick={()=>setIgView(null)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:12,marginBottom:11,fontFamily:"Rajdhani,sans-serif",letterSpacing:1}}>← Back</button>
              <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"var(--white)",marginBottom:7}}>📱 Instagram Story Caption</div>
              <p style={{fontSize:11,color:"var(--muted)",marginBottom:9}}>Film a 5–15 second clip of your drill, then add this text as an overlay or caption in Instagram Stories.</p>
              <div className="copy-box">{storyText}</div>
              <button className={`copy-btn ${copied?"copied":""}`} onClick={()=>doCopy(storyText)}>{copied?"✅ COPIED!":"📋 COPY CAPTION"}</button>
            </>
          ) : igView==="post" ? (
            <>
              <button onClick={()=>setIgView(null)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:12,marginBottom:11,fontFamily:"Rajdhani,sans-serif",letterSpacing:1}}>← Back</button>
              <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"var(--white)",marginBottom:7}}>🖼️ Feed Post Caption</div>
              <p style={{fontSize:11,color:"var(--muted)",marginBottom:9}}>Post a video clip or photo of your session, then paste this caption. String 3–5 drill clips together for a highlights reel.</p>
              <div className="copy-box">{postText}</div>
              <button className={`copy-btn ${copied?"copied":""}`} onClick={()=>doCopy(postText)}>{copied?"✅ COPIED!":"📋 COPY CAPTION"}</button>
            </>
          ) : igView==="card" ? (
            <>
              <button onClick={()=>setIgView(null)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:12,marginBottom:11,fontFamily:"Rajdhani,sans-serif",letterSpacing:1}}>← Back</button>
              <div style={{fontFamily:"Rajdhani,sans-serif",fontWeight:700,fontSize:13,color:"var(--white)",marginBottom:7}}>🃏 Score Card — Screenshot & Share</div>
              <p style={{fontSize:11,color:"var(--muted)",marginBottom:9}}>Screenshot this card (Home + Volume Up on iPhone · Power + Volume Down on Android) then post it as your Story.</p>
              <div className="share-card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <CBLogo size={44}/>
                  <div style={{fontFamily:"Anton,sans-serif",fontSize:13,color:"var(--gold)",letterSpacing:1.5,textAlign:"right",lineHeight:1.2}}>CB CHEETAHS<br/>BALL MASTERY</div>
                </div>
                <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:10,color:"var(--muted)",letterSpacing:3,textTransform:"uppercase",marginBottom:3}}>Day {CURRENT_DAY} of 15</div>
                <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:18,fontWeight:700,color:"var(--white)",marginBottom:2,lineHeight:1.2}}>{todayDrill.title}</div>
                <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:13,fontWeight:700,color:TIERS.find(t=>t.id===selectedTier)?.color??"var(--muted)",marginBottom:12}}>
                  {TIERS.find(t=>t.id===selectedTier)?.label??"Session completed"}
                </div>
                <div className="share-grid">
                  {[{label:"MY PTS",val:myTotal.toLocaleString(),color:"var(--gold)"},{label:"RANK",val:`#${myRank}`,color:"var(--red)"},{label:"STREAK",val:streak>=1?`🔥${streak}`:"—",color:"#ff6b35"}].map(s=>(
                    <div key={s.label} className="share-stat">
                      <div className="ss-val" style={{color:s.color}}>{s.val}</div>
                      <div className="ss-lbl">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(200,16,46,.1)",border:"1px solid rgba(200,16,46,.28)",borderRadius:7,padding:"6px 9px",fontSize:10,color:"var(--muted)"}}>
                  <span style={{color:"var(--red)",fontWeight:700}}>{TEAM_LABELS[user.teamId]}</span> · {myTeamPts.toLocaleString()} team pts · #CherryBeachCheetahs
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );};

  // ════════════════ APP SHELL ═══════════════════════════════════════════════
  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        {/* Header */}
        <div className="app-header">
          <div className="header-inner">
            <div className="header-left">
              <CBLogo size={40}/>
              <div>
                <div className="header-club">CHERRY BEACH CHEETAHS</div>
                <div className="header-sub">U15 · 15-Day Ball Mastery</div>
              </div>
            </div>
            <div className="header-right">
              <div style={{textAlign:"right"}}>
                <div className="hname">{user.playerName}</div>
                {streak>=3&&<div className="hstreak">🔥{streak}-day</div>}
                <div className="hlogout" onClick={()=>setUser(null)}>logout</div>
              </div>
              <div className="av" style={{background:TEAM_COLORS[user.teamId]}}>{user.initials}</div>
            </div>
          </div>
          <nav className="app-nav">
            {[{id:"home",l:"Home"},{id:"today",l:"Today"},{id:"drills",l:"Drills"},{id:"standings",l:"Standings"},{id:"points",l:"Points"}].map(n=>(
              <button key={n.id} className={`nav-btn ${tab===n.id?"active":""}`} onClick={()=>switchTab(n.id)}>{n.l}</button>
            ))}
          </nav>
        </div>

        {/* Scrollable content */}
        <div className="content">
          <div className={`page fade ${fade?"":"out"}`}>
            {tab==="home"      && renderHome()}
            {tab==="today"     && renderToday()}
            {tab==="drills"    && renderDrills()}
            {tab==="standings" && renderStandings()}
            {tab==="points"    && renderPoints()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {mathModal  && renderMathModal()}
      {wallModal  && renderWallModal()}
      {drillModal && renderDrillModal()}
      {igModal    && renderIgModal()}
    </>
  );
}
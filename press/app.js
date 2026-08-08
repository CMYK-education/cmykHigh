/* Press — CMYK High SIS/LMS prototype */

const state = {
  role: "student",
  view: "overview",
  selectedSkill: "self-management",
  academicStep: 0,
  academicAnswered: false,
  toastTimer: null,
};

const STUDENT = {
  name: "Maya Chen",
  grade: 10,
  guide: "Coach Rivera",
  pathway: "Technology & making",
  inkToday: 78,
  masteryPct: 64,
  skillFocus: "Self Management",
};

const BLOCKS = [
  {
    id: "A",
    type: "academics",
    title: "Deep-focus academics",
    detail: "Algebra II · Quadratic forms — AI tutor + guide nearby",
    time: "8:30 – 11:00",
    status: "live",
    progress: 62,
  },
  {
    id: "B",
    type: "skills",
    title: "Skills Studio",
    detail: "Explicit teach: Self Management systems · then practiced evidence",
    time: "11:30 – 2:00",
    status: "next",
    progress: 0,
  },
  {
    id: "C",
    type: "pathways",
    title: "Pathways & outdoors",
    detail: "Robotics lab + internship prep checklist",
    time: "2:30 – 5:00",
    status: "planned",
    progress: 0,
  },
];

const SKILLS = [
  {
    id: "self-management",
    pillar: "C",
    pillarName: "Personal",
    name: "Self Management",
    blurb: "Systems for time, materials, and follow-through so desire turns into finished work.",
    level: "Developed",
    levelsOn: ["Emerging", "Developed"],
    taught: "Skills Block B — Systems Lab",
    practiced: [
      { where: "Academics A", how: "Start ritual, unit checklist, closing reflection" },
      { where: "Skills B", how: "Build weekly planner + materials kit audit" },
      { where: "Pathways C", how: "Lab clean-down + next-session prep card" },
      { where: "Home", how: "Nightly 5-minute reset with guardian optional" },
    ],
    lookFors: [
      "Can name next action without prompting",
      "Materials ready before block starts",
      "Closes work with a written handoff",
    ],
  },
  {
    id: "problem-solving",
    pillar: "M",
    pillarName: "Professional",
    name: "Problem Solving",
    blurb: "Break hard problems into steps; choose tools; verify the result.",
    level: "Emerging",
    levelsOn: ["Emerging"],
    taught: "Skills Block — Problem Framing",
    practiced: [
      { where: "Academics A", how: "Error analysis after missed mastery check" },
      { where: "Pathways C", how: "Debug robotics loop with partner" },
      { where: "Seminar", how: "Case clinic: tradeoffs under constraints" },
    ],
    lookFors: [
      "States the problem in one sentence",
      "Tries two strategies before asking for rescue",
      "Checks answer against constraints",
    ],
  },
  {
    id: "relationships",
    pillar: "Y",
    pillarName: "Interpersonal",
    name: "Healthy Relationships",
    blurb: "Meaningful connections that help both people grow.",
    level: "Developed",
    levelsOn: ["Emerging", "Developed"],
    taught: "Skills Block — Feedback Circles",
    practiced: [
      { where: "Skills B", how: "Structured peer feedback protocol" },
      { where: "Pathways C", how: "Pair programming roles rotate" },
      { where: "Expedition", how: "Trail roles + after-action appreciation" },
    ],
    lookFors: [
      "Gives specific, kind, useful feedback",
      "Asks before advising",
      "Repairs quickly after friction",
    ],
  },
  {
    id: "resilience",
    pillar: "K",
    pillarName: "Global",
    name: "Resilience",
    blurb: "Take meaningful risks, adapt, and persist through hard things.",
    level: "Emerging",
    levelsOn: ["Emerging"],
    taught: "Skills Block — Struggle Scripts",
    practiced: [
      { where: "Academics A", how: "Remediation without collapsing effort" },
      { where: "Outdoors", how: "Wasatch micro-expedition stretch goals" },
      { where: "Internship", how: "Cold outreach + follow-up cadence" },
    ],
    lookFors: [
      "Names the hard part accurately",
      "Returns to work after a miss",
      "Uses a struggle script before quitting",
    ],
  },
];

const COHORT = [
  { name: "Maya Chen", unit: "Quadratic forms", focus: 86, signal: "on-task", note: "Ready for mastery check" },
  { name: "Jonah Park", unit: "Systems of eq.", focus: 41, signal: "stuck", note: "Guide: re-chunk examples" },
  { name: "Ava Brooks", unit: "Credit recovery · Lit", focus: 72, signal: "on-task", note: "Strong retrieval streak" },
  { name: "Leo Nguyen", unit: "US History inquiry", focus: 28, signal: "distracted", note: "Waste spike — reset ritual" },
  { name: "Sam Ortiz", unit: "Biology · Cells", focus: 91, signal: "mastery", note: "Stretch: hole-fill quiz" },
];

const ROSTER = [
  { name: "Maya Chen", grade: 10, blocks: "A acad · B skills · C path", attendance: "Present", credits: "6.5", skill: "Self Mgmt · Developed" },
  { name: "Jonah Park", grade: 9, blocks: "A skills · B acad · C path", attendance: "Present", credits: "4.0", skill: "Resilience · Emerging" },
  { name: "Ava Brooks", grade: 11, blocks: "A acad · B path · C skills", attendance: "Late B", credits: "9.0", skill: "Communication · Solidified" },
  { name: "Leo Nguyen", grade: 10, blocks: "A path · B acad · C skills", attendance: "Present", credits: "6.0", skill: "Problem Solving · Emerging" },
  { name: "Sam Ortiz", grade: 12, blocks: "A acad · B skills · C intern", attendance: "Off-site C", credits: "11.5", skill: "Contributions · Developed" },
];

const ACADEMIC_FLOW = [
  {
    title: "Quadratic forms · Unit 4.2",
    prompt: "Which expression is equivalent to (x + 3)² − 4?",
    choices: [
      { id: "a", text: "x² + 6x + 5", correct: true },
      { id: "b", text: "x² + 9 − 4", correct: false },
      { id: "c", text: "x² + 6x + 13", correct: false },
      { id: "d", text: "(x + 3 − 2)(x + 3 + 2)", correct: false },
    ],
    teach: "Expand carefully, then combine constants. Near-miss options catch common shortcuts.",
  },
  {
    title: "Retrieval check · Mastery gate",
    prompt: "A ball’s height is h(t) = −t² + 6t + 7. When is it at 12 feet?",
    choices: [
      { id: "a", text: "No real time — height never reaches 12", correct: false },
      { id: "b", text: "t = 1 and t = 5", correct: true },
      { id: "c", text: "t = 3 only", correct: false },
      { id: "d", text: "t = 0 and t = 6", correct: false },
    ],
    teach: "Set −t² + 6t + 7 = 12 → −t² + 6t − 5 = 0. Factor and verify both roots in context.",
  },
];

const NAV_BY_ROLE = {
  student: [
    { id: "overview", label: "Overview" },
    { id: "today", label: "Today" },
    { id: "academics", label: "Academics" },
    { id: "skills", label: "Skills Studio" },
    { id: "evidence", label: "Evidence" },
  ],
  guide: [
    { id: "overview", label: "Overview" },
    { id: "guide", label: "Guide Console" },
    { id: "today", label: "Day Board" },
    { id: "skills", label: "Skills Studio" },
    { id: "evidence", label: "Evidence" },
  ],
  admin: [
    { id: "overview", label: "Overview" },
    { id: "sis", label: "SIS Roster" },
    { id: "today", label: "Day Board" },
    { id: "guide", label: "Guide Console" },
    { id: "skills", label: "Skills Studio" },
  ],
};

function $(sel) { return document.querySelector(sel); }
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function toast(msg) {
  const node = $("#toast");
  node.textContent = msg;
  node.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => node.classList.remove("show"), 2800);
}

function setRole(role) {
  state.role = role;
  if (!NAV_BY_ROLE[role].some((n) => n.id === state.view)) {
    state.view = NAV_BY_ROLE[role][0].id;
  }
  render();
}

function setView(view) {
  state.view = view;
  render();
}

function renderNav() {
  const list = $("#navList");
  list.innerHTML = "";
  NAV_BY_ROLE[state.role].forEach((item) => {
    const btn = el(`<button type="button"><span class="dot"></span>${item.label}</button>`);
    if (item.id === state.view) btn.classList.add("active");
    btn.addEventListener("click", () => setView(item.id));
    list.appendChild(btn);
  });
  document.querySelectorAll(".role-switch button").forEach((b) => {
    b.classList.toggle("active", b.dataset.role === state.role);
  });
}

function renderOverview() {
  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Press · CMYK High OS</div>
        <h1>The school day, as a system of record.</h1>
        <p>SIS + LMS built for A/B/C blocks, AI academics with a human guide, and skills that are taught — not hoped for.</p>
      </div>
      <div class="top-actions">
        <button class="btn cyan" type="button" data-go="today">Open Today</button>
        <button class="btn ghost" type="button" data-go="skills">Skills map</button>
      </div>
    </div>
    <div class="hero-intro">
      <div class="hero-panel">
        <div class="bars" aria-hidden="true"><i class="c"></i><i class="m"></i><i class="y"></i><i class="k"></i></div>
        <div class="eyebrow" style="color:var(--yellow)">Why not TimeBack?</div>
        <h2>Academics and skills, equal weight.</h2>
        <p>TimeBack coordinates mastery academics and “time back.” Press coordinates the whole CMYK High day — including explicit skill curriculum, practice sites, and evidence.</p>
        <div class="hero-cta">
          <button class="btn yellow" type="button" data-go="academics">Try academic block</button>
          <button class="btn magenta" type="button" data-go="guide">Guide console</button>
        </div>
      </div>
      <div class="panel">
        <h3>Research snapshot</h3>
        <p class="sub">From Alpha’s TimeBack docs & public positioning</p>
        <div class="timeline">
          <div class="timeline-item"><div class="tick cyan"></div><div><b>Mastery OS for academics</b><span>AI tutoring, ≥90% gates, XP ≈ verified focused minutes</span></div></div>
          <div class="timeline-item"><div class="tick magenta"></div><div><b>Desktop launcher + waste signals</b><span>Time-on-task and distraction detection across apps</span></div></div>
          <div class="timeline-item"><div class="tick key"></div><div><b>1EdTech backbone</b><span>OneRoster, Caliper, QTI, CASE, CLR for a multi-app ecosystem</span></div></div>
          <div class="timeline-item"><div class="tick"></div><div><b>Afternoon as reclaimed time</b><span>Life skills exist — but aren’t Press-style structured curriculum</span></div></div>
        </div>
      </div>
    </div>
    <div class="compare">
      <article>
        <div class="label">TimeBack pattern</div>
        <h3>Finish academics → reclaim the day</h3>
        <ul>
          <li>Primary object: academic mastery + XP</li>
          <li>~2 hour learning compression</li>
          <li>Life skills / sports as reward space</li>
          <li>Platform for many learning apps</li>
        </ul>
      </article>
      <article class="press">
        <div class="label">Press for CMYK High</div>
        <h3>Own the block → prove the skill</h3>
        <ul>
          <li>Primary objects: Block + Skill + Evidence</li>
          <li>A/B/C × 2.5 hours, student-ordered</li>
          <li>Skills taught with maps of practice sites</li>
          <li>School-native SIS/LMS, guide-first</li>
        </ul>
      </article>
    </div>
  `;
}

function renderToday() {
  const blocks = BLOCKS.map((b) => `
    <div class="block-card ${b.status === "live" ? "live" : ""} ${b.status === "done" ? "done" : ""}" data-block="${b.id}">
      <div class="block-letter ${b.type}">${b.id}</div>
      <div>
        <h4>${b.title}</h4>
        <p>${b.detail}</p>
        <div class="progress" aria-hidden="true"><i style="--w:${b.progress}%"></i></div>
      </div>
      <div>
        <span class="pill ${b.status === "live" ? "live" : ""}">${b.status === "live" ? "Live now" : b.status === "next" ? "Up next" : "Planned"}</span>
        <div class="mono muted mt-12">${b.time}</div>
      </div>
    </div>
  `).join("");

  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Day Board · ${STUDENT.name}</div>
        <h1>A / B / C — 2.5 hours each.</h1>
        <p>Flexible order. Inflexible mastery. Today Maya leads with academics, then Skills Studio, then pathways.</p>
      </div>
      <div class="top-actions">
        <button class="btn ghost" type="button" id="shuffleBlocks">Simulate rearrange</button>
        <button class="btn cyan" type="button" data-go="academics">Enter Block A</button>
      </div>
    </div>
    <div class="stat-row">
      <div class="stat" style="--accent:var(--cyan)"><div class="label">Ink today</div><div class="value">${STUDENT.inkToday}</div><div class="meta">verified academic minutes</div></div>
      <div class="stat" style="--accent:var(--magenta)"><div class="label">Skill focus</div><div class="value" style="font-size:1.25rem;margin-top:10px">${STUDENT.skillFocus}</div><div class="meta">taught in Block B</div></div>
      <div class="stat" style="--accent:var(--yellow)"><div class="label">Mastery</div><div class="value">${STUDENT.masteryPct}%</div><div class="meta">Algebra II sequence</div></div>
      <div class="stat" style="--accent:var(--key)"><div class="label">Guide</div><div class="value" style="font-size:1.25rem;margin-top:10px">${STUDENT.guide}</div><div class="meta">co-present in A & B</div></div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <h3>Today’s blocks</h3>
        <p class="sub">Tap a block to jump into its workspace</p>
        <div class="block-stack">${blocks}</div>
      </div>
      <div class="panel">
        <h3>Block contract</h3>
        <p class="sub">What “done” means — not seat time</p>
        <div class="timeline">
          <div class="timeline-item"><div class="tick key"></div><div><b>Academics</b><span>Unit mastery check ≥90% or active remediation plan</span></div></div>
          <div class="timeline-item"><div class="tick magenta"></div><div><b>Skills</b><span>Lesson look-fors practiced + one evidence artifact logged</span></div></div>
          <div class="timeline-item"><div class="tick cyan"></div><div><b>Pathways</b><span>Milestone progress + clean handoff for next session</span></div></div>
        </div>
        <div class="guide-note mt-18">
          <b>Unlike TimeBack’s afternoon reclaim</b>
          <span>Finishing academics early does not cancel Skills Studio. It unlocks stretch work inside the academic block — then Maya still shows up for explicit skill teaching.</span>
        </div>
      </div>
    </div>
  `;
}

function renderAcademics() {
  const step = ACADEMIC_FLOW[state.academicStep];
  const choices = step.choices.map((c) => {
    let cls = "";
    if (state.academicAnswered) {
      if (c.correct) cls = "correct";
      else if (c.id === state.picked) cls = "wrong";
    }
    return `<button type="button" class="${cls}" data-choice="${c.id}" ${state.academicAnswered ? "disabled" : ""}>${c.text}</button>`;
  }).join("");

  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Block A · Academics</div>
        <h1>AI delivers. Guide steadies.</h1>
        <p>Mastery-gated retrieval with a live human guide watching the cohort signals — Alpha energy, CMYK structure.</p>
      </div>
      <div class="top-actions">
        <button class="btn ghost" type="button" data-go="guide">Open guide view</button>
        <button class="btn yellow" type="button" id="nextAcademic" ${state.academicAnswered ? "" : "disabled"}>Next unit check</button>
      </div>
    </div>
    <div class="session">
      <div class="ai-pane">
        <div class="kicker">AI Tutor · Press Academics</div>
        <h3>${step.title}</h3>
        <p class="lead">${step.teach}</p>
        <div class="prompt-box">
          <div class="q">${step.prompt}</div>
          <div class="choices">${choices}</div>
        </div>
        <div class="session-meta">
          <span>Mastery gate 90%</span>
          <span>Ink clock running</span>
          <span>Guide: Rivera · aisle 2</span>
        </div>
      </div>
      <div class="panel guide-pane">
        <h3>Guide overlay</h3>
        <p class="sub">What Coach Rivera sees while Maya works</p>
        <div class="guide-note">
          <b>Intervention suggestion</b>
          <span>If Maya misses the near-miss distractor, run a 90-second contrastive example: expand vs. “distribute the square.”</span>
        </div>
        <div class="action-list">
          <button type="button" data-toast="Start ritual logged for Maya.">Log start ritual</button>
          <button type="button" data-toast="Stuck signal cleared — Maya resumed retrieval.">Clear stuck</button>
          <button type="button" data-toast="Evidence draft: Self Management · materials ready.">Stamp skill evidence</button>
          <button type="button" data-go="skills">Jump to skill map</button>
        </div>
        <div class="mt-18">
          <div class="label muted" style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Linked skill practice sites</div>
          <p class="mt-12" style="font-size:14px">This academic block is a <b>practice site</b> for Self Management — not only content delivery. Press makes that link visible to student and guide.</p>
        </div>
      </div>
    </div>
  `;
}

function renderSkills() {
  const selected = SKILLS.find((s) => s.id === state.selectedSkill) || SKILLS[0];
  const cards = SKILLS.map((s) => `
    <div class="skill-card ${s.pillar.toLowerCase()} ${s.id === selected.id ? "selected" : ""}" data-skill="${s.id}">
      <div class="swatch">${s.pillar}</div>
      <h4>${s.name}</h4>
      <p>${s.blurb}</p>
      <div class="scale">
        ${["Emerging", "Developed", "Solidified"].map((lv) => `<span class="${s.levelsOn.includes(lv) ? "on" : ""}">${lv}</span>`).join("")}
      </div>
    </div>
  `).join("");

  const sites = selected.practiced.map((p) => `
    <article>
      <div class="tag">${p.where}</div>
      <div>
        <h4>Practiced here</h4>
        <p>${p.how}</p>
      </div>
    </article>
  `).join("");

  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Skills Studio · CMYK curriculum</div>
        <h1>Teach the skill. Map the practice.</h1>
        <p>Every skill shows where it is taught, where it is practiced, and what evidence moves the growth scale.</p>
      </div>
      <div class="top-actions">
        <button class="btn magenta" type="button" data-toast="Skill lesson queued for Block B.">Queue for Block B</button>
      </div>
    </div>
    <div class="grid-2">
      <div>
        <div class="skill-map">${cards}</div>
      </div>
      <div class="panel">
        <h3>${selected.pillarName} · ${selected.name}</h3>
        <p class="sub">Taught: ${selected.taught}</p>
        <div class="guide-note">
          <b>Look-fors</b>
          <span>${selected.lookFors.join(" · ")}</span>
        </div>
        <h4 class="mt-18" style="font-size:1rem">Where this skill is found & practiced</h4>
        <div class="practice-sites mt-12">${sites}</div>
      </div>
    </div>
  `;
}

function renderEvidence() {
  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Evidence Ledger</div>
        <h1>Growth you can point to.</h1>
        <p>Academics, skills, pathways, and expeditions write to one ledger — the CMYK credential’s backbone.</p>
      </div>
    </div>
    <div class="stat-row">
      <div class="stat" style="--accent:var(--cyan)"><div class="label">Evidence items</div><div class="value">24</div><div class="meta">this quarter</div></div>
      <div class="stat" style="--accent:var(--magenta)"><div class="label">Skills touched</div><div class="value">7</div><div class="meta">across 4 pillars</div></div>
      <div class="stat" style="--accent:var(--yellow)"><div class="label">Solidified</div><div class="value">1</div><div class="meta">Communication</div></div>
      <div class="stat" style="--accent:var(--key)"><div class="label">Sources</div><div class="value">4</div><div class="meta">AI · guide · peer · pathway</div></div>
    </div>
    <div class="panel">
      <h3>Recent ledger</h3>
      <p class="sub">Not XP alone — artifacts and observations with sources</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>When</th><th>Skill</th><th>Source</th><th>Evidence</th><th>Level signal</th></tr></thead>
          <tbody>
            <tr><td class="mono">Today · A</td><td>Self Management</td><td>Guide</td><td>Materials ready + start ritual without prompt</td><td><span class="status ok">Developed</span></td></tr>
            <tr><td class="mono">Today · A</td><td>Problem Solving</td><td>AI check</td><td>Missed near-miss; recovered after contrastive example</td><td><span class="status idle">Emerging</span></td></tr>
            <tr><td class="mono">Wed · B</td><td>Healthy Relationships</td><td>Peer</td><td>Feedback circle: specific + kind revision notes</td><td><span class="status ok">Developed</span></td></tr>
            <tr><td class="mono">Tue · C</td><td>Resilience</td><td>Pathway</td><td>Returned to robotics debug after failed run</td><td><span class="status idle">Emerging</span></td></tr>
            <tr><td class="mono">Mon · Exp</td><td>Communication</td><td>Guide</td><td>Trail brief delivered clear roles to cohort</td><td><span class="status ok">Solidified</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderGuide() {
  const rows = COHORT.map((s) => `
    <div class="cohort-row">
      <div class="person">
        <div class="avatar">${s.name.split(" ").map((p) => p[0]).join("")}</div>
        <div><b>${s.name}</b><span>${s.unit}</span></div>
      </div>
      <div>
        <div class="muted" style="font-size:12px;font-weight:700">Focus</div>
        <div class="progress" style="margin-top:6px"><i style="--w:${s.focus}%"></i></div>
      </div>
      <div><span class="status ${s.signal === "stuck" || s.signal === "distracted" ? "hot" : s.signal === "mastery" ? "ok" : "idle"}">${s.signal}</span></div>
      <div style="font-size:13.5px;color:var(--muted)">${s.note}</div>
    </div>
  `).join("");

  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">Guide Console · Coach Rivera</div>
        <h1>See the room. Act with precision.</h1>
        <p>During Block A, guides get cohort heat — not another gradebook. Interventions become skill evidence automatically.</p>
      </div>
      <div class="top-actions">
        <button class="btn magenta" type="button" data-toast="Broadcast: 2-minute reset ritual.">Broadcast reset</button>
        <button class="btn ghost" type="button" data-go="academics">Student session</button>
      </div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <h3>Live academic cohort</h3>
        <p class="sub">Block A · 8:30–11:00 · AI + guide</p>
        <div class="cohort">${rows}</div>
      </div>
      <div class="panel">
        <h3>Run sheet · next Skills block</h3>
        <p class="sub">Block B will teach Self Management systems</p>
        <div class="timeline">
          <div class="timeline-item"><div class="tick magenta"></div><div><b>0:00–0:15 Teach</b><span>Definition, non-examples, look-fors</span></div></div>
          <div class="timeline-item"><div class="tick magenta"></div><div><b>0:15–1:30 Practice</b><span>Build planner + materials kit audit in pairs</span></div></div>
          <div class="timeline-item"><div class="tick magenta"></div><div><b>1:30–2:15 Apply</b><span>Apply system to tomorrow’s Day Plan in Press</span></div></div>
          <div class="timeline-item"><div class="tick key"></div><div><b>2:15–2:30 Evidence</b><span>Each student logs one artifact to the ledger</span></div></div>
        </div>
        <div class="guide-note mt-18">
          <b>Press difference</b>
          <span>TimeBack optimizes for academic minutes and waste. Press also scripts the skill block so “human skills” are as structured as Algebra.</span>
        </div>
      </div>
    </div>
  `;
}

function renderSIS() {
  const rows = ROSTER.map((r) => `
    <tr>
      <td><b>${r.name}</b></td>
      <td>${r.grade}</td>
      <td class="mono">${r.blocks}</td>
      <td>${r.attendance}</td>
      <td>${r.credits}</td>
      <td>${r.skill}</td>
    </tr>
  `).join("");

  return `
    <div class="topbar">
      <div>
        <div class="eyebrow">SIS · School of record</div>
        <h1>Roster, blocks, credits, credentials.</h1>
        <p>Traditional SIS fields plus CMYK-native block plans and skill growth — one system, not five logins.</p>
      </div>
      <div class="top-actions">
        <button class="btn ghost" type="button" data-toast="Export stub: CLR + transcript bundle.">Export CLR</button>
        <button class="btn cyan" type="button" data-toast="Enrollment draft created.">Add student</button>
      </div>
    </div>
    <div class="stat-row">
      <div class="stat" style="--accent:var(--cyan)"><div class="label">Active students</div><div class="value">48</div><div class="meta">founding cohort target</div></div>
      <div class="stat" style="--accent:var(--magenta)"><div class="label">Guides</div><div class="value">6</div><div class="meta">~8 students each</div></div>
      <div class="stat" style="--accent:var(--yellow)"><div class="label">Block fidelity</div><div class="value">94%</div><div class="meta">contracts met this week</div></div>
      <div class="stat" style="--accent:var(--key)"><div class="label">Pathway seats</div><div class="value">19</div><div class="meta">internships live</div></div>
    </div>
    <div class="panel">
      <h3>Roster</h3>
      <p class="sub">Attendance is by block — because the day is by block</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Grade</th><th>Today’s plan</th><th>Attendance</th><th>Credits</th><th>CMYK skill</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

const VIEWS = {
  overview: renderOverview,
  today: renderToday,
  academics: renderAcademics,
  skills: renderSkills,
  evidence: renderEvidence,
  guide: renderGuide,
  sis: renderSIS,
};

function bindViewEvents(root) {
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.go));
  });
  root.querySelectorAll("[data-toast]").forEach((btn) => {
    btn.addEventListener("click", () => toast(btn.dataset.toast));
  });
  root.querySelectorAll("[data-block]").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.block;
      if (id === "A") setView("academics");
      else if (id === "B") setView("skills");
      else toast("Pathways workspace prototype — robotics milestone board coming next.");
    });
  });
  root.querySelectorAll("[data-skill]").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedSkill = card.dataset.skill;
      render();
    });
  });
  root.querySelectorAll("[data-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const choice = btn.dataset.choice;
      const step = ACADEMIC_FLOW[state.academicStep];
      const correct = step.choices.find((c) => c.id === choice)?.correct;
      state.academicAnswered = true;
      state.picked = choice;
      render();
      toast(correct
        ? "Mastery signal recorded · Ink awarded for verified retrieval."
        : "Miss logged · Guide overlay suggests a contrastive example.");
    });
  });
  const next = root.querySelector("#nextAcademic");
  if (next) {
    next.addEventListener("click", () => {
      state.academicStep = (state.academicStep + 1) % ACADEMIC_FLOW.length;
      state.academicAnswered = false;
      state.picked = null;
      render();
    });
  }
  const shuffle = root.querySelector("#shuffleBlocks");
  if (shuffle) {
    shuffle.addEventListener("click", () => {
      const order = BLOCKS.map((b) => b.id);
      BLOCKS.push(BLOCKS.shift());
      BLOCKS.forEach((b, i) => {
        b.status = i === 0 ? "live" : i === 1 ? "next" : "planned";
      });
      toast(`Day plan rearranged → ${BLOCKS.map((b) => b.id).join(" · ")} (was ${order.join(" · ")})`);
      render();
    });
  }
}

function render() {
  renderNav();
  const root = $("#viewRoot");
  const fn = VIEWS[state.view] || renderOverview;
  root.innerHTML = fn();
  root.className = "view active";
  bindViewEvents(root);
  $("#contextLine").textContent = `${state.role} · ${state.view}`;
}

function init() {
  document.querySelectorAll(".role-switch button").forEach((b) => {
    b.addEventListener("click", () => setRole(b.dataset.role));
  });
  render();
}

document.addEventListener("DOMContentLoaded", init);

# CMYK High — SIS/LMS Research Brief

**Purpose:** Capture what we already have (CMYK.education + CMYK High), what the market expects from high-school SIS/LMS systems, what Alpha Schools' TimeBack does, and how that informs the SIS/LMS we intend to build.

**Audience:** Internal product / engineering planning  
**Date:** 2026-08-08  
**Repos in this environment:** `CMYK-LTI`, `CMYK-Firebase`, `CMYK-VC`, `cmykHigh`

---

## 1. Executive takeaway

CMYK.education is a **skills-evidence + credential platform** (AI scoring of human skills, advisor review, portable credentials). CMYK High is a **school brand and go-to-market site** for a planned independent high school (Lehi, UT; target open Fall 2027). Neither repo is an SIS or a full LMS.

The product described next — an AI-native SIS/LMS that coordinates tutoring, detects productive vs unproductive struggle, surfaces where guides should intervene, and keeps parents/students in the loop — is a **new system**. It should reuse ideas, skills models, and eventually services from CMYK.education, but it should live in its **own repository** (recommendation at the end).

---

## 2. CMYK.education today — what exists

CMYK.education splits across three codebases. Together they form a **skills LMS + analytics engine + credential issuer**, not a traditional school operating system.

### 2.1 Frontend — `CMYK-LTI` (package: `cmyk-skill-tracker`)

| Aspect | Detail |
|--------|--------|
| **Product** | Skills-based learning platform: students upload evidence → AI + advisors score 8 CMYK competencies → progress + shareable credentials |
| **Stack** | React 19, Vite, MUI 7, Tailwind 4, React Router 7, Firebase Auth/Firestore/Storage, Recharts, Stripe (optional), EmailJS |
| **Hosting** | Vercel; marketing at `cmyk.education`, app at `app.cmyk.education` |
| **Auth** | Firebase email/password; roles: student, advisor/teacher, admin; counselor tokenized upload links |

**Surfaces:**

1. **Marketing host** — product story, skills, curriculum/planner, credentials narrative, shop (Student Bundle), contact  
2. **App host** — authenticated LMS:
   - Students: Evidence upload, Progress charts, Credentials export/share  
   - Advisors: review AI-analyzed submissions, finalize/reject, OCR assist  
   - Admins: user management, advisor/school assignment  

**Important note on the name:** despite `CMYK-LTI`, there is **no IMS LTI 1.3 launch implementation** in this repo. It is a standalone Firebase SPA. “LTI” is historical naming.

**Eight CMYK skills** (canonical keys used in analysis):

| Family (marketing) | Skills |
|--------------------|--------|
| **C — Personal** | Passion, Self Management |
| **M — Professional** | Cognitively & Technically Able, Makes Positive Contributions |
| **Y — Interpersonal** | Develops Healthy Relationships, Social Consciousness |
| **K — Global** | Communication, Resilience |

Scoring scale (backend): **0.000–4.000** with bands such as No Evidence → Dormant → Emerging → Developed → Solidified.

**Key paths:** `src/AppRouter.jsx`, `src/App.jsx`, `src/components/FileUpload.jsx`, `TeacherAssignmentReview.jsx`, `src/services/*`, `docs/CMYK_WORK_PICKUP.md`, `docs/COMMERCE_DESIGN.md`.

### 2.2 Backend analytics — `CMYK-Firebase`

Firebase project: **`cmyk-progress-tracker`**.

| Layer | Choice |
|-------|--------|
| Runtime | Firebase Functions v2, Node 20 |
| Data | Firestore + Storage |
| AI | OpenAI (`gpt-4o-mini` primary for analysis) |
| OCR | Mathpix (math), smart PDF/DOCX extract, Google Vision / Document AI as needed |

**Core pipeline:**

```
Upload (Storage)
  → onEvidenceUpload → students/{uid}/evidence/{id} (pending_review)
  → advisor sets status=analyzing
  → triggerAnalysis → OCR → per-skill OpenAI prompts → evidence-based scores
  → status=ai_analyzed (+ authenticity, mastery/need matches, analysis statement)
  → mirrorStudentEvidenceToRoot → evidence/{id}
  → advisor finalize (frontend) → Progress / credentials / share links
```

**Notable capabilities already built (reusable concepts for a future SIS/LMS):**

- Selective skill analysis (cost control)  
- Evidence-weight and challenge-level adjustments  
- Authenticity estimates  
- Advisor correction / learning system hooks  
- Credential share links (`createCredentialShareLink` / `getSharedCredential`)  
- Memory-tiered functions and daily cost circuit breakers  

**Security caveat:** current Firestore rules are fully open for development (`allow read, write: if true`). Production hardening is required before school-grade use.

### 2.3 Credentials — `CMYK-VC`

Python/Flask service for issuing **CMYKSkillCredential** verifiable credentials. Evolution: Blockcerts → Solana → **Cardano** (pycardano / CIP-25-style metadata). CORS allowlists `cmyk.education` / LTI host. Intended base: `vc-api.cmyk.education`.

**Maturity:** APIs exist (generate, verify, list, QR, payment stub); storage is largely in-memory; chain submit often falls back to mock hashes. Useful as a **portable credential arm**, not yet a production transcript system.

### 2.4 What CMYK.education *is not*

| Traditional school system function | Present in CMYK.education? |
|------------------------------------|----------------------------|
| Enrollment / admissions / guardians | No (shop/org design only) |
| Master schedule / bell schedule | No |
| Daily attendance | No |
| Course LMS (modules, discussions, quizzes) | Minimal (evidence + review) |
| Academic gradebook / GPA / transcripts | No (skills credentials only) |
| State reporting / compliance | No |
| Real-time tutoring session orchestration | No |
| Struggle / engagement telemetry for guides | No |
| Parent portal for academics + life | No |

**Implication:** CMYK.education is a strong **human-skills evidence layer** and a partial **credential layer**. The school still needs a true SIS/LMS (or an AI-native successor that covers those jobs).

---

## 3. CMYK High today — `cmykHigh`

| Aspect | Detail |
|--------|--------|
| **What it is** | Static marketing site for **CMYK High** — planned small independent high school |
| **Domain** | `cmykhigh.com` (CNAME) |
| **Tech** | `index.html`, `business.html`, inline CSS/JS, Google Apps Script → Sheets/email |
| **Contact** | `hello@cmykhigh.com` |

### 3.1 School model (from site copy)

- **Audience:** Capable but disengaged teens, grades 9–12  
- **Four pillars:** AI personalized academics · human skills with live coaches · mentorship + pathways · outdoor experiential learning (Wasatch as “second campus”)  
- **Day structure:** Flexible blocks — deep-focus academics · seminars/skills · pathways/rec/outdoors; mastery required  
- **Credentials:** CMYK skills evidence **supplements** transcript/GPA (accreditation/tuition/diploma still being finalized)  
- **Timeline (business page):** Fall 2027 school opens (~100 founding class) → Spring 2028 first internships  
- **B2B:** `business.html` — partners “design your intern” with minimum CMYK skill floors  

### 3.2 Product vision constraints for the future SIS/LMS

From the school’s own positioning, the system must eventually support:

1. **Dual track:** AI mastery academics + coach-led human skills (not grades-only)  
2. **Evidence → rating → credential** on a transparent scale across 8 skills / 4 families  
3. **Portable credentials for internships** — employers set skill floors; students apply with proof  
4. **Flexible scheduling / mastery gates**, credit recovery & acceleration  
5. **Pathways + work-based learning** as first-class objects  
6. **Guide/coach workflows** distinct from traditional “teacher of record lecturing all day”  
7. Brand split: **cmykhigh.com** (school) vs **cmyk.education** (platform/skills stack)

---

## 4. US high-school SIS vs LMS — what the market expects

In US K–12, **SIS** and **LMS** are usually separate products that sync.

### 4.1 SIS (Student Information System) — “the school’s system of record”

**Job:** Hold official identities, enrollments, schedules, attendance, grades, transcripts, and compliance data.

**Popular vendors (high school / district):**

| System | Role / notes |
|--------|----------------|
| **PowerSchool SIS** | Largest footprint; enrollment, scheduling, attendance, transcripts, state reporting; ecosystem (incl. Schoology LMS) |
| **Infinite Campus** | Strong all-in-one SIS + optional LMS, food service, communications, registration |
| **Skyward** | Common in many districts; admin + family access |
| **Aeries, Synergy (Edupoint), Focus, Alma** | Regional / mid-market SIS options |
| **Blackbaud / Veracross / FACTS** | More common in **independent / private** schools (tuition, admissions, CRM) |

**Core SIS function areas high schools require:**

1. **Identity & demographics** — students, guardians, emergency contacts, medical flags, FERPA roles  
2. **Admissions / enrollment / withdrawals** — year, grade, residency, documents  
3. **Rostering** — courses, sections, teachers, rooms, terms  
4. **Master schedule & student schedules** — conflicts, seats, period structure  
5. **Attendance** — period/daily, codes, truancy workflows  
6. **Gradebook → report cards → transcripts / GPA** — official academic record  
7. **Behavior / discipline** — incidents, consequences  
8. **IEP / 504 / special programs** — often modular or integrated  
9. **Parent / student portal** — grades, attendance, schedule, fees, announcements  
10. **Communications** — notifications, mass email/SMS (or integration)  
11. **Fees, lunch, activities** — especially in all-in-one suites  
12. **State / compliance reporting** — public schools; private schools still need accreditation-ready records  
13. **Interoperability** — OneRoster, Clever/ClassLink, LTI grade passback, CSV/API exports  

### 4.2 LMS (Learning Management System) — “the classroom instruction layer”

**Job:** Deliver courses, assignments, assessments, discussions, and day-to-day teaching workflows.

**Popular LMS options in US high schools:**

| System | Character |
|--------|-----------|
| **Canvas (Instructure)** | Flexible pedagogy, strong rubrics/SpeedGrader, broad LTI ecosystem; rising in K–12 |
| **Schoology (PowerSchool)** | K–12-native gradebook, standards-based grading, mature parent portal; tight PowerSchool SIS pairing |
| **Google Classroom** | Lightweight assignment distribution on Workspace; not a full SIS-grade gradebook/LMS |
| **Brightspace (D2L), Moodle** | Present but less dominant in typical US high schools than the above |

**Core LMS feature areas:**

1. **Course structure** — modules, pages, files, calendars  
2. **Assignments & submissions** — deadlines, groups, file/link uploads  
3. **Assessments** — quizzes, question banks, rubrics, speed grading  
4. **Gradebook** — categories, weights, standards-based options, SIS passback  
5. **Discussions / collaboration**  
6. **Differentiation** — sections, mastery paths, accommodations  
7. **Analytics** — missing work, engagement, standards coverage  
8. **Parent/observer access**  
9. **LTI / publisher content** — Khan, Savvas, McGraw Hill, etc.  
10. **Mobile apps** for students and teachers  

### 4.3 The painful gap (why “SIS/LMS for the future” is a real category)

Legacy stacks optimize for **compliance and content distribution**. They are weak at:

- Continuous AI tutoring orchestration  
- Real-time “where is this student stuck?” guide dashboards  
- Distinguishing **productive struggle** (desirable difficulty) from **unproductive struggle** (frustration, guessing, idle loops)  
- Learning-science-native pacing (mastery gates, spacing, retrieval) as first-class product logic  
- Unified **academic mastery + human skills evidence** in one operating picture for guides and parents  
- Outcome loops tied to external validation (MAP, state tests, AP/SAT) rather than engagement theater  

That gap is exactly the space Alpha’s TimeBack is claiming — and the space CMYK High’s model needs.

---

## 5. TimeBack (Alpha Schools) — functions and features

**Sources:** [Alpha announcement](https://alpha.school/blog/introducing-timeback-the-next-evolution-of-alphas-model/), [TimeBack docs](https://docs.timeback.com/) (How it works, Principles, API overview, XP system, PowerPath).

TimeBack is Alpha’s upgrade of **2 Hour Learning**: an AI-native **education operating platform** (they describe it as a ~$100M project) that compresses academics via personalized mastery so students reclaim afternoon time for life skills. It is **not** marketed as a drop-in PowerSchool clone; it is a **mastery + analytics + app ecosystem** with SIS-like rostering primitives underneath.

### 5.1 Product thesis

- Core academics in ~**2 hours/day** via AI + mastery  
- Afternoons for workshops / life skills / passions  
- Goal: give kids their **time back** (hence the name)  
- Prove learning via a **closed loop** to external assessments, not just in-app completion  

### 5.2 Architecture (three layers)

| Layer | What it provides |
|-------|------------------|
| **1. Standards backbone** | 1EdTech APIs: students, classes, enrollments, content, results, learning events |
| **2. Learning system** | Mastery state, XP, heartbeats/time-on-task, closed-loop analytics, hole-filling remediation |
| **3. Student experience** | Learning apps (1st + 3rd party), student dashboards, **TimeBack Desktop App** launcher |

### 5.3 Platform APIs (eight 1EdTech-aligned surfaces)

| API | Purpose |
|-----|---------|
| **OneRoster** | Courses, classes, students, enrollments, resources, assessment results |
| **EduBridge** | Convenience: enrollment analytics, subject tracks, bulk ops, weekly facts |
| **Caliper** | Activity events + time-spent heartbeats; feeds XP/analytics |
| **QTI** | Interoperable items, tests, scoring, item banks |
| **PowerPath** | Placement tests, adaptive quizzes, mastery progression, lesson plans |
| **CASE** | Align content to CCSS / NGSS / state frameworks |
| **Open Badges** | Issue/verify digital badges |
| **CLR** | Comprehensive learner records / verifiable transcripts |

Auth: OAuth 2.0 client credentials. Launch path for apps: **LTI**.

### 5.4 Student / school-facing functions (from Alpha + docs)

1. **Personalized mastery learning** — adaptive paths, placement, unlock on performance  
2. **AI adaptive tutoring** — real-time personalization of academics  
3. **Real-time skill / progress tracking** — dashboards for students (and operator analytics)  
4. **XP motivation system** — `1 XP ≈ 1 minute of focused, verified learning`; expected vs awarded XP  
5. **Year → visible goals** — academic year broken into actionable targets  
6. **Time-back tracking** — finish mastery → reclaim afternoon  
7. **Desktop App engagement signals**  
   - Waste detection (idle, distracted, multitasking)  
   - Time-on-task vs passive screen time  
   - Session context (which app, how long)  
8. **Closed-loop validation** — correlate in-app activity with MAP Growth, state tests, SAT/AP  
9. **Hole filling** — when external mastery &lt; ~90%, generate targeted remediation for missed standards, retest, then advance  
10. **Guide / life-skills afternoon model** — software frees humans to coach motivation and workshops (Alpha “guides,” not lecture-first teachers)  

### 5.5 Learning-science rules TimeBack enforces (high signal for our design)

**Tier 0 non-negotiables:**

- Faultless communication (unambiguous examples / non-examples)  
- Retrieval practice as the primary learning event  
- Mastery gating at **≥90%** on rigorous checks  

**XP integrity:**

- No XP for unverified passive activity  
- No XP below ~80% accuracy  
- Partial/negative XP for waste / gaming  
- Bonus for first-attempt mastery  

**Other principles:** spacing, interleaving, worked examples, cognitive-load-aware granularity (“stuck ≈ working-memory overload → finer lessons”), anti-gaming design, interoperable events so apps compound.

### 5.6 What TimeBack solves that classic SIS/LMS usually don’t

| Need | Classic SIS/LMS | TimeBack |
|------|-----------------|----------|
| Who is enrolled in Algebra 2? | Strong | OneRoster / rostering |
| Official transcript / state report | Strong | CLR / badges (partial; not their marketing center) |
| Post worksheets & collect homework | Strong (LMS) | Secondary; apps own experiences |
| Is the student *learning* or just clicking? | Weak | Waste + XP + mastery + external tests |
| Adaptive tutoring orchestration | Weak / bolt-on | Core |
| Guide “who needs me in the next 10 minutes?” | Weak | Engagement + mastery signals |
| Productive vs unproductive struggle | Almost absent | Explicit design target via waste/accuracy/time-to-mastery |

### 5.7 Gaps / caveats when reading TimeBack as a competitor

- Still described as **beta** in Alpha’s public posts  
- Oriented to an **app ecosystem + developer platform**, not only a single school admin UI  
- Public docs emphasize **developer APIs** more than registrar workflows (fees, discipline, accreditation packets)  
- Independent schools still need classical SIS concerns (admissions, guardians, transcripts) even if academics run on a TimeBack-like engine  

---

## 6. Synthesis — “SIS/LMS for the future” (CMYK High direction)

Ideas unloaded from product intent (plus fit with existing CMYK assets):

### 6.1 Likely product pillars

| Pillar | Description | Related existing asset |
|--------|-------------|------------------------|
| **AI tutoring coordination** | Session orchestration, content path, tutor memory, subject engines | Partial: OpenAI analysis stack in Firebase |
| **Mastery academics OS** | Placement, adaptive practice, mastery gates, hole-filling | New (TimeBack-like) |
| **Struggle intelligence** | Detect productive vs unproductive struggle; alert guides | New (engagement telemetry + learning science) |
| **Guide cockpit** | “Who is stuck, why, and what intervention helps?” | Partial: advisor review UI patterns |
| **Human skills evidence** | CMYK 8 skills, evidence upload, coach scoring | **CMYK-LTI + Firebase** |
| **Parent & student updates** | Progress, goals, wins, alerts — not just missing homework | New + shop/parent contact patterns |
| **Credentials & pathways** | Skills credentials, internship readiness, CLR-like records | **CMYK-VC** + High business partnerships |
| **School operations (thin SIS)** | Roster, attendance-lite, schedule blocks, guardians | New (keep lean for micro-school) |
| **Learning science engine** | Spacing, retrieval, cognitive load, desirable difficulty | New (encode as product rules) |

### 6.2 Productive vs unproductive struggle (design stub)

Signals to instrument early (inspired by TimeBack’s waste/accuracy/time loop + tutoring research):

| Signal | Productive struggle (likely) | Unproductive struggle (likely) |
|--------|------------------------------|--------------------------------|
| Time on item | Elevated but progressing | Elevated with no progress |
| Attempt quality | Varied strategies, improving errors | Same wrong strategy / rapid guessing |
| Help-seeking | After genuine attempts | Immediate help-spam or none + freeze |
| Affect / idle | Short pauses, re-engagement | Long idle, tab switches, rage-quit loops |
| Accuracy trajectory | Rising toward mastery gate | Flat/chaotic below threshold |
| Tutor dialogue | Building explanations | Copying answers / “just tell me” loops |

**Guide action:** surface *why* and *recommended move* (hint, worked example, finer grain lesson, reset placement, human check-in) — not just a red “stuck” badge.

### 6.3 Suggested system boundaries

```
┌─────────────────────────────────────────────────────────────┐
│  CMYK High SIS/LMS (new product — new repo recommended)     │
│  roster · schedule · guides · tutoring · struggle · parents │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
                ▼                             ▼
     CMYK.education skills layer      External academics
     (evidence, 8 skills, advisors)   (AI tutors / content apps)
                │
                ▼
           CMYK-VC credentials
```

For a ~100-student founding class, prefer a **lean SIS** (not PowerSchool parity on day one) plus a **differentiated learning OS** (the actual moat).

### 6.4 Standards to consider early

Even if we do not implement full 1EdTech on day one, design data models to be compatible with:

- **OneRoster** — rostering  
- **Caliper-like events** — learning telemetry  
- **LTI** — launch third-party tools  
- **CLR / Open Badges** — portable records (aligns with CMYK-VC direction)  
- **CASE** — standards alignment when academics mature  

---

## 7. Repository recommendation

### Do you need a new repo?

**Yes.** Recommended.

| Existing repo | Why it’s the wrong home for the full SIS/LMS |
|---------------|-----------------------------------------------|
| `cmykHigh` | Static marketing site (GitHub Pages HTML). Mixing a school OS here would tangle brand content with product engineering. |
| `CMYK-LTI` | Skills evidence LMS for CMYK.education; different domain, auth model, and product surface. |
| `CMYK-Firebase` | Analysis backend for skills evidence — keep as a service dependency, not the app monorepo. |
| `CMYK-VC` | Credential issuance microservice. |

**Suggested approach:**

1. Create a new repo, e.g. `CMYK-High-OS`, `cmyk-high-lms`, or `cmyk-sis` (name TBD).  
2. Keep `cmykHigh` as the public school website.  
3. Treat CMYK.education repos as **related services** to integrate (skills evidence, credentials), not to overwrite.  
4. Store this research brief (and future product specs) in `cmykHigh/docs/` until the new repo exists; then copy/move product docs into the new repo’s `docs/`.

### Can you add a new repo to *this* Cursor environment?

**Yes — you do not need to start a new environment.**

This Cloud Agent environment is already named **“CMYK LMS + SIS”** and currently includes:

- `github.com/CMYK-education/CMYK-Firebase`  
- `github.com/CMYK-education/CMYK-LTI`  
- `github.com/CMYK-education/CMYK-VC`  
- `github.com/CMYK-education/cmykHigh`  

After you create the new GitHub repo under `CMYK-education`:

1. Open the environment in the Cursor dashboard:  
   [CMYK LMS + SIS environment](https://cursor.com/dashboard/cloud-agents/environments/e/778f2b73-9369-11f1-ba66-0e7d0216e441)  
2. Add the new repository to the environment’s repo list.  
3. Start a new agent run (or snapshot/rebuild if you use environment builds) so the new repo is cloned into the workspace.

**You only need a new environment** if you want a clean break (different secrets, install scripts, or machine image). For multi-repo CMYK work, **adding the repo here is the right default.**

---

## 8. Suggested next artifacts (when ready)

1. **Product brief** — MVP scope for Fall 2027 founding class (must-have vs later)  
2. **Role model** — student, parent/guardian, guide/coach, academic tutor AI, admin/registrar, employer partner  
3. **Event taxonomy** — tutoring steps, struggle states, mastery transitions, guide interventions  
4. **Data model v0** — people, enrollments, learning sessions, skills evidence link, credentials  
5. **Build vs buy matrix** — thin SIS modules vs integrate Blackbaud/FACTS/etc. for tuition/admissions  
6. **Interoperability stance** — how much 1EdTech to implement in year one  

---

## 9. Source index

### Internal repos (this workspace)

- `/agent/repos/CMYK-LTI` — CMYK.education frontend / skills LMS  
- `/agent/repos/CMYK-Firebase` — evidence analysis Cloud Functions  
- `/agent/repos/CMYK-VC` — verifiable credentials API  
- `/agent/repos/cmykHigh` — CMYK High marketing site  

### External (research)

- Alpha: [Introducing TimeBack](https://alpha.school/blog/introducing-timeback-the-next-evolution-of-alphas-model/)  
- TimeBack docs: [How it works](https://docs.timeback.com/beta/about-timeback/how-it-works), [Principles](https://docs.timeback.com/beta/about-timeback/principles), [API overview](https://docs.timeback.com/beta/api-reference/overview), [Why build here](https://docs.timeback.com/beta/about-timeback/why-build-here)  
- Market: PowerSchool, Infinite Campus, Schoology, Canvas, Google Classroom public comparisons and vendor pages (2024–2026)  

---

*This document is a planning brief, not a commitment to feature parity with any vendor. Product scope will be refined as CMYK High’s operating model and MVP are decided.*

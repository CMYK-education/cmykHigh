# Press — CMYK High SIS / LMS

Press is the school operating system for CMYK High: rostering, scheduling, academics, skills, evidence, and guide workflows in one product shaped around the CMYK day.

## What TimeBack is (and isn’t)

[TimeBack](https://alpha.school/blog/introducing-timeback-the-next-evolution-of-alphas-model/) is Alpha School’s evolution of “2 Hour Learning”: an AI platform and developer infrastructure for mastery-based academics. Public docs describe:

- **Academics-first OS** — personalized mastery, adaptive tutoring, year goals broken into actionable units
- **Motivation via “time back”** — finish academics with mastery (~2 hours), reclaim the rest of the day
- **XP currency** — roughly 1 XP ≈ 1 minute of verified focused learning; XP only after retrieval/mastery
- **≥90% mastery gates** — no advancement on time, completion theater, or self-report
- **Desktop launcher** — waste detection, time-on-task, session context across learning apps
- **Closed loop** — in-app signals correlated with external assessments (MAP, state tests, SAT/AP); “hole filling” for gaps
- **1EdTech stack** — OneRoster, LTI, Caliper, QTI, CASE, Open Badges, CLR as a platform for many apps

TimeBack is excellent at coordinating **academic software**. Life skills and afternoon activities are the *reward for finishing academics*, not a first-class structured curriculum inside the OS.

## What CMYK High needs instead

CMYK High keeps Alpha-like AI academics with a human guide nearby — then deliberately diverges:

| Dimension | TimeBack / Alpha pattern | CMYK High / Press |
| --- | --- | --- |
| Day structure | Compress academics; reclaim afternoon | Fixed **A / B / C blocks** (2.5 hours each), student-owned arrangement |
| Second half of day | Sports, workshops, passion projects (often loosely instrumented) | **Skills development taught explicitly** with maps of where skills live and are practiced |
| Progress currency | XP + time-back | **Mastery units** (academics) + **CMYK evidence** (skills) + block fidelity |
| Human role | Guides / coaches support focus | Guide is co-present in academics *and* leads structured skill instruction |
| Credential story | Academic mastery + external tests | Academic credits **and** CMYK growth scale (Emerging → Developed → Solidified) |
| Product shape | Learning OS + developer platform | **School-native SIS + LMS** for one model (not a marketplace of apps) |

Press is not “TimeBack with CMYK colors.” It is a **dual-track operating system**: academics and skills are equal, linked, and scheduled.

## Product thesis

> School software usually tracks classes, grades, and assignments. Alpha-style software tracks academic mastery and reclaimed time. Press tracks **the whole CMYK day**: which block a student is in, what academic unit they are mastering with AI + guide, which human skill is being taught, where that skill shows up again, and what evidence proves growth.

## Core objects

1. **Person** — student, guide, pathway mentor, guardian, admin
2. **Block** — A / B / C; 150 minutes; typed as `academics` | `skills` | `pathways`
3. **DayPlan** — student’s ordered blocks for a date (flexible order, inflexible mastery)
4. **AcademicTrack** — subject sequence, units, mastery threshold, AI session state
5. **Skill** — CMYK pillar + named skill (e.g. Cyan → Self Management)
6. **SkillLesson** — explicit teach: definition, look-fors, practice contexts, assessment
7. **PracticeSite** — where the skill is found/practiced (seminar, internship, expedition, academic block, home systems)
8. **Evidence** — artifact/observation tagged to skill + growth level
9. **GuideSession** — live cohort view during academics or skills block
10. **Credit / Credential** — transcript credit + CMYK skill credential

## Module map

### 1. SIS — School of record
- Rosters, enrollment, guardians, attendance **by block**
- Credits, transcripts, Utah/independent-school reporting hooks
- Pathways placements and internship partners

### 2. Day Board — Block scheduler
- Assign and rearrange A/B/C without losing accountability
- Live status: on track / needs guide / remediation / finished early → stretch or pathway
- Check-in / check-out and presence for each 2.5-hour block

### 3. Academics Engine (AI + Guide)
- Mastery-gated units (≥90% retrieval checks)
- AI tutor delivers instruction; Press surfaces **guide interventions** (start work, stuck, gaming signals, celebrate mastery)
- Hole-filling / credit recovery / acceleration queues
- Optional adapters to third-party academic apps (TimeBack-style Caliper/LTI later) — Press remains the system of record

### 4. Skills Studio (differentiation vs TimeBack)
- Explicit skill curriculum, not “afternoon vibes”
- Every skill shows: **taught here → practiced here → evidenced here**
- CMYK pillars as the taxonomy (Personal / Professional / Interpersonal / Global)
- Growth scale: Emerging → Developed → Solidified (evidence over time)

### 5. Evidence Ledger
- Unified feed linking academic attempts, skill practice, pathway work, outdoor/expedition notes
- Parent-visible growth without reducing kids to XP scores alone

### 6. Guide Console
- Cohort heatmaps during academic blocks
- Skill seminar run-sheets and look-fors
- Coaching notes that become structured evidence, not private sticky notes

## Motivational model (CMYK-native)

Borrow TimeBack’s rigor (mastery gates, anti-gaming, retrieval) — change the promise:

- **Block fidelity** — the work of the block is finished well
- **Ink** — verified academic minutes (similar spirit to XP, renamed to avoid marketplace baggage)
- **Press marks** — skill evidence stamps toward Solidified
- **Pathway unlocks** — deeper internship / expedition access tied to academic + skill readiness, not only finishing early

Students do not “escape” skills by finishing academics fast. Skills blocks are scheduled instruction. Finishing early inside a block unlocks **stretch academics, deeper practice, or pathway work** — still structured.

## Architecture (v0 → v1)

**v0 (this prototype)** — static interactive product demo with seeded cohort data; validates UX for student Today, Academics session, Skills map, Guide console, SIS roster.

**v1** — Next.js (or similar) + Postgres; Auth; block scheduling; evidence API; guide real-time presence; AI session provider interface.

**v2** — Parent portal; transcript/CLR export; LTI/Caliper adapters for academic content vendors; offline expedition capture.

## Success metrics

- % of academic units mastered on first gated check
- Median guide interventions per academic block (quality over volume)
- Skills with ≥3 independent evidence sources per student per quarter
- Block attendance + on-task completion (not seat time alone)
- Parent clarity: can name student’s current academic unit *and* skill focus

## Why this is better *for CMYK High*

1. **Fits the actual day** — A/B/C blocks are native objects, not afterthoughts.
2. **Skills are curriculum** — taught, mapped, practiced, evidenced.
3. **Guide is first-class software** — not a hall monitor for an AI app.
4. **CMYK credential is real data** — growth scale backed by evidence ledger.
5. **School-sized, not marketplace-sized** — optimized for one innovative high school (and later copies of the model), not a global app store.
6. **Keeps Alpha’s academic rigor** — mastery, retrieval, anti-gaming — without outsourcing the school’s identity to TimeBack’s afternoon narrative.

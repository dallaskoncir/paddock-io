# Paddock.io — Ideal User Flow: Track Day Registration

**Purpose:** Translate the friction points identified in `competitor-critique.md` into a concrete, step-by-step registration flow for Paddock.io.
**Goal:** A first-time user can find an event and complete registration + payment in well under 5 minutes, with zero redundant data entry and no dead ends.
**Architecture reference:** `react-hook-form` + Zod wizard, `Zustand`-persisted state across steps, `@paddock/ui` (shadcn/Radix) components, per `paddockio.md`.

---

## Design Principles

Each principle below directly answers a finding from the competitor critique.

1. **One CTA, always visible.** Every screen has exactly one primary action, rendered as a real button (never a text link), and it stays on-screen via sticky positioning when content scrolls. *(Fixes: REGISTER buried in a paragraph; non-sticky checkout button.)*
2. **Ask once, reuse everywhere.** Anything the user has already provided (name, email, vehicle, emergency contact) is never asked for again — it's pulled from their profile/Garage and shown for confirmation, not re-entry. *(Fixes: duplicate name/email fields across signup steps; disconnected vehicle data models.)*
3. **Progressive disclosure over wall-of-fields.** Forms show the common case first; niche/advanced fields are opt-in and collapsed by default. *(Fixes: the 17-field Edit Vehicle form treating "Color" and "GCR Page #" with equal weight.)*
4. **State is never ambiguous.** No screen shows contradictory messaging (e.g., "no registrations" above a populated table); every state — empty, loading, error, success — is explicit and real-time.
5. **One color, one meaning.** Blue is always primary/affirmative; red is reserved exclusively for destructive or blocking actions. No alternating CTA colors for equivalent actions.
6. **Legal content is summarized, not dumped.** Terms are condensed to a single plain-language line with a "Read full terms" link/modal, backed by one checkbox — never a scrolling textarea or duplicate consent blocks.
7. **Progress is always visible.** Every step of the registration wizard shows a persistent step indicator ("Step 2 of 4: Driver Profile") so the user always knows how much is left.
8. **Autosave, no data loss.** Zustand-persisted wizard state means a user can close the tab mid-registration and resume exactly where they left off.

---

## Flow Overview

```
Landing Page
   │
   ▼
Event Discovery (search/browse)
   │
   ▼
Event Detail Page  ───────────────► [sticky "Register — $299" CTA]
   │
   ▼
Lightweight Auth Gate (returning user = instant; new user = email-only)
   │
   ▼
┌─────────────────────────── Registration Wizard ───────────────────────────┐
│  Step 1: Garage     →   Step 2: Driver Profile   →   Step 3: Tech Inspection   →   Step 4: Checkout │
└─────────────────────────────────────────────────────────────────────────────┘
   │
   ▼
Payment Confirmation
   │
   ▼
My Events (event now appears, with calendar + prep info)
```

---

## Step-by-Step Screens

### 0. Landing Page

**Purpose:** Get the user to a relevant event in one search.

- Hero search bar with three clearly distinct, properly labeled inputs: **Location**, **Date range**, **Discipline/Run group type** — each with a real `<label>`, sufficient contrast, and visible affordance (calendar icon, location pin, dropdown chevron) so input type is obvious before clicking.
- Below the fold: "Upcoming near you" event cards, sorted by date by default.
- If sponsored content exists, it is visually distinct (bordered "Sponsored" card treatment, not slotted into the organic grid) — never blended with real listings.

*Friction fixed:* undifferentiated search fields; ads disguised as event cards.

### 1. Event Discovery / Search Results

**Purpose:** Let the user scan and compare events fast.

- Card layout with explicit visual hierarchy: **Track name** (largest), **Date** and **Price** (bold, same row, icon-paired), then organizer and run-group tags as small badges below.
- Spots-remaining indicator on each card ("12 spots left") — sets urgency and is information a driver actually needs.
- Filter sidebar persists across scroll; selected filters shown as removable chips above results.

*Friction fixed:* low-contrast metadata; date/venue buried under bold but less-useful title text.

### 2. Event Detail Page

**Purpose:** Give the user everything needed to decide and register, above the fold.

- **Summary card** pinned at the top: dates, venue (with map thumbnail), price, run groups offered, spots remaining. This replaces having to read four paragraphs to find the same facts.
- **Sticky "Register — from $299" button**, visible in the viewport at all times (header-pinned on scroll), not a hyperlink in body text.
- Full event description is collapsed under an "Event Details" disclosure — available, not mandatory reading.
- Entrant list shows real badges per driver (`novice-driver`, run group, car class) instead of bare initials — useful context, reusing the `@paddock/ui` badge variants.
- Real heading structure (`h2`/`h3`) for Requirements, Schedule, Venue — screen-reader and sighted scanning both work.

*Friction fixed:* CTA-as-text-link; wall-of-text description; uninformative entrant avatars; no heading landmarks.

### 3. Lightweight Auth Gate

**Purpose:** Never block momentum from "I want to register" with a full account-creation form before the user has even chosen their options.

- Clicking "Register" opens a single field: **email**. Existing email → instantly recognized, session restored, skip straight to Step 1 with profile pre-filled. New email → magic-link or password set in one short step, with name captured during Driver Profile (Step 2) instead of asked twice.
- No marketing opt-in checkboxes here — those live in account settings, not the registration path.

*Friction fixed:* two-step "create account, then register" gate; redundant name/email fields between signup steps; marketing asks mixed into a transactional flow.

### 4. Registration Wizard — Step 1: Garage

**Purpose:** Attach a vehicle to this registration with minimal typing.

- Returning users see their saved vehicles as selectable cards (photo, year/make/model). One click selects and advances — no retyping.
- "Add a vehicle" expands an inline form showing only the common fields first: **Year, Make, Model, Color**. A secondary, collapsed "Competition details (optional)" section holds the niche fields (transponder #, log book #, GCR page #, wheelbase, etc.) for the minority of users who need them.
- This is the *same* vehicle record used later at Tech Inspection and Checkout — entered once, referenced everywhere, validated by the shared `vehicleSchema`.

*Friction fixed:* freeform single-text-field vehicle entry disconnected from the structured Garage form; 17 equal-weight fields with no progressive disclosure.

### 5. Registration Wizard — Step 2: Driver Profile

**Purpose:** Confirm who's driving and how they should be grouped — fast for returning users, guided for new ones.

- Name, contact info, and emergency contact pre-filled from the account created in Step 3 (Auth Gate) or from a prior registration — shown for confirmation with an "Edit" affordance, not blank fields to refill.
- Run-group selection uses a short guided picker ("New to this track? → Novice. Cleared to drive solo? → Intermediate.") instead of requiring the user to parse three paragraphs of program description to self-select correctly.
- Emergency contact is asked once per account and persisted — never re-entered per event.

*Friction fixed:* dense unstructured program-description text used as the only group-selection guidance; emergency contact and profile fields re-collected every flow.

### 6. Registration Wizard — Step 3: Tech Inspection

**Purpose:** Confirm the car and driver gear meet event requirements, with real-time feedback instead of a static PDF/checklist.

- Dynamic checklist generated from the vehicle selected in Step 1, driven by `techSchema` — only shows requirements relevant to that car/class.
- Inline validation gives immediate, specific feedback (e.g., "Helmet Snell certification (2014) has expired — events on this platform require SA2020 or newer") rather than a generic pass/fail at submission.
- Live status badge (`tech-passed` / `tech-failed`, reusing the existing `@paddock/ui` variants) updates as the user completes each item, so they always know where they stand before paying.

*Friction fixed:* tech requirements as a flat bullet list disconnected from the actual vehicle being registered; no real-time validation of safety-gear compliance.

### 7. Registration Wizard — Step 4: Checkout

**Purpose:** One clear summary, one legal step, one payment action.

- Single summary card: event, driver, vehicle, run group, and an itemized price breakdown produced by `calculateEventTotal()` (base fee + optional transponder rental + early-bird discount applied automatically, no manual coupon hunting).
- Optional add-ons (transponder rental, instructor request) are presented as opt-in toggles the user actively chooses — not default-visible checkboxes everyone has to read and dismiss.
- **One** consolidated terms acknowledgment: a single short sentence ("I agree to the event waiver and cancellation terms") with a "Read full terms" link that opens a modal — never a scrollable embedded textarea, never two stacked legal blocks.
- Payment form with a sticky "Pay & Register — $X" button, visible regardless of scroll position.

*Friction fixed:* two redundant stacked terms-acceptance blocks; legal text trapped in a tiny scroll box; an irrelevant "Instructor Registration" option shown to everyone by default; non-sticky checkout CTA.

### 8. Payment Confirmation

**Purpose:** Close the loop with certainty and next steps — no ambiguity about what just happened.

- Immediate on-screen confirmation: event, date, amount charged, confirmation number.
- Three concrete next actions, each a real button: **Add to calendar** (.ics/Google Cal), **View track map / event requirements**, **Go to My Events**.
- Confirmation email sent immediately, mirroring the on-screen summary exactly (no discrepancy between channels).

*Friction fixed:* no equivalent positive-confirmation moment existed in the legacy flow beyond a generic green banner.

### 9. My Events (post-registration state)

**Purpose:** Reflect real, current state — never contradict itself.

- The event just registered for appears immediately in an "Upcoming" list. If the list is genuinely empty, the empty state says so and nothing else — no banner and table disagreeing with each other.
- Each row shows date, event, status (confirmed/waitlisted), and a single contextual action (e.g., "View details," "Cancel registration").

*Friction fixed:* "You have no upcoming registrations" displayed directly above a populated table of upcoming events.

---

## Friction Point → Resolution Quick Reference

| Friction point (from `competitor-critique.md`) | Resolved at |
|---|---|
| REGISTER is a text link inside a paragraph | Event Detail Page — sticky CTA button |
| Two incompatible vehicle data models | Garage (Step 1) — single shared `vehicleSchema` used everywhere |
| Inconsistent red/blue CTA colors | Global — one primary button variant, red reserved for destructive actions only |
| Two stacked, scrollable legal-acceptance blocks | Checkout (Step 4) — single condensed consent + modal |
| Redundant name/email across signup steps | Auth Gate + Driver Profile — collected once, reused |
| 17-field vehicle form with no hierarchy | Garage (Step 1) — progressive disclosure, common fields first |
| "Instructor Registration" shown to all users | Checkout (Step 4) — opt-in toggle, not default-visible |
| Contradictory empty-state copy on My Events | My Events — single source of truth, no static banner conflicting with live data |
| Dense paragraph-only run-group guidance | Driver Profile (Step 2) — guided picker |
| No real-time tech/safety validation | Tech Inspection (Step 3) — inline, vehicle-specific validation |
| Non-sticky, easy-to-lose checkout button | Checkout (Step 4) — sticky CTA |
| Marketing opt-ins mixed into account creation | Removed from registration path entirely; lives in account settings |

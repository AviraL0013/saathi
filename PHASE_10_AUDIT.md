# PHASE 10 AUDIT — SAATHI Intelligence Presentation

_Generated after Phase 10 implementation. All claims verified against source code._

---

## 1. Real Backend Driven

Every value in these sections is read directly from a backend API response, not derived or transformed.

| Dashboard Section | Backend Endpoint | Field(s) Used |
|---|---|---|
| LearningProgress — overall % | `/metrics` | `active_patterns`, `promoted_patterns`, `learning_patterns`, `observing_patterns` |
| LearningProgress — daysLearning | `/patterns` | `first_observed` (oldest across all patterns) |
| LearningProgress — patternsFound | `/metrics` | `active_patterns` |
| LearningProgress — patternsPromoted | `/metrics` | `promoted_patterns` |
| LearningProgress — byMember | `/patterns` | `member_id`, `confidence` (avg per member) |
| LearningProgress — missingInsights | `/patterns` | `description`, `confidence`, `confidence_band` (OBSERVING/LEARNING) |
| HouseholdHealth — medicationAdherence | `/patterns` | `total_matches`, `total_observations` on med patterns |
| HouseholdHealth — routineConsistency | `/patterns` | avg `confidence` of PROMOTED + LEARNING patterns |
| HouseholdHealth — elderCareScore | `/patterns` | avg `confidence` of Dadaji's patterns |
| HouseholdHealth — missedReminders | `/patterns` | `consecutive_misses` on medication patterns |
| HouseholdHealth — conditions | `/graph/{hh}/full` | `HAS_CONDITION` edges, severity |
| ReasoningFeed — all cards | `/rte/audit` | `route`, `stage_decided`, `complexity_score`, `rule_matched`, `pattern_matched`, `score_breakdown`, `latency_ms` |
| RecentEvents — events | `/actions/history` | All ActionLog fields |
| PatternPromotions | `/patterns` | `confidence_band`, `confidence`, `observation_days`, `total_observations`, `total_matches`, `promoted_at`, `demoted_at`, `first_observed`, `last_observed`, `time_window`, `day_pattern`, `consecutive_misses`, `promoted_rule_id` |
| HouseholdGraph (interactive) | `/graph/{hh}/full` | All nodes and edges |
| LifeEvents — event card | `/graph/{hh}/full` | `life_event` nodes, `DIRECTLY_AFFECTS` edges, `CONFLICTS_WITH` edges (with `reason`) |
| LifeEvents — health card | `/graph/{hh}/full` | `health_condition` nodes, `HAS_CONDITION`/`TAKES`/`FOLLOWS` edges |
| ConflictResolution | `/graph/{hh}/full` | `CONFLICTS_WITH` edges with `reason` field |
| SaathiEfficiency | `/metrics` | `token_savings_percentage`, `estimated_daily_cost_usd`, `v1_estimated_tokens_per_call`, `v2_actual_tokens_per_call`, `avg_rule_engine_latency_ms`, `avg_bedrock_latency_ms`, `functionality_during_outage`, `rule_engine_percentage` |
| HouseholdSnapshot — nextMedicationTime | `/graph/{hh}/full` | `TAKES` edges with `schedule` field, member name |
| HouseholdSnapshot — nextEvent | `/patterns` | `time_window` of highest-confidence pattern |
| HouseholdSnapshot — waterTankStatus | `/actions/history` | Latest water motor action `command`, `rule_id`, timestamp |
| HouseholdSnapshot — currentMoodEstimate | `/metrics` | `total_events_processed`, `circuit_breaker.state` |

---

## 2. Derived Intelligence

These sections transform real backend data into human-readable meaning. No hardcoded values.

| Dashboard Section | Sources | Transformation |
|---|---|---|
| HouseholdMemory | `/patterns` + `/metrics` | `deriveHouseholdMemory()` — natural language from PROMOTED/LEARNING patterns + metric counts |
| LearnedToday | `/patterns` | `deriveLearnedToday()` — LEARNING/OBSERVING patterns → discovery sentences |
| SaathiObservations | `/patterns` + `/metrics` | `deriveObservations()` — pattern confidence → observation sentences |
| RecommendedActions | `/patterns` + `/metrics` | `deriveRecommendedActions()` — near-promotion patterns + Bedrock call count |
| ReasoningFeed — structured steps | `/rte/audit` + `/rules` | `rteAuditToReasoning()` — 5-step story from RTE decision fields |
| IntelligenceTimeline | `/patterns` + `/actions/history` + `/rte/audit` | Unified chronological story combining all three data streams |
| RecentEvents — recipients | `/actions/history` | `actionsToEvents()` — `target_members` IDs resolved to display names |
| RecentEvents — device detail | `/actions/history` | `device_id`, `command`, `success`, `latency_ms` preserved and shown |

---

## 3. Remaining Mock Data

These fields are still hardcoded because no backend endpoint provides them.

| Section | Field | Mock Value | Reason |
|---|---|---|---|
| FamilyPresence — home/away | who is home | Papa always away | Redis pub/sub not exposed as REST endpoint |
| FamilyPresence — currentActivity | activity strings | 5 hardcoded strings | No activity tracking endpoint |
| HouseholdSnapshot — membersHome | count | 5 | Presence not available |
| HouseholdSnapshot — membersAway | count | 1 | Presence not available |
| HouseholdHealth — takenToday | medication taken status | hardcoded true/false | No medication event tracking |
| IntelligenceStats — rulesActive | count | 9 | Not yet dynamic |
| IntelligenceStats — daysLearning | days | 52 | Kept from mock for this specific field in stats |
| DeviceOverview (5 of 6 devices) | device state | SHARMA_DEVICES | `/graph/{hh}/devices` only returns water motor |
| HouseholdGraph — fallback | SVG ring | `mockGraph()` | Used when `/graph/{hh}/full` fails |

---

## 4. Fields Fetched But Previously Not Rendered (now fixed in Phase 10)

| Field | Location | Phase 10 Status |
|---|---|---|
| `target_members` | ActionLog → `/actions/history` | ✅ Now shown as "Notified: Rajesh, Sunita" in RecentEvents expanded view |
| `latency_ms` | ActionLog | ✅ Now shown in RecentEvents expanded view |
| `command` | ActionLog | ✅ Now shown as "Command: turn_off on water motor" |
| `device_id` | ActionLog | ✅ Shown in device command detail |
| `channel` | ActionLog | ✅ Shown in notification detail |
| `success` | ActionLog | ✅ Shown as "✓ Success" / "✗ Failed" |
| `score_breakdown` | RTEAuditLog | ✅ Now rendered as complexity factor bars in ReasoningFeed |
| `rule_matched` | RTEAuditLog | ✅ Shown as code chip in ReasoningFeed Decision step |
| `pattern_matched` | RTEAuditLog | ✅ Shown as code chip in ReasoningFeed |
| `latency_ms` | RTEAuditLog | ✅ Shown in ReasoningFeed outcome |
| `token_savings_percentage` | `/metrics` | ✅ SaathiEfficiency card |
| `estimated_daily_cost_usd` | `/metrics` | ✅ SaathiEfficiency card |
| `v1_estimated_tokens_per_call` | `/metrics` | ✅ SaathiEfficiency token comparison |
| `v2_actual_tokens_per_call` | `/metrics` | ✅ SaathiEfficiency token comparison |
| `avg_rule_engine_latency_ms` | `/metrics` | ✅ SaathiEfficiency latency row |
| `avg_bedrock_latency_ms` | `/metrics` | ✅ SaathiEfficiency latency row |
| `functionality_during_outage` | `/metrics` | ✅ SaathiEfficiency offline resilience |
| `rule_engine_percentage` | `/metrics` | ✅ SaathiEfficiency routing split bar |
| `promoted_at` | `/patterns` | ✅ "Promoted: 3 days ago" in PatternPromotions |
| `demoted_at` | `/patterns` | ✅ "Demoted: 2 weeks ago" in PatternPromotions |
| `first_observed` | `/patterns` | ✅ "First seen: N days ago" in PatternPromotions |
| `last_observed` | `/patterns` | ✅ "Last confirmed: N days ago" in PatternPromotions |
| `time_window` | `/patterns` | ✅ "8:30 PM" time chip in PatternPromotions |
| `day_pattern` | `/patterns` | ✅ "M · T · W · Th · F" schedule chip |
| `consecutive_misses` | `/patterns` | ✅ "4 consecutive misses" in DemotedCard |
| CONFLICTS_WITH `reason` | `/graph/{hh}/full` | ✅ "No TV during board exam study" in LifeEvents and ConflictResolution |
| DIRECTLY_AFFECTS `impact` | `/graph/{hh}/full` | ✅ Impact level colours in LifeEvents affected members |
| TAKES `schedule` | `/graph/{hh}/full` | ✅ Drives `nextMedicationTime` in HouseholdSnapshot |

---

## Phase 10 Verification Checklist

| Check | Status | Evidence |
|---|---|---|
| `target_members` visible in RecentEvents | ✅ | `EventRow` expanded view shows "Notified: X, Y" from `ev.targetMembers` |
| Token savings visible | ✅ | `SaathiEfficiency` renders `token_savings_percentage` from `/metrics` |
| Daily cost visible | ✅ | `SaathiEfficiency` renders `estimated_daily_cost_usd` |
| `promoted_at` visible | ✅ | `PromotedCard` shows "Promoted: N days ago" via `daysAgo(p.promoted_at)` |
| `demoted_at` visible | ✅ | `DemotedCard` shows "Demoted: N days ago" |
| `first_observed` visible | ✅ | `PromotedCard` shows "First seen: N days ago" |
| `last_observed` visible | ✅ | All pattern cards show "Last confirmed/observed" |
| `time_window` visible | ✅ | Time chip "8:30 PM" in PromotedCard and DemotedCard |
| `day_pattern` visible | ✅ | Day schedule chips "M · T · W" in PromotedCard |
| LifeEvents: zero hardcoded constraint bullets | ✅ | Constraints derived from `CONFLICTS_WITH` edges with `edge.reason` |
| ReasoningFeed: structured score breakdown | ✅ | `entry.scoreBreakdown` rendered as factor bars with `+N` values |
| Timeline includes Rule Engine decisions | ✅ | All `r.route` values included, not just BEDROCK |
| Snapshot strings derived from backend | ✅ | `metricsAndDataToSnapshot()` uses patterns, ActionLog, graph |
| `PHASE_10_AUDIT.md` created | ✅ | This file |

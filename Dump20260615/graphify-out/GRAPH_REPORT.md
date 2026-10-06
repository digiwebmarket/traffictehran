# Graph Report - Dump20260615  (2026-09-29)

## Corpus Check
- 14 files · ~67,558 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1709 nodes · 4619 edges · 75 communities (59 shown, 13 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 253 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35c1b6c6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- citibig-transit-dashboard/assets/js/chart.js
- citibig-remote-app/assets/js/chart.js
- tn
- n
- tn
- ho
- s
- s
- ho
- o
- n
- oo
- jt
- sn
- .update
- o
- xt
- .getContext
- updateElements
- i
- updateElements
- u
- l
- e
- citibig-remote-app/assets/js/leaflet.js
- Si
- citibig-transit-dashboard/assets/js/leaflet.js
- inRange
- sn
- Citibig_Transit_DB
- i
- wa
- wa
- ro
- f
- oo
- ua
- .isHorizontal
- parse
- .getProps
- jt
- .getDatasetMeta
- .buildOrUpdateControllers
- .getContext
- Citibig_Transit_API
- .getDatasetMeta
- hs
- m
- k
- u
- hs
- render_dashboard_page
- m
- k
- xt
- Jt
- Jt
- So
- p
- p
- _t
- d
- d
- Citibig_Transit_Admin
- deploy.py
- as
- Citibig Transit Dashboard - Handoff Document
- Ft
- on
- ts
- run_citibig_transit_dashboard
- Tehran Traffic Control Company Logo Image

## God Nodes (most connected - your core abstractions)
1. `tn` - 127 edges
2. `tn` - 127 edges
3. `n()` - 59 edges
4. `n()` - 59 edges
5. `s()` - 45 edges
6. `s()` - 45 edges
7. `a()` - 36 edges
8. `a()` - 36 edges
9. `Citibig_Transit_DB` - 34 edges
10. `o()` - 32 edges

## Surprising Connections (you probably didn't know these)
- `render_dashboard_page` --references--> `Citibig_Transit_DB`  [EXTRACTED]
  citibig-transit-dashboard/includes/class-citibig-admin.php → HANDOFF.md
- `Jt()` --indirect_call--> `Ft()`  [INFERRED]
  citibig-remote-app/assets/js/leaflet.js → citibig-remote-app/assets/js/chart.js
- `Jt()` --indirect_call--> `qt()`  [INFERRED]
  citibig-remote-app/assets/js/leaflet.js → citibig-remote-app/assets/js/chart.js
- `Ee()` --indirect_call--> `O()`  [INFERRED]
  citibig-remote-app/assets/js/chart.js → citibig-remote-app/assets/js/leaflet.js
- `ri()` --indirect_call--> `si()`  [INFERRED]
  citibig-remote-app/assets/js/chart.js → citibig-remote-app/assets/js/leaflet.js

## Import Cycles
- None detected.

## Communities (75 total, 13 thin omitted)

### Community 0 - "citibig-transit-dashboard/assets/js/chart.js"
Cohesion: 0.04
Nodes (31): afterEvent(), at(), beforeUpdate(), Bi(), Bt(), Ci(), Do(), draw() (+23 more)

### Community 1 - "citibig-remote-app/assets/js/chart.js"
Cohesion: 0.04
Nodes (32): beforeUpdate(), ea(), Ee(), et(), getMaxOverflow(), ha(), ia(), initialize() (+24 more)

### Community 2 - "tn"
Cohesion: 0.05
Nodes (8): afterDraw(), d(), Di(), Ie(), ke(), Ni(), Pn(), tn

### Community 3 - "n"
Cohesion: 0.07
Nodes (11): Be(), fn(), gn(), lt(), n(), ne(), numeric(), Oe() (+3 more)

### Community 4 - "tn"
Cohesion: 0.06
Nodes (4): getPixelForTick(), getPixelForValue(), Gs(), tn

### Community 5 - "ho"
Cohesion: 0.06
Nodes (15): beforeLayout(), buildLookupTable(), _generate(), getDecimalForValue(), _getTimestampsForTable(), getValueForPixel(), Go(), ho() (+7 more)

### Community 6 - "s"
Cohesion: 0.09
Nodes (40): a(), ai(), draw(), eo(), fa(), fo(), g(), getRange() (+32 more)

### Community 7 - "s"
Cohesion: 0.07
Nodes (21): a(), Be(), bo, dt(), getRange(), H(), ji(), label() (+13 more)

### Community 8 - "ho"
Cohesion: 0.08
Nodes (16): beforeLayout(), buildLookupTable(), _generate(), getDecimalForValue(), _getTimestampsForTable(), getValueForPixel(), Go(), ho() (+8 more)

### Community 9 - "o"
Cohesion: 0.12
Nodes (11): afterUpdate(), ki(), o(), Oi(), Qs(), Si(), va(), x() (+3 more)

### Community 10 - "n"
Cohesion: 0.10
Nodes (6): fn(), gn(), n(), Oe(), xn(), Ye()

### Community 11 - "oo"
Cohesion: 0.07
Nodes (21): beforeDatasetDraw(), beforeDatasetsDraw(), beforeDraw(), ca, ea(), es(), fa(), ga() (+13 more)

### Community 12 - "jt"
Cohesion: 0.08
Nodes (11): ce(), color(), de, he(), jt(), kt(), mt(), qt() (+3 more)

### Community 13 - "sn"
Cohesion: 0.09
Nodes (6): addElements(), ce(), de, en, he(), sn

### Community 14 - ".update"
Cohesion: 0.10
Nodes (5): afterDraw(), d(), Di(), ke(), Pn()

### Community 15 - "o"
Cohesion: 0.09
Nodes (10): Ae(), getPixelForTick(), getPixelForValue(), Gs(), lo(), o(), pt(), ra() (+2 more)

### Community 16 - "xt"
Cohesion: 0.10
Nodes (6): an(), as(), on, rs(), ts(), xt

### Community 17 - ".getContext"
Cohesion: 0.11
Nodes (7): ao(), co(), da(), inXRange(), inYRange(), ro(), Y()

### Community 18 - "updateElements"
Cohesion: 0.11
Nodes (17): Bn(), _calculateBarIndexPixels(), _calculateBarValuePixels(), _getAxis(), _getAxisCount(), getBasePixel(), getFirstScaleIdForIndexAxis(), getLabelAndValue() (+9 more)

### Community 19 - "i"
Cohesion: 0.11
Nodes (22): bs(), ct(), dn(), e(), ei(), fe(), Fs(), ge() (+14 more)

### Community 20 - "updateElements"
Cohesion: 0.12
Nodes (17): aa(), Bn(), _calculateBarIndexPixels(), _calculateBarValuePixels(), _getAxis(), _getAxisCount(), getBasePixel(), getFirstScaleIdForIndexAxis() (+9 more)

### Community 21 - "u"
Cohesion: 0.09
Nodes (10): addBox(), configure(), kn(), ln(), qn(), removeBox(), reset(), start() (+2 more)

### Community 22 - "l"
Cohesion: 0.11
Nodes (18): ai(), buildTicks(), determineDataLimits(), gi(), l(), ii(), mi(), mo() (+10 more)

### Community 23 - "e"
Cohesion: 0.09
Nodes (17): at(), b(), cn(), dn(), e(), ei(), fe(), hn() (+9 more)

### Community 24 - "citibig-remote-app/assets/js/leaflet.js"
Cohesion: 0.09
Nodes (4): a(), Ci(), l(), x()

### Community 25 - "Si"
Cohesion: 0.18
Nodes (6): afterUpdate(), Oi(), Si(), va(), x(), ya

### Community 26 - "citibig-transit-dashboard/assets/js/leaflet.js"
Cohesion: 0.09
Nodes (4): a(), Ci(), l(), x()

### Community 27 - "inRange"
Cohesion: 0.14
Nodes (20): average(), dataset(), getCenterPoint(), ha(), hi(), index(), inRange(), K() (+12 more)

### Community 30 - "i"
Cohesion: 0.14
Nodes (13): bs(), ct(), Fs(), ge(), is(), ks(), ms(), qi() (+5 more)

### Community 31 - "wa"
Cohesion: 0.19
Nodes (7): Ba(), ki(), Ta(), update(), wa, za(), zs()

### Community 32 - "wa"
Cohesion: 0.19
Nodes (6): afterEvent(), Ba(), f(), Ta(), wa, za()

### Community 33 - "ro"
Cohesion: 0.16
Nodes (7): ao(), co(), Do(), inXRange(), inYRange(), ro(), Y()

### Community 34 - "f"
Cohesion: 0.12
Nodes (18): b(), cn(), eo(), et(), f(), g(), hn(), j() (+10 more)

### Community 35 - "oo"
Cohesion: 0.12
Nodes (6): ca, dt(), ga(), io(), no(), oo

### Community 36 - "ua"
Cohesion: 0.14
Nodes (9): beforeDatasetDraw(), beforeDatasetsDraw(), beforeDraw(), es(), generateLabels(), Ie(), Ni(), oa() (+1 more)

### Community 37 - ".isHorizontal"
Cohesion: 0.12
Nodes (4): bo, H(), Us(), Ys()

### Community 38 - "parse"
Cohesion: 0.15
Nodes (8): buildTicks(), determineDataLimits(), mo(), parse(), parseArrayData(), parsePrimitiveData(), po(), Vn()

### Community 39 - ".getProps"
Cohesion: 0.22
Nodes (12): average(), dataset(), getCenterPoint(), index(), nearest(), q(), s(), tooltipPosition() (+4 more)

### Community 40 - "jt"
Cohesion: 0.16
Nodes (3): color(), jt(), te()

### Community 41 - ".getDatasetMeta"
Cohesion: 0.21
Nodes (4): aa(), afterDatasetsUpdate(), onClick(), reset()

### Community 42 - ".buildOrUpdateControllers"
Cohesion: 0.18
Nodes (5): addElements(), kn(), qn(), removeBox(), stop()

### Community 43 - ".getContext"
Cohesion: 0.21
Nodes (4): Ae(), Bi(), Ci(), Fi()

### Community 45 - ".getDatasetMeta"
Cohesion: 0.23
Nodes (3): afterDatasetsUpdate(), da(), onClick()

### Community 47 - "m"
Cohesion: 0.21
Nodes (12): bi(), e(), hi(), m(), Pi(), Qe(), Ti(), u() (+4 more)

### Community 48 - "k"
Cohesion: 0.21
Nodes (12): F(), G(), j(), k(), me(), ne(), e(), Oe() (+4 more)

### Community 49 - "u"
Cohesion: 0.23
Nodes (6): addBox(), configure(), Nn(), start(), u(), wn()

### Community 52 - "m"
Cohesion: 0.21
Nodes (12): bi(), e(), hi(), m(), Pi(), Qe(), Ti(), u() (+4 more)

### Community 53 - "k"
Cohesion: 0.21
Nodes (12): F(), G(), j(), k(), me(), ne(), e(), Oe() (+4 more)

### Community 55 - "Jt"
Cohesion: 0.20
Nodes (11): Ae(), be(), Ie(), Jt(), ke(), Le(), O(), Qt() (+3 more)

### Community 56 - "Jt"
Cohesion: 0.20
Nodes (11): Ae(), be(), Ie(), Jt(), ke(), Le(), O(), Qt() (+3 more)

### Community 58 - "p"
Cohesion: 0.22
Nodes (10): De(), ei(), ii(), Je(), ni(), oi(), p(), pe() (+2 more)

### Community 59 - "p"
Cohesion: 0.22
Nodes (10): De(), ei(), ii(), Je(), ni(), oi(), p(), pe() (+2 more)

### Community 60 - "_t"
Cohesion: 0.28
Nodes (4): kt(), qt(), _t(), wt()

### Community 61 - "d"
Cohesion: 0.25
Nodes (9): at(), d(), ht(), i(), Li(), Mi(), v(), W() (+1 more)

### Community 62 - "d"
Cohesion: 0.25
Nodes (9): at(), d(), ht(), i(), Li(), Mi(), v(), W() (+1 more)

### Community 64 - "deploy.py"
Cohesion: 0.31
Nodes (5): deploy_frontend(), deploy_plugin(), Citibig Transit Dashboard - Automated Deployment Script Deploy local frontend…, upload_directory(), upload_file()

### Community 66 - "Citibig Transit Dashboard - Handoff Document"
Cohesion: 0.18
Nodes (10): sec-routes, sec-stations, Index UI, Citibig Transit Dashboard - Handoff Document, Key Directories, Project Context, References, Remote Hosting & Deployment Infrastructure (Verified via FTP) (+2 more)

### Community 67 - "Ft"
Cohesion: 0.32
Nodes (6): Bt(), Ft(), Gt(), It(), vt(), zt()

### Community 70 - "run_citibig_transit_dashboard"
Cohesion: 0.18
Nodes (3): run_citibig_transit_dashboard(), Citibig_Transit_Assets, Citibig_Transit_Shortcode

## Knowledge Gaps
- **11 isolated node(s):** `Key Directories`, `Remote Hosting & Deployment Infrastructure (Verified via FTP)`, `What Was Accomplished in the Current Session`, `References`, `Suggested Skills for the Next Agent` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 277 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tn` connect `tn` to `citibig-remote-app/assets/js/chart.js`, `ua`, `.isHorizontal`, `parse`, `s`, `ho`, `o`, `.getProps`, `.getContext`, `.getDatasetMeta`, `.update`, `sn`, `updateElements`, `u`, `So`, `i`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `tn` connect `tn` to `citibig-transit-dashboard/assets/js/chart.js`, `ho`, `s`, `.getDatasetMeta`, `.buildOrUpdateControllers`, `oo`, `jt`, `o`, `u`, `.getContext`, `i`, `updateElements`, `l`, `inRange`, `sn`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `h()` connect `s` to `citibig-remote-app/assets/js/leaflet.js`, `k`, `Jt`, `.getProps`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `s()` (e.g. with `beforeUpdate()` and `bs()`) actually correct?**
  _`s()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Key Directories`, `Remote Hosting & Deployment Infrastructure (Verified via FTP)`, `What Was Accomplished in the Current Session` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `citibig-transit-dashboard/assets/js/chart.js` be split into smaller, more focused modules?**
  _Cohesion score 0.03575076608784474 - nodes in this community are weakly interconnected._
- **Should `citibig-remote-app/assets/js/chart.js` be split into smaller, more focused modules?**
  _Cohesion score 0.03829113924050633 - nodes in this community are weakly interconnected._
# Graph Report - ترافیک تهران  (2026-10-07)

## Corpus Check
- 61 files · ~117,381 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 27 file(s) not represented in the graph (top: .woff2 9, .css 6, .woff 6)

## Summary
- 1963 nodes · 5170 edges · 92 communities (74 shown, 18 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 180 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `32dc259e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- citibig-transit-dashboard/assets/js/chart.js
- citibig-remote-app/assets/js/chart.js
- .update
- .update
- n
- l
- jt
- n
- jt
- ho
- oo
- draw
- xt
- ho
- ro
- xt
- tn
- o
- oo
- ro
- devices/page.tsx
- updateElements
- .getProps
- tn
- s
- s
- citibig-transit-dashboard/assets/js/leaflet.js
- citibig-remote-app/assets/js/leaflet.js
- public/js/leaflet.js
- sn
- sn
- package.json
- .update
- .update
- Citibig_Transit_DB
- e
- a
- ._computeLabelItems
- compilerOptions
- Citibig_Transit_API
- u
- .getDatasetMeta
- e
- a
- l
- o
- react
- toPersianDigits
- ._computeLabelItems
- update
- So
- .getDatasetMeta
- .draw
- .draw
- .notifyPlugins
- stations/page.tsx
- F
- run_citibig_transit_dashboard
- deploy.py
- api.ts
- hs
- hs
- F
- F
- Jt
- p
- d
- Citibig_Transit_Admin
- p
- d
- p
- سند انتقال کانتکست و وضعیت پروژه (HANDOFF.md)
- d
- bi
- bi
- StatusBadge.tsx
- bi
- .buildOrUpdateControllers
- Jt
- Jt
- سند انتقال کانتکست و وضعیت پروژه (HANDOFF.md)
- m
- m
- m
- oi
- oi
- next.config.mjs

## God Nodes (most connected - your core abstractions)
1. `tn` - 127 edges
2. `tn` - 127 edges
3. `n()` - 59 edges
4. `n()` - 59 edges
5. `s()` - 45 edges
6. `s()` - 45 edges
7. `Citibig_Transit_DB` - 34 edges
8. `o()` - 32 edges
9. `o()` - 32 edges
10. `i()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `دیپلوی به سرور` --references--> `deploy_plugin()`  [INFERRED]
  backend/README.md → Dump20260615/deploy.py
- `Jt()` --indirect_call--> `Ft()`  [INFERRED]
  Dump20260615/citibig-remote-app/assets/js/leaflet.js → Dump20260615/citibig-remote-app/assets/js/chart.js
- `Jt()` --indirect_call--> `qt()`  [INFERRED]
  Dump20260615/citibig-remote-app/assets/js/leaflet.js → Dump20260615/citibig-remote-app/assets/js/chart.js
- `Ee()` --indirect_call--> `O()`  [INFERRED]
  Dump20260615/citibig-remote-app/assets/js/chart.js → Dump20260615/citibig-remote-app/assets/js/leaflet.js
- `ri()` --indirect_call--> `si()`  [INFERRED]
  Dump20260615/citibig-remote-app/assets/js/chart.js → Dump20260615/citibig-remote-app/assets/js/leaflet.js

## Import Cycles
- None detected.

## Communities (92 total, 18 thin omitted)

### Community 0 - "citibig-transit-dashboard/assets/js/chart.js"
Cohesion: 0.04
Nodes (31): at(), b(), beforeUpdate(), buildLookupTable(), cn(), eo(), et(), getDecimalForValue() (+23 more)

### Community 1 - "citibig-remote-app/assets/js/chart.js"
Cohesion: 0.04
Nodes (29): at(), b(), beforeUpdate(), buildLookupTable(), cn(), eo(), et(), getDecimalForValue() (+21 more)

### Community 2 - ".update"
Cohesion: 0.07
Nodes (22): afterDraw(), afterEvent(), afterUpdate(), Ba(), Bi(), Ci(), configure(), Ee() (+14 more)

### Community 3 - ".update"
Cohesion: 0.08
Nodes (22): afterDraw(), afterEvent(), afterUpdate(), Ba(), Bi(), Ci(), configure(), Ee() (+14 more)

### Community 4 - "n"
Cohesion: 0.08
Nodes (8): Be(), fn(), g(), gn(), g(), n(), ne(), numeric()

### Community 5 - "l"
Cohesion: 0.09
Nodes (27): Bn(), _calculateBarIndexPixels(), _calculateBarValuePixels(), _getAxis(), _getAxisCount(), getFirstScaleIdForIndexAxis(), getLabelAndValue(), getLabelForValue() (+19 more)

### Community 6 - "jt"
Cohesion: 0.07
Nodes (13): ce(), color(), de, dt(), he(), It(), jt(), kt() (+5 more)

### Community 7 - "n"
Cohesion: 0.09
Nodes (7): Be(), fn(), gn(), n(), ne(), numeric(), xn()

### Community 8 - "jt"
Cohesion: 0.08
Nodes (12): ce(), color(), de, he(), It(), jt(), kt(), mt() (+4 more)

### Community 9 - "ho"
Cohesion: 0.09
Nodes (7): _generate(), _getTimestampsForTable(), ho(), init(), nt(), rn(), Vo()

### Community 10 - "oo"
Cohesion: 0.07
Nodes (24): beforeDatasetDraw(), beforeDatasetsDraw(), beforeDraw(), ca, draw(), ea(), fa(), fo() (+16 more)

### Community 11 - "draw"
Cohesion: 0.08
Nodes (29): ai(), average(), beforeDraw(), dataset(), draw(), fo(), getCenterPoint(), getMaxOverflow() (+21 more)

### Community 12 - "xt"
Cohesion: 0.10
Nodes (6): an(), as(), on, rs(), ts(), xt

### Community 13 - "ho"
Cohesion: 0.10
Nodes (6): _generate(), _getTimestampsForTable(), ho(), init(), nt(), rn()

### Community 14 - "ro"
Cohesion: 0.09
Nodes (11): ao(), co(), da(), Do(), getBasePixel(), inXRange(), inYRange(), Oe() (+3 more)

### Community 15 - "xt"
Cohesion: 0.10
Nodes (5): an(), as(), on, ts(), xt

### Community 16 - "tn"
Cohesion: 0.09
Nodes (5): es(), generateLabels(), Ie(), tn, ze()

### Community 17 - "o"
Cohesion: 0.10
Nodes (14): bs(), ct(), Fs(), ge(), is(), ks(), ms(), o() (+6 more)

### Community 18 - "oo"
Cohesion: 0.09
Nodes (19): beforeDatasetDraw(), beforeDatasetsDraw(), ca, ea(), fa(), ga(), ia(), io() (+11 more)

### Community 19 - "ro"
Cohesion: 0.10
Nodes (12): ao(), buildTicks(), co(), da(), Do(), getBasePixel(), inXRange(), inYRange() (+4 more)

### Community 20 - "devices/page.tsx"
Cohesion: 0.18
Nodes (23): lucide-react, DevicesPage(), EtaPage(), EtaRecord, RoutesPage(), AdvancedFilterBar(), AdvancedFilterBarProps, FilterField (+15 more)

### Community 21 - "updateElements"
Cohesion: 0.12
Nodes (19): aa(), Bn(), _calculateBarIndexPixels(), _calculateBarValuePixels(), _getAxis(), _getAxisCount(), getFirstScaleIdForIndexAxis(), getLabelAndValue() (+11 more)

### Community 22 - ".getProps"
Cohesion: 0.11
Nodes (23): ai(), average(), dataset(), getCenterPoint(), ha(), hi(), index(), inRange() (+15 more)

### Community 24 - "s"
Cohesion: 0.09
Nodes (18): beforeLayout(), bo, getRange(), Go(), H(), _i(), j(), ji() (+10 more)

### Community 25 - "s"
Cohesion: 0.10
Nodes (15): bo, getRange(), H(), _i(), ii(), ji(), label(), lo() (+7 more)

### Community 26 - "citibig-transit-dashboard/assets/js/leaflet.js"
Cohesion: 0.08
Nodes (6): a(), Ci(), l(), me(), x(), ze()

### Community 27 - "citibig-remote-app/assets/js/leaflet.js"
Cohesion: 0.08
Nodes (6): a(), Ci(), l(), me(), x(), ze()

### Community 28 - "public/js/leaflet.js"
Cohesion: 0.08
Nodes (6): a(), Ci(), l(), me(), x(), ze()

### Community 29 - "sn"
Cohesion: 0.13
Nodes (3): addElements(), en, sn

### Community 30 - "sn"
Cohesion: 0.13
Nodes (3): addElements(), en, sn

### Community 31 - "package.json"
Cohesion: 0.06
Nodes (31): autoprefixer, postcss, react-dom, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+23 more)

### Community 35 - "e"
Cohesion: 0.11
Nodes (20): Bt(), dn(), e(), ei(), fe(), Fs(), Ft(), gi() (+12 more)

### Community 36 - "a"
Cohesion: 0.13
Nodes (11): a(), determineDataLimits(), Di(), g(), g(), m(), p(), pi() (+3 more)

### Community 38 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 40 - "u"
Cohesion: 0.16
Nodes (5): addBox(), ke(), reset(), start(), u()

### Community 41 - ".getDatasetMeta"
Cohesion: 0.13
Nodes (6): afterDatasetsUpdate(), ko(), onClick(), ra(), removeBox(), stop()

### Community 42 - "e"
Cohesion: 0.13
Nodes (18): Bt(), dn(), e(), ei(), fe(), Ft(), gi(), Gt() (+10 more)

### Community 43 - "a"
Cohesion: 0.16
Nodes (8): a(), determineDataLimits(), Di(), pi(), r(), ri(), So, v()

### Community 44 - "l"
Cohesion: 0.16
Nodes (13): buildTicks(), l(), ii(), jn(), mo(), parse(), parseArrayData(), parseObjectData() (+5 more)

### Community 45 - "o"
Cohesion: 0.19
Nodes (8): bs(), ct(), ks(), ms(), o(), u(), i(), xs()

### Community 46 - "react"
Cohesion: 0.23
Nodes (11): next, react, DashboardLayout(), metadata, Header(), Sidebar(), clearSession(), getStoredSession() (+3 more)

### Community 47 - "toPersianDigits"
Cohesion: 0.22
Nodes (14): OverviewDashboardPage(), BarChartItem, BarChartWidget(), BarChartWidgetProps, DonutChartWidget(), DonutChartWidgetProps, KpiCard(), KpiCardProps (+6 more)

### Community 49 - "update"
Cohesion: 0.12
Nodes (13): beforeLayout(), es(), ge(), Go(), is(), ns(), os(), pe() (+5 more)

### Community 50 - "So"
Cohesion: 0.12
Nodes (4): dt(), j(), ko(), So

### Community 51 - ".getDatasetMeta"
Cohesion: 0.19
Nodes (5): aa(), afterDatasetsUpdate(), onClick(), ra(), reset()

### Community 52 - ".draw"
Cohesion: 0.20
Nodes (3): Ae(), Ie(), ze()

### Community 54 - ".notifyPlugins"
Cohesion: 0.24
Nodes (3): addBox(), ke(), start()

### Community 55 - "stations/page.tsx"
Cohesion: 0.29
Nodes (10): LoginPage(), StationsPage(), Button(), ButtonProps, Input(), InputProps, apiGetStations(), apiLogin() (+2 more)

### Community 56 - "F"
Cohesion: 0.21
Nodes (12): label(), F(), h(), j(), k(), ke(), ne(), e() (+4 more)

### Community 57 - "run_citibig_transit_dashboard"
Cohesion: 0.15
Nodes (3): run_citibig_transit_dashboard(), Citibig_Transit_Assets, Citibig_Transit_Shortcode

### Community 58 - "deploy.py"
Cohesion: 0.16
Nodes (11): Citibig Transit Dashboard - WordPress Backend Plugin, دیپلوی به سرور, ساختار و فایل‌ها, deploy_frontend(), deploy_next_frontend(), deploy_plugin(), get_ftp_connection(), load_env() (+3 more)

### Community 59 - "api.ts"
Cohesion: 0.31
Nodes (11): UsersPage(), StatusBadge(), apiCreateUser(), apiDeleteUser(), apiGetUsers(), DashboardChartsData, DeviceItem, getApiUrl() (+3 more)

### Community 62 - "F"
Cohesion: 0.24
Nodes (12): F(), G(), h(), j(), k(), ke(), ne(), e() (+4 more)

### Community 63 - "F"
Cohesion: 0.24
Nodes (12): F(), G(), h(), j(), k(), ke(), ne(), e() (+4 more)

### Community 64 - "Jt"
Cohesion: 0.20
Nodes (10): Ae(), be(), Ie(), Jt(), Le(), O(), Qt(), Re() (+2 more)

### Community 65 - "p"
Cohesion: 0.22
Nodes (10): De(), ei(), ii(), Je(), ni(), oi(), p(), pe() (+2 more)

### Community 66 - "d"
Cohesion: 0.25
Nodes (9): at(), d(), ht(), i(), Li(), Mi(), v(), W() (+1 more)

### Community 68 - "p"
Cohesion: 0.22
Nodes (9): Ae(), be(), De(), ei(), Ie(), ii(), p(), pe() (+1 more)

### Community 69 - "d"
Cohesion: 0.25
Nodes (9): at(), d(), ht(), i(), Li(), Mi(), v(), W() (+1 more)

### Community 70 - "p"
Cohesion: 0.22
Nodes (9): Ae(), be(), De(), ei(), Ie(), ii(), p(), pe() (+1 more)

### Community 71 - "سند انتقال کانتکست و وضعیت پروژه (HANDOFF.md)"
Cohesion: 0.33
Nodes (5): سند انتقال کانتکست و وضعیت پروژه (HANDOFF.md), ۱. خلاصه وضعیت کلی سیستم, ۲. دستاوردها و اقدامات تکمیل‌شده در این نشست, ۳. اطلاعات اعتبارسنجی و دسترسی‌ها, ۴. وظایف آتی و گام‌های بعدی پیشنهادی

### Community 72 - "d"
Cohesion: 0.25
Nodes (9): at(), d(), ht(), i(), Li(), Mi(), v(), W() (+1 more)

### Community 73 - "bi"
Cohesion: 0.25
Nodes (8): bi(), c(), e(), hi(), Pi(), Qe(), Ti(), u()

### Community 74 - "bi"
Cohesion: 0.25
Nodes (8): bi(), c(), e(), hi(), Pi(), Qe(), Ti(), u()

### Community 75 - "StatusBadge.tsx"
Cohesion: 0.29
Nodes (4): clsx, tailwind-merge, CardProps, StatusBadgeProps

### Community 76 - "bi"
Cohesion: 0.25
Nodes (8): bi(), c(), e(), hi(), Pi(), Qe(), Ti(), u()

### Community 78 - "Jt"
Cohesion: 0.29
Nodes (7): Jt(), Le(), O(), Qt(), Re(), $t(), te()

### Community 79 - "Jt"
Cohesion: 0.29
Nodes (7): Jt(), Le(), O(), Qt(), Re(), $t(), te()

### Community 80 - "سند انتقال کانتکست و وضعیت پروژه (HANDOFF.md)"
Cohesion: 0.33
Nodes (5): سند انتقال کانتکست و وضعیت پروژه (HANDOFF.md), ۱. خلاصه وضعیت کلی سیستم, ۲. دستاوردها و اقدامات تکمیل‌شده در این نشست, ۳. اطلاعات اعتبارسنجی و دسترسی‌ها, ۴. وظایف آتی و گام‌های بعدی پیشنهادی

### Community 81 - "m"
Cohesion: 0.60
Nodes (5): m(), ve(), xe(), ye(), z()

### Community 82 - "m"
Cohesion: 0.60
Nodes (5): m(), ve(), xe(), ye(), z()

### Community 83 - "m"
Cohesion: 0.60
Nodes (5): m(), ve(), xe(), ye(), z()

### Community 85 - "oi"
Cohesion: 0.67
Nodes (4): Je(), ni(), oi(), si()

### Community 86 - "oi"
Cohesion: 0.67
Nodes (4): Je(), ni(), oi(), si()

## Knowledge Gaps
- **71 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 352 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tn` connect `tn` to `citibig-remote-app/assets/js/chart.js`, `.update`, `e`, `a`, `._computeLabelItems`, `ho`, `o`, `.buildOrUpdateControllers`, `update`, `So`, `ro`, `.draw`, `.getDatasetMeta`, `.notifyPlugins`, `.getProps`, `s`, `sn`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `s()` (e.g. with `ao()` and `co()`) actually correct?**
  _`s()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `citibig-transit-dashboard/assets/js/chart.js` be split into smaller, more focused modules?**
  _Cohesion score 0.03526645768025078 - nodes in this community are weakly interconnected._
- **Why does `tn` connect `tn` to `citibig-transit-dashboard/assets/js/chart.js`, `.update`, `u`, `ho`, `.getDatasetMeta`, `a`, `l`, `draw`, `ro`, `e`, `._computeLabelItems`, `o`, `.draw`, `updateElements`, `s`, `sn`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `citibig-remote-app/assets/js/chart.js` be split into smaller, more focused modules?**
  _Cohesion score 0.038030095759233926 - nodes in this community are weakly interconnected._
- **Why does `n()` connect `n` to `citibig-transit-dashboard/assets/js/chart.js`, `.update`, `.update`, `u`, `ho`, `e`, `a`, `l`, `.getDatasetMeta`, `ro`, `xt`, `._computeLabelItems`, `o`, `oo`, `tn`, `updateElements`, `.draw`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
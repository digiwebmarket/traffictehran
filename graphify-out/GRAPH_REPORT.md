# Graph Report - ترافیک تهران  (2026-10-06)

## Corpus Check
- 59 files · ~117,926 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1922 nodes · 4584 edges · 108 communities (90 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `de1e3132`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 101|Community 101]]

## God Nodes (most connected - your core abstractions)
1. `_()` - 280 edges
2. `_()` - 280 edges
3. `tn` - 124 edges
4. `tn` - 124 edges
5. `_()` - 81 edges
6. `_()` - 81 edges
7. `_()` - 81 edges
8. `n()` - 56 edges
9. `n()` - 56 edges
10. `js` - 54 edges

## Surprising Connections (you probably didn't know these)
- `EtaPage()` --calls--> `toPersianDigits()`  [EXTRACTED]
  traffic-frontend/src/app/(dashboard)/eta/page.tsx → traffic-frontend/src/lib/utils.ts
- `RoutesPage()` --calls--> `toPersianDigits()`  [EXTRACTED]
  traffic-frontend/src/app/(dashboard)/routes/page.tsx → traffic-frontend/src/lib/utils.ts
- `StationsPage()` --calls--> `toPersianDigits()`  [EXTRACTED]
  traffic-frontend/src/app/(dashboard)/stations/page.tsx → traffic-frontend/src/lib/utils.ts
- `DevicesPage()` --calls--> `getStoredSession()`  [EXTRACTED]
  traffic-frontend/src/app/(dashboard)/devices/page.tsx → traffic-frontend/src/lib/auth.ts
- `DevicesPage()` --calls--> `toPersianDigits()`  [EXTRACTED]
  traffic-frontend/src/app/(dashboard)/devices/page.tsx → traffic-frontend/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (108 total, 18 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (63): DevicesPage(), EtaPage(), EtaRecord, Header(), Sidebar(), apiCreateUser(), apiDeleteDevice(), apiDeleteUser() (+55 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (47): _(), ai(), beforeLayout(), cn(), ct(), dn(), draw(), Ee() (+39 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (40): _(), at(), beforeLayout(), cn(), ct(), dn(), e(), ei() (+32 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (6): d(), Ie(), ke(), Ni(), Pn(), tn

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (4): d(), Pn(), tn, Y()

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (21): afterDraw(), afterEvent(), Ba(), g(), ki(), lo(), m(), o() (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (6): js, labelColor(), labelPointStyle(), Ls(), rt(), updateRangeFromParsed()

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (21): Bn(), _calculateBarIndexPixels(), _calculateBarValuePixels(), Fs(), _getAxis(), _getAxisCount(), getFirstScaleIdForIndexAxis(), getLabelAndValue() (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (8): _(), a(), Ae(), Ci(), l(), O(), Re(), x()

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (9): afterDraw(), afterEvent(), Ba(), f(), onClick(), Ta(), wa, wi() (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (8): _(), a(), Ae(), Ci(), l(), O(), Re(), x()

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (8): _(), a(), Ae(), Ci(), l(), O(), Re(), x()

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (9): at(), e(), fn(), gn(), lt(), n(), na(), xn() (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (10): color(), It(), jt(), kt(), mt(), qt(), _t(), te() (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (17): ao(), b(), co(), da(), Do(), eo(), getBasePixel(), ha() (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.10
Nodes (15): a(), Ae(), Di(), g(), j(), ko(), m(), o() (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (16): Bt(), color(), Ee(), Ft(), Gt(), It(), jt(), kt() (+8 more)

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (10): buildLookupTable(), _generate(), getDecimalForValue(), _getTimestampsForTable(), getValueForPixel(), ho(), initOffsets(), jo() (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (8): Ae(), getPixelForTick(), getPixelForValue(), _getRuler(), Gs(), ra(), Z(), zn()

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (3): js, rt(), updateRangeFromParsed()

### Community 20 - "Community 20"
Cohesion: 0.08
Nodes (19): Be(), bo, et(), getRange(), H(), _i(), j(), ji() (+11 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (5): aa(), afterDatasetsUpdate(), fn(), gn(), n()

### Community 22 - "Community 22"
Cohesion: 0.11
Nodes (18): buildTicks(), determineDataLimits(), draw(), fo(), getMaxOverflow(), ii(), jn(), l() (+10 more)

### Community 23 - "Community 23"
Cohesion: 0.10
Nodes (6): beforeUpdate(), en, initialize(), reset(), rn(), xn()

### Community 24 - "Community 24"
Cohesion: 0.13
Nodes (3): addElements(), sn, w()

### Community 25 - "Community 25"
Cohesion: 0.17
Nodes (7): afterUpdate(), ki(), Oi(), Qs(), Si(), ya, zs()

### Community 26 - "Community 26"
Cohesion: 0.14
Nodes (5): an(), as(), on, rs(), ts()

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (18): beforeDatasetDraw(), beforeDatasetsDraw(), beforeDraw(), ca, ea(), ei(), fa(), ga() (+10 more)

### Community 28 - "Community 28"
Cohesion: 0.13
Nodes (3): addElements(), sn, w()

### Community 29 - "Community 29"
Cohesion: 0.10
Nodes (10): Be(), bo, et(), H(), label(), ne(), numeric(), s() (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.08
Nodes (23): dependencies, clsx, lucide-react, next, react, react-dom, tailwind-merge, devDependencies (+15 more)

### Community 32 - "Community 32"
Cohesion: 0.16
Nodes (6): buildLookupTable(), _generate(), _getTimestampsForTable(), ho(), initOffsets(), nt()

### Community 33 - "Community 33"
Cohesion: 0.15
Nodes (15): aa(), Bn(), _calculateBarIndexPixels(), _calculateBarValuePixels(), _getAxis(), _getAxisCount(), getBasePixel(), getFirstScaleIdForIndexAxis() (+7 more)

### Community 34 - "Community 34"
Cohesion: 0.13
Nodes (4): buildTicks(), da(), mo(), ro()

### Community 35 - "Community 35"
Cohesion: 0.12
Nodes (5): addBox(), configure(), ke(), Ni(), start()

### Community 36 - "Community 36"
Cohesion: 0.13
Nodes (19): ai(), average(), dataset(), getCenterPoint(), hi(), index(), li(), lo() (+11 more)

### Community 37 - "Community 37"
Cohesion: 0.14
Nodes (14): beforeDatasetDraw(), beforeDatasetsDraw(), beforeDraw(), ca, ea(), fa(), ga(), ia() (+6 more)

### Community 38 - "Community 38"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 40 - "Community 40"
Cohesion: 0.16
Nodes (4): afterDatasetsUpdate(), kn(), onClick(), qn()

### Community 41 - "Community 41"
Cohesion: 0.16
Nodes (12): ao(), b(), co(), Do(), eo(), ha(), inXRange(), inYRange() (+4 more)

### Community 42 - "Community 42"
Cohesion: 0.24
Nodes (4): a(), determineDataLimits(), Di(), So

### Community 43 - "Community 43"
Cohesion: 0.24
Nodes (11): average(), dataset(), getCenterPoint(), index(), inRange(), nearest(), tooltipPosition(), Ui() (+3 more)

### Community 45 - "Community 45"
Cohesion: 0.21
Nodes (5): Bi(), Ci(), cs, f(), Fi()

### Community 46 - "Community 46"
Cohesion: 0.23
Nodes (9): ii(), l(), parse(), parseArrayData(), parseObjectData(), parsePrimitiveData(), po(), resolveDataElementOptions() (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.21
Nodes (4): Bi(), Ci(), cs, Fi()

### Community 48 - "Community 48"
Cohesion: 0.16
Nodes (3): Ie(), Us(), Ys()

### Community 49 - "Community 49"
Cohesion: 0.26
Nodes (4): ce(), de, dt(), he()

### Community 50 - "Community 50"
Cohesion: 0.17
Nodes (3): init(), rn(), Vo()

### Community 51 - "Community 51"
Cohesion: 0.21
Nodes (4): io(), no(), oo, zi()

### Community 52 - "Community 52"
Cohesion: 0.26
Nodes (4): ce(), de, dt(), he()

### Community 53 - "Community 53"
Cohesion: 0.21
Nodes (4): io(), no(), oo, zi()

### Community 54 - "Community 54"
Cohesion: 0.18
Nodes (6): kn(), ln(), qn(), removeBox(), stop(), un()

### Community 58 - "Community 58"
Cohesion: 0.29
Nodes (6): deploy_frontend(), deploy_next_frontend(), deploy_plugin(), Citibig Transit Dashboard - Automated Deployment Script Deploy local frontend o, upload_directory(), upload_file()

### Community 59 - "Community 59"
Cohesion: 0.22
Nodes (6): addBox(), beforeUpdate(), configure(), initialize(), reset(), start()

### Community 60 - "Community 60"
Cohesion: 0.22
Nodes (3): getDecimalForValue(), getValueForPixel(), jo()

### Community 62 - "Community 62"
Cohesion: 0.31
Nodes (9): at(), be(), d(), m(), ve(), W(), xe(), ye() (+1 more)

### Community 64 - "Community 64"
Cohesion: 0.31
Nodes (9): at(), be(), d(), m(), ve(), W(), xe(), ye() (+1 more)

### Community 66 - "Community 66"
Cohesion: 0.31
Nodes (9): at(), be(), d(), m(), ve(), W(), xe(), ye() (+1 more)

### Community 67 - "Community 67"
Cohesion: 0.32
Nodes (5): Bt(), Ft(), Gt(), vt(), zt()

### Community 71 - "Community 71"
Cohesion: 0.25
Nodes (7): Citibig Transit Dashboard - Handoff Document, Key Directories, Project Context, References, Remote Hosting & Deployment Infrastructure (Verified via FTP), Suggested Skills for the Next Agent, What Was Accomplished in the Current Session

### Community 72 - "Community 72"
Cohesion: 0.29
Nodes (7): F(), h(), Jt(), ke(), ne(), p(), s()

### Community 73 - "Community 73"
Cohesion: 0.33
Nodes (7): G(), k(), me(), Oe(), Se(), te(), ze()

### Community 75 - "Community 75"
Cohesion: 0.29
Nodes (7): F(), h(), Jt(), ke(), ne(), p(), s()

### Community 76 - "Community 76"
Cohesion: 0.33
Nodes (7): G(), k(), me(), Oe(), Se(), te(), ze()

### Community 77 - "Community 77"
Cohesion: 0.29
Nodes (7): F(), h(), Jt(), ke(), ne(), p(), s()

### Community 78 - "Community 78"
Cohesion: 0.33
Nodes (7): G(), k(), me(), Oe(), Se(), te(), ze()

### Community 79 - "Community 79"
Cohesion: 0.40
Nodes (5): c(), e(), hi(), q(), Qe()

### Community 80 - "Community 80"
Cohesion: 0.40
Nodes (5): c(), e(), hi(), q(), Qe()

### Community 81 - "Community 81"
Cohesion: 0.40
Nodes (5): c(), e(), hi(), q(), Qe()

### Community 82 - "Community 82"
Cohesion: 0.50
Nodes (4): bi(), Pi(), Ti(), u()

### Community 83 - "Community 83"
Cohesion: 0.67
Nodes (4): Je(), ni(), oi(), si()

### Community 84 - "Community 84"
Cohesion: 0.50
Nodes (4): bi(), Pi(), Ti(), u()

### Community 85 - "Community 85"
Cohesion: 0.67
Nodes (4): Je(), ni(), oi(), si()

### Community 89 - "Community 89"
Cohesion: 0.50
Nodes (4): bi(), Pi(), Ti(), u()

### Community 90 - "Community 90"
Cohesion: 0.67
Nodes (4): Je(), ni(), oi(), si()

### Community 94 - "Community 94"
Cohesion: 0.67
Nodes (3): ei(), ii(), ri()

### Community 95 - "Community 95"
Cohesion: 0.67
Nodes (3): i(), Mi(), zi()

### Community 96 - "Community 96"
Cohesion: 0.67
Nodes (3): ei(), ii(), ri()

### Community 97 - "Community 97"
Cohesion: 0.67
Nodes (3): i(), Mi(), zi()

### Community 98 - "Community 98"
Cohesion: 0.67
Nodes (3): ei(), ii(), ri()

### Community 99 - "Community 99"
Cohesion: 0.67
Nodes (3): i(), Mi(), zi()

## Knowledge Gaps
- **60 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_()` connect `Community 1` to `Community 3`, `Community 5`, `Community 6`, `Community 12`, `Community 13`, `Community 18`, `Community 20`, `Community 24`, `Community 26`, `Community 27`, `Community 32`, `Community 33`, `Community 34`, `Community 40`, `Community 41`, `Community 42`, `Community 43`, `Community 45`, `Community 46`, `Community 49`, `Community 50`, `Community 51`, `Community 55`, `Community 56`, `Community 59`, `Community 60`, `Community 61`, `Community 67`, `Community 68`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `_()` connect `Community 2` to `Community 4`, `Community 7`, `Community 9`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 19`, `Community 21`, `Community 22`, `Community 23`, `Community 25`, `Community 28`, `Community 29`, `Community 35`, `Community 36`, `Community 37`, `Community 44`, `Community 47`, `Community 48`, `Community 52`, `Community 53`, `Community 54`, `Community 57`, `Community 63`, `Community 69`, `Community 70`, `Community 74`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `tn` connect `Community 3` to `Community 1`, `Community 34`, `Community 33`, `Community 68`, `Community 5`, `Community 40`, `Community 42`, `Community 43`, `Community 45`, `Community 46`, `Community 18`, `Community 20`, `Community 56`, `Community 24`, `Community 27`, `Community 60`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `Citibig Transit Dashboard - Automated Deployment Script Deploy local frontend o`, `nextConfig`, `name` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0616729088639201 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.036735922914784704 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.038295038295038296 - nodes in this community are weakly interconnected._
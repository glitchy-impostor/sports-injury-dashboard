# 🤕 Injury Risk Per Minute — Across Professional Sports

**TL;DR:** Bull riders face more injury risk in 8 seconds than swimmers do in an entire competition. This dashboard lets you explore just how unhinged that gap really is.

---

## 🐂 What Is This?

An interactive data visualization dashboard that answers a simple question:

> **If you step onto a field / court / ring / bull right now, how likely are you to get hurt in the next 60 seconds?**

Turns out the answer ranges from "basically guaranteed" (bull riding) to "you're probably fine" (swimming), with a **1,440× spread** between the two. Combat sports, unsurprisingly, occupy their own terrifying tier.

## 📊 What's Inside

Seven interactive views built with React + Recharts:

| Tab | What It Shows |
|-----|--------------|
| **Per 1,000 Hours** | The classic epidemiological metric, log-scaled |
| **Per Minute** | The fun one — raw probability of injury per minute of play |
| **Body Parts** | Where injuries land (spoiler: boxers break heads, soccer players break legs) |
| **Severity** | Minor vs. moderate vs. "you're out for months" |
| **Risk Matrix** | Scatter plot of rate × severity — the true danger quadrant |
| **Raw Data** | Full table with sources for the skeptics |
| **Methods** | Honest discussion of why cross-sport comparison is messy |

## 🔬 The Data

All injury rates sourced from peer-reviewed epidemiological research:

- **British Journal of Sports Medicine** — meta-analyses on soccer, boxing, MMA
- **NFL Injury Surveillance System** — via the Harvard Football Players Health Study
- **Nature Scientific Reports** — 13-season trend analysis across MLB, NBA, NFL, NHL
- **Clinical Journal of Sport Medicine** — bull riding and extreme sports

Rates are normalized to **match/competition hours only** (training rates are 5-10× lower across the board).

### Some Highlights That'll Make You Wince

- 🥊 Boxing competition: **1,081 injuries per 1,000 hours** (~1 injury per minute of bout time)
- 🏈 NFL game injury rate is **4-5× higher** than NBA, NHL, and MLB
- 🧠 **71% of boxing injuries** hit the head and neck
- 🏉 Rugby league clocks in at **825/1000h** — and that's semi-professional
- ⚾ Baseball is the safest of the Big 4 at just 3.61/1000 AEs (still not zero though)

## 🚀 Run It

```bash
npm install
npm run dev
```

## 🌐 Deploy to GitHub Pages

Update the `base` in `vite.config.js` to your repo name, then:

```bash
npm run deploy
```

Enable Pages from the `gh-pages` branch in your repo settings and you're live.

## ⚠️ Caveats (The Honest Part)

This is a fun analysis project, not a peer-reviewed publication. Some real limitations:

1. **Injury definitions vary wildly** between studies — "time-loss" vs "medical attention" vs "any complaint" all produce different numbers
2. **Denominators aren't standardized** — athlete-exposures ≠ hours ≠ bouts, and converting between them introduces noise
3. **Severity data is approximate** — pulled from the closest available meta-analysis per sport, not a single unified dataset
4. **Combat sport rates look inflated** relative to team sports partly because bouts are short and injury-dense by nature

The methodology tab in the dashboard goes deeper on all of this.

## 🛠 Built With

- **React 18** + **Vite**
- **Recharts** for all visualizations
- **JetBrains Mono** because monospace makes data look cooler
- ☕ and an unhealthy amount of BJSM papers

---

*Built for fun, not for medical advice. If you're choosing a sport based on this dashboard, maybe just go swimming.* 🏊

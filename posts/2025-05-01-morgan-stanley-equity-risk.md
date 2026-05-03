---
layout: post
title: "Building Software for Equity Risk at Morgan Stanley"
author: "Dulanga Jayawardena"
categories: profile
category: Work
subtitle: Morgan Stanley
tags: [Java, Kafka, KDB+, Spring Boot, Risk]
image: dulanga-jayawardena-icc-2022.jpeg
read_time: 6
---

On the Equity Risk Technology team, I built the global services and pipelines traders and risk managers used to monitor exposure and PnL across the equity book in real time. A large part of the role was extending the platform to support new product classes across multiple asset types — each with its own pricing, booking, and regulatory quirks. The work spanned backend development, product onboarding, automation, a prod-parallel overhaul, and L3 on-call rotation across all four global regions.

Rather than list every project, what follows is three stories — a product problem, a migration, and a design tradeoff, with some details scrubbed.

---

## Stack & Scope

- **Languages in production:** Java (Spring Boot), Python, C#, KDB+, Bash
- **Infra:** Kafka, MQ, REST, SQL, Jenkins
- **Coverage:** L3 on-call across four global regions
- **Cross-functional reach:** Traders, risk managers, product owners, legal, and partner dev teams across eight regions
- **Mentorship:** Onboarded new joiners, ran knowledge-sharing sessions, built the team's documentation hub

---

## A product problem

Non-technical staff regularly needed to extract product data from a compressed internal format. Every time, they would wait for a developer to run CLI commands across multiple systems; a bottleneck that added long turnaround times, and pulled engineers away from higher-value work.

Nobody had asked for a fix. I realized we could automate this using a legacy CLI tool that had fallen out of use, and rebuilt it with a user-friendly interface that let business users self-serve. **Turnaround time dropped by 80%**, developer interruptions for this class of request went to near zero, and the tool stayed in near-daily use.

Some of the highest-value work isn't on any roadmap, but instead in the gap between what users need and what they've learned to work around.

---

## A migration that needed a reconciliation harness

We ran a multi-quarter overhaul of a pricing model. We were worried about tiny bugs that would not show up in testing, but would affect calculations in production. We needed daily, automated, book-wide comparison between legacy and new before any cutover.

The two environments were intentionally isolated, which meant the comparison window was narrow and the harness had to run unattended every morning.

I wrote a Bash harness that orchestrated the comparison across both sides, normalized the outputs, and produced a daily diff with per-metric thresholds. It caught **more than ten critical issues** before any of them touched production. By cutover the diffs had been clean for weeks.

---

## A design tradeoff: prod-parallel fidelity vs. isolation

For several years I was the SME for the prod-parallel environment, which was a negotiation between two requirements that pull in opposite directions: the environment only earns its keep if it behaves enough like production to be trustworthy, but it has to be isolated enough that nothing real can leak through.

The clearest case was the re-architecture I led. The legacy bring-up process was manual, error-prone, and a recurring source of false differences — discrepancies that looked like bugs but were actually config drift. I automated it end-to-end, matching production configuration wherever fidelity demanded it and introducing deliberate, logged divergence only where isolation required it. The payoff: **startup time cut roughly in half**, **four hours of recurring manual work eliminated each month**, and — more importantly — confidence that when the two environments disagreed, the disagreement was worth investigating.

The principle I took from it: anywhere you can't audit a divergence, you've created a class of phantom bugs that will quietly consume your team's time forever.

---

## A few smaller things worth mentioning

- **New product class onboarding.** Built support for new product types in the risk pipeline that encompassed all equity products.
- **Cross-regional one-click trading workflow.** Coordinated traders, developers, and legal across three regions to ship a regulatory-compliant booking flow — **steps cut by 50%, processing time by 80%**.
- **QA cleanup utility.** Replaced an 8+ step manual process across multiple CLI systems with a one-step GUI interface — **manual effort reduced by 95%**.
- **CI/CD migration.** Led the transition of team systems to the firm's new CI/CD infrastructure, designing reusable templates and tracking dashboards to drive consistent adoption across the team.

---

*Outside the core engineering work, I co-chaired Morgan Stanley's CodeClub, running coding workshops for underprivileged kids in partnership with the Zubin Foundation and Kids4Kids, and served as Communications Officer for the Multicultural Alliance.*

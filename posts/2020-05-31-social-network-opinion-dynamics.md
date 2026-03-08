---
layout: post
title: "Simulating the Spread of Opinions in Social Networks"
author: "Dulanga Jayawardena"
categories: projects
category: Research
subtitle: "Research · CUHK"
tags: [Python, NumPy, NetworkX, Research]
image: leaves.jpeg
read_time: 7
link: https://github.com/dulangaj/Modelling-and-Simulating-Opinion-Dynamics-in-Social-Networks
---

How do opinions spread through social networks? This project explored that question using two well-known models in opinion dynamics: **DeGroot** (linear) and **Bounded Confidence** (non-linear), and proposed a new influence-based self-appraisal mechanism to overcome some of the limitations in existing approaches.

The study combined simulations, mathematical modeling, and real-world social network data to understand how network structure and individual influence shape group consensus — or the lack of it.

---

## Why It Matters

In the era of social media, information and misinformation spread rapidly, influencing everything from public health to political outcomes. Understanding how opinions evolve within social networks is critical for anticipating these dynamics and designing better information ecosystems.

We modeled social networks as graphs: nodes represent individuals, edges represent social connections, and opinions evolve based on interactions with neighbors.

---

## DeGroot Model — Linear Consensus

Each agent adjusts their opinion by averaging the opinions of their neighbors. Over time, opinions converge to a group consensus. A self-appraisal mechanism (from Friedkin) allows individuals to gradually place more weight on their own previous influence.

Well-connected individuals accumulate more influence over time, and network topology strongly affects how quickly consensus is reached:

| Network Type | Time to Consensus (100 nodes) |
| ------------- | ----------------------------- |
| Line          | 14,654 iterations |
| Ring          | 4,043 iterations |
| Star          | 12 iterations |
| Random        | 33 iterations |
| SBM (Stochastic Block Model) | 50 iterations |

---

## Bounded Confidence Model — Non-linear Clustering

Agents only consider neighbors whose opinions are within a certain threshold difference (𝜏). Instead of universal consensus, this leads to clusters of like-minded agents.

Lower thresholds create multiple stable opinion clusters. The final opinion distribution depends heavily on initial opinions and network structure:

| Network Type | Time to Consensus (𝜏=1, 100 nodes) |
| ------------- | ----------------------------- |
| Line          | 9,861 iterations |
| Ring          | 2,803 iterations |
| Star          | 11 iterations |
| Random        | 24 iterations |
| SBM           | 30 iterations |

---

## A New Approach: Influence-Based Self-Appraisal

A major limitation of the Friedkin self-appraisal model is its reliance on static network structure to determine self-confidence. This project proposed a **dynamic influence-based self-appraisal**, where agents adjust their self-confidence based on how much their previous opinions contributed to final group outcomes.

The result: more realistic adaptation of self-confidence based on actual influence, where power doesn't automatically flow to highly connected agents. However, original opinions still impact long-term self-confidence.

---

## Real-World Validation

The simulations used both synthetic networks (line, ring, star, random, SBM) and real-world Facebook friendship networks from the [KONECT dataset](http://konect.uni-koblenz.de/networks/facebook-wosn-links), providing more realistic topology for opinion dynamics studies.

---

## Takeaways

No single model fully explains the complex ways opinions spread in the real world. But this project compared linear and non-linear models across multiple network types, proposed a new dynamic self-appraisal mechanism that better reflects real-world social behavior, and highlighted the powerful role network structure plays in consensus formation.

As opinion dynamics research grows increasingly relevant in our hyperconnected world, combining multiple models may offer the most accurate understanding of how opinions actually spread — online and offline.

---

Full source code and report on [GitHub](https://github.com/dulangaj/Modelling-and-Simulating-Opinion-Dynamics-in-Social-Networks).
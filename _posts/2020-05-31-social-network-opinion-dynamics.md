---
layout: post
title: "Simulating the Spread of Opinions in Social Networks"
author: "Dulanga Jayawardena"
categories: projects
tags: [projects, python]
image: leaves.jpeg
---

# Simulating the Spread of Opinions in Social Networks

## Overview

This project explored how opinions spread through social networks using two well-known models in opinion dynamics: **DeGroot** (linear) and **Bounded Confidence** (non-linear). The project also proposed a new influence-based self-appraisal mechanism to overcome some of the limitations in existing models.

The study combined simulations, mathematical modeling, and real-world social network data to better understand how factors like network structure and individual influence shape group consensus—or the lack of it.

---

## The Problem

In the era of social media, information and misinformation spread rapidly, influencing everything from public health to political outcomes. Understanding how opinions evolve within social networks is critical for anticipating these dynamics and designing better information ecosystems.

This project modeled social networks as graphs where:

- Nodes represent individuals ("agents")
- Edges represent social connections
- Opinions evolve based on interactions with neighbors

---

## Models Explored

### 1️⃣ DeGroot Model (Linear Consensus)

- Each agent adjusts their opinion by averaging the opinions of their neighbors.
- Over time, opinions converge to a group consensus.
- A self-appraisal mechanism (from Friedkin) allows individuals to gradually place more weight on their own previous influence.

**Key finding:**  
Well-connected individuals accumulate more influence over time, and network topology strongly affects how quickly consensus is reached.

| Network Type | Time to Consensus (100 nodes) |
| ------------- | ----------------------------- |
| Line          | 14,654 iterations |
| Ring          | 4,043 iterations |
| Star          | 12 iterations |
| Random        | 33 iterations |
| SBM (Stochastic Block Model) | 50 iterations |

---

### 2️⃣ Bounded Confidence Model (Non-linear Clustering)

- Agents only consider neighbors whose opinions are within a certain threshold difference (𝜏).
- Leads to clusters of like-minded agents instead of universal consensus.

**Key finding:**  
Lower thresholds create multiple stable opinion clusters. The final opinion distribution depends heavily on initial opinions and network structure.

| Network Type | Time to Consensus (𝜏=1, 100 nodes) |
| ------------- | ----------------------------- |
| Line          | 9,861 iterations |
| Ring          | 2,803 iterations |
| Star          | 11 iterations |
| Random        | 24 iterations |
| SBM           | 30 iterations |

---

## Proposed Improvement: Influence-Based Self-Appraisal

A major limitation of the Friedkin self-appraisal model is its reliance on static network structure (number of connections) to determine self-confidence. This project proposed a **dynamic influence-based self-appraisal**, where agents adjust their self-confidence based on how much their previous opinions contributed to final group outcomes.

**Result:**  
- More realistic adaptation of self-confidence based on actual influence.
- Power doesn't automatically flow to highly connected agents.
- However, original opinions still impact long-term self-confidence.

---

## Real-World Data

The simulations used both synthetic networks (line, ring, star, random, SBM) and real-world Facebook friendship networks from the [KONECT dataset](http://konect.uni-koblenz.de/networks/facebook-wosn-links), providing more realistic topology for opinion dynamics studies.

---

## Conclusion

No single model fully explains the complex ways in which opinions spread in the real world. However, this project:

- Compared linear and non-linear models across multiple network types.
- Proposed a new dynamic self-appraisal mechanism that better reflects real-world social behavior.
- Highlighted the powerful role network structure plays in both speeding up or slowing down consensus formation.

As opinion dynamics research grows increasingly relevant in our hyperconnected world, combining multiple models may offer the most accurate understanding of how opinions actually spread online and offline.

---

# 🔗 Repository
Check out the full source code and report on [GitHub](https://github.com/dulangaj/Modelling-and-Simulating-Opinion-Dynamics-in-Social-Networks).
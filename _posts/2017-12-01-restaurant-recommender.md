---
layout: post
title: "Restaurant Recommender — Data-Driven Restaurant Discovery"
author: "Dulanga Jayawardena"
categories: [projects, blog]
year: 2018
summary: "Data product that lets students tune their own scoring model while scraping live OpenRice data."
outcome: "Surfaced hidden-gem ramen spots and informed a cuisine-gap report for CUHK neighborhoods."
tags: [Data, Python, Visualization]
image: pilpil.jpeg
image_alt: "Close up of ramen bowls on a wood table"
featured: true
---

## 📝 Project Overview

**Restaurant Analyzer** started as a university project, but ended up being something my friends and I genuinely used while studying in Hong Kong. The tool allowed us to search for restaurants on OpenRice (Hong Kong's equivalent to Yelp) — but with a twist: instead of relying on the platform’s default algorithm, users could **customize** how much different factors (price, distance, ratings, bad review ratios, etc.) influenced their search results.

With full control over search weightings, the tool made restaurant hunting more data-driven and personalized — and it even led us to discover some of our favorite hidden gems, including [Amazing Ramen](https://www.openrice.com/en/hongkong/r-amazing-ramen-tai-po-japanese-ramen-r192373) -- a hidden gem back then, tucked deep in a far away alley.

---

## 🔬 Study & Findings

As part of the project, we also analyzed real-world restaurant data to explore how pricing and ratings actually correlated in Hong Kong’s restaurant scene. 

- Customer satisfaction tended to increase with price — but only up to around **HK$100 per person**. Beyond that point, satisfaction plateaued, suggesting diminishing returns at higher price points.

- Analysis across districts (Sha Tin, Mong Kok, TST, CUHK area) revealed significant gaps in certain cuisine types, which led us to propose business opportunities in underserved areas — such as Japanese restaurants near CUHK.
![Japanese Restaurant Heatmap](/assets/img/17.12_heatmap.png)

We used multiple data visualizations including scatter plots, heatmaps, histograms, and pie charts to better understand pricing, popularity, cuisine diversity, and geographic gaps across districts.

---

## 🔧 Technical Highlights

- Built web scraping & data collection scripts to pull live data from OpenRice.
- Designed a customizable scoring algorithm allowing users to define their own weightings across multiple search factors.
- Modeled correlations between price, rating, and customer satisfaction.
- Analyzed real-world restaurant trends using both synthetic data queries and live scraped data.
- Packaged the tool into a real-world system that my friends and I actively used during university.

---

## 🎯 Real-World Outcome

- The tool successfully helped us identify great-value restaurants that we would have never discovered through default OpenRice searches.
- Using aggressive weighting schemes allowed us to unearth highly rated but lesser-known restaurants tucked away from main areas.
- Our "hidden gem" favorite — found through the tool — remained a mainstay in our dining until graduation.

---

## 🔗 Repository

Check out the full source code on [GitHub](https://github.com/RiceProjectTeam/RestaurantAnalyzer).
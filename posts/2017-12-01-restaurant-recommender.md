---
layout: post
title: "Restaurant Recommender — Data-Driven Restaurant Discovery"
author: "Dulanga Jayawardena"
categories: projects
category: Engineering
subtitle: Academic Project
tags: [Python, Tkinter, Machine Learning, Collaborative Filtering]
image: pilpil.jpeg
read_time: 5
link: https://github.com/RiceProjectTeam/RestaurantAnalyzer
---

**Restaurant Analyzer** started as a university project, but ended up being something my friends and I genuinely used while studying in Hong Kong. The tool allowed us to search for restaurants on OpenRice (Hong Kong’s equivalent to Yelp) — but with a twist: instead of relying on the platform’s default algorithm, users could **customize** how much different factors (price, distance, ratings, bad review ratios, etc.) influenced their search results.

With full control over search weightings, the tool made restaurant hunting more data-driven and personalized — and it even led us to discover some of our favorite hidden gems, including [Amazing Ramen](https://www.openrice.com/en/hongkong/r-amazing-ramen-tai-po-japanese-ramen-r192373), tucked deep in a far away alley.

---

## What the Data Told Us

We analyzed real-world restaurant data to explore how pricing and ratings actually correlated in Hong Kong’s restaurant scene.

Customer satisfaction tended to increase with price — but only up to around **HK$100 per person**. Beyond that point, satisfaction plateaued, suggesting diminishing returns at higher price points.

Analysis across districts (Sha Tin, Mong Kok, TST, CUHK area) revealed significant gaps in certain cuisine types, which led us to propose business opportunities in underserved areas — such as Japanese restaurants near CUHK.

![Japanese Restaurant Heatmap](/assets/img/17.12_heatmap.png)

We used scatter plots, heatmaps, histograms, and pie charts to better understand pricing, popularity, cuisine diversity, and geographic gaps across districts.

---

## How It Works

- Web scraping scripts pull live data from OpenRice.
- A customizable scoring algorithm lets users define their own weightings across multiple search factors.
- Correlations between price, rating, and customer satisfaction are modeled and visualized.
- The whole thing is packaged into a usable tool — not just an academic exercise.

---

## Did It Actually Work?

The tool helped us identify great-value restaurants we would have never discovered through default OpenRice searches. Aggressive weighting schemes unearthed highly rated but lesser-known spots tucked away from main areas. Our "hidden gem" favorite — found through the tool — remained a mainstay in our dining until graduation.

---

Check out the full source code on [GitHub](https://github.com/RiceProjectTeam/RestaurantAnalyzer).
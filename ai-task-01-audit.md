Here is the purely descriptive English prompt, completely stripped of any repair directions or technical hints, ready for your local AI agent:

Role: Senior Front-End Developer (Nuxt 4 + Vue 3 + Nuxt Content v3)

Context: The project is a Data-Driven Nuxt 4 blog system. I need you to address the following bugs, implement a new feature, and write documentation based strictly on the observed behaviors described below. Do not rely on previous assumptions; analyze these exact phenomena.

Bug Reports:

Bug 1: TOC Disappears on Client-Side Navigation

Observed Behavior: The previous TOC bug persists. When switching between pages via client-side routing, the right-side Table of Contents (TOC) disappears. However, manually refreshing the page (F5) makes the TOC appear correctly.

Performance Note: Testing reveals that client-side page switching takes only about 8ms, whereas a full page refresh takes around 100ms. This significant time discrepancy suggests that the right sidebar's calculation/rendering logic is being entirely skipped during the fast client-side navigation.

Bug 2: Layout Flashing (FOUC) on Browser Back Navigation

Observed Behavior: When navigating back from an external webpage using the browser's "Back" button, the previous 404 error no longer occurs. However, the page now exhibits a severe visual flash. For a brief moment, the page layout appears completely broken, messy, and unstyled before finally snapping into the correct format. This flashing behavior must be eliminated entirely for all pages moving forward.

Feature Request:

Feat 1: Optional Custom Background Images for Homepage Cards

Requirement: I want the ability to set custom background images for individual article cards on the homepage.

Constraints: This custom background image must be optional. If an article does not have a custom image specified, the card must seamlessly fall back to using the current default background. Any image assets added for this feature must be placed in accordance with standard Nuxt project structure conventions.

Documentation Task:

Docs 1: Series Configuration Guide

Requirement: Write a comprehensive markdown guide explaining exactly how to add and configure "Series" articles in this data-driven architecture.

Target File: Save this guide specifically to content/blog-settings/publish-series-article.md.

Specific Focus: I noticed that some homepage cards display a <span class="card-badge">Series</span> badge, but it is currently unclear where or how this is triggered. The guide must provide a detailed, step-by-step explanation of how to set up the data/frontmatter so this badge appears correctly.
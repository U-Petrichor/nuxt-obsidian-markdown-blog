🐛 Bug Fix & Feature Request: TOC Sidebar & Scroll Tracking
[Context]
After adding more complex Markdown content to the pages, the right-side Table of Contents (TOC) sidebar has stopped functioning correctly.

[Mission]
I need you to debug, fix, and enhance the TOC sidebar component.

[Acceptance Criteria & Technical Directives]

Data Fetching (Nuxt Content v3 API)

Retrieve the TOC data (specifically h1, h2, and h3 tags). In Nuxt Content v3, this is usually available inside the AST object (page.value.body.toc) or through the collection schema. Ensure the data extraction logic handles empty or malformed TOCs gracefully without crashing.

Hierarchical Rendering (Vue 3)

Render the TOC links with clear visual hierarchy. Use nested <ul>/<li> structures or CSS padding left (pl-4, pl-8, etc.) based on the heading depth.

Active Scroll Tracking (Intersection Observer)

Implement scroll tracking so the sidebar highlights the heading currently being read.

Mandatory Approach: Use the native IntersectionObserver API in an onMounted hook to observe the heading DOM elements (h1, h2, h3 inside the markdown container). Do NOT use simple window.addEventListener('scroll') as it causes performance bottlenecks.

Maintain a reactive state (e.g., const activeId = ref('')) that updates when a heading intersects with the viewport's top margin.

Bind an .active CSS class to the corresponding TOC link based on activeId.

Smooth Scrolling (Optional but recommended)

When a user clicks a TOC link, the page should scroll smoothly to the target heading (scroll-behavior: smooth).


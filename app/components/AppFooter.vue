<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer-inner">
      <p class="footer-brand">
        Petrichor
      </p>
      <p class="footer-meta">
        © {{ year }} · Blog & Series Docs
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--border-color);
  background: var(--surface);
  backdrop-filter: blur(14px);
}

.app-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.footer-brand {
  margin: 0;
  font-weight: 800;
  color: var(--text-primary);
}

.footer-meta {
  margin: 0;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .app-footer-inner {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

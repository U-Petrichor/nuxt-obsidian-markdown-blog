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

<style scoped src="~/assets/styles/components/app-footer.css"></style>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { categories } from './content/categories'
</script>

<template>
  <UApp>
    <header class="sticky top-0 z-50 border-b border-default bg-default/75 backdrop-blur">
      <UContainer class="flex h-16 items-center justify-between gap-4">
        <RouterLink to="/" class="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight">
          <UIcon name="i-lucide-dices" class="size-6 text-primary" />
          Table Notes
        </RouterLink>
        <nav class="flex items-center gap-1 overflow-x-auto">
          <UButton
            v-for="c in categories"
            :key="c.id"
            :to="{ name: 'category', params: { category: c.id } }"
            :icon="c.icon"
            color="neutral"
            variant="ghost"
            size="sm"
          >
            <span class="hidden sm:inline">{{ c.label }}</span>
          </UButton>
          <UColorModeButton />
        </nav>
      </UContainer>
    </header>
    <UContainer class="py-10">
      <!-- Keyed by path so views rebuild per category/document (but not on ?s= updates). -->
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </RouterView>
    </UContainer>
    <footer class="border-t border-default py-6 text-center text-sm text-muted">
      Made with Vue &amp; Nuxt UI
    </footer>
  </UApp>
</template>

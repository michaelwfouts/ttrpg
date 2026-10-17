<script setup lang="ts">
import { categoryById } from '../content/categories'
import type { Doc } from '../types/content'

defineProps<{ doc: Doc; showCategory?: boolean }>()
</script>

<template>
  <RouterLink :to="{ name: 'doc', params: { category: doc.category, slug: doc.slug } }" class="block">
    <UCard class="group h-full rounded-xl transition duration-200 hover:-translate-y-0.5 hover:ring-2 hover:ring-primary">
      <p v-if="showCategory" class="mb-1 flex items-center gap-1 text-xs uppercase tracking-wide text-muted">
        <UIcon :name="categoryById(doc.category)?.icon ?? 'i-lucide-file'" />
        {{ categoryById(doc.category)?.label }}
      </p>
      <h2 class="text-lg font-semibold tracking-tight text-highlighted group-hover:text-primary">
        {{ doc.meta.title }}
      </h2>
      <p v-if="doc.meta.description" class="mt-2 line-clamp-3 text-sm text-muted">{{ doc.meta.description }}</p>
      <p v-if="doc.meta.system || doc.meta.duration" class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span v-if="doc.meta.system" class="flex items-center gap-1"><UIcon name="i-lucide-book-open" /> {{ doc.meta.system }}</span>
        <span v-if="doc.meta.duration" class="flex items-center gap-1"><UIcon name="i-lucide-clock" /> {{ doc.meta.duration }}</span>
      </p>
      <div v-if="doc.meta.tags?.length" class="mt-3 flex flex-wrap gap-1">
        <UBadge v-for="t in doc.meta.tags" :key="t" color="primary" variant="subtle" size="sm">{{ t }}</UBadge>
      </div>
    </UCard>
  </RouterLink>
</template>

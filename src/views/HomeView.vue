<script setup lang="ts">
import { computed } from 'vue'
import { useSearch, allTags } from '../composables/useSearch'
import { useContent } from '../composables/useContent'
import SearchBar from '../components/SearchBar.vue'
import TagFilter from '../components/TagFilter.vue'
import DocCard from '../components/DocCard.vue'

const { query, selectedTags, results, toggleTag } = useSearch()
const { categories, docsIn } = useContent()
const searching = computed(() => query.value.trim() !== '' || selectedTags.value.length > 0)
</script>

<template>
  <section class="relative -mt-10 pb-10 pt-16 text-center">
    <div class="bg-grid pointer-events-none absolute inset-0 -z-10" />
    <h1 class="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-highlighted sm:text-5xl">
      Ready for <span class="text-primary">the table</span>
    </h1>
    <p class="mx-auto mt-4 max-w-xl text-lg text-muted">
      Every one-shot, combat and dungeon, one search away.
    </p>
    <div class="mx-auto mt-8 max-w-xl">
      <SearchBar v-model="query" />
    </div>
    <TagFilter :tags="allTags" :selected="selectedTags" class="justify-center" @toggle="toggleTag" />
  </section>

  <template v-if="searching">
    <p v-if="!results.length" class="mt-6 text-center text-muted">Nothing matches.</p>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <DocCard v-for="d in results" :key="d.category + d.slug" :doc="d" show-category />
    </div>
  </template>
  <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <RouterLink v-for="c in categories" :key="c.id" :to="{ name: 'category', params: { category: c.id } }" class="block">
      <UCard class="group h-full rounded-xl transition duration-200 hover:-translate-y-0.5 hover:ring-2 hover:ring-primary">
        <UIcon :name="c.icon" class="size-8 text-primary" />
        <h2 class="mt-3 text-lg font-semibold tracking-tight text-highlighted group-hover:text-primary">{{ c.label }}</h2>
        <p class="mt-1 text-sm text-muted">{{ c.description }}</p>
        <p class="mt-3 text-xs uppercase tracking-wide text-muted">
          {{ docsIn(c.id).length ? `${docsIn(c.id).length} ${docsIn(c.id).length === 1 ? 'entry' : 'entries' }` : 'Coming soon' }}
        </p>
      </UCard>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContent } from '../composables/useContent'
import { useSearch } from '../composables/useSearch'
import SearchBar from '../components/SearchBar.vue'
import DocCard from '../components/DocCard.vue'

const props = defineProps<{ category: string }>()
const { categoryById, docsIn } = useContent()

const cat = computed(() => categoryById(props.category))
// App.vue keys the router view by path, so this view is rebuilt when the category changes.
const { query, results } = useSearch(props.category)
const hasDocs = computed(() => docsIn(props.category).length > 0)
</script>

<template>
  <p v-if="!cat">
    <UButton to="/" variant="link" icon="i-lucide-arrow-left">Home</UButton>
    Nothing here.
  </p>
  <section v-else>
    <UButton to="/" variant="link" color="neutral" icon="i-lucide-arrow-left" class="-ml-2">Home</UButton>
    <h1 class="mt-2 flex items-center gap-3 text-4xl font-bold tracking-tight text-highlighted">
      <UIcon :name="cat.icon" class="size-9 text-primary" /> {{ cat.label }}
    </h1>
    <p class="mt-2 text-muted">{{ cat.description }}</p>

    <p v-if="!hasDocs" class="mt-8 text-muted">Nothing here yet. Drop a markdown file into <code>content/{{ cat.id }}/</code>.</p>
    <template v-else>
      <div class="my-6 max-w-xl"><SearchBar v-model="query" /></div>
      <p v-if="!results.length" class="text-muted">Nothing matches.</p>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DocCard v-for="d in results" :key="d.slug" :doc="d" />
      </div>
    </template>
  </section>
</template>

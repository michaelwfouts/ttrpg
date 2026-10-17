<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContent } from '../composables/useContent'
import DocToc from '../components/DocToc.vue'

const props = defineProps<{ category: string; slug: string }>()
const route = useRoute()
const router = useRouter()
const { find, categoryById } = useContent()

const doc = computed(() => find(props.category, props.slug))
const cat = computed(() => categoryById(props.category))
// H2 and H3 only: deeper headings (stat blocks, GM intrusions) would drown the sidebar.
const tocHeadings = computed(() => doc.value?.headings.filter((h) => h.depth === 2 || h.depth === 3) ?? [])

const activeId = ref('')
const drawerOpen = ref(false)

/** The active section is the last heading that has scrolled past the sticky header. */
function updateActive() {
  let current = tocHeadings.value[0]?.id ?? ''
  for (const h of tocHeadings.value) {
    const el = document.getElementById(h.id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= 100) current = h.id
    else break
  }
  activeId.value = current
}

let frame = 0
function onScroll() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    updateActive()
  })
}

function goTo(id: string) {
  // The slide-over locks page scroll while open, so wait for it to close first.
  const delay = drawerOpen.value ? 250 : 0
  drawerOpen.value = false
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ block: 'start' })
    router.replace({ query: { ...route.query, s: id } })
  }, delay)
}

watchEffect(() => {
  document.title = doc.value ? `${doc.value.meta.title} · Table Notes` : 'Table Notes'
})

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  await nextTick()
  const s = route.query.s
  if (typeof s === 'string') document.getElementById(s)?.scrollIntoView()
  updateActive()
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (frame) cancelAnimationFrame(frame)
  document.title = 'Table Notes'
})
</script>

<template>
  <p v-if="!doc">
    <UButton to="/" variant="link" icon="i-lucide-arrow-left">Home</UButton>
    Not found.
  </p>
  <article v-else>
    <UButton
      :to="{ name: 'category', params: { category } }"
      variant="link"
      color="neutral"
      icon="i-lucide-arrow-left"
      class="-ml-2"
    >
      {{ cat?.label ?? 'Back' }}
    </UButton>
    <h1 class="mt-2 text-4xl font-bold tracking-tight text-highlighted">{{ doc.meta.title }}</h1>
    <p v-if="doc.meta.description" class="mt-2 max-w-3xl text-lg text-muted">{{ doc.meta.description }}</p>
    <p v-if="doc.meta.system || doc.meta.duration || doc.meta.players" class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
      <span v-if="doc.meta.system" class="flex items-center gap-1"><UIcon name="i-lucide-book-open" /> {{ doc.meta.system }}</span>
      <span v-if="doc.meta.duration" class="flex items-center gap-1"><UIcon name="i-lucide-clock" /> {{ doc.meta.duration }}</span>
      <span v-if="doc.meta.players" class="flex items-center gap-1"><UIcon name="i-lucide-users" /> {{ doc.meta.players }}</span>
    </p>
    <div v-if="doc.meta.tags?.length" class="mt-3 flex flex-wrap gap-2">
      <UBadge v-for="t in doc.meta.tags" :key="t" color="primary" variant="subtle">{{ t }}</UBadge>
    </div>

    <div class="mt-8 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <aside class="hidden lg:block">
        <!-- The nav itself is the scroll container so DocToc can keep the active entry in view. -->
        <DocToc
          class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
          :headings="tocHeadings"
          :active-id="activeId"
          @select="goTo"
        />
      </aside>
      <div class="doc-prose min-w-0" v-html="doc.html" />
    </div>

    <UButton
      icon="i-lucide-list"
      class="fixed bottom-4 right-4 z-40 rounded-full shadow-lg lg:hidden"
      size="lg"
      @click="drawerOpen = true"
    >
      Sections
    </UButton>
    <USlideover v-model:open="drawerOpen" side="left" title="Sections" description="Jump to a section">
      <template #body>
        <DocToc :headings="tocHeadings" :active-id="activeId" @select="goTo" />
      </template>
    </USlideover>
  </article>
</template>

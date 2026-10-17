<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { DocHeading } from '../types/content'

const props = defineProps<{ headings: DocHeading[]; activeId: string }>()
defineEmits<{ select: [id: string] }>()

const list = ref<HTMLElement | null>(null)

interface Group {
  heading: DocHeading
  children: DocHeading[]
}

// Each H2 owns the H3s that follow it. An H3 with no H2 before it stands alone.
const groups = computed<Group[]>(() => {
  const out: Group[] = []
  for (const h of props.headings) {
    if (h.depth >= 3 && out.length) out[out.length - 1].children.push(h)
    else out.push({ heading: h, children: [] })
  }
  return out
})

const parentOf = computed(() => {
  const map = new Map<string, string>()
  for (const g of groups.value) for (const c of g.children) map.set(c.id, g.heading.id)
  return map
})

const expanded = reactive(new Set<string>())

// The group opened by scrolling (not by the user), so it can close again once you scroll past it.
let autoOpened: string | null = null

function toggle(id: string) {
  if (id === autoOpened) autoOpened = null
  if (expanded.has(id)) expanded.delete(id)
  else expanded.add(id)
}

const expandable = computed(() => groups.value.filter((g) => g.children.length))
const anyOpen = computed(() => expandable.value.some((g) => expanded.has(g.heading.id)))

/** If any group is open, close them all; only when every group is closed, open them all. */
function toggleAll() {
  autoOpened = null
  if (anyOpen.value) expanded.clear()
  else for (const g of expandable.value) expanded.add(g.heading.id)
}

/** A collapsed group stands in for its active child, so the current position is never invisible. */
function isActive(g: Group): boolean {
  if (props.activeId === g.heading.id) return true
  return !expanded.has(g.heading.id) && g.children.some((c) => c.id === props.activeId)
}

// Open the group you've scrolled into, close it again once you've scrolled out of it,
// and keep the active entry visible in the sidebar.
watch(
  () => props.activeId,
  async (id) => {
    const group = parentOf.value.get(id) ?? id
    if (autoOpened && autoOpened !== group) {
      expanded.delete(autoOpened)
      autoOpened = null
    }
    if (group !== id && !expanded.has(group)) {
      expanded.add(group)
      autoOpened = group
    }
    await nextTick()
    const el = list.value?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)
    const box = list.value
    if (!el || !box) return
    if (el.offsetTop < box.scrollTop || el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = el.offsetTop - box.clientHeight / 3
    }
  },
  { immediate: true },
)
</script>

<template>
  <nav ref="list" aria-label="Sections" class="text-sm">
    <!-- Sticky so it stays reachable while the sidebar scrolls. -->
    <div v-if="expandable.length" class="sticky top-0 z-10 bg-default pb-1">
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        :icon="anyOpen ? 'i-lucide-chevrons-down-up' : 'i-lucide-chevrons-up-down'"
        @click="toggleAll"
      >
        {{ anyOpen ? 'Collapse all' : 'Expand all' }}
      </UButton>
    </div>
    <ul class="space-y-0.5">
      <li v-for="g in groups" :key="g.heading.id">
        <div class="flex items-stretch">
          <button
            type="button"
            :data-id="g.heading.id"
            class="block min-w-0 flex-1 rounded-md border-l-2 py-1.5 pl-3 pr-2 text-left font-medium leading-snug transition-colors hover:bg-elevated"
            :class="isActive(g) ? 'border-primary bg-elevated text-primary' : 'border-transparent'"
            :aria-current="activeId === g.heading.id ? 'location' : undefined"
            @click="$emit('select', g.heading.id)"
          >
            {{ g.heading.text }}
          </button>
          <button
            v-if="g.children.length"
            type="button"
            class="rounded-md px-2 text-muted transition-colors hover:bg-elevated"
            :aria-label="`${expanded.has(g.heading.id) ? 'Collapse' : 'Expand'} ${g.heading.text}`"
            :aria-expanded="expanded.has(g.heading.id)"
            @click="toggle(g.heading.id)"
          >
            <UIcon
              name="i-lucide-chevron-right"
              class="size-4 transition-transform"
              :class="{ 'rotate-90': expanded.has(g.heading.id) }"
            />
          </button>
        </div>
        <ul v-if="g.children.length && expanded.has(g.heading.id)" class="mb-1 space-y-0.5">
          <li v-for="c in g.children" :key="c.id">
            <button
              type="button"
              :data-id="c.id"
              class="block w-full rounded-md border-l-2 py-1.5 pl-6 pr-2 text-left leading-snug text-muted transition-colors hover:bg-elevated"
              :class="activeId === c.id ? 'border-primary bg-elevated text-primary' : 'border-transparent'"
              :aria-current="activeId === c.id ? 'location' : undefined"
              @click="$emit('select', c.id)"
            >
              {{ c.text }}
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

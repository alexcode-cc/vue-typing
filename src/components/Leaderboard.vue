<script setup>
import { computed } from 'vue'
import { useTypingStore } from '../stores/typingStore'

const store = useTypingStore()

const DIFFICULTY_CONFIG = {
  easy: { label: '簡單', color: 'from-green-500 to-green-600' },
  medium: { label: '普通', color: 'from-yellow-500 to-yellow-600' },
  hard: { label: '困難', color: 'from-red-500 to-red-600' }
}

const leaderboard = computed(() => store.getLeaderboard())

const difficultySections = computed(() => {
  return ['easy', 'medium', 'hard'].map(diff => ({
    ...DIFFICULTY_CONFIG[diff],
    entries: leaderboard.value[diff] || []
  }))
})

const actions = {
  clearLeaderboard: () => store.clearLeaderboard()
}
</script>

<template>
  <div class="bg-zinc-800/50 backdrop-blur rounded-2xl p-6 border border-zinc-700/50">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-white">排行榜</h2>
      <button
        @click="actions.clearLeaderboard"
        class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        清空
      </button>
    </div>

    <div class="space-y-6">
      <!-- Leaderboard for each difficulty -->
      <div
        v-for="section in difficultySections"
        :key="section.label"
        class="bg-zinc-900/30 rounded-xl overflow-hidden"
      >
        <div class="px-4 py-3 border-b border-zinc-800">
          <div class="flex items-center gap-2">
            <div class="w-1 h-6 rounded-full bg-gradient-to-b" :class="section.color"></div>
            <h3 class="font-medium text-white">{{ section.label }}難度</h3>
            <span class="text-zinc-500 text-sm ml-auto">
              {{ section.entries.length }} 筆記錄
            </span>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="section.entries.length === 0" class="p-6 text-center text-zinc-500 text-sm">
          暫無記錄，快來挑戰吧！
        </div>

        <!-- Records list -->
        <div v-else class="divide-y divide-zinc-800">
          <div
            v-for="(entry, index) in section.entries"
            :key="entry.date"
            class="px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium"
                :class="index < 3
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                  : 'bg-zinc-800 text-zinc-400'
                "
              >
                {{ index + 1 }}
              </div>
              <div>
                <div class="text-white font-mono font-medium">{{ entry.wpm }} WPM</div>
                <div class="text-zinc-500 text-xs">
                  {{ new Date(entry.date).toLocaleString('zh-TW') }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-1 rounded text-xs font-medium"
                :class="entry.accuracy >= 90
                  ? 'bg-green-500/20 text-green-400'
                  : entry.accuracy >= 80
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
                "
              >
                {{ entry.accuracy }}%
              </span>
              <span class="text-zinc-500 text-sm">{{ entry.time }}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="mt-6 pt-4 border-t border-zinc-700">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-400">
            {{ Object.values(leaderboard).reduce((sum, arr) => sum + arr.length, 0) }}
          </div>
          <div class="text-zinc-500 text-xs mt-1">總記錄數</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-400">100%</div>
          <div class="text-zinc-500 text-xs mt-1">最高準確率</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-purple-400">100+</div>
          <div class="text-zinc-500 text-xs mt-1">詞彙量</div>
        </div>
      </div>
    </div>
  </div>
</template>
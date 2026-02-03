<script setup>
import TypingBox from './components/TypingBox.vue'
import StatsPanel from './components/StatsPanel.vue'
import DifficultySelector from './components/DifficultySelector.vue'
import Leaderboard from './components/Leaderboard.vue'
</script>

<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          打字練習網
        </h1>
        <p class="text-zinc-400">提升你的打字速度和準確度</p>
      </header>

      <!-- Difficulty Selector -->
      <DifficultySelector class="mb-6" />

      <!-- Main Content -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Typing Box (Takes 2 columns) -->
        <div class="md:col-span-2">
          <TypingBox />
        </div>

        <!-- Stats Panel (Takes 1 column) -->
        <div class="md:col-span-1">
          <StatsPanel />
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="mt-6">
        <Leaderboard />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
<script setup lang="ts">
import { useAppStore } from './stores/app'
import NavigationRail from './components/NavigationRail.vue'
import ListSection from './components/ListSection.vue'
import ChatWindow from './components/ChatWindow.vue'
import AuthView from './components/AuthView.vue'
import { Sun, Moon } from 'lucide-vue-next'

const store = useAppStore()
</script>

<template>
  <div 
    class="h-screen w-full overflow-hidden flex font-sans relative transition-colors duration-500 selection:bg-blue-500/30"
    :class="store.isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'"
  >
    <!-- Auth Screen -->
    <Transition name="fade" mode="out-in">
      <AuthView v-if="!store.isAuthenticated" class="absolute inset-0 z-40 bg-inherit" />

      <!-- Main App Content -->
      <div v-else class="flex flex-1 h-full relative z-10 w-full animate-in fade-in zoom-in-95 duration-700">
        <!-- Navigation Rail (Far Left) -->
        <NavigationRail />

        <!-- Main Content Area -->
        <main class="flex-1 flex overflow-hidden relative">
          <!-- List Section (Small Content) -->
          <ListSection class="w-80 transition-all duration-500" />

          <!-- Detail Section (Large Content) -->
          <div class="flex-1 h-full overflow-hidden">
            <ChatWindow :chat-id="store.activeId" />
          </div>
        </main>
      </div>
    </Transition>

    <!-- Global Theme Toggle Button (Floating Top Right) -->
    <button 
      @click="store.toggleTheme"
      class="fixed h-12 w-12 top-6 right-10 z-50 flex items-center justify-center rounded-full backdrop-blur-3xl border transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl group overflow-hidden"
      :class="store.isDark ? 'bg-slate-900/50 border-slate-700 text-yellow-400' : 'bg-white/50 border-gray-200 text-blue-600'"
    >
      <!-- Glossy Effect -->
      <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <Sun v-if="store.isDark" class="w-5 h-5 relative z-10" />
      <Moon v-else class="w-5 h-5 relative z-10" />
    </button>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

.dark {
  color-scheme: dark;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Custom Scrollbar for Clean UI */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>

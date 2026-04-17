<script setup lang="ts">
import { useAppStore } from '../stores/app'
import { 
  MessageSquare, 
  Users, 
  Sparkles, 
  Menu, 
  ChevronLeft,
  ChevronRight,
  Settings,
  UserCircle
} from 'lucide-vue-next'
import { computed } from 'vue'

const store = useAppStore()

const navItems = [
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
] as const

const isNavActive = (id: string) => store.activeTab === id

</script>

<template>
  <div 
    class="flex flex-col h-full transition-all duration-300 relative z-30"
    :class="[
      store.isSidebarExpanded ? 'w-56' : 'w-20',
      store.isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-gray-200'
    ]"
  >
    <!-- Toggle Button -->
    <div class="p-4 flex items-center" :class="store.isSidebarExpanded ? 'justify-between' : 'justify-center'">
      <span v-if="store.isSidebarExpanded" class="font-bold text-lg tracking-tight ml-2">ArtChat</span>
      <button 
        @click="store.toggleSidebar"
        class="p-2 rounded-full transition-colors"
        :class="store.isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'"
      >
        <Menu v-if="!store.isSidebarExpanded" class="w-6 h-6" />
        <ChevronLeft v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Navigation Items -->
    <div class="flex-1 mt-6 px-3 space-y-4">
      <div 
        v-for="item in navItems" 
        :key="item.id"
        @click="store.setTab(item.id)"
        class="group relative flex items-center rounded-2xl cursor-pointer transition-all duration-300"
        :class="[
          store.isSidebarExpanded ? 'px-4 py-3 gap-4' : 'justify-center p-3',
          isNavActive(item.id) 
            ? (store.isDark ? 'bg-blue-900/40 text-blue-400 shadow-sm' : 'bg-blue-100 text-blue-700 shadow-sm')
            : (store.isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500')
        ]"
      >
        <!-- Active Indicator (Material Design 3 style) -->
        <div 
          v-if="isNavActive(item.id)"
          class="absolute left-0 w-1 h-6 bg-blue-600 rounded-full transition-all"
        ></div>

        <component :is="item.icon" class="w-6 h-6" :class="isNavActive(item.id) ? 'scale-110' : ''" />
        
        <span 
          v-if="store.isSidebarExpanded"
          class="font-medium whitespace-nowrap transition-opacity duration-300"
          :class="isNavActive(item.id) ? 'font-bold' : ''"
        >
          {{ item.label }}
        </span>

        <!-- Tooltip for collapsed state -->
        <div 
          v-if="!store.isSidebarExpanded"
          class="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="p-4 space-y-4">
      <div 
        class="flex items-center cursor-pointer rounded-2xl transition-all duration-300"
        :class="[
          store.isSidebarExpanded ? 'px-4 py-3 gap-4' : 'justify-center p-3',
          store.isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
        ]"
      >
        <Settings class="w-6 h-6" />
        <span v-if="store.isSidebarExpanded" class="font-medium">Settings</span>
      </div>

      <div 
        class="flex items-center cursor-pointer rounded-2xl transition-all duration-300"
        :class="[
          store.isSidebarExpanded ? 'px-4 py-3 gap-4' : 'justify-center p-3',
          store.isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
        ]"
      >
        <div class="w-8 h-8 shrink-0 rounded-full bg-blue-500 items-center justify-center flex text-white font-bold text-xs ring-2 ring-transparent transition-all group-hover:ring-blue-500/30">
          JW
        </div>
        <span v-if="store.isSidebarExpanded" class="font-medium truncate transition-opacity duration-300">James Wilson</span>
      </div>
    </div>
  </div>
</template>

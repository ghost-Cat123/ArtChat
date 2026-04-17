<script setup lang="ts">
import { useAppStore } from '../stores/app'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Pin,
  PinOff,
  Check,
  X,
  Sparkles,
  PlusCircle,
  FolderPlus,
  Users,
  UserPlus,
  LayoutGrid,
  Filter,
  CheckCircle2,
  Bell,
  History
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

const store = useAppStore()

interface Item {
  id: string
  name: string
  avatar: string
  lastMsg?: string
  time?: string
  online?: boolean
  status?: string
}

const activeItems = computed(() => {
  if (store.activeTab === 'messages') return store.sortedChats()
  if (store.activeTab === 'contacts') return store.contactCategories
  if (store.activeTab === 'ai') return store.sortedAIHistory()
  return []
})

// Avatar hover logic
const hoverItem = ref<any | null>(null)
const hoverTimeout = ref<number | null>(null)

const handleMouseEnter = (item: any) => {
  hoverTimeout.value = window.setTimeout(() => {
    hoverItem.value = item
  }, 1000)
}

const handleMouseLeave = () => {
  if (hoverTimeout.value) clearTimeout(hoverTimeout.value)
  hoverItem.value = null
}

// AI Management
const editingId = ref<string | null>(null)
const editingName = ref('')

const startEdit = (id: string, name: string) => {
  editingId.value = id
  editingName.value = name
}

const saveEdit = (id: string) => {
  if (store.activeTab === 'contacts') {
    store.editCategory(id, editingName.value)
  } else {
    store.editAIName(id, editingName.value)
  }
  editingId.value = null
}

// Contacts/Friends UI
const showAddMenu = ref(false)
const showNewCategory = ref(false)
const newCategoryName = ref('')

const handleAddCategory = () => {
  if (newCategoryName.value.trim()) {
    store.createCategory(newCategoryName.value)
    newCategoryName.value = ''
    showNewCategory.value = false
  }
}

// Batch select state
const isBatchMode = ref(false)

</script>

<template>
  <div 
    class="flex flex-col h-full transition-colors duration-300 relative border-r overflow-hidden"
    :class="store.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'"
  >
    <!-- Header -->
    <div class="p-6 pb-2">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold capitalize" :class="store.isDark ? 'text-white' : 'text-slate-900'">
          {{ store.activeTab }}
        </h2>
        
        <div class="relative flex items-center gap-2">
          <!-- AI Batch Delete -->
          <button 
            v-if="store.activeTab === 'ai' && store.isAnyAISelected"
            @click="store.batchDeleteAI"
            class="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:scale-110 active:scale-95 transition-all text-[10px] font-bold uppercase"
          >
            Batch Delete
          </button>

          <!-- New Chat / Add Menu -->
          <button 
            v-if="store.activeTab === 'ai'"
            @click="store.createNewAIChat"
            class="p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            :class="store.isDark ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'"
            title="New AI Chat"
          >
            <Plus class="w-5 h-5" />
          </button>

          <button 
            v-if="store.activeTab === 'contacts'"
            @click="showAddMenu = !showAddMenu"
            class="p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            :class="store.isDark ? (showAddMenu ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700') : (showAddMenu ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900')"
          >
            <Plus class="w-5 h-5" />
          </button>
          
          <!-- Dropdown for Contacts -->
          <div v-if="showAddMenu" class="absolute right-0 top-full mt-2 w-48 rounded-2xl border shadow-xl z-50 p-2" :class="store.isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'">
            <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <UserPlus class="w-4 h-4 text-blue-500" />
              <span class="text-xs font-semibold" :class="store.isDark ? 'text-slate-200' : 'text-slate-700'">Add Friend</span>
            </button>
            <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Users class="w-4 h-4 text-green-500" />
              <span class="text-xs font-semibold" :class="store.isDark ? 'text-slate-200' : 'text-slate-700'">Create Group</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div 
        class="flex items-center gap-3 px-4 py-2.5 rounded-full transition-all border mb-4 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/30"
        :class="store.isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-gray-200'"
      >
        <Search class="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search..."
          class="bg-transparent border-none focus:ring-0 outline-none text-sm w-full"
          :class="store.isDark ? 'text-white' : 'text-slate-900'"
        />
      </div>

      <!-- System Notices for Contacts -->
      <div v-if="store.activeTab === 'contacts'" class="mb-4 space-y-1">
        <div 
          @click="store.setActiveId('friend-requests')"
          class="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all"
          :class="store.activeId === 'friend-requests' ? (store.isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600') : (store.isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50')"
        >
          <div class="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" :class="store.isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'"><UserPlus class="w-4 h-4" /></div>
          <div class="flex-1 font-bold text-sm" :class="store.isDark ? 'text-slate-200' : 'text-slate-700'">Friend Requests</div>
          <div class="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">2</div>
        </div>
        <div 
          @click="store.setActiveId('group-notices')"
          class="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all"
          :class="store.activeId === 'group-notices' ? (store.isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600') : (store.isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50')"
        >
          <div class="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" :class="store.isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'"><Bell class="w-4 h-4" /></div>
          <div class="flex-1 font-bold text-sm" :class="store.isDark ? 'text-slate-200' : 'text-slate-700'">Group Notices</div>
        </div>
      </div>

      <!-- Sub Tabs for Contacts -->
      <div v-if="store.activeTab === 'contacts'" class="flex p-1 rounded-xl mb-4" :class="store.isDark ? 'bg-slate-800/80' : 'bg-slate-100'">
        <button 
          @click="store.friendSubTab = 'friends'"
          class="flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all"
          :class="store.friendSubTab === 'friends' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
        >
          Friends
        </button>
        <button 
          @click="store.friendSubTab = 'groups'"
          class="flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all"
          :class="store.friendSubTab === 'groups' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
        >
          Groups
        </button>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar space-y-1">
      <div v-if="store.activeTab === 'ai'" class="px-2 mb-3 flex items-center justify-between">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <History class="w-3 h-3" /> Recent Sessions
        </div>
        <button @click="isBatchMode = !isBatchMode" class="text-[9px] font-bold text-blue-500 uppercase">
          {{ isBatchMode ? 'Done' : 'Select' }}
        </button>
      </div>

      <div 
        v-for="item in activeItems" 
        :key="item.id"
        @click="isBatchMode && store.activeTab === 'ai' ? store.toggleAISelection(item.id) : store.setActiveId(item.id)"
        class="group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 relative border border-transparent overflow-hidden"
        :class="[
          store.activeId === item.id 
            ? (store.isDark ? 'bg-slate-800/80 shadow-md border-slate-700' : 'bg-slate-50 shadow-sm border-gray-100') 
            : (store.isDark ? 'hover:bg-slate-800/40' : 'hover:bg-gray-50'),
          store.activeTab === 'ai' && (item as any).selected ? 'ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-900/10' : ''
        ]"
      >
        <!-- Selection Checkbox -->
        <div v-if="isBatchMode && store.activeTab === 'ai'" class="flex-shrink-0">
          <div 
            class="w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all"
            :class="(item as any).selected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'"
          >
            <Check v-if="(item as any).selected" class="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <!-- Avatar -->
        <div 
          class="relative flex-shrink-0"
          @mouseenter="handleMouseEnter(item)"
          @mouseleave="handleMouseLeave"
        >
          <div 
            class="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all group-hover:scale-105 shadow-sm overflow-hidden"
            :class="store.isDark ? 'bg-slate-900' : 'bg-white'"
          >
            {{ 'avatar' in item ? item.avatar : ('icon' in item ? item.icon : '👥') }}
          </div>
          <div v-if="'online' in item && (item as any).online" class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 rounded-full" :class="store.isDark ? 'border-slate-800' : 'border-white'"></div>
          <div v-if="(store.activeTab === 'ai' || store.activeTab === 'messages') && (item as any).pinned" class="absolute -top-1 -right-1">
            <Pin class="w-3 h-3 text-blue-500 fill-blue-500 drop-shadow-sm" />
          </div>
        </div>

        <!-- Main Info -->
        <div class="flex-1 min-w-0">
          <!-- AI Edit Mode -->
          <div v-if="editingId === item.id" class="flex items-center gap-2" @click.stop>
            <input 
              v-model="editingName"
              @keyup.enter="saveEdit(item.id)"
              class="bg-white dark:bg-slate-700 border-2 border-blue-500/50 rounded-xl px-3 py-1.5 text-xs w-full outline-none"
            />
            <button @click="saveEdit(item.id)" class="p-2 bg-green-500 text-white rounded-lg hover:scale-110"><Check class="w-4 h-4" /></button>
            <button @click="editingId = null" class="p-2 bg-slate-400 text-white rounded-lg hover:scale-110"><X class="w-4 h-4" /></button>
          </div>

          <template v-else>
            <div class="flex justify-between items-baseline mb-0.5">
              <h3 class="font-bold text-sm truncate" :class="store.isDark ? 'text-slate-100' : 'text-slate-900'">{{ item.name }}</h3>
              <span v-if="'time' in item" class="text-[9px] opacity-40 font-black uppercase tracking-widest">{{ (item as any).time }}</span>
            </div>
            <p class="text-[11px] truncate opacity-50 font-medium">
              {{ 'lastMsg' in item ? (item as any).lastMsg : ((item as any).status || '') }}
            </p>
          </template>
        </div>

        <!-- Hover Actions (Slide in naturally) -->
        <div 
          v-if="!isBatchMode && editingId !== item.id" 
          class="absolute inset-y-0 right-0 flex items-center gap-1 translate-x-full group-hover:translate-x-0 transition-transform duration-300 px-3 z-10"
          :class="store.isDark ? 'bg-slate-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'"
        >
          <!-- Message Actions -->
          <template v-if="store.activeTab === 'messages'">
            <button @click.stop="store.togglePinChat(item.id)" class="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl text-blue-500 transition-colors">
              <PinOff v-if="(item as any).pinned" class="w-4 h-4" />
              <Pin v-else class="w-4 h-4" />
            </button>
            <button @click.stop="store.deleteChat(item.id)" class="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-red-500 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </template>

          <!-- AI Actions -->
          <template v-if="store.activeTab === 'ai'">
            <button @click.stop="store.togglePinAI(item.id)" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500">
              <PinOff v-if="(item as any).pinned" class="w-4 h-4" />
              <Pin v-else class="w-4 h-4" />
            </button>
            <button @click.stop="startEdit(item.id, item.name)" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500">
              <Pencil class="w-4 h-4" />
            </button>
            <button @click.stop="store.deleteAIHistory(item.id)" class="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-red-500">
              <Trash2 class="w-4 h-4" />
            </button>
          </template>
          
          <!-- Category Actions -->
          <template v-if="store.activeTab === 'contacts' && (item as any).isCustom">
            <button @click.stop="startEdit(item.id, item.name)" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-colors">
              <Pencil class="w-4 h-4" />
            </button>
            <button @click.stop="store.deleteCategory(item.id)" class="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-red-500 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </template>
        </div>
      </div>
      
      <!-- Add Category Button (at the end of contacts) -->
      <button 
        v-if="store.activeTab === 'contacts' && !showNewCategory"
        @click="showNewCategory = true"
        class="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-500 dark:hover:text-slate-300 transition-all mt-4 mb-4"
      >
        <Plus class="w-5 h-5" />
      </button>

      <!-- New Category Input -->
      <div v-if="showNewCategory" class="mt-4 p-4 rounded-[2rem] transition-all border" :class="store.isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'">
        <input 
          v-model="newCategoryName"
          @keyup.enter="handleAddCategory"
          placeholder="Category name..."
          class="w-full bg-transparent border-none outline-none ring-0 text-base mb-6 font-semibold placeholder-slate-400 focus:ring-0 focus:outline-none"
          :class="store.isDark ? 'text-white' : 'text-slate-900'"
        />
        <div class="flex justify-end gap-3">
          <button @click="showNewCategory = false" class="px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 hover:text-slate-500 transition-colors">Cancel</button>
          <button @click="handleAddCategory" class="px-5 py-2 text-[10px] font-black uppercase tracking-[0.1em] bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outline-none {
  outline: none !important;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}
</style>

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDropdownStore = defineStore('dropdownStore', () => {
   const activeDropdownId = ref(null);

   function open(id) {
      activeDropdownId.value = id;
   }

   function close() {
      activeDropdownId.value = null;
   }

   return { activeDropdownId, open, close };
});
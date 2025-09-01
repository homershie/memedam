<template>
  <figure
    class="relative w-64 cursor-pointer rounded-xl border border-gray-950/[.1] bg-gray-950/[.01] p-4 hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
  >
    <div class="flex flex-row items-center gap-2">
      <img
        :src="img"
        class="rounded-full border border-surface-200 dark:border-surface-800"
        width="32"
        height="32"
        alt=""
      />
      <div class="flex flex-col">
        <span class="text-sm font-medium dark:text-white">
          {{ name }}
        </span>
        <small class="font-medium text-black/40! dark:text-white/40!">{{
          username
        }}</small>
      </div>
    </div>
  </figure>
</template>

<script setup>
defineProps({
  img: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
})
</script>

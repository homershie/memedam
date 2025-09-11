<template>
  <div
    :style="styles"
    :class="
      cn(
        'pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] motion-safe:animate-glow',
        props.class,
      )
    "
  ></div>
</template>

<script setup>
import { cn } from "@/lib/utils";
import { computed } from "vue";

const props = defineProps({
  borderRadius: { type: Number, required: false, default: 10 },
  color: { type: [String, Array], required: false, default: "#FFF" },
  borderWidth: { type: Number, required: false, default: 2 },
  duration: { type: Number, required: false, default: 10 },
  class: { type: null, required: false },
});

const styles = computed(() => {
  return {
    "--border-radius": `${props.borderRadius}px`,
    "--border-width": `${props.borderWidth}px`,
    "--duration": `${props.duration}s`,
    backgroundImage: `radial-gradient(transparent,transparent, ${
      Array.isArray(props.color) ? props.color.join(",") : props.color
    },transparent,transparent)`,
    backgroundSize: "300% 300%",
    mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
    WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    padding: "var(--border-width)",
    borderRadius: "var(--border-radius)",
  };
});
</script>

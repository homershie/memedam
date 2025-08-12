<script setup>
import { useLayout } from '@/layouts/composables/layout';
import { updatePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { ref } from 'vue';

const { layoutConfig } = useLayout();

const presets = {
    Aura
};
const preset = ref(layoutConfig.preset);
const presetOptions = ref(['Aura']);

const menuMode = ref(layoutConfig.menuMode);
const menuModeOptions = ref([
    { label: 'Static', value: 'static' },
    { label: 'Overlay', value: 'overlay' }
]);

const primaryColors = ref([
    { name: 'emerald', palette: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22' } },
    { name: 'blue', palette: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' } },
    { name: 'purple', palette: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764' } }
]);

// 移除未使用的 surfaces 變數

function getPresetExt() {
    const color = primaryColors.value.find((c) => c.name === layoutConfig.primary);
    return {
        semantic: {
            primary: color.palette
        }
    };
}

function onPresetChange() {
    layoutConfig.preset = presets[preset.value];
    updatePreset(getPresetExt());
}

function onMenuModeChange() {
    layoutConfig.menuMode = menuMode.value;
}

function onPrimaryColorChange() {
    updatePreset(getPresetExt());
}
</script>

<template>
    <div class="layout-configurator">
        <div class="layout-configurator-content">
            <div class="layout-configurator-section">
                <h3>主題設定</h3>
                <div class="field">
                    <label for="preset">主題</label>
                    <Dropdown id="preset" v-model="preset" :options="presetOptions" @change="onPresetChange" />
                </div>
                <div class="field">
                    <label for="menuMode">選單模式</label>
                    <Dropdown id="menuMode" v-model="menuMode" :options="menuModeOptions" optionLabel="label" optionValue="value" @change="onMenuModeChange" />
                </div>
                <div class="field">
                    <label for="primaryColor">主要顏色</label>
                    <Dropdown id="primaryColor" v-model="layoutConfig.primary" :options="primaryColors" optionLabel="name" optionValue="name" @change="onPrimaryColorChange" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-configurator {
    position: fixed;
    top: 0;
    right: 0;
    width: 20rem;
    height: 100vh;
    background: var(--surface-overlay);
    border-left: 1px solid var(--surface-border);
    z-index: 999;
    transform: translateX(100%);
    transition: transform 0.3s;

    &.layout-configurator-active {
        transform: translateX(0);
    }

    .layout-configurator-content {
        padding: 2rem;

        .layout-configurator-section {
            margin-bottom: 2rem;

            h3 {
                margin: 0 0 1rem 0;
                font-weight: 600;
                color: var(--text-color);
            }

            .field {
                margin-bottom: 1rem;

                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--text-color);
                }
            }
        }
    }
}
</style>

<script setup lang="ts">
import { defineClientComponent, useData } from 'vitepress';

const DocSearch = defineClientComponent(() => import('./DocSearch.vue')).setup()

const { theme } = useData()
const showSearchbar = !!theme.value.meilisearch
</script>
<template>
    <div class="docs-hero-area">
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-half-fullhd">
                    <div class="is-flex is-align-items-center is-flex-direction-column gap-16 has-text-centered">
                        <h1>AppsCode Documentations</h1>
                        <p>Assistance is available at any stage of your AppsCode journey. Whether you're just starting out or
                            navigating more advanced territories, support is here for you.</p>
                        <doc-search v-if="showSearchbar" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.docs-hero-area {
    padding: 60px 0;
    background-image: url('/images/pattern-squire.png');
    position: relative;
    z-index: 9;
    border-bottom: 1px solid $color-border;
    background-color: #fcfcfc;
}
</style>
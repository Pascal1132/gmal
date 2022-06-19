<template>
    <div class="system">
        <div class="warning"><fa :icon="['fas', 'computer']" />
        Le menu Système est en cours de développement</div>
    </div>
</template>
<script lang="js">
export default {
    name: 'System',
}
</script>
<style lang="scss" scoped>
.system {
    width: 100%;
    height: 20%;
    .warning {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        gap: 10px;
        width: 100%;
        height: 100%;
        color: $highlight-color;
        border-radius: 6px;
        border: 2px solid $highlight-color;
    }
}
</style>
<template>
    <div class="system">
        <h1>À propos</h1>
        <p>G-mal est un site web qui a été conçu par Pascal Parent. Il s'agit d'un service gratuit qui vous permet de je sais pas quoi en ligne. Vous pouvez également y accéder à partir de votre ordinateur ou de votre téléphone portable.</p>
        <h4>Technologies</h4>
        <p>G-mal utilise les technologies suivantes :</p>
        <ul>
            <li>Nuxt</li>
            <li>Vue</li>
            <li>Vuex</li>
            <li>Axios</li>
        </ul>
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
    max-width: 600px;

    ul{
        list-style: none;
        padding: 0;
        margin: 0;
        display:flex;gap:4px;
        flex-wrap: wrap;
        li {
            margin-bottom: 10px;
            background-color: $bg-color-0;
            padding: 10px;
            width: 200px;
            text-align: center;
            border-radius: 5px;
        }
    }
}
</style>
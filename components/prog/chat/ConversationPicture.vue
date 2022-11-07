<template>
    <img :src="url"
        onerror="this.onerror=null; this.src='https://www.mountsinai.on.ca/wellbeing/our-team/team-images/person-placeholder/image'">
</template>
<script>
export default {
    name: "ConversationPicture",
    props: {
        url: {
            type: String,
            default: null,
        },
    },
}
</script>
<template>
    <div class="message-status-icon" v-if="message.isMine">
        <div class="base" :class="{online: message.isOnline, read: message.isRead, pending: !(message.isRead || message.isOnline)}">
            <div class="icon"><fa :icon="['fas', 'check']" /></div>
        </div>
    </div>
</template> 
<script>
export default {
    name: 'MessageStatusIcon',
    props: {
        message: {
            type: Object,
            required: true,
        },
    },
};
</script>
<style lang="scss">
.message-status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    .base {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1px solid $txt-color;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon svg{
            width: 8px;
            height: 8px;
            padding: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $txt-color;
        }

        &.read {
            border-color: #0a0;
            background-color: $success-color;

            .icon svg{
                color: $bg-color-0;
            }
        }

        &.pending {
            border: 1px solid $txt-color;
            background-color: $bg-color-0;

            .icon svg{
                display: none;
            }
        }
    }
    
}
</style>
<template>
    <div class="notifications-container">
        <div v-for="notification in notifications" :key="notification.id" class="notification">
            <div class="notification__content" v-html="notification.html">
            </div>
            <div class="notification__close" @click="removeNotification(notification.id)">
                <fa :icon="['fas', 'times']" />
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'pinia';

export default {
    name: 'Notifications',
    setup() {
        const { removeNotification } = useNotificationsStore();
        return {
            removeNotification,
        }
    },
    computed: {
        ...mapState(useNotificationsStore, ['notifications']),
    }
}
</script>
<style lang="scss">
.notifications-container {
    position: fixed;
    bottom: 50px;
    right: 0;
    z-index: 1000;
    width: 100%;
    max-width: 400px;
    padding: 10px;
    box-sizing: border-box;
    .notification {
        position: relative;
        margin-bottom: 10px;
        padding: 5px;
        border-radius: 5px;
        background-color: $bg-color-2;

        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
        .notification__content {
            font-size: 14px;
            padding: 5px;
            color: $txt-color;
            border-radius: $border-radius-sm;
        }
        .notification__close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            color: $txt-color;
            font-size: 14px;
        }
    }
}
</style>
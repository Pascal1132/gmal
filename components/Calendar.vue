<template>
  <div class="calendar" :class="{ show }">
    <!-- simple calendar -->
    <span class="calendar-header">{{ currentDateString }}</span>
  </div>
</template>
<script lang="js">
export default {
    name: 'Calendar',
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            currentDateString: '',
        }
    },
    methods: {
        getCurrentDateString(){
            /*const date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            this.currentDateString = `${day}/${month}/${year}`;*/
            // Like above but with full string for month
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            this.currentDateString = `${day} ${months[month - 1]} ${year}`;

        },
    },
    mounted() {
        this.getCurrentDateString();
        setInterval(() => {
            this.getCurrentDateString();
        }, 1000);
        
    },
    }
</script>
<style lang="scss" scoped>
.calendar {
  display: none;
  position: absolute;
  padding: 5px;
  color: #f5f5f5;
  background-color: rgba(34, 34, 34, 0.95);
  border-radius: 6px;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.2);
  min-width: 100px;
  font-size: 13px;
  bottom: 0;
  right: 0;
  margin-bottom: 60px;
  margin-right: 10px;
  z-index: 44;
  transition: all 0.2s ease-in-out;
  &.show {
    display: flex;
  }
  ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    li {
      width: 100%;
      display: flex;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      align-items: center;
      justify-content: space-between;
    }
  }
  .calendar-header {
    font-size: 20px;
    padding: 5px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
</style>

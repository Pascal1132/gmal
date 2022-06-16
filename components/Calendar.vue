<template>
  <div class="calendar" :class="{ show }">
    <!-- simple calendar -->
    <div class="calendar-body">
      <date-picker :language="fr" :inline="true" v-model="selectedDate"></date-picker>
    </div>
  </div>
</template>
<script lang="js">
import {en, fr} from 'vuejs-datepicker/dist/locale'
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
            fr: fr,
            en: en,
            selectedDate: new Date(),
            loaded: false
        }
    },
    mounted() {
        if (!this.loaded) {
 // on click stop propagation to prevent closing the calendar
        this.$el.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        this.loaded = true;
        }
       

    },
    // on show =false, reset the calendar
    watch: {
        show(val) {
            if (!val) {
                setTimeout(() => {
                    this.selectedDate = new Date();
                }, 200);
            }
        },
    },
    }
</script>
<style lang="scss">
.calendar {
  display: flex;
  position: absolute;
  padding: 5px;
  justify-content: center;
  flex-direction: column;
  color: #f5f5f5;
  background-color: rgba(34, 34, 34, 0.95);

  border-radius: 6px;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.2);
  min-width: 100px;
  font-size: 13px;
  bottom: 0;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  right: 0;
  margin-bottom: 60px;
  margin-right: 10px;
  z-index: 44;
  transition: all 0.2s ease-in-out;
  transform: translateX(calc(100% + 10px));
  &.show {
    transform: translateX(0);
  }
  *{
    transition: all 0.2s ease-in-out;
  }
  .calendar-header {
    font-size: 20px;
    padding: 5px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .calendar-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    .vdp-datepicker__calendar {
      background-color: transparent;
      border: none;

      header {
        display: flex;
        .prev:not(.disabled):hover,
        .next:not(.disabled):hover,
        .up:not(.disabled):hover {
          background: rgba(125, 125, 125, 0.15);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
        }
        .prev {
          display: flex;
          order: 1;
          border-radius: 5px;;
          &:after {
            border-right: 10px solid #f5f5f5;
          }
          
          transform: rotate(-90deg);
        }
        .next {
          display: flex;
          order: 2;
          color: #f5f5f5;
          border-radius: 5px;
          &:after {
            border-left: 10px solid #f5f5f5;
          }
          transform: rotate(-90deg);
        }
        .up {
          display: block;
          order: 0;
          text-align: left;
          border-radius: 5px;;
          padding-left: 10px;
        }
      }
      .cell {
        background-color: transparent;
        border: 1px solid transparent;
        border-radius: 50%;
        margin: 0;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        height: 40px;
        line-height: 40px;
        border: 1px solid transparent !important;
        &.day {
          justify-content: center;
          &:hover {
            background: rgba(125, 125, 125, 0.15);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
          }
          &.selected {
            border: 1px solid $highlight-color !important;
          }
          &.today {
            background: $highlight-color !important;
          }
        }
        &.month, &.year {
          justify-content: center;
          height: 70px;
          width: 70px;
          padding: 5px;
          &:hover {
            background: rgba(125, 125, 125, 0.15);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
          }
          &.selected {
            border: 1px solid $highlight-color !important;
          }
          &.today {
            background: $highlight-color !important;
          }
        }
      }
    }
  }
}
</style>

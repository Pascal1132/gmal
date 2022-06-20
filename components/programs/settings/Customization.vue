<template>
  <div class="customization">
    <div class="warning">
      <fa :icon="['fas', 'computer']" />
      Le menu de personnalisation est en cours de développement
    </div>

    <h2>Personnalisation</h2>
    <div class="theme-selector">
      <div class="current-bg">
        <div class="bg-preview"><div class="over-bg">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
            <span class="line small"></span>
            <div class="button"></div>
        </div></div>
      </div>
    </div>
  </div>
</template>
<script lang="js">
export default {
    name: 'customization',
}
</script>
<style lang="scss" scoped>
.customization {
  width: 100%;
  height: 100%;
  display: flex;
    flex-direction: column;
    align-items: flex-start;
  .warning {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    gap: 10px;
    width: 100%;
    height: 200px;
    color: $highlight-color;
    border-radius: 6px;
    border: 2px solid $highlight-color;
  }
  .theme-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .current-bg {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .bg-preview {
        width: 300px;
      height: 180px;
        border-radius: 6px;
        margin: 0;
        background: linear-gradient(to bottom right, #00bcd4, #0064a7);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        .over-bg {
          width: 70px;
          height: 75px;
          top: 80px;
          display:flex;
          align-items: flex-start;
            justify-content: center;
          left: 220px;
          flex-direction: column;
          background-color: $bg-color-light;
          border-radius: 4px;
          padding: 4px 10px;
          position: relative;
            .line {
                width: 100%;
                height: 1px;
                background-color: $txt-color;
                margin: 5px 0;
                top: 0;
                &.small{
                    width: 50%;

                }
                }

            .button {
                width: 20px;
                height: 7px;
                background-color: $highlight-color;
                border-radius: 2px;
                align-self: flex-end;
                text-align: right;
                transform: translateX(12px);
                margin: auto;
            }
        }
      }
    }
  }
}
</style>

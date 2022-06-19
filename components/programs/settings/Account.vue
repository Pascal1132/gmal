<template>
  <div class="account">
    <h3>Votre compte :</h3>
    <div class="account-info">
      <div class="account-info-item">
        <div class="account-info-item-title">
          Nom d'utilisateur :
        </div>
        <div class="account-info-item-value">
          <input type="text" v-model="user.username" />
        </div>
      </div>
      <div class="account-info-item">
        <div class="account-info-item-title">
          Nom :
        </div>
        <div class="account-info-item-value">
          <input type="text" v-model="user.name" />
        </div>
      </div>
      <div class="account-info-item">
        <div class="account-info-item-title">
          Prénom :
        </div>
        <div class="account-info-item-value">
          <input type="text" v-model="user.firstname" />
        </div>
      </div>
      <div class="account-info-item">
        <div class="account-info-item-title">
          Email :
        </div>
        <div class="account-info-item-value">
          <input type="text" v-model="user.email" />
        </div>
      </div>
      <div class="account-info-item">
        <div class="account-info-item-title">
          Date de naissance :
        </div>
        <div class="account-info-item-value">
          <input type="date" v-model="user.birthdate" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js">
export default {
    name: 'Account',
    data() {
        return {
            user: {
                username: '',
                name: '',
                firstname: '',
                email: '',
                birthdate: '',
            },
        };
    },
}
</script>
<style lang="scss" scoped>
.account {
    width: 100%;
    height: 100%;
    max-width: 600px;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: left;

    h3 {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .account-info {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 10px;

        .account-info-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 5px;

            overflow: hidden;
            .account-info-item-title {
                font-size: 14px;
                margin-right: 10px;
                width: 250px;
            }
            .account-info-item-value {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                width: 100%;

                margin-left: 10px;
                font-size: 14px;
                .account-type {
                    font-size: 11px;
                    color: #fff;
                }
                input {
                width: 100%;
                background-color: $bg-color-lighter;
                color: $txt-color;
                font-size: 14px;
                padding: 0;
                margin: 0;
                width: 100%;
                padding: 5px;
                border: 1px solid $border-color;
                border-radius: $border-radius-sm;
                outline: none;
                transition: all 0.2s ease-in-out;
                &:focus{
                    border: 1px solid $highlight-color;
                }
            }
            }
        }
    }


}
</style>

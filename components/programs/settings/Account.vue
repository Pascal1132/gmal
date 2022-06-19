<template>
  <div class="account">
    <h3>Votre compte :</h3>
    <!--<div class="account-info-item-title">
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
      </div>-->
    <!-- Button connect with gmail or facebook -->
    <div v-if="!$auth.loggedIn">
      Connectez-vous avec
      <button class="facebook-btn" @click="connectWithFacebook">
        <fa class="btn-icon" :icon="['fab', 'facebook']" />
        Facebook
      </button>
    </div>
    <div v-else>
      Connecté avec Facebook
      <fa class="btn-icon" :icon="['fab', 'facebook']" />
      <br>
      <button class="logout-btn" @click="logoutWithFacebook">
        Se déconnecter
        <fa class="btn-icon" :icon="['fas', 'arrow-right-from-bracket']" />
      </button>
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
    methods: {
        connectWithFacebook() {
            this.$auth.loginWith('facebook')
        },
        logoutWithFacebook() {
            this.$auth.logout('facebook')
        }
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
          &:focus {
            border: 1px solid $highlight-color;
          }
        }
      }
    }
  }
  .facebook-btn {
    background-color: #007bff;
    border-color: #007bff;
    color: #fff;
    padding: 5px 7px;
    border-radius: 5px;
    outline: none;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: #0069d9;
      border-color: #0062cc;
      color: #fff;
    }
  }
  .logout-btn {
    background-color: $bg-color-dark;
    color: $txt-color;
    padding: 5px 7px;
    margin-top: 15px;
    font-size: 14px;
    border-radius: 5px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: $transition;
    &:hover {
      background-color: $hover-btn-color;
      border-color: #dee2e6;
    }
  }
}
</style>

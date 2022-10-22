<template>
  <div class="account">
    
    <!--<div>
      <label>Téléphone </label>
      <input type="phone" v-model="user.phone" />

      <div v-if="waitingForCode">
        <label>Code de vérification</label>
        <input type="text" v-model="user.phoneVerificationCode" />
        <button @click="verifyCode" class="btn">Vérifier</button>
      </div>
    </div>
    <button @click="signIn" id="recaptcha-container" class="btn">logins</button>
    <div v-if="firebaseUser">
      <client-only>
        <pre>{{ firebaseUser }}</pre>
      </client-only>
      <button @click="signOut">Logout</button>
    </div>
    <div v-else>Statut: déconnecté</div>-->
    <div v-if="firebaseUser">
      <h3>Votre compte :</h3>
      <pre>{{firebaseUser}}</pre>
      <button @click="signOut" class="btn">Déconnexion</button>
    </div>
    <div v-else class="login-container">
      <div class="phone-form">
        <fa class="icon" :icon="['fas', 'phone']" />
        <input type="phone" id="phone" @input="onPhoneInput" :readonly="waitingForCode" v-model="user.phone"
          placeholder="Téléphone (+1)" />
        {{ error.phone }}
      </div>
      <button class="btn" v-if="!waitingForCode" @click="signIn" id="recaptcha-container">Se connecter</button>
      <div class="phone-verification-form" v-if="waitingForCode">
        <label>Entrer le code</label>
        <div id="code-input" @click.prevent="onCodeInputClick">
          <span class="number" v-for="(n, i) in 6" :key="i" :class="{active: (selectionStartInputCodeVerification == i && !isBlured)}">
            {{phoneVerificationCodeDigits[i] || ''}}
          </span>
        </div>
        {{ error.phoneVerificationCode }}
        <input id="dummyInputCodeVerification" ref="dummyInputCodeVerification" @input="updateSelectionStart"
          type="text" maxlength="6" v-model="user.phoneVerificationCode" @focusout="onBlur" @focusin="onFocus">
      </div>
    </div>
  </div>
</template>
<script lang="js">

export default {
  name: 'Account',
  setup() {
    const firebaseUser = useFirebaseUser();

    return {
      firebaseUser,
    };
  },
  data() {
    return {
      user: {
        phone: '',
        phoneVerificationCode: '',
      },
      error: {
        phone: '',
        phoneVerificationCode: '',
      },
      data: {},
      waitingForCode: false,
      verifier: null,
      canLogin: false,
      selectionStartInputCodeVerification: 0,
      isBlured: false,
    };
  },
  async mounted() {
    const { data } = useFetch('/api/animal');
    this.data = data;
    if (!this.verifier) {
      this.verifier = setupVerifier("recaptcha-container");
    }
  },
  methods: {
    connectWithFacebook() {
    },
    logoutWithFacebook() {
    },
    onPhoneInput() {
      this.error.phone = '';

      if (this.user.phone.length === 10) {
        this.canLogin = true;
      }
    },
    async signOut() {
      await signOutUser();
      this.verifier = setupVerifier("recaptcha-container");
    },
    async signIn() {
      await signInUser(`+1${this.user.phone}`, this.verifier);
      this.waitingForCode = true;
    },
    verifyCode() {
      window.confirmationResult.confirm(this.user.phoneVerificationCode).then((result) => {
        this.user = result.user;
        this.user.selectionStartInputCodeVerification = 0;
        this.waitingForCode = false;
        this.user.phoneVerificationCode = '';
        this.verifier.clear();
        this.error.phoneVerificationCode = '';
      }).catch((error) => {
        this.error.phoneVerificationCode = error.message;
      });
    },
    onCodeInputClick(e) {
      e.preventDefault();
      this.$refs.dummyInputCodeVerification.focus();
    },
    updateSelectionStart() {
      const selection = this.$refs.dummyInputCodeVerification.selectionStart;
      this.selectionStartInputCodeVerification = (selection > 5) ? 5 : selection;

      // check if all digits are numbers
      const digits = this.user.phoneVerificationCode.split('');
      const isAllDigits = digits.every(d => !isNaN(d));
      if (this.user.phoneVerificationCode.length === 6 && isAllDigits) {
        this.verifyCode();
      }
    },
    onBlur() {
      this.isBlured = true;
    },
    onFocus() {
      this.isBlured = false;
    },
  },
  computed: {
    phoneVerificationCodeDigits() {
      return this.user.phoneVerificationCode.split('');
    },
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

  .login-container{
    display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
    height: 100%;
  }
  .phone-form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: calc(100% - 20px);
    height: 50px;
    background-color: $bg-color-2;
    border-radius: $border-radius-sm;
    border: 1px solid $border-color;
    transition: all 0.2s ease-in-out;
    margin: 5px;

    overflow: hidden;

    input {
      border: none;
      outline: none;
      width: 100%;
      background: transparent;
      padding: 10px;
      font-size: 15px;
      color: $txt-color;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      margin-left: 10px;
      height: 12px;

      overflow: hidden;
      transform: rotate(90deg);
    }

    &:focus-within {
      border: 2px solid $highlight-color;
      background-color: $bg-color-0;
    }
  }

  .phone-verification-form {
    display: flex;
    margin: 5px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    #code-input {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;

      .number {
        height: 50px;
        width: 50px;
        border: 1px solid $border-color;
        border-radius: $border-radius-sm;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin: 5px;

        &.active {
          border: 2px solid $highlight-color;
        }
      }
    }
  }

  .btn {
    width: 50%;
    height: 40px;
    background-color: $bg-color-2;
    border-radius: $border-radius-sm;
    border: 2px solid $border-color;
    outline: none;
    color: $highlight-color;
    font-size: 15px;

    font-weight: bold;
    margin: 15px 5px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: $highlight-color;
      color: $bg-color-0;
    }
  }
}

#dummyInputCodeVerification {
  position: absolute;
  opacity: 0;

}
</style>

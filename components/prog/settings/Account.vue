<template>
  <div class="account">
    <div v-if="firebaseUser">
      <h3>Votre compte :</h3>
      <h4>Vous pouvez compléter votre profil :</h4>
      <!-- Display name -->
      <div class="input-form">
        <fa class="icon" :icon="['fas', 'user']" />
        <input type="text" id="displayName" ref="displayNameInput" v-model="firebaseUser.displayName"
          placeholder="Nom d'utilisateur" @focusout="triggerUpdate" />
      </div>
      <!-- photoUrl -->
      <div class="input-form">
        <fa class="icon" :icon="['fas', 'image']" />
        <input type="text" id="photoUrl" ref="photoUrlInput" @focusout="triggerUpdate" v-model="firebaseUser.photoURL" placeholder="URL de votre photo"/>
      </div>
      <button @click="signOut" class="btn full-width btn-danger visible">Déconnexion</button>
    </div>
    <div v-else class="login-container">
      <h3>Connexion</h3>
      <div class="input-form" :class="{disabled: waitingForCode}">
        <fa class="icon" :icon="['fas', 'phone']" />
        <input type="phone" id="phone" ref="phoneInput" @input="onPhoneInput" :readonly="waitingForCode"
          v-model="user.phone" placeholder="Téléphone (+1)" />
        <button class="edit-btn" @click="onEditNumberClick">Modifier le numéro</button>
      </div>
      <span class="error" :class="{visible: errors.phone != ''}">{{ errors.phone }}</span>

      <button class="btn" :class="{visible:!waitingForCode}" @click="signIn" id="recaptcha-container">Se
        connecter</button>
      <div class="phone-verification-form" v-if="waitingForCode">
        <label class="phone-verification-form-title">Entrer le code</label>
        <div id="code-input" @click.prevent="onCodeInputClick">
          <span class="number" v-for="(n, i) in 6" :key="i"
            :class="{active: (selectionStartInputCodeVerification == i && !isBlured)}">
            {{phoneVerificationCodeDigits[i] || ''}}
          </span>
        </div>
        <span class="error"
          :class="{visible: errors.phoneVerificationCode != ''}">{{errors.phoneVerificationCode}}</span>
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
        phone: '6505553434',
        phoneVerificationCode: '',
      },
      errors: {
        phone: '',
        phoneVerificationCode: '',
      },
      profileData: {},
      waitingForCode: false,
      verifier: null,
      canLogin: false,
      selectionStartInputCodeVerification: 0,
      isBlured: false,
    };
  },
  async mounted() {    
    this.checkVerifier();
  },
  methods: {
    connectWithFacebook() {
    },
    logoutWithFacebook() {
    },
    onPhoneInput() {
      this.errors.phone = '';

      if (this.user.phone.length === 10) {
        this.canLogin = true;
      }
    },
    async signOut() {
      await signOutUser();
      this.checkVerifier();
    },
    async signIn() {
      console.log('signIn');
      this.checkVerifier();
      const req = await signInUser(`+1${this.user.phone}`, this.verifier);
      if (req == true) {
        this.waitingForCode = true;
        // focus on the input next tick
        this.$nextTick(() => {
          this.$refs.dummyInputCodeVerification.focus();
        });
      } else {
        // add error message
        this.errors.phone = req.message;
        // reset errors after 3s
        setTimeout(() => {
          this.errors.phone = '';
        }, 3000);
      }

    },
    verifyCode() {
      window.confirmationResult.confirm(this.user.phoneVerificationCode).then((result) => {
        this.user = result.user;
        this.user.selectionStartInputCodeVerification = 0;
        this.waitingForCode = false;
        this.user.phoneVerificationCode = '';
        this.verifier.clear();
        this.errors.phoneVerificationCode = '';
      }).catch((error) => {
        this.errors.phoneVerificationCode = error.message;
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
    onEditNumberClick() {
      this.waitingForCode = false;
      this.user.phoneVerificationCode = '';
      this.$nextTick(() => {
        this.$refs.phoneInput.focus();
      });

      this.errors.phoneVerificationCode = '';
    },
    triggerUpdate() {
      updateUser(this.firebaseUser);
    },
    checkVerifier() {
      if (this.verifier == null && this.firebaseUser == null) {
        this.verifier = setupVerifier("recaptcha-container");
      }
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
  overflow-x: hidden;

  h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .login-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    width: 100%;
    height: 100%;
  }

  .input-form {
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
    }

    &:focus-within:not(.disabled) {
      border: 2px solid $highlight-color;
      background-color: $bg-color-0;
    }

    .edit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      border: none;
      visibility: hidden;
      opacity: 0;
      outline: none;
      background: rgba($hex-bg-color-1, 0.95);
      color: $txt-color;
      border-radius: $border-radius-sm;
      padding: 5px 10px;
      position: absolute;
      right: 30px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.2s ease-in-out;

      &:hover {
        filter: brightness(1.2);
      }
    }

    &.disabled {
      border: none;

      .edit-btn {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  .phone-verification-form {
    display: flex;
    margin: 25px 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    .phone-verification-form-title {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 10px;
    }

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

    &:not(.visible) {
      display: none;
    }

    &.full-width {
      width: calc(100% - 20px);
    }

    &.btn-danger {
      background-color: $bg-color-2;
      border: 2px solid $danger-color;
      color: $txt-color;
      filter: brightness(0.6);

      &:hover {
        filter: brightness(1.2);
      }
    }

    &.btn-success {
      background-color: $success-color;
      border: 2px solid $success-color;
      color: $bg-color-0;

      &:hover {
        filter: brightness(1.2);
      }
    }
  }

  .error {
    color: $txt-color;
    display: none;
    width: calc(100% - 20px);
    margin-left: 5px;
    padding: 5px;
    border: 2px solid $border-color;
    border-radius: $border-radius-sm;
    background-color: $danger-color;

    &.visible {
      display: block;
    }
  }
}

#dummyInputCodeVerification {
  position: absolute;
  opacity: 0;

}
</style>

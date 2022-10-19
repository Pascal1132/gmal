<template>
  <div class="login">
    <h1>C'est presque fini !</h1>
    <p>
      Vous allez être redirigé vers la page d'accueil dans quelques secondes...
    </p>
  </div>
</template>
<script lang="js">
export default {
    name: 'Login',
    mounted() {
    },
}
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  margin: auto;
  margin-top: 50px;
  height: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: $bg-color-2;
  color: $txt-color;

  h1 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    margin-bottom: 10px;
  }
}
</style>

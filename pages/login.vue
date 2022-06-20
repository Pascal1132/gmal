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
}
</script>
<style lang="scss" scoped>

    .login {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 500px;
        margin:auto;
        margin-top: 50px;
        height: 100%;
        padding: 10px;
        border-radius: 5px;
        background-color: $bg-color-lighter;
        color: $txt-color;
        animation: bounce 2s ease-in-out infinite;

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
    @keyframes bounce {
        0% {
            transform: translateY(0);
            box-shadow: 0 100px 10px -35px rgba(0, 0, 0, 0.2);
        }
        50% {
            transform: translateY(-10px);box-shadow: 0 110px 10px -40px rgba(0, 0, 0, 0.1);
        }
        100% {
            transform: translateY(0);box-shadow: 0 100px 10px -35px rgba(0, 0, 0, 0.2);
        }
    }
    
</style>

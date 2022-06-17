<template>
  <div class="file-explorer">
    <header>
        <button>Nouveau</button>
        <div class="separator"></div>
        <button><fa :icon="['fas', 'scissors']" /></button>
        <button><fa :icon="['fas', 'clone']" /></button>
        <button><fa :icon="['fas', 'trash']" /></button>
        <div class="separator"></div>
        <button>Trier</button>
        <button><fa :icon="['fas', 'bars']" /> Afficher</button>
        <div class="separator"></div>
        <button><fa :icon="['fas', 'ellipsis']" /></button>
    </header>
    <div class="content">
        <div class="content-nav">
            <!-- Prev and next buttons -->
            <div class="btn-container">
            <button><fa :icon="['fas', 'arrow-left']" /></button>
            <button><fa :icon="['fas', 'arrow-right']" /></button>
            </div>
            <div class="breadcrumb-container">
            <span>Home</span>
            <span>/</span>
            <span>Documents</span>
            
            </div>
            <div class="search-container">
                <input type="search" placeholder="Rechercher" />
            </div>
        </div>

    </div>
  </div>
</template>
<script lang="js">
export default {
    name: 'FileExplorer',
    props: {
        windowKey: {
            type: String,
            default: '',
        },
    },
    mounted() {
        this.$store.commit('setWindow', {
            id: this.windowKey,
            title: 'File Explorer',
            isMinimized: false,
         pos:{
            // center the window
            x: window.innerWidth / 2 - 300,
            y: window.innerHeight / 2 - 300,
         },
        size: {
            width: 700,
            height: 500,
            minWidth: 400,
            minHeight: 400,
        },
        });
    },
}
</script>
<style lang="scss" scoped>
.file-explorer{
    height: 100%;
    width: 100%;
    button{
            padding: 7px 9px;
            display: flex;
            flex-direction: row;
            gap: 5px;
            align-items: center;
            background-color: transparent;
            border: none;
            color: $txt-color;
            justify-content: center;
            border-radius: 5px;
            transition: $btn-transition;
            &:hover{
                background-color: $hover-btn-color;
            }
        }
    header{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 5px;
        height: 40px;
        background-color: transparent;
        border-bottom: 1px solid $border-color;
        .separator{
            width: 1px;
            height: 20px;
            background-color: $border-color;
            margin: 0 10px;
        }
        
    }
    .content{
        background-color: $bg-color-dark;
        height: calc(100% - 40px);
        width: 100%;
        .content-nav{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            width: 100%;
            gap: 10px;
            background-color: $bg-color-dark;
            .btn-container{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 40px;
                background-color: $bg-color-dark;
            }
            .breadcrumb-container{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 35px;
                width: 100%;
                border: 1px solid $border-color;
                span{
                    padding: 0 5px;
                    color: $txt-color;
                    font-size: 15px;
                    font-weight: bold;
                    &:not(:last-child){
                        margin-right: 5px;
                    }
                }
            }
            .search-container{
                display: flex;
                justify-content: flex-end;
                align-items: center;
                background-color: $bg-color-dark;
                input{
                    width: 200px;
                    height: 100%;
                    margin: 0 10px 0 0;
                    height: 35px;
                    border: none;
                    border: 1px solid $border-color;
                    background-color: transparent;
                    color: $txt-color;
                    padding: 0 10px;
                    font-size: 13px;
                    font-weight: normal;
                    &:focus{
                        outline: none;
                    }
                }
            }
        }
    }
}

</style>

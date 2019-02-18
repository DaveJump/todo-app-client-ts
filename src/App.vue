<template>
  <div id="app">
    <transition :name="`pop-${this.direction === 'forward' ? 'in' : 'out'}`">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component
class App extends Vue {
  @State direction!: string

  beforeCreate () {
    this.$router.replace({ path: '/' })
  }
}

export default App
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.pop-out-enter-active,
.pop-out-leave-active,
.pop-in-enter-active,
.pop-in-leave-active {
  will-change: transform;
  transition: all .25s;
  height: 100%;
  top: 0;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}

.pop-out-enter {
  // opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.pop-out-leave-active {
  // opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.pop-in-enter {
  // opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.pop-in-leave-active {
  // opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>

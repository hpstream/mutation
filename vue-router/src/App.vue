<template>
  <div id="app1">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
    <div>
      我的年龄是: {{this.$store.state.age}}
      <br />
      hpStream的年龄是: {{this.$store.getters.getAge}}
      <br />
      <!-- dispatch对应的action -->
      <button @click="$store.dispatch('changeAge',3)">过一会增加年龄</button>
      <!-- commit 对应的mutation -->
      <button @click="$store.commit('changeAge',5)">立即增加年龄</button>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

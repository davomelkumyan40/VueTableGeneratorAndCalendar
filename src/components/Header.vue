<template>
  <div class="header">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/tablegenerator">Table Generator</router-link>
      <router-link to="/clockslide">Clock Slider</router-link>
    </div>
  </div>
</template>


<style scoped>
.header {
  width: 100%;
  height: 60px;
  background-color: #333333;
}

#nav {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

#nav a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 200px;
  text-decoration: none;
  font-size: 1.1rem;
  color: #ccc;
  transition: 0.3s ease background-color;
}

#nav a:hover {
  background-color: #252525;
  color: rgb(236, 236, 236);
}

#nav a.router-link-exact-active {
  color: rgb(236, 236, 236);
  background-color: #252525;
}
</style>
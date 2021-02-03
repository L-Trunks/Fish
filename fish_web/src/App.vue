<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Courier New", Courier, monospace;
}
.router-link {
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}
a {
  text-decoration: none;
}
.el-pagination {
  text-align: center;
}
.el-carousel button {
  background: #000;
}
.baberrage-stage {
  height: 400px !important;
}
.el-loading-parent--hidden {
  overflow: scroll !important;
}
</style>

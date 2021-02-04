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
.tag_info {
  display: inline-block;
  padding: 0 10px;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  color: #409eff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  background-color: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.2);
  color: #67c23a;
  margin-top: 5px;
}
</style>

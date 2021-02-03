<template>
  <footer id="red">
    <h1 class="text">垂钓俱乐部</h1>
    <h2 class="text2">&copy; DIMENSIONMC - DESIGNED BY <a href="">Eumenides</a></h2>
    <h2 class="text3">-POWERED BY <a href="">Eumenides</a>-</h2>
  </footer>
</template>

<script>
export default {
  name: "Hfooter"
};
</script>
<style scoped>
#red {
  margin-top:150px;
  border-top: solid #c7c3c3;
  border-width: 3px;
  background: #e9e0e0;
  bottom: 0;
  width: 100%;
  /* height: 100px; */
}

.text {
  /* margin-top: 20px; */
  color: #999999;
  font-family: Lato;
  font-size: 30px;
  text-align: center;
}

.text2 {
  color: #424242;
  font-family: Lato;
  font-size: 10px;
  text-align: center;
}

.text3 {
  color: #424242;
  font-family: Lato;
  font-size: 10px;
  text-align: center;
  float: center;
  margin-bottom: 10px;
}

</style>

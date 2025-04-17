<script setup lang="ts">
import { AstPrinter } from './lox/ast-printer';
import { Lox } from './lox/lox';

const souceCode = `
Var lang = "en";
Var name = "Lox";
class Name {
  init(name) {
    this.name = name;
  }
  greet() {
    print("Hello " + this.name);
  }
};
print("Hello " + name);
`

Lox.run(souceCode);
AstPrinter.main()

</script>

<template>
  <div class="container">
    <div class="left-panel" ref="grapRef"></div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;

}

.left-panel {
  width: 60%;
  background-color: #f0f0f0;
}

.right-panel {
  width: 40%;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>

<script setup lang="ts">
import { Graph } from '@antv/x6/es';
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';

const grapRef = ref<HTMLElement | null>(null);

interface Store {
  hasCommond: false,
  hasRedo: false
}

interface Data { name: string, id: string, age: string }



const data = ref<Data>({
  name: '',
  id: '',
  age: ''
})
const proxyData = computed(() => {
  return new Proxy(data, {
    get(target, key) {
      return Reflect.get(target.value, key)
    },
    set(target, key: string, value) {
      const oldValue = Reflect.get(target.value, key)
      const updateDataCommand = new UpdateDataCommand(data, { key, value, oldValue })
      history.execute(updateDataCommand)
      return true
    }
  })
})


abstract class Command {
  abstract execute(): any;
  abstract unexecute(): any;
}

class AddNodeCommand extends Command {
  constructor(private graph: Graph, private node: any) {
    super();
  }

  execute() {
    this.graph.addNode(this.node);
  }

  unexecute() {
    this.graph.removeCell(this.node);
  }
}

class UpdateDataCommand extends Command {
  constructor(private node: any, private data: { key: string, value: any, oldValue: any }) {
    super();
  }

  execute() {
    this.node.value[this.data.key] = this.data.value
  }

  unexecute() {
    this.node.value[this.data.key] = this.data.oldValue
  }
}

// 命令invoker
class History {
  private history: Command[] = [];
  private redoStack: Command[] = [];

  private maxSize: number = 10;

  constructor() { }

  execute(command: Command) {
    command.execute();
    this.history.push(command);
    this.redoStack = [];
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }
  }

  undo() {
    const command = this.history.pop();
    if (command) {
      command.unexecute();
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }

  reset() {
    this.history = [];
    this.redoStack = [];
  }

}

const history = new History();

let graph: Graph;

onMounted(() => {
  // console.log(grapRef.value);
  graph = new Graph({
    container: grapRef.value!,
    panning: true,
    scaling: {
      min: 0.1,
      max: 10
    }
  });

  graph.addNode({
    id: `1`,
    x: 100,
    y: 40,
    width: 100,
    height: 40,
    label: '1',
    data: {
      id: `1`,
      name: '1',
      age: 18
    }
  });
  graph.addNode({
    id: '2',
    x: 500,
    y: 40,
    width: 100,
    height: 40,
    label: '2',
    data: {
      id: `2`,
      name: '2',
      age: 19
    }
  });

  graph.on('node:click', ({ node }) => {
    data.value = node.getData();
  });
});

let val = 3
let pos = {
  x: 300,
  y: 300
}
const addNode = () => {
  ++val;
  const addNodeCommand = new AddNodeCommand(graph, {
    id: val.toString(),
    x: pos.x,
    y: pos.y,
    width: 100,
    height: 40,
    label: val.toString(),
    data: {
      id: val.toString(),
      name: val.toString(),
      age: val.toString()
    }
  });

  pos.x += 50
  pos.y += 50

  history.execute(addNodeCommand);
}

const removeNode = () => {
  ElMessage({
    message: '删除节点',
    type: 'success'
  });
  // graph.removeNode(val.toString());
}

const undo = () => {
  history.undo()
}

const redo = () => {
  history.redo()
}

const handleNameChange = (val) => {
  proxyData.name = val
}
</script>

<template>
  <div class="container">
    <div class="left-panel" ref="grapRef"></div>
    <div class="right-panel">
      <div>
        <el-button @click="undo">撤销</el-button>
        <el-button @click="redo">重做</el-button>
      </div>
      <el-button @click="addNode">新增节点</el-button>
      <el-button @click="removeNode">删除节点</el-button>

      <el-input v-model="proxyData.id"></el-input>
      <el-input v-model="proxyData.name"></el-input>
      <el-input v-model="proxyData.age"></el-input>
    </div>
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

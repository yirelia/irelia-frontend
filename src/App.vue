<script setup lang="ts">
import { Graph } from '@antv/x6/es';
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';

const grapRef = ref<HTMLElement | null>(null);


const state = ref({
  hasCommond: false,
  hasRedo: false
})
const data = ref<{ name: string, id: string, age: string }>({
  name: '',
  id: '',
  age: ''
})

abstract class Command {
  abstract execute(): any;
  abstract redo(): any;
}

class AddNodeCommand extends Command {
  constructor(private graph: Graph, private node: any) {
    super();
  }

  execute() {
    this.graph.addNode(this.node);
  }

  redo() {
    this.graph.removeCell(this.node)
  }
}

class UpdateDataCommand extends Command {
  constructor(private node: any, private oldData: any, private newData: any) {
    super();
  }

  execute() {
    this.node.setData(this.newData);
  }

  redo() {
    this.node.setData(this.oldData);
  }
}

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
      command.execute();
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.redo();
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
    console.log(node.getData());
    data.value = node.getData();
  });
});

let val = 3
const addNode = () => {
  ++val;
  const addNodeCommand = new AddNodeCommand(graph, {
    id: val.toString(),
    x: 300,
    y: 300,
    width: 100,
    height: 40,
    label: val.toString(),
    data: {
      id: val.toString(),
      name: val.toString(),
      age: val.toString()
    }
  });

  history.execute(addNodeCommand);
}

const removeNode = () => {
  ElMessage({
    message: '删除节点',
    type: 'success'
  });
  // graph.removeNode(val.toString());
}
</script>

<template>
  <div class="container">
    <div class="left-panel" ref="grapRef"></div>
    <div class="right-panel">
      <div>
        <el-button>撤销</el-button>
        <el-button>重做</el-button>
      </div>
      <el-button @click="addNode">新增节点</el-button>
      <el-button @click="removeNode">删除节点</el-button>

      <el-input v-model="data.id"></el-input>
      <el-input v-model="data.name"></el-input>
      <el-input v-model="data.age"></el-input>
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

<template>
  <el-container>
    <el-aside width="300px">
      <div>

        <div></div>

      </div>

    </el-aside>
    <el-main>
      <div ref="faultTreeRef" style="height : 100%"></div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
  import { Graph, Shape } from "@antv/x6";
  import { onMounted, ref } from "vue";
  import { AndGate, CFalut, Falut, OrGate } from "./coustom-node";
  import { Snapline } from '@antv/x6-plugin-snapline'
  import { ElMessage } from "element-plus";
  const faultTreeRef = ref<HTMLElement>();
  const graph = ref<Graph>();

  const handleFault = (node: Falut | OrGate) => {
    node.toggleActive(true)
    const edges = graph.value!.getOutgoingEdges(node) || []
    for (const edge of edges) {
      const target = edge.getTargetNode()
      edge.setAttrs({
        line: {
          stroke: 'red',
          strokeDasharray: 5,
          targetMarker: 'classic',
          style: {
            animation: 'ant-line 30s infinite linear',
          },
        }
      })
      if (target) {
        if (target.shape === 'orGate') {
          (target as OrGate).toggleActive(true)
          ElMessage.error('或门触发故障')
          setTimeout(() => {
            handleFault(target as OrGate)

          }, 2000)
        } else {
          (target as Falut).toggleActive(true)
        }
      }
    }
  }
  onMounted(() => {
    graph.value = new Graph({
      container: faultTreeRef.value,
      panning: true,
      mousewheel: true,
      grid: true,
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          })
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF',
            },
          },
        },
      },
    });

    graph.value.use(
      new Snapline({
        enabled: true,
      }),
    )
    // 控制连接桩显示/隐藏
    const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
      for (let i = 0, len = ports.length; i < len; i += 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden'
      }
    }
    graph.value.on('node:mouseenter', () => {
      const ports = faultTreeRef.value!.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>
      showPorts(ports, true)
    })
    graph.value.on('node:mouseleave', () => {
      const ports = faultTreeRef.value!.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>
      showPorts(ports, false)
    })

    graph.value.on('node:moved', ({ node }) => {
      console.log(node.position())
    })

    graph.value.on('edge:added', ({ edge }) => {
      console.log(edge.source, edge.target, edge.getSourceCell(), edge.getTargetCell())
    })

    graph.value.on('dispach:fault', ({ node }: { node: Falut }) => {
      if (!node.isFault()) {
        ElMessage.error('下发故障')
        setTimeout(() => {
          node.toggleActive(true)
          handleFault(node)

        }, 2000)

      }
    })




    graph.value.addNode(new Falut({
      id: 'y1',
      x: 100,
      y: 260,
      attrs: {
        label: {
          text: '油泵故障',
        }
      }
    }))

    graph.value.addNode(new Falut({
      id: 'y2',
      x: 300,
      y: 260,
      attrs: {
        label: {
          text: '油泵故障',
        }
      }
    }))

    graph.value.addNode(new Falut({
      id: 'f1',
      x: 500,
      y: 260,
      attrs: {
        label: {
          text: '风扇故障',
        }
      }
    }))

    graph.value.addNode(new Falut({
      id: 'f2',
      x: 700,
      y: 260,
      attrs: {
        label: {
          text: '风机故障',
        }
      }
    }))


    graph.value.addNode(new OrGate({
      id: 'r1',
      x: 200,
      y: 60
    }))

    graph.value.addNode(new OrGate({
      id: 'r2',
      x: 600,
      y: 60
    }))

    graph.value.addNode(new CFalut({
      id: 'y3',
      x: 200,
      y: -120,
      attrs: {
        label: {
          text: '油泵故障',
        }
      }
    }))

    graph.value.addNode(new CFalut({
      id: 'f3',
      x: 600,
      y: -120,
      attrs: {
        label: {
          text: '风机故障',
        }
      }
    }))

    graph.value.addEdge({
      source: {
        cell: 'y1',
        port: 'top'
      },
      target: {
        cell: 'r1',
        port: 'bottom'
      }
    })

    graph.value.addEdge({
      source: {
        cell: 'y2',
        port: 'top'
      },
      target: {
        cell: 'r1',
        port: 'bottom'
      }
    })

    graph.value.addEdge({
      source: {
        cell: 'r1',
        port: 'top'
      },
      target: {
        cell: 'y3',
        port: 'bottom'
      }
    })

    graph.value.centerContent()
  });
</script>

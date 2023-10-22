"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProps,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import TextField from "@mui/material/TextField";

import Button from "@mui/material/Button";

import Sidebar from "../(components)/sidebar";
import CustomNode from "../(components)/CustomNode";
import CustomNodeStart from "../(components)/CustomNodeStart";
import EdgeData from "../(components)/EdgeData";
import NodeData from "../(components)/NodeData";
import CustomNodeEnd from "../(components)/CustomNodeEnd";
import ButtonEdge from "../(components)/ButtonEdge";

import "./index.css";

const initialNodes = [
  {
    id: "START",
    type: "input",
    data: { label: "INICIO", max_retries: 1, in_other_case: "" },
    position: { x: 10, y: 0 },
  },
];


const nodeTypes = {
  selectorNode: CustomNode,
  output: CustomNodeEnd,
  input: CustomNodeStart,
};

const edgeTypes = {
  buttonedge: ButtonEdge,
};
const DnDFlow = () => {
  const reactFlowWrapper = useRef<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowProps | any
  >(null);
  const [nodeData, setNodeData] = useState<any>(null);
  const [edgeData, setEdgeData] = useState<any>(null);
  const [flowName, setFlowName] = useState<any>("flujo_ejemplo");

  const [nodeSelected, setNodeSelected] = useState<any>(null);
  const [edgeSelected, setEdgeSelected] = useState<any>(null);
  const [code, setCode] = useState<any>(null);
  const [id, setId] = useState<any>(null);

  const flowKey = "example-flow";
  const init = (element: ReactFlowProps) => {
    setReactFlowInstance(element!);
    console.log(element);
    //element.setViewport({ x: 0, y: 0, zoom: 1 });
  };
  const onConnect = useCallback((params: any) => {
    params["type"] = "buttonedge";
    params["data"] = { condition: "", samples: [] };
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      let label = `Editar texto haciendo click aqui`;
      let new_id = `dndnode_${id}`;
      setId(id+1)

      if (type == "output") {
        label = "FIN";
        new_id = "END";
      }

      const newNode = {
        id: new_id,
        type,
        position,
        data: { label: label, max_retries: 1, in_other_case: "" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, id]
  );

  const onNodeClick = useCallback(
    (event: any, node: any) => {
      setEdgeSelected(null);
      event.preventDefault();
      setNodeSelected(node);
    },
    [setNodeSelected]
  );
  const onEdgeClick = useCallback(
    (event: any, edge: any) => {
      setNodeSelected(null);
      event.preventDefault();
      setEdgeSelected(edge);
    },
    [setEdgeSelected]
  );

  useEffect(() => {
    if (nodeSelected) {
      console.log("edit", nodeSelected, nodeData);
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeSelected.id) {
            console.log("Set a");
            node = nodeData;
          }
          return node;
        })
      );
      setNodeSelected(null);
    }
  }, [nodeData, setNodes]);

  useEffect(() => {
    if (edgeSelected) {
      console.log("editando qui");
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id === edgeSelected.id) {
            edge = edgeData;
          }
          return edge;
        })
      );
      setEdgeSelected(null);
    }
  }, [edgeData, setEdges]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      let flow = reactFlowInstance.toObject();
      flow["name_flow"] = flowName
      setCode(JSON.stringify(flow));
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance, flowName]);

  const handleDelete = (elementToDelete: string) => {
    console.log("delete", elementToDelete);
    if (elementToDelete == "node") {
      setNodes((nds) => {
        const result = nds.filter((i) => i.id != nodeSelected.id);
        return result;
      });
      setNodeSelected(null);
    }
    if (elementToDelete == "edge") {
      setEdges((edges) => {
        const result = edges.filter((i) => i.id != edgeSelected.id);
        return result;
      });
      setEdgeSelected(null);
    }
  };

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey)!);

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setId(flow.nodes.length+1)

        //setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes]);

  return (
    <div className="parent">
      <Grid container spacing={2} className="dndflow">
        <Grid xs={9} className="content">
          <div>
            <ReactFlowProvider>
              <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onInit={(element:any) => {
                    init(element);
                  }}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  fitView
                  onNodeClick={onNodeClick}
                  onEdgeClick={onEdgeClick}
                  //defaultViewport={defaultViewport}
                >
                  <Controls />
                  <Panel position="top-right">
                    <Grid container spacing={3}>
                      <Button variant="outlined" onClick={onSave}>
                        Exportar
                      </Button>
                      <Button variant="outlined" onClick={onRestore}>
                        Abrir
                      </Button>
                    </Grid>

                    {/* <button onClick={onAdd}>add node</button> */}
                  </Panel>
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          </div>
        </Grid>
        <Grid xs={3}>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <TextField
                id="outlined-basic"
                label="Nombre de flujo"
                value={flowName}
                variant="outlined"
                onChange={(evt) => setFlowName(evt.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <Sidebar />
            </Grid>

            <Grid xs={12}>
              <div>
                {nodeSelected && (
                  <NodeData
                    data={nodeSelected}
                    handleDelete={handleDelete}
                    setNodeData={setNodeData}
                  ></NodeData>
                )}
                <br></br>
                {edgeSelected && (
                  <EdgeData
                    data={edgeSelected}
                    setEdgeData={setEdgeData}
                    handleDelete={handleDelete}
                  ></EdgeData>
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {code && (
        <div>
          <p>Codigo generado:</p>
          <textarea
            readOnly
            name=""
            id=""
            cols={25}
            rows={30}
            value={code}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default DnDFlow;

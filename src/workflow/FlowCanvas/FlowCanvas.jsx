import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  ReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  BaseEdge,
  getStraightPath,
  useReactFlow,
} from '@xyflow/react';
import { useFlowDndState } from './FlowDndContext';
import GraphControls from '../Modules/FlowCanvas/GraphControls/GraphControls';
import '@xyflow/react/dist/style.css';
import StartNode from '../Molecules/Canvas/StartNode/StartNode';
import EndNode from '../Molecules/Canvas/EndNode/EndNode';
import CanvasNode from '../Molecules/Canvas/CanvasNode/CanvasNode';
import ProceduresNode from '../Molecules/Canvas/ProceduresNode/ProceduresNode';
import LoopNode from '../Molecules/Canvas/LoopNode/LoopNode';
import './FlowCanvas.css';
import branchStyles from './BranchPath.module.css';
import { FLOW_CONNECTOR_GAP } from '../flowLayoutConstants';

/* ─── Custom Node Wrappers ─── */
function resolveCanvasNodeState(data, isSelected) {
  if (data.previewHighlight) return 'preview-active';
  if (isSelected) return 'selected';
  return 'default';
}

function StartNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <StartNode title={data.title} subtitle={data.subtitle} selected={isSelected} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function TriggerNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <CanvasNode nodeType="trigger" label={data.headerLabel || (data.subtype === 'Schedule-based' ? 'Schedule-based trigger' : 'Trigger')} stepNumber={data.stepNumber} title={data.title} description={data.subtitle} titlePlaceholder={data.titlePlaceholder} descriptionPlaceholder={data.descriptionPlaceholder} hasToggle={false} toggleEnabled={data.toggleEnabled} toggleDisabled={data.viewOnly} viewOnly={data.viewOnly} state={resolveCanvasNodeState(data, isSelected)} onDelete={data.onDelete} onMoveUp={data.onMoveUp} onMoveDown={data.onMoveDown} canMoveUp={data.canMoveUp} canMoveDown={data.canMoveDown} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function TaskNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <CanvasNode nodeType="task" label="Task" stepNumber={data.stepNumber} title={data.title} description={data.subtitle} titlePlaceholder={data.titlePlaceholder} descriptionPlaceholder={data.descriptionPlaceholder} hasAiIcon={data.hasAiIcon} hasToggle={data.hasToggle} toggleEnabled={data.toggleEnabled} toggleDisabled={data.viewOnly} viewOnly={data.viewOnly} onToggleChange={data.onToggleChange} state={isSelected ? 'selected' : 'default'} onDelete={data.onDelete} onMoveUp={data.onMoveUp} onMoveDown={data.onMoveDown} canMoveUp={data.canMoveUp} canMoveDown={data.canMoveDown} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function VoiceCallNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <CanvasNode nodeType="task" label="Task" stepNumber={data.stepNumber} title={data.title} description={data.subtitle} titlePlaceholder={data.titlePlaceholder} descriptionPlaceholder={data.descriptionPlaceholder} hasAiIcon={data.hasAiIcon} hasToggle={data.hasToggle} toggleEnabled={data.toggleEnabled} toggleDisabled={data.viewOnly} viewOnly={data.viewOnly} onToggleChange={data.onToggleChange} state={isSelected ? 'selected' : 'default'} onDelete={data.onDelete} onMoveUp={data.onMoveUp} onMoveDown={data.onMoveDown} canMoveUp={data.canMoveUp} canMoveDown={data.canMoveDown} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function BranchNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <CanvasNode nodeType="branch" label="Branch" stepNumber={data.stepNumber} title={data.title} description={data.subtitle} titlePlaceholder={data.titlePlaceholder} descriptionPlaceholder={data.descriptionPlaceholder} hasToggle={data.hasToggle} toggleEnabled={data.toggleEnabled} toggleDisabled={data.viewOnly} viewOnly={data.viewOnly} hasAddButton onAddClick={data.onAddBranch} state={isSelected ? 'selected' : 'default'} onDelete={data.onDelete} onMoveUp={data.onMoveUp} onMoveDown={data.onMoveDown} canMoveUp={data.canMoveUp} canMoveDown={data.canMoveDown} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function ControlNodeWrapper({ id, data, nodeType, label }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <CanvasNode
        nodeType={nodeType}
        label={label}
        stepNumber={data.stepNumber}
        title={data.title}
        description={data.subtitle}
        titlePlaceholder={data.titlePlaceholder}
        descriptionPlaceholder={data.descriptionPlaceholder}
        hasToggle={data.hasToggle}
        toggleEnabled={data.toggleEnabled}
        toggleDisabled={data.viewOnly} viewOnly={data.viewOnly}
        state={isSelected ? 'selected' : 'default'}
        onDelete={data.onDelete}
        onMoveUp={data.onMoveUp}
        onMoveDown={data.onMoveDown}
        canMoveUp={data.canMoveUp}
        canMoveDown={data.canMoveDown}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function ProceduresNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <ProceduresNode
        stepNumber={data.stepNumber}
        procedureItems={data.procedureItems || []}
        hasToggle={data.hasToggle}
        toggleEnabled={data.toggleEnabled}
        toggleDisabled={data.viewOnly} viewOnly={data.viewOnly}
        state={resolveCanvasNodeState(data, isSelected)}
        onDelete={data.onDelete}
        onMoveUp={data.onMoveUp}
        onMoveDown={data.onMoveDown}
        canMoveUp={data.canMoveUp}
        canMoveDown={data.canMoveDown}
        onToggleChange={data.onToggleChange}
        onDropProcedure={data.onDropProcedure}
        onSelectProcedure={data.onSelectProcedure}
        onRemoveProcedure={data.onRemoveProcedure}
        selectedProcedureId={data.selectedProcedureId}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function DelayNodeWrapper(props) {
  return <ControlNodeWrapper {...props} nodeType="delay" label="Delay" />;
}

function ParallelNodeWrapper(props) {
  return <ControlNodeWrapper {...props} nodeType="parallel" label="Parallel tasks" />;
}

function LoopNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    // 860px wide wrapper — wider than standard 432px node-center so
    // handles are placed at the visual center of the loop container.
    <div style={{ width: 860, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <Handle type="target" position={Position.Top} />
      <LoopNode
        loopNodeId={id}
        stepNumber={data.stepNumber}
        title={data.title}
        description={data.subtitle}
        titlePlaceholder={data.titlePlaceholder}
        descriptionPlaceholder={data.descriptionPlaceholder}
        loopChildren={data.loopChildren || []}
        loopBodyHeight={data.loopBodyHeight}
        afterLoopConnectorId={data.afterLoopConnectorId}
        selectedNodeId={data.selectedNodeId}
        hasToggle={data.hasToggle}
        toggleEnabled={data.toggleEnabled}
        toggleDisabled={data.viewOnly}
        viewOnly={data.viewOnly}
        state={isSelected ? 'selected' : 'default'}
        onDelete={data.onDelete}
        onMoveUp={data.onMoveUp}
        onMoveDown={data.onMoveDown}
        canMoveUp={data.canMoveUp}
        canMoveDown={data.canMoveDown}
        onChildClick={data.onChildClick}
        onChildDelete={data.onChildDelete}
        onChildToggleChange={data.onChildToggleChange}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function SubAgentNodeWrapper(props) {
  return <ControlNodeWrapper {...props} nodeType="subagent" label="Sub-agent" />;
}

function BranchPathNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const chipClass = [
    branchStyles.chip,
    data.isFallback ? branchStyles.chipFallback : '',
    isSelected ? branchStyles.chipSelected : '',
    data.isVoiceCallBranch ? branchStyles.chipNoPointer : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={branchStyles.pathWrapper}>
      <Handle type="target" position={Position.Top} />
      <div className={chipClass}>
        <span className={branchStyles.chipLabel}>{data.label}</span>
        {!data.isFallback && !data.isVoiceCallBranch && (
          <span className={`material-symbols-outlined ${branchStyles.chipIcon}`}>info</span>
        )}
        {!data.isVoiceCallBranch && (
          <div className={branchStyles.chipMenuWrapper} ref={menuRef}>
            <span
              className={`material-symbols-outlined ${branchStyles.chipMenu}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!data.isFallback) setMenuOpen((m) => !m);
              }}
            >more_vert</span>
            {menuOpen && !data.isFallback && (
              <div className={branchStyles.chipDropdown}>
                <button
                  className={branchStyles.chipDropdownItem}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); data.onDelete?.(); }}
                >
                  <span className="material-symbols-outlined">delete</span>
                  Delete branch
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function EndNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <EndNode
        selected={isSelected}
        viewOnly={data.viewOnly}
        isDraggingFromLHS={data.isDraggingFromLHS}
        onDropBeforeEnd={data.onDropBeforeEnd}
        hideAdd={data.hideAdd}
      />
    </div>
  );
}

function BranchEndNodeWrapper() {
  return (
    <div className="flow-canvas__branch-end-wrapper">
      <Handle type="target" position={Position.Top} />
      <div className="flow-canvas__branch-end">
        End
      </div>
    </div>
  );
}

function LoopAnchorNodeWrapper() {
  return (
    <div className="flow-canvas__loop-anchor">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

/* ─── Custom Edge: main connector with + button and dnd-kit drop zone ─── */
function AddButtonEdge({ id, source, target, sourceX, sourceY, targetX, targetY, style, data }) {
  const { isDraggingFromLHS } = useFlowDndState();
  const viewOnly = data?.viewOnly;
  const connectorId = data?.connectorId;

  const { setNodeRef, isOver } = useDroppable({
    id: connectorId || `edge-fallback-${id}`,
    disabled: viewOnly || !connectorId,
    data: {
      afterNodeId: data?.afterNodeId ?? null,
      branchPathId: data?.branchPathId,
      loopBodyId: data?.loopBodyId,
      insertAtBeginning: data?.insertAtBeginning,
    },
  });

  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  const btnClass = [
    'flow-canvas__edge-add',
    isDraggingFromLHS ? 'flow-canvas__edge-add--lhs-drag' : '',
    isOver ? 'flow-canvas__edge-add--drop-target' : '',
  ].filter(Boolean).join(' ');

  const showAddButton = !viewOnly && source !== '__start__' && target !== '__end__' && !data?.hideAddButton;
  const isEndEdge = target === '__end__';

  const isVertical = Math.abs(sourceX - targetX) < 8;
  const lineTop = Math.min(sourceY, targetY);
  const lineHeight = Math.max(Math.abs(targetY - sourceY), 56);
  const dropX = isVertical ? labelX - 28 : labelX - 28;
  const dropY = isVertical ? lineTop : labelY - 28;
  const dropW = 56;
  const dropH = isVertical ? lineHeight : 56;

  const edgeStroke = isOver ? '#1976d2' : (style?.stroke || '#ccd5e4');
  const edgeStrokeWidth = isOver ? 8 : (style?.strokeWidth || 1);

  return (
    <>
      {!isEndEdge && (
        <BaseEdge
          id={id}
          path={edgePath}
          style={{ ...style, stroke: edgeStroke, strokeWidth: edgeStrokeWidth }}
        />
      )}
      {!viewOnly && connectorId && (
        <foreignObject x={dropX} y={dropY} width={dropW} height={dropH}>
          <div
            ref={setNodeRef}
            className={`flow-canvas__connector-drop-zone${isOver ? ' flow-canvas__connector-drop-zone--over' : ''}`}
          >
            {showAddButton && (
              <button className={btnClass} type="button" tabIndex={-1}>
                <span className="material-symbols-outlined">add</span>
              </button>
            )}
          </div>
        </foreignObject>
      )}
    </>
  );
}

/* ─── Custom Edge: branch fan ─── */
function BranchFanEdge({ sourceX, sourceY, targetX, targetY }) {
  const midY = sourceY + 30;
  const d = `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
  return <path d={d} className="flow-canvas__branch-fan" fill="none" />;
}

/* ─── Stable maps ─── */
const NODE_TYPES = {
  start: StartNodeWrapper,
  trigger: TriggerNodeWrapper,
  task: TaskNodeWrapper,
  voiceCall: VoiceCallNodeWrapper,
  branch: BranchNodeWrapper,
  delay: DelayNodeWrapper,
  parallel: ParallelNodeWrapper,
  loop: LoopNodeWrapper,
  subagent: SubAgentNodeWrapper,
  procedures: ProceduresNodeWrapper,
  branchPath: BranchPathNodeWrapper,
  branchEnd: BranchEndNodeWrapper,
  loopAnchor: LoopAnchorNodeWrapper,
  end: EndNodeWrapper,
};

const EDGE_TYPES = {
  addButton: AddButtonEdge,
  branchFan: BranchFanEdge,
};

/* ─── Main FlowCanvas ─── */
// Nodes are positioned purely by buildFlow() — no canvas drag-to-reorder.
// This matches Zapier/n8n's fixed-layout model and eliminates all the
// localNodes sync complexity that was causing diagonal lines and ghost buttons.
function FlowCanvasInner({
  nodes = [],
  edges = [],
  onNodeClick,
  onDropNode,
  orientation = 'vertical',
  onOrientationChange,
  onRun,
  onEdit,
  selectedNodeId,
  viewOnly = false,
  previewOpen = false,
  previewActive = false,
}) {
  const { zoomTo, fitView, setCenter, setViewport, getViewport } = useReactFlow();
  const { isDraggingFromLHS } = useFlowDndState();
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef(null);
  const initialPositioned = useRef(false);

  const onDropNodeRef = useRef(onDropNode);
  useEffect(() => { onDropNodeRef.current = onDropNode; }, [onDropNode]);

  const endEdgeSourceId = useMemo(
    () => edges.find((e) => e.target === '__end__')?.source ?? null,
    [edges],
  );

  // Enrich nodes with selectedNodeId — positions come directly from buildFlow,
  // no local state needed because nodes never move on the canvas.
  const styledNodes = useMemo(
    () => nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        selectedNodeId,
        viewOnly,
        isDraggingFromLHS,
        previewHighlight: previewActive && (n.type === 'trigger' || n.type === 'procedures'),
        ...(n.id === '__end__' && !viewOnly && !n.data?.hideAddBeforeEnd
          ? {
              onDropBeforeEnd: (type, label, description) => {
                onDropNodeRef.current?.({
                  type,
                  label,
                  description,
                  afterNodeId: n.data?.afterNodeId ?? endEdgeSourceId,
                });
              },
            }
          : {}),
        ...(n.id === '__end__' ? { hideAdd: !!n.data?.hideAddBeforeEnd } : {}),
      },
    })),
    [nodes, selectedNodeId, viewOnly, isDraggingFromLHS, endEdgeSourceId, previewActive]
  );

  // Pin start node 24px below the controls bar, horizontally centered, at zoom=1.
  // Controls: top=8px + height≈52px → bottom≈60px → target top = 60+24 = 84px.
  const recenterFlow = useCallback((duration = 0) => {
    const startNode = nodes.find(n => n.type === 'start');
    const canvas = canvasRef.current;
    if (!startNode || !canvas) return;
    const { width } = canvas.getBoundingClientRect();
    setViewport({ x: width / 2, y: 84 - startNode.position.y, zoom: 1 }, { duration });
  }, [nodes, setViewport]);

  const positionToStart = useCallback(() => recenterFlow(0), [recenterFlow]);

  // Run once on initial load
  useEffect(() => {
    if (initialPositioned.current || !nodes.length) return;
    const timer = setTimeout(() => {
      positionToStart();
      initialPositioned.current = true;
    }, 80);
    return () => clearTimeout(timer);
  }, [nodes.length, positionToStart]);

  // Re-pin when nodes are added/removed
  const prevNodeCountRef = useRef(nodes.length);
  useEffect(() => {
    if (!initialPositioned.current) return;
    if (nodes.length !== prevNodeCountRef.current) {
      prevNodeCountRef.current = nodes.length;
      setTimeout(() => positionToStart(), 80);
    }
  }, [nodes.length, positionToStart]);

  // Re-center when preview panel opens/closes (canvas width changes like RHS drawer).
  const prevPreviewOpenRef = useRef(previewOpen);
  useEffect(() => {
    if (!initialPositioned.current) {
      prevPreviewOpenRef.current = previewOpen;
      return;
    }
    if (prevPreviewOpenRef.current === previewOpen) return;
    prevPreviewOpenRef.current = previewOpen;
    const timer = setTimeout(() => recenterFlow(300), 80);
    return () => clearTimeout(timer);
  }, [previewOpen, recenterFlow]);

  const defaultEdgeOptions = useMemo(
    () => ({ type: 'addButton', style: { stroke: '#ccd5e4', strokeWidth: 1 } }),
    []
  );

  const handleNodeClick = useCallback(
    (event, node) => {
      if (event.target.closest('.cnh__toggle')) return;
      onNodeClick?.(node);
      // Read width after React has flushed the re-render (RHS panel may open,
      // making the canvas narrower). Using rAF gives us the post-layout width.
      requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { width } = canvas.getBoundingClientRect();
        const { y, zoom: currentZoom } = getViewport();
        setViewport({ x: width / 2, y, zoom: currentZoom }, { duration: 300 });
      });
    },
    [onNodeClick, getViewport, setViewport]
  );

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          viewOnly,
        },
      })),
    [edges, viewOnly]
  );

  const handleViewportChange = useCallback(({ zoom: z }) => {
    setZoom(Math.round(z * 100));
  }, []);

  return (
    <div
      ref={canvasRef}
      className={`flow-canvas${isDraggingFromLHS ? ' flow-canvas--lhs-dragging' : ''}`}
      style={{ '--flow-connector-gap': `${FLOW_CONNECTOR_GAP}px` }}
    >
      <div className="flow-canvas__toolbar-anchor">
        <GraphControls
          orientation={orientation}
          onOrientationChange={onOrientationChange}
          onRun={onRun}
          onEdit={onEdit}
          zoom={zoom}
          onZoomSelect={(z) => zoomTo(z, { duration: 200 })}
          onFitView={() => { positionToStart(); }}
          viewOnly={viewOnly}
        />
      </div>

      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={handleNodeClick}
        onViewportChange={handleViewportChange}
        defaultViewport={{ x: 0, y: 84, zoom: 1 }}
        nodeOrigin={[0.5, 0]}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnScroll
        zoomOnScroll
      />
    </div>
  );
}

export default function FlowCanvas({ onNodesReorder: _ignored, ...props }) {
  // Wrap with ReactFlowProvider so useReactFlow() hooks inside FlowCanvasInner work correctly.
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

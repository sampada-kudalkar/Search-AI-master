import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import CanvasNode from '../CanvasNode/CanvasNode';
import CanvasNodeHeader from '../CanvasNodeHeader/CanvasNodeHeader';
import CanvasNodeBody from '../CanvasNodeBody/CanvasNodeBody';
import { useFlowDndState } from '../../../FlowCanvas/FlowDndContext';
import '../CanvasNode/CanvasNode.css';
import '../EndNode/EndNode.css';
import {
  FLOW_CONNECTOR_GAP,
  FLOW_STANDARD_NODE_HEIGHT,
} from '../../../flowLayoutConstants';
import styles from './LoopNode.module.css';

export const CONTAINER_W = 860;
const CENTER_X = CONTAINER_W / 2;

/** @deprecated Loop children are laid out inside LoopNode — kept for imports */
export const LOOP_CHILD_X = CONTAINER_W / 4;

export const LOOP_LAYOUT = {
  CARD_H: 94,
  TOP_CONNECTOR_H: 60,
  LOOP_BODY_TOP: 154,
  LOOP_BODY_PAD: 24,
  BTM_CONNECTOR_H: 72,
};

const R = 8;

export function computeLoopBodyHeight(childCount = 1) {
  const count = Math.max(childCount, 1);
  const { LOOP_BODY_PAD } = LOOP_LAYOUT;
  return (
    LOOP_BODY_PAD * 2
    + count * FLOW_STANDARD_NODE_HEIGHT
    + count * FLOW_CONNECTOR_GAP
  );
}

export function computeLoopCanvasHeight(childCount = 1) {
  const { CARD_H, TOP_CONNECTOR_H, BTM_CONNECTOR_H } = LOOP_LAYOUT;
  return CARD_H + TOP_CONNECTOR_H + computeLoopBodyHeight(childCount) + BTM_CONNECTOR_H;
}

export const LOOP_NODE_CANVAS_HEIGHT = computeLoopCanvasHeight(1);

function LoopFrameSvg({ height }) {
  const w = CONTAINER_W;
  const h = height;
  const cx = CENTER_X;

  const dashedTop = `M 0 0 L ${cx} 0`;
  const dashedLeft = `M 0 0 L 0 ${h}`;
  const dashedBottom = `M 0 ${h} L ${cx} ${h}`;
  const entryArrow = `M ${cx} 0 L ${cx} 20`;

  const solidPath = `
    M ${cx} 0
    L ${w - R} 0
    Q ${w} 0 ${w} ${R}
    L ${w} ${h - R}
    Q ${w} ${h} ${w - R} ${h}
    L ${cx} ${h}
  `;

  return (
    <svg
      className={styles.loopSvg}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <marker
          id="loop-arrow-down"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#b8c6e0" />
        </marker>
      </defs>

      <path d={dashedTop} stroke="#b8c6e0" strokeWidth="1.5" strokeDasharray="6 4" strokeLinecap="round" />
      <path d={dashedLeft} stroke="#b8c6e0" strokeWidth="1.5" strokeDasharray="6 4" strokeLinecap="round" />
      <path d={dashedBottom} stroke="#b8c6e0" strokeWidth="1.5" strokeDasharray="6 4" strokeLinecap="round" />
      <path d={entryArrow} stroke="#b8c6e0" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#loop-arrow-down)" />
      <path d={solidPath} stroke="#ccd5e4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoopConnector({
  connectorId,
  loopBodyId,
  afterNodeId,
  viewOnly = false,
  showAdd = true,
  isDropHighlight = false,
}) {
  const { isDraggingFromLHS } = useFlowDndState();
  const { setNodeRef, isOver } = useDroppable({
    id: connectorId,
    disabled: viewOnly || !connectorId,
    data: {
      loopBodyId,
      afterNodeId: afterNodeId ?? null,
    },
  });

  const addClass = [
    styles.connectorAdd,
    isDraggingFromLHS ? styles.connectorAddPulse : '',
    (isOver || isDropHighlight) ? styles.connectorAddOver : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setNodeRef}
      className={`${styles.connector}${isOver ? ` ${styles.connectorOver}` : ''}`}
    >
      <div className={styles.connectorLine} aria-hidden />
      {showAdd && !viewOnly && (
        <button type="button" className={addClass} tabIndex={-1}>
          <span className="material-symbols-outlined">add</span>
        </button>
      )}
    </div>
  );
}

export default function LoopNode({
  loopNodeId,
  stepNumber,
  title,
  description,
  titlePlaceholder = 'For each loop',
  descriptionPlaceholder = 'Repeat the following tasks for each theme',
  loopChildren = [],
  loopBodyHeight = computeLoopBodyHeight(1),
  afterLoopConnectorId,
  selectedNodeId,
  hasToggle = false,
  toggleEnabled = true,
  toggleDisabled = false,
  viewOnly = false,
  onToggleChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  onChildClick,
  onChildDelete,
  onChildToggleChange,
  state = 'default',
}) {
  const [on, setOn] = useState(toggleEnabled);
  useEffect(() => { setOn(toggleEnabled); }, [toggleEnabled]);

  const handleToggle = (val) => {
    if (toggleDisabled) return;
    setOn(val);
    onToggleChange?.(val);
  };

  const isOff = hasToggle && !on;
  const stateClass = state !== 'default' ? ` canvas-node--${state}` : '';
  const canvasHeight = LOOP_LAYOUT.CARD_H + LOOP_LAYOUT.TOP_CONNECTOR_H + loopBodyHeight + LOOP_LAYOUT.BTM_CONNECTOR_H;
  const bottomExitTop = LOOP_LAYOUT.LOOP_BODY_TOP + loopBodyHeight;

  const { setNodeRef: setAfterLoopRef, isOver: isAfterLoopOver } = useDroppable({
    id: afterLoopConnectorId || `connector-after-loop-${loopNodeId}`,
    disabled: viewOnly || !afterLoopConnectorId,
    data: { afterNodeId: loopNodeId },
  });

  const { isDraggingFromLHS } = useFlowDndState();

  const afterLoopAddClass = [
    styles.connectorAdd,
    isDraggingFromLHS ? styles.connectorAddPulse : '',
    isAfterLoopOver ? styles.connectorAddOver : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.root}>
      <div className={`canvas-node${stateClass} ${styles.card}`}>
        <CanvasNodeHeader
          nodeType="loop"
          label="Loop"
          hasToggle={hasToggle}
          toggleEnabled={on}
          toggleDisabled={toggleDisabled}
          viewOnly={viewOnly}
          onToggleChange={handleToggle}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
        <div className={isOff ? 'canvas-node__body--disabled' : undefined}>
          <CanvasNodeBody
            nodeType="loop"
            stepNumber={stepNumber}
            title={title}
            description={description}
            titlePlaceholder={titlePlaceholder}
            descriptionPlaceholder={descriptionPlaceholder}
          />
        </div>
      </div>

      <div className={styles.topConnector} aria-hidden />

      <div className={styles.loopBody} style={{ height: loopBodyHeight }}>
        <LoopFrameSvg height={loopBodyHeight} />
        <div className={`${styles.loopBodyContent} nodrag nopan`}>
          {loopChildren.map((child, index) => {
            const isChildSelected = selectedNodeId === child.id;
            return (
              <React.Fragment key={child.id}>
                <div
                  className={styles.loopChild}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChildClick?.(child.id);
                  }}
                >
                  <CanvasNode
                    nodeType="task"
                    label="Task"
                    stepNumber={child.stepNumber}
                    title={child.title}
                    description={child.subtitle}
                    titlePlaceholder={child.titlePlaceholder || 'Enter task name'}
                    descriptionPlaceholder={child.descriptionPlaceholder || 'Enter description'}
                    hasToggle={child.hasToggle}
                    toggleEnabled={child.toggleEnabled ?? true}
                    toggleDisabled={viewOnly}
                    viewOnly={viewOnly}
                    onToggleChange={(enabled) => onChildToggleChange?.(child.id, enabled)}
                    onDelete={loopChildren.length > 1 ? () => onChildDelete?.(child.id) : undefined}
                    state={isChildSelected ? 'selected' : 'default'}
                  />
                </div>
                <LoopConnector
                  connectorId={`connector-${loopNodeId}-${index}`}
                  loopBodyId={loopNodeId}
                  afterNodeId={child.id}
                  viewOnly={viewOnly}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className={styles.bottomExit} style={{ top: bottomExitTop }}>
        <div className={styles.bottomStack}>
          <div className={styles.bottomLineWrap}>
            <div className={styles.bottomConnectorLine} aria-hidden />
          </div>
          <span className={styles.bottomArrow} aria-hidden>
            <span className="material-symbols-outlined">arrow_downward</span>
          </span>
          <span className="end-node">Loop completes</span>
          <div
            ref={setAfterLoopRef}
            className={`${styles.afterLoopConnector}${isAfterLoopOver ? ` ${styles.connectorOver}` : ''}`}
          >
            <div className={styles.afterLoopLine} aria-hidden />
            {!viewOnly && (
              <button type="button" className={afterLoopAddClass} tabIndex={-1}>
                <span className="material-symbols-outlined">add</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.spacer} style={{ height: canvasHeight }} aria-hidden />
    </div>
  );
}

import React, { useState } from 'react';

// Procedure book icon (matches Prcediure.svg from Figma node-id: 41-43388)
const ProcedureBookIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M13.1984 4.19922H9.59844C9.28795 4.19922 8.98172 4.27151 8.70401 4.41036C8.4263 4.54922 8.18473 4.75083 7.99844 4.99922C7.81214 4.75083 7.57057 4.54922 7.29286 4.41036C7.01515 4.27151 6.70893 4.19922 6.39844 4.19922H2.79844C2.69235 4.19922 2.59061 4.24136 2.51559 4.31638C2.44058 4.39139 2.39844 4.49313 2.39844 4.59922V11.7992C2.39844 11.9053 2.44058 12.007 2.51559 12.0821C2.59061 12.1571 2.69235 12.1992 2.79844 12.1992H6.39844C6.7167 12.1992 7.02192 12.3256 7.24697 12.5507C7.47201 12.7757 7.59844 13.081 7.59844 13.3992C7.59844 13.5053 7.64058 13.607 7.71559 13.6821C7.79061 13.7571 7.89235 13.7992 7.99844 13.7992C8.10452 13.7992 8.20627 13.7571 8.28128 13.6821C8.35629 13.607 8.39844 13.5053 8.39844 13.3992C8.39844 13.081 8.52486 12.7757 8.74991 12.5507C8.97495 12.3256 9.28018 12.1992 9.59844 12.1992H13.1984C13.3045 12.1992 13.4063 12.1571 13.4813 12.0821C13.5563 12.007 13.5984 11.9053 13.5984 11.7992V4.59922C13.5984 4.49313 13.5563 4.39139 13.4813 4.31638C13.4063 4.24136 13.3045 4.19922 13.1984 4.19922ZM6.39844 11.3992H3.19844V4.99922H6.39844C6.7167 4.99922 7.02192 5.12565 7.24697 5.35069C7.47201 5.57573 7.59844 5.88096 7.59844 6.19922V11.7992C7.25257 11.539 6.83129 11.3985 6.39844 11.3992ZM12.7984 11.3992H9.59844C9.16558 11.3985 8.7443 11.539 8.39844 11.7992V6.19922C8.39844 5.88096 8.52486 5.57573 8.74991 5.35069C8.97495 5.12565 9.28018 4.99922 9.59844 4.99922H12.7984V11.3992Z" fill="#555"/>
  </svg>
);
import CanvasNodeHeader from '../CanvasNodeHeader/CanvasNodeHeader';
import styles from './ProceduresNode.module.css';
import './CanvasNode.css';

export default function ProceduresNode({
  stepNumber,
  procedureItems = [],
  hasToggle = false,
  toggleEnabled = true,
  onToggleChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  state = 'default',
  onDropProcedure,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const stateClass = state !== 'default' ? ` canvas-node--${state}` : '';

  const handleDragOver = (e) => {
    const type = e.dataTransfer.types.includes('application/reactflow-type');
    if (!type) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only clear if truly leaving this node (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const nodeType = e.dataTransfer.getData('application/reactflow-type');
    // description = procedure name (from LHSEntityGroup sub-item)
    // label = category name (parentLabel) — use description for the chip
    const description = e.dataTransfer.getData('application/reactflow-description');
    const label = e.dataTransfer.getData('application/reactflow-label');
    const procedureName = description || label;
    if (nodeType === 'procedures' && procedureName && onDropProcedure) {
      onDropProcedure(procedureName);
    }
  };

  return (
    <div
      className={`canvas-node${stateClass}${isDragOver ? ' canvas-node--drop-target' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CanvasNodeHeader
        nodeType="procedures"
        label="Procedures"
        hasToggle={hasToggle}
        toggleEnabled={toggleEnabled}
        onToggleChange={onToggleChange}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />
      <div className={styles.body}>
        {stepNumber != null && (
          <span className={styles.step}>{stepNumber}. Follow procedures</span>
        )}
        {procedureItems.length > 0 ? (
          <div className={styles.chips}>
            {procedureItems.map((p) => (
              <span key={p.id} className={styles.chip}>
                <ProcedureBookIcon />
                <span className={styles.chipName}>{p.name}</span>
                {onDropProcedure && (
                  <button
                    type="button"
                    className={styles.chipClose}
                    onClick={(e) => { e.stopPropagation(); /* remove handled by parent via onDelete */ }}
                    title="Remove"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 11, lineHeight: 1 }}>close</span>
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className={`${styles.empty}${isDragOver ? ` ${styles.emptyDragOver}` : ''}`}>
            {isDragOver ? 'Drop to add procedure' : 'Add procedures from the left panel'}
          </span>
        )}
        {isDragOver && procedureItems.length > 0 && (
          <div className={styles.dropHint}>Drop to add procedure</div>
        )}
      </div>
    </div>
  );
}

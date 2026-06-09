import React, { useState, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import './LHSEntityGroup.css';

function EntityGroupItem({
  item,
  idx,
  nodeType,
  parentLabel,
  viewOnly,
  readOnly,
  editingIdx,
  editDraft,
  setEditDraft,
  canEdit,
  dragAlwaysVisible,
  onStartEdit,
  onCommitEdit,
  onDeleteItem,
  onCancelEdit,
}) {
  const canDrag = !viewOnly && (readOnly || editingIdx !== idx);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lhs-${nodeType}-${parentLabel}-${item}-${idx}`,
    disabled: !canDrag,
    data: {
      type: nodeType,
      label: parentLabel,
      description: item,
      dragPreview: { label: item },
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={[
        'lhs-entity-group__item',
        editingIdx === idx ? 'lhs-entity-group__item--editing' : '',
        isDragging ? 'lhs-entity-group__item--dragging' : '',
      ].filter(Boolean).join(' ')}
      {...(canDrag ? listeners : {})}
      {...(canDrag ? attributes : {})}
    >
      {editingIdx === idx ? (
        <input
          className="lhs-entity-group__item-input"
          value={editDraft}
          autoFocus
          onChange={(e) => setEditDraft(e.target.value)}
          onBlur={() => onCommitEdit(idx)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); onCommitEdit(idx); }
            if (e.key === 'Escape') { e.preventDefault(); onCancelEdit(); }
          }}
        />
      ) : (
        <span className="lhs-entity-group__item-label">{item}</span>
      )}

      {!viewOnly && (
        <div className="lhs-entity-group__item-actions">
          {canEdit && editingIdx === idx ? (
            <button
              className="lhs-entity-group__item-btn lhs-entity-group__item-btn--delete"
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onDeleteItem(idx)}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          ) : canEdit ? (
            <button
              className="lhs-entity-group__item-btn lhs-entity-group__item-btn--edit"
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => { e.stopPropagation(); onStartEdit(idx); }}
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          ) : null}
          <span
            className={`lhs-entity-group__item-drag material-symbols-outlined${dragAlwaysVisible ? ' lhs-entity-group__item-drag--visible' : ''}`}
          >
            drag_indicator
          </span>
        </div>
      )}
    </div>
  );
}

export default function LHSEntityGroup({ title, items = [], nodeType, parentLabel, onItemsChange, viewOnly = false, readOnly = false, dragAlwaysVisible = false }) {
  const canEdit = !viewOnly && !readOnly && !!onItemsChange;
  const [editingIdx, setEditingIdx] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newDraft, setNewDraft] = useState('');
  const addGuardRef = useRef(false);

  const startEdit = (idx) => {
    setEditingIdx(idx);
    setEditDraft(items[idx]);
  };

  const commitEdit = (idx) => {
    const trimmed = editDraft.trim();
    if (trimmed) {
      const next = items.map((it, i) => (i === idx ? trimmed : it));
      onItemsChange?.(next);
    }
    setEditingIdx(null);
  };

  const deleteItem = (idx) => {
    onItemsChange?.(items.filter((_, i) => i !== idx));
    setEditingIdx(null);
  };

  const commitAdd = () => {
    if (addGuardRef.current) return;
    addGuardRef.current = true;
    const trimmed = newDraft.trim();
    if (trimmed) {
      onItemsChange?.([...items, trimmed]);
    }
    setAddingNew(false);
    setNewDraft('');
  };

  const cancelAdd = () => {
    addGuardRef.current = true;
    setAddingNew(false);
    setNewDraft('');
  };

  return (
    <div className="lhs-entity-group">
      <p className="lhs-entity-group__title">{title}</p>

      <div className="lhs-entity-group__items">
        {items.map((item, idx) => (
          <EntityGroupItem
            key={idx}
            item={item}
            idx={idx}
            nodeType={nodeType}
            parentLabel={parentLabel}
            viewOnly={viewOnly}
            readOnly={readOnly}
            editingIdx={editingIdx}
            editDraft={editDraft}
            setEditDraft={setEditDraft}
            canEdit={canEdit}
            dragAlwaysVisible={dragAlwaysVisible}
            onStartEdit={startEdit}
            onCommitEdit={commitEdit}
            onDeleteItem={deleteItem}
            onCancelEdit={() => setEditingIdx(null)}
          />
        ))}

        {addingNew && (
          <div className="lhs-entity-group__item lhs-entity-group__item--editing">
            <input
              className="lhs-entity-group__item-input"
              value={newDraft}
              autoFocus
              placeholder="Item name…"
              onChange={(e) => setNewDraft(e.target.value)}
              onBlur={commitAdd}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); commitAdd(); }
                if (e.key === 'Escape') { e.preventDefault(); cancelAdd(); }
              }}
            />
          </div>
        )}
      </div>

      {canEdit && (
        <button
          className="lhs-entity-group__add-btn"
          type="button"
          onClick={() => { addGuardRef.current = false; setAddingNew(true); setNewDraft(''); }}
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add
        </button>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { PROCEDURES, getProceduresByIds } from '../../../services/procedureService';
import styles from './ProcedureTaskBody.module.css';

export default function ProcedureTaskBody({ initialValues = {}, onFieldChange, onSelectProcedure, viewOnly = false }) {
  const [procedureIds, setProcedureIds] = useState(initialValues.procedureIds ?? []);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuRef = useRef(null);

  useEffect(() => {
    if (!addMenuOpen) return;
    const handler = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setAddMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [addMenuOpen]);

  const procedures = getProceduresByIds(procedureIds);
  const available = PROCEDURES.filter((p) => !procedureIds.includes(p.id));

  const handleAdd = (id) => {
    const next = [...procedureIds, id];
    setProcedureIds(next);
    onFieldChange?.('procedureIds', next);
    setAddMenuOpen(false);
  };

  const handleRemove = (id) => {
    const next = procedureIds.filter((pid) => pid !== id);
    setProcedureIds(next);
    onFieldChange?.('procedureIds', next);
  };

  return (
    <div className={styles.body}>
      {/* ─── Procedure list ─── */}
      <div className={styles.list}>
        {procedures.map((p, idx) => (
          <div
            key={p.id}
            className={`${styles.row}${idx === 0 ? ` ${styles.rowFirst}` : ''}`}
            onClick={() => onSelectProcedure?.(p.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectProcedure?.(p.id)}
          >
            <div className={styles.rowText}>
              <span className={styles.rowName}>{p.name}</span>
              <span className={styles.rowDesc}>
                {(initialValues.procedureOverrides?.[p.id]?.whenToUse) || p.whenToUse || p.description || ''}
              </span>
            </div>
            {!viewOnly && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={(e) => { e.stopPropagation(); handleRemove(p.id); }}
                title="Remove"
              >
                <span className={`material-symbols-outlined ${styles.removeBtnIcon}`}>delete</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ─── Add button ─── */}
      {!viewOnly && (
        <div className={styles.addWrapper} ref={addMenuRef}>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setAddMenuOpen((v) => !v)}
            disabled={available.length === 0}
          >
            <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add_circle</span>
            Add
          </button>
          {addMenuOpen && available.length > 0 && (
            <div className={styles.addMenu}>
              {available.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={styles.addMenuItem}
                  onClick={() => handleAdd(p.id)}
                >
                  <span className={`material-symbols-outlined ${styles.addMenuIcon}`}>menu_book</span>
                  <div className={styles.addMenuText}>
                    <span className={styles.addMenuName}>{p.name}</span>
                    {p.whenToUse && (
                      <span className={styles.addMenuDesc}>{p.whenToUse}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

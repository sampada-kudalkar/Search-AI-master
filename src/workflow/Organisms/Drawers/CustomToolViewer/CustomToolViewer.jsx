import React, { useState, useRef, useEffect } from 'react';
import { FormInput, TextArea, Toggle } from '../../../elemental-stubs';
function NativeDrawer({ isOpen, onClose, children, width = 960 }) {
  React.useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
      <div style={{ position: 'relative', width, maxWidth: '95vw', height: '100%', background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.14)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
const CommonSideDrawer = ({ isOpen, onClose, children }) => <NativeDrawer isOpen={isOpen} onClose={onClose} width={650}>{children}</NativeDrawer>;
/* Select/SelectItem stubs */
function Select({ value, onChange, children }) {
  return <select value={value} onChange={(e) => onChange?.(e.target.value)} style={{ height: 36, padding: '0 12px', border: '1px solid #c5cad3', borderRadius: 4, fontSize: 14, width: '100%', fontFamily: '"Roboto", sans-serif' }}>{children}</select>;
}
function SelectItem({ value, children }) { return <option value={value}>{children}</option>; }
import { OPTION_FIELD_TYPES } from '../CustomToolBuilder/CustomToolBuilder.jsx';
import VariableChip from '../../../Molecules/Inputs/VariableChip/VariableChip';
import styles from './CustomToolViewer.module.css';

// ─── Interactive field ────────────────────────────────────────────────────────

function InteractiveField({ field }) {
  const [textValue, setTextValue] = useState('');
  const [radioValue, setRadioValue] = useState('');
  const [checkValues, setCheckValues] = useState([]);
  const [selectValue, setSelectValue] = useState(undefined);
  const [toggled, setToggled] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const label = field.label || 'Untitled field';
  const required = field.required;

  switch (field.type) {
    case 'text':
    case 'number':
    case 'date':
      return (
        <div className={styles.fieldWrap}>
          <FormInput
            name={`view_${field.id}`}
            type={field.type}
            label={label}
            placeholder={field.placeholder || ''}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            required={required}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className={styles.fieldWrap}>
          <TextArea
            name={`view_${field.id}`}
            label={label}
            placeholder={field.placeholder || ''}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            noFloatingLabel
            required={required}
          />
        </div>
      );

    case 'dropdown':
      return (
        <div className={styles.fieldWrap}>
          <span className={styles.fieldLabel}>
            {label}{required && <span className={styles.required}> *</span>}
          </span>
          <Select
            value={selectValue}
            onChange={(e, v) => setSelectValue(v)}
            placeHolder="Select..."
          >
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </Select>
        </div>
      );

    case 'radio':
      return (
        <div className={styles.fieldWrap}>
          <span className={styles.fieldLabel}>
            {label}{required && <span className={styles.required}> *</span>}
          </span>
          <div className={styles.optionGroup}>
            {field.options.map((opt) => (
              <label key={opt} className={styles.optionLabel}>
                <input
                  type="radio"
                  name={`view_radio_${field.id}`}
                  value={opt}
                  checked={radioValue === opt}
                  onChange={() => setRadioValue(opt)}
                  className={styles.optionInput}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div className={styles.fieldWrap}>
          {!field.hideLabel && (
            <span className={styles.fieldLabel}>
              {label}{required && <span className={styles.required}> *</span>}
            </span>
          )}
          <div className={styles.optionGroup}>
            {field.options.map((opt) => (
              <label key={opt} className={styles.optionLabel}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={checkValues.includes(opt)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckValues((prev) => [...prev, opt]);
                    } else {
                      setCheckValues((prev) => prev.filter((o) => o !== opt));
                    }
                  }}
                  className={styles.optionInput}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'toggle':
      return (
        <div className={styles.toggleRow}>
          <span className={styles.fieldLabel}>{label}</span>
          <Toggle
            name={`view_toggle_${field.id}`}
            checked={toggled}
            onChange={(instance, e) => setToggled(e.target.checked)}
          />
        </div>
      );

    case 'variable':
      return (
        <div className={styles.fieldWrap}>
          <span className={styles.fieldLabel}>
            {label}{required && <span className={styles.required}> *</span>}
          </span>
          <VariableChip
            value={textValue || field.placeholder || 'variable_name'}
            type="variable"
            onChange={setTextValue}
            onDelete={() => setTextValue('')}
          />
        </div>
      );

    case 'tags':
      return (
        <div className={styles.fieldWrap}>
          <span className={styles.fieldLabel}>
            {label}{required && <span className={styles.required}> *</span>}
          </span>
          <div className={styles.tagsInput}>
            {tags.map((tag, i) => (
              <span key={i} className={styles.tagChip}>
                {tag}
                <button
                  type="button"
                  className={styles.tagChipRemove}
                  onClick={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </span>
            ))}
            <input
              className={styles.tagInputInner}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  setTags((prev) => [...prev, tagInput.trim()]);
                  setTagInput('');
                }
              }}
              placeholder={tags.length === 0 ? (field.placeholder || 'Type and press Enter...') : ''}
            />
          </div>
        </div>
      );

    case 'variable': {
      // Variable chip input — shows {x} chips matching the reference screenshot
      const defaultVars = field.defaultVars || [];
      return (
        <div className={styles.fieldWrap}>
          <span className={styles.fieldLabel}>
            {label}{required && <span className={styles.required}> *</span>}
          </span>
          <div className={styles.tagsInput}>
            {defaultVars.map((v, i) => (
              <VariableChip key={i} value={v} type="variable" />
            ))}
            {tags.map((tag, i) => (
              <VariableChip
                key={`tag-${i}`}
                value={tag}
                type="variable"
                onDelete={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}
              />
            ))}
            <input
              className={styles.tagInputInner}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  setTags((prev) => [...prev, tagInput.trim()]);
                  setTagInput('');
                }
              }}
              placeholder={tags.length === 0 && defaultVars.length === 0 ? (field.placeholder || 'Map a variable...') : ''}
            />
            <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 13, color: '#1976d2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{'{'}</span>
              <span style={{ fontWeight: 600 }}>x</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{'}'}</span>
            </span>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CustomToolViewer({ isOpen, tool, onClose, onEditTool }) {
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

  if (!tool) return null;

  const handleEdit = () => {
    setMenuOpen(false);
    onEditTool?.(tool);
  };

  return (
    <CommonSideDrawer
      isOpen={isOpen}
      title=""
      onClose={onClose}
      width="650px"
      shouldScroll={false}
      buttonPosition="right"
      headerRightContent={<span className={styles.drawerSuppress} />}
    >
      <div className={styles.outer}>
        {/* ─── Custom header ─── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} type="button" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.98854 10.6267L8.73215 13.3703C8.85608 13.4943 8.91724 13.6393 8.91565 13.8054C8.91403 13.9715 8.85287 14.1192 8.73215 14.2485C8.60288 14.3778 8.45438 14.4446 8.28665 14.4488C8.11892 14.4531 7.97042 14.3906 7.84115 14.2613L4.10877 10.529C3.95813 10.3783 3.88281 10.2026 3.88281 10.0017C3.88281 9.80088 3.95813 9.62514 4.10877 9.4745L7.84115 5.74212C7.96508 5.61819 8.11224 5.55703 8.28265 5.55862C8.45305 5.56024 8.60288 5.62567 8.73215 5.75494C8.85287 5.88421 8.91537 6.03058 8.91965 6.19404C8.92392 6.3575 8.86142 6.50386 8.73215 6.63312L5.98854 9.37675H15.7931C15.9704 9.37675 16.1189 9.43658 16.2386 9.55623C16.3582 9.67588 16.418 9.82438 16.418 10.0017C16.418 10.1791 16.3582 10.3276 16.2386 10.4472C16.1189 10.5669 15.9704 10.6267 15.7931 10.6267H5.98854Z" fill="currentColor"/>
              </svg>
            </button>
            <span className={styles.headerTitle}>{tool.name}</span>
          </div>
          <div className={styles.headerRight} ref={menuRef}>
            <button
              className={styles.moreBtn}
              type="button"
              onClick={() => setMenuOpen((m) => !m)}
              title="More options"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
            {menuOpen && (
              <div className={styles.moreMenu}>
                <button className={styles.moreMenuItem} type="button" onClick={handleEdit}>
                  <span className="material-symbols-outlined">edit</span>
                  Edit tool
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Interactive fields ─── */}
        <div className={styles.body}>
          {tool.fields?.map((f) => (
            <InteractiveField key={f.id} field={f} />
          ))}
        </div>
      </div>
    </CommonSideDrawer>
  );
}

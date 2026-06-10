import React, { useState } from 'react';
import FieldPickerModal from '../../Modals/FieldPickerModal/FieldPickerModal';
import VariableChip, { DataTypeIcon } from '../../../Molecules/Inputs/VariableChip/VariableChip';
import './VoiceCallToolDrawer.css';

const ATTEMPT_OPTIONS = Array.from({ length: 5 }, (_, i) => String(i + 1));
const INTERVAL_OPTIONS = Array.from({ length: 48 }, (_, i) => String(i + 1));
const INTERVAL_UNIT_OPTIONS = ['Minutes', 'Hours', 'Days'];

function NativeDrawer({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 650,
          maxWidth: '95vw',
          height: '100%',
          overflowY: 'auto',
          background: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.14)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children, showInfo = false }) {
  return (
    <div className="vctd__label-row">
      <span className="vctd__label">{children}</span>
      {showInfo && (
        <span className="material-symbols-outlined vctd__info" aria-hidden="true">
          info
        </span>
      )}
    </div>
  );
}

function StyledSelect({ value, onChange, options, placeholder }) {
  return (
    <div className="vctd__select-wrap">
      <select
        className="vctd__select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ color: value ? '#212121' : '#9e9e9e' }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const optionValue = typeof opt === 'string' ? opt : opt.value;
          const optionLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      <span className="material-symbols-outlined vctd__select-icon">expand_more</span>
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="vctd__checkbox">
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        className={`vctd__checkbox-box${checked ? ' vctd__checkbox-box--checked' : ''}`}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        {checked && <span className="material-symbols-outlined">check</span>}
      </span>
      {label}
    </label>
  );
}

function VoicemailTextarea({ value, onChange, placeholder }) {
  return (
    <div className="vctd__textarea-wrap">
      <textarea
        className="vctd__textarea"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
      <button type="button" className="vctd__var-btn" title="Insert variable" aria-label="Insert variable">
        <DataTypeIcon />
      </button>
    </div>
  );
}

export default function VoiceCallToolDrawer({ isOpen, onClose }) {
  const [hasPhoneChip, setHasPhoneChip] = useState(true);
  const [callFrom, setCallFrom] = useState('');
  const [retryNoAnswer, setRetryNoAnswer] = useState(true);
  const [retryRejected, setRetryRejected] = useState(false);
  const [retryVoicemail, setRetryVoicemail] = useState(true);
  const [voicemailMsg, setVoicemailMsg] = useState('');
  const [maxAttempts, setMaxAttempts] = useState('2');
  const [retryInterval, setRetryInterval] = useState('24');
  const [retryUnit, setRetryUnit] = useState('Hours');
  const [contextVariables, setContextVariables] = useState([]);
  const [fieldPickerOpen, setFieldPickerOpen] = useState(false);

  return (
    <NativeDrawer isOpen={isOpen} onClose={onClose}>
      <div className="vctd">
        <div className="vctd__header">
          <div className="vctd__header-left">
            <button type="button" className="vctd__back" onClick={onClose} aria-label="Back">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            </button>
            <span className="vctd__title">Initiate voice call</span>
          </div>
          <button type="button" className="vctd__save" onClick={onClose}>
            Save
          </button>
        </div>

        <div className="vctd__body">
          {/* Phone number */}
          <div className="vctd__field">
            <FieldLabel>Phone number</FieldLabel>
            <div className="vctd__chip-field">
              {hasPhoneChip ? (
                <VariableChip
                  value="Contact.PhoneNumber"
                  type="variable"
                  onDelete={() => setHasPhoneChip(false)}
                />
              ) : (
                <span className="vctd__label" style={{ color: '#9e9e9e' }}>
                  Add variable…
                </span>
              )}
            </div>
          </div>

          {/* Call from */}
          <div className="vctd__field">
            <FieldLabel showInfo>Call from</FieldLabel>
            <StyledSelect
              value={callFrom}
              onChange={setCallFrom}
              placeholder="Select a caller ID"
              options={[
                { value: 'location-number', label: 'Location number' },
                { value: 'main-number', label: 'Main number' },
              ]}
            />
          </div>

          {/* Call routed to — read-only */}
          <div className="vctd__field">
            <FieldLabel showInfo>Call routed to</FieldLabel>
            <button
              type="button"
              className="vctd__routed-field"
              aria-readonly="true"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined vctd__routed-icon">smart_toy</span>
              <span className="vctd__routed-value">Front desk agent</span>
              <span className="material-symbols-outlined vctd__routed-chevron">expand_more</span>
            </button>
          </div>

          {/* Context — shared library-style container */}
          <div className="vctd__field">
            <FieldLabel showInfo>Context</FieldLabel>
            <div className="vctd__context-box">
              {contextVariables.length === 0 ? (
                <p className="vctd__context-empty">No context added</p>
              ) : (
                <div className="vctd__context-chips">
                  {contextVariables.map((item, i) => (
                    <VariableChip
                      key={`${item.value}-${i}`}
                      value={item.value}
                      type="variable"
                      onDelete={() => setContextVariables((prev) => prev.filter((_, idx) => idx !== i))}
                    />
                  ))}
                </div>
              )}
              <div className="vctd__context-footer">
                <button
                  type="button"
                  className="vctd__context-add-btn"
                  onClick={() => setFieldPickerOpen(true)}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  >
                    add_circle
                  </span>
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Retry settings */}
          <div className="vctd__section">
            <div>
              <div className="vctd__section-title">Retry settings</div>
              <div className="vctd__section-desc">
                Automatically retry if the customer doesn&apos;t connect on the first attempt.
              </div>
            </div>

            <div className="vctd__checkbox-row">
              <Checkbox checked={retryNoAnswer} onChange={setRetryNoAnswer} label="No answer" />
              <Checkbox checked={retryRejected} onChange={setRetryRejected} label="Call rejected" />
              <Checkbox checked={retryVoicemail} onChange={setRetryVoicemail} label="Voice mail" />
            </div>

            {retryVoicemail && (
              <div className="vctd__voicemail-block">
                <div className="vctd__section-desc">
                  Leave a message if the call goes to voicemail.
                </div>
                <VoicemailTextarea
                  value={voicemailMsg}
                  onChange={setVoicemailMsg}
                  placeholder="Enter your message here"
                />
              </div>
            )}
          </div>

          {/* Retry attempts */}
          <div className="vctd__section">
            <div className="vctd__section-title">Retry attempts</div>
            <div className="vctd__retry-grid">
              <div className="vctd__field">
                <FieldLabel>Max attempts</FieldLabel>
                <StyledSelect value={maxAttempts} onChange={setMaxAttempts} options={ATTEMPT_OPTIONS} />
              </div>
              <div className="vctd__field">
                <FieldLabel>Interval between retries</FieldLabel>
                <StyledSelect value={retryInterval} onChange={setRetryInterval} options={INTERVAL_OPTIONS} />
              </div>
              <div className="vctd__field">
                <span className="vctd__label vctd__label--spacer" aria-hidden="true">&nbsp;</span>
                <StyledSelect value={retryUnit} onChange={setRetryUnit} options={INTERVAL_UNIT_OPTIONS} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {fieldPickerOpen && (
        <FieldPickerModal
          overlayZIndex={10000}
          onClose={() => setFieldPickerOpen(false)}
          onSelectField={(value, name) => {
            setContextVariables((prev) => {
              if (prev.some((v) => v.value === value)) return prev;
              return [...prev, { value, name }];
            });
            setFieldPickerOpen(false);
          }}
        />
      )}
    </NativeDrawer>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '../../../Molecules/RHS/RHSHeader/icons/close.svg';

const font = '"Roboto", sans-serif';
const SAMPLE_COLOR = {
  number: '#1976d2',
  string: '#37a248',
};

const CATEGORIES = [
  {
    id: 'business',
    label: 'Business',
    sectionLabel: 'Business fields',
    fields: [
      { name: 'Business name', value: 'Business.name', sample: 'Aspen Dental', valueType: 'string' },
      { name: 'Business phone', value: 'Business.phone', sample: '+1 415-555-0100', valueType: 'string' },
      { name: 'Business email', value: 'Business.email', sample: 'frontdesk@dealer.com', valueType: 'string' },
      { name: 'Business address', value: 'Business.address', sample: '720 Castro St', valueType: 'string' },
      { name: 'Business hours', value: 'Business.hours', sample: '9:00 AM – 6:00 PM', valueType: 'string' },
      { name: 'Business website', value: 'Business.website', sample: 'www.dealer.com', valueType: 'string' },
      { name: 'Business category', value: 'Business.category', sample: 'Automotive', valueType: 'string' },
      { name: 'Business rating', value: 'Business.rating', sample: '4.6', valueType: 'number' },
      { name: 'Total reviews', value: 'Business.totalReviews', sample: '1284', valueType: 'number' },
      { name: 'Response rate', value: 'Business.responseRate', sample: '92%', valueType: 'string' },
      { name: 'NPS score', value: 'Business.npsScore', sample: '68', valueType: 'number' },
      { name: 'Active since', value: 'Business.activeSince', sample: '2018', valueType: 'number' },
      { name: 'Owner name', value: 'Business.ownerName', sample: 'Jane Smith', valueType: 'string' },
      { name: 'Owner email', value: 'Business.ownerEmail', sample: 'jane@dealer.com', valueType: 'string' },
      { name: 'Region', value: 'Business.region', sample: 'West', valueType: 'string' },
      { name: 'Tax ID', value: 'Business.taxId', sample: '94-1234567', valueType: 'string' },
      { name: 'License number', value: 'Business.licenseNumber', sample: 'DL-88421', valueType: 'string' },
      { name: 'DMS provider', value: 'Business.dmsProvider', sample: 'CDK', valueType: 'string' },
      { name: 'Timezone', value: 'Business.timezone', sample: 'America/Los_Angeles', valueType: 'string' },
      { name: 'Locale', value: 'Business.locale', sample: 'en-US', valueType: 'string' },
    ],
  },
  {
    id: 'location',
    label: 'Location',
    sectionLabel: 'Location fields',
    fields: [
      { name: 'Location name', value: 'Location.name', sample: 'Downtown showroom', valueType: 'string' },
      { name: 'Location address', value: 'Location.address', sample: '100 Main St', valueType: 'string' },
      { name: 'Location phone', value: 'Location.phone', sample: '+1 650-555-0110', valueType: 'string' },
      { name: 'Location email', value: 'Location.email', sample: 'downtown@dealer.com', valueType: 'string' },
      { name: 'Location hours', value: 'Location.hours', sample: 'Mon–Sat 8–7', valueType: 'string' },
      { name: 'Service bay count', value: 'Location.serviceBayCount', sample: '12', valueType: 'number' },
      { name: 'Sales team size', value: 'Location.salesTeamSize', sample: '8', valueType: 'number' },
      { name: 'Manager name', value: 'Location.managerName', sample: 'Alex Rivera', valueType: 'string' },
      { name: 'Manager email', value: 'Location.managerEmail', sample: 'alex@dealer.com', valueType: 'string' },
      { name: 'City', value: 'Location.city', sample: 'San Mateo', valueType: 'string' },
      { name: 'State', value: 'Location.state', sample: 'CA', valueType: 'string' },
      { name: 'Zip code', value: 'Location.zipCode', sample: '94401', valueType: 'number' },
    ],
  },
  {
    id: 'contacts',
    label: 'Contacts',
    sectionLabel: 'Contact fields',
    fields: [
      { name: 'Contact first name', value: 'Contact.firstName', sample: 'Raynil', valueType: 'string' },
      { name: 'Contact last name', value: 'Contact.lastName', sample: 'Kumar', valueType: 'string' },
      { name: 'Contact phone', value: 'Contact.phone', sample: '+1 982-919-9109', valueType: 'string' },
      { name: 'Contact email', value: 'Contact.email', sample: 'raynil@example.com', valueType: 'string' },
      { name: 'Vehicle make', value: 'Contact.vehicleMake', sample: 'Toyota', valueType: 'string' },
      { name: 'Vehicle model', value: 'Contact.vehicleModel', sample: 'Camry', valueType: 'string' },
      { name: 'Vehicle year', value: 'Contact.vehicleYear', sample: '2022', valueType: 'number' },
      { name: 'VIN', value: 'Contact.vin', sample: '4T1BF1FK5EU123456', valueType: 'string' },
      { name: 'Last service date', value: 'Contact.lastServiceDate', sample: '2026-03-12', valueType: 'string' },
      { name: 'Last visit reason', value: 'Contact.lastVisitReason', sample: 'Oil change', valueType: 'string' },
      { name: 'Customer since', value: 'Contact.customerSince', sample: '2021', valueType: 'number' },
      { name: 'Preferred channel', value: 'Contact.preferredChannel', sample: '"SMS"', valueType: 'string' },
    ],
  },
  {
    id: 'trigger',
    label: '1. Trigger',
    sectionLabel: 'Task output',
    fields: [
      { name: 'Appointment id', value: 'Trigger.appointmentId', sample: '545043398', valueType: 'number' },
      { name: 'patientID', value: 'Trigger.patientId', sample: '27679', valueType: 'number' },
      { name: 'Provider', value: 'Trigger.provider', sample: 'Dr.John', valueType: 'string' },
      { name: 'diagnosisCode', value: 'Trigger.diagnosisCode', sample: '9651531', valueType: 'number' },
      { name: 'Priority', value: 'Trigger.priority', sample: '"High"', valueType: 'string' },
      { name: 'Order', value: 'Trigger.order', sample: '219', valueType: 'string' },
    ],
  },
];

function FieldChip({ name }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
        border: '1px solid #d1e5f9',
        borderRadius: 4,
        background: '#fff',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          background: '#ecf5fd',
          borderRight: '1px solid #d1e5f9',
          height: 24,
          width: 25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: '4px 0 0 4px',
        }}
      >
        <span style={{ fontSize: 11, color: '#1976d2', fontFamily: 'monospace' }}>{'{}'}</span>
      </span>
      <span
        style={{
          fontSize: 12,
          lineHeight: '16px',
          color: '#555555',
          fontFamily: font,
          whiteSpace: 'nowrap',
          padding: '0 9px 0 6px',
        }}
      >
        {name}
      </span>
    </span>
  );
}

function FieldRow({ field, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(field.value, field.name)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <FieldChip name={field.name} />
      <span
        style={{
          fontSize: 13,
          lineHeight: '20px',
          color: SAMPLE_COLOR[field.valueType] ?? '#555',
          fontFamily: font,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {field.sample}
      </span>
    </button>
  );
}

export default function FieldPickerModal({ onClose, onSelectField, overlayZIndex = 9999 }) {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('trigger');

  const selectedCategory = CATEGORIES.find((c) => c.id === selectedCategoryId);

  const filteredFields = useMemo(() => {
    if (!selectedCategory) return [];
    const q = search.toLowerCase();
    return selectedCategory.fields.filter(
      (f) =>
        f.name.toLowerCase().includes(q)
        || f.value.toLowerCase().includes(q)
        || f.sample.toLowerCase().includes(q.replace(/"/g, ''))
    );
  }, [selectedCategory, search]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: overlayZIndex,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: 8, width: 560, maxWidth: '90vw',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 12px' }}>
          <span style={{ fontSize: 16, fontWeight: 400, lineHeight: '24px', letterSpacing: '-0.32px', color: '#212121', fontFamily: font }}>
            Fields
          </span>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
            <img src={CloseIcon} alt="Close" style={{ width: 24, height: 24 }} />
          </button>
        </div>

        <div style={{ padding: '0 24px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            height: 36, border: '1px solid #d0d5dd', borderRadius: 4,
            padding: '0 12px', boxSizing: 'border-box',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#8f8f8f', flexShrink: 0, fontVariationSettings: "'FILL' 0, 'wght' 300" }}>search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              autoFocus
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 14,
                lineHeight: '20px', color: '#212121', fontFamily: font, background: 'transparent',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', height: 320, padding: '0 24px 24px', boxSizing: 'border-box', gap: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: 180, flexShrink: 0, overflowY: 'auto', paddingRight: 8 }}>
            {CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    height: 32, padding: '0 8px', borderRadius: 4,
                    background: isSelected ? '#f2f4f7' : '#fff',
                    border: 'none', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                  }}
                >
                  <span style={{
                    fontSize: 13, lineHeight: '20px', fontFamily: font,
                    color: isSelected ? '#212121' : '#555555',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textAlign: 'left', flex: 1,
                  }}
                  >
                    {cat.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: '#8f8f8f', fontFamily: font }}>{cat.fields.length}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#8f8f8f', fontVariationSettings: "'FILL' 0, 'wght' 300" }}>chevron_right</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ width: 1, background: '#e9e9eb', flexShrink: 0, marginRight: 12 }} />

          <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, color: '#555', fontVariationSettings: "'FILL' 0, 'wght' 300", marginTop: 2 }}
              >
                expand_more
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: '#555555', fontFamily: font, marginBottom: 10 }}>
                  {selectedCategory?.sectionLabel ?? 'Task output'}
                </div>
                <div
                  style={{
                    borderLeft: '1px solid #e9e9eb',
                    marginLeft: 2,
                    paddingLeft: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {filteredFields.length === 0 ? (
                    <span style={{ fontSize: 13, color: '#8f8f8f', fontFamily: font }}>No fields match your search.</span>
                  ) : (
                    filteredFields.map((field) => (
                      <FieldRow key={field.value} field={field} onClick={onSelectField} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

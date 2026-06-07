import React, { useState } from 'react';
import { FormInput, TextArea } from '../../../elemental-stubs';

export default function SubAgentBody({ initialValues = {}, onFieldChange, viewOnly = false }) {
  const [name, setName] = useState(initialValues.name ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormInput
        name="subAgentName"
        type="text"
        label="Sub-agent name"
        placeholder="Enter name"
        value={name}
        readOnly={viewOnly}
        onChange={(e) => {
          setName(e.target.value);
          onFieldChange?.('name', e.target.value);
        }}
        required
      />
      <TextArea
        name="subAgentDescription"
        label="Description"
        placeholder="Enter description"
        value={description}
        readOnly={viewOnly}
        onChange={(e) => {
          setDescription(e.target.value);
          onFieldChange?.('description', e.target.value);
        }}
        noFloatingLabel
      />
    </div>
  );
}

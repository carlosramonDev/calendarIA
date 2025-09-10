import React, { useState } from 'react';

const NaturalLanguageInput = ({ onProcessText }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onProcessText(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Event with Natural Language</h3>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g., 'Meeting with John tomorrow at 10 AM'"
      />
      <button type="submit">Process Text</button>
    </form>
  );
};

export default NaturalLanguageInput;

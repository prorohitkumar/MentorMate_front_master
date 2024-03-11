import React, { useState } from 'react';
import './TagInput.css';

function TagInput({ onTagsChange, initialTags = [], suggestions = [] }) {
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const updateTags = (newTags) => {
    setTags(newTags);
    onTagsChange(newTags); // This should be a callback to inform the parent component
  };

  const addTag = (value) => {
    // Split the value by comma and trim each tag, filtering out only non-empty tags
    const tagList = value.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    if (tagList.length > 0) {
      // Combine with current tags and remove duplicates
      const newTags = Array.from(new Set([...tags, ...tagList]));
      updateTags(newTags);
    }
    setInput(''); // Clear input field
    setFilteredSuggestions([]); // Clear suggestions
  };

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setInput(userInput);

    // If user input includes a comma, add the tag(s)
    if (userInput.includes(',')) {
      addTag(userInput);
    } else {
      // Otherwise, filter suggestions based on the current input
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  };

  const handleInputKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input) {
      e.preventDefault(); // Prevent form submission and default comma handling
      addTag(input);
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    updateTags(newTags);
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion);
  };

  return (
    <div className="tags-input-container">
      <div className="tag-items">
        {tags.map((tag, index) => (
          <div key={index} className="tag-item">
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="tag-remove-button">
              &times;
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Type and hit enter or comma to add"
        className="tag-input"
      />
      {filteredSuggestions.length > 0 && (
        <div className="suggestions-container">
          {filteredSuggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-tag" onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagInput;
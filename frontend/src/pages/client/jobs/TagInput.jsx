import React, { useState } from "react";

const TagInput = ({ tags, setTags }) => {
  const [inputVal, setInputVal] = useState("");

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault();
      const newTag = inputVal.trim().replace(/,$/, "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputVal("");
    }
  };

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  return (
    <div className="tag-input-wrap">
      {tags.map((tag) => (
        <span key={tag} className="tag-chip">
          {tag}
          <button type="button" onClick={() => removeTag(tag)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <input
        type="text"
        className="tag-input"
        placeholder={tags.length === 0 ? "VD: React, Node.js, Figma — nhấn Enter để thêm" : "Thêm kỹ năng..."}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={addTag}
      />
    </div>
  );
};

export default TagInput;

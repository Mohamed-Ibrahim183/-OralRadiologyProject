// CriteriaSection.js
import React from "react";

const CriteriaSection = ({ categories, submittedcategories }) => {
  if (Array.isArray(submittedcategories)) {
    submittedcategories.forEach((category) => {
      const criteriaElement = document.querySelector(
        `#criteria${category} input`
      );
      if (criteriaElement) {
        criteriaElement.checked = true;
      }
    });
  }

  return (
    <section className="criteria-section">
      <h2 className="assignment-section-title">Criteria</h2>
      <div className="assignment-criteria">
        {categories.map((cat) => (
          <label
            className="criteria-item"
            id={`criteria${cat.categoryId}`}
            key={cat.categoryId}
          >
            <input type="checkbox" className="criteria-checkbox" disabled />
            <p className="criteria-text">
              Upload a photo of the {cat.categoryName}
            </p>
          </label>
        ))}
      </div>
    </section>
  );
};

export default CriteriaSection;

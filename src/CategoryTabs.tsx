// src/CategoryTabs.tsx



type CategoryTabsProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

const CATEGORIES = ["Presidential", "Governmental", "Private", "School"];

export function CategoryTabs({ selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="tabs-container fade-in-glow delay-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          // We conditionally add the 'active' class if this tab is selected
          className={`tab-btn ${selectedCategory === category ? "active" : ""}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
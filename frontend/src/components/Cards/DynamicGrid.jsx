// src/components/ui/DynamicGrid.jsx
import React from 'react';

 function DynamicGrid({ children, columns = 3, gap = "gap-6 md:gap-8" }) {
  // Dictionnaire qui associe le nombre de colonnes aux classes Tailwind correspondantes
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  const selectedGrid = gridClasses[columns] || gridClasses[3];

  return (
    <div className={`grid ${selectedGrid} ${gap}`}>
      {children}
    </div>
  );
}

export default DynamicGrid;
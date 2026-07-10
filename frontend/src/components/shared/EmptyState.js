import React from 'react';
import { SearchX } from 'lucide-react';
export default function EmptyState({ title = 'Nothing found', desc = '', icon: Icon = SearchX }) {
  return (
    <div className="empty-state">
      <Icon size={48} />
      <h3>{title}</h3>
      {desc && <p>{desc}</p>}
    </div>
  );
}

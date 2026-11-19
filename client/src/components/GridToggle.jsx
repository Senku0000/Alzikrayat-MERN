/**
 * GridToggle.jsx
 *
 * A small, reusable toggle (configured via props) for switching the
 * gallery between a grid and a list display style — satisfies the
 * "support at least one alternate display style" requirement.
 */
export default function GridToggle({ view, onChange }) {
  return (
    <div className="toggle-group">
      <button className={view === 'grid' ? 'active' : ''} onClick={() => onChange('grid')}>
        Grid
      </button>
      <button className={view === 'list' ? 'active' : ''} onClick={() => onChange('list')}>
        List
      </button>
    </div>
  );
}

import { useState } from 'react';
import { User } from 'lucide-react';
import { c, ui } from '../../styles/theme';

// Photo file: public/photos/<ID>.jpg. If the file is missing, a normal person icon is shown.
const ProfileCard = ({ id, name, rows }) => {
  const [noPhoto, setNoPhoto] = useState(false);

  return (
    <section style={{ ...ui.card, display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div
        style={{
          width: '96px',
          height: '96px',
          borderRadius: '10px',
          overflow: 'hidden',
          border: `1px solid ${c.border}`,
          background: c.row,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {noPhoto ? (
          <User size={40} color={c.dim} />
        ) : (
          <img
            src={`/photos/${id}.jpg`}
            alt={name}
            onError={() => setNoPhoto(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <div style={{ flex: 1, minWidth: '240px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px 24px' }}>
        <div style={{ gridColumn: '1 / -1', fontSize: '18px', fontWeight: 600 }}>{name}</div>
        {rows.map(([label, value]) => (
          <div key={label}>
            <div style={{ fontSize: '11px', color: c.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: '14px', color: c.text }}>{value || '—'}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileCard;
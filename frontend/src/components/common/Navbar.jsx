import { Menu, Bell, LogOut } from 'lucide-react';
import { c, ui } from '../../styles/theme';

const Navbar = ({
  onMenuClick,
  onNotificationClick,
  notificationCount = 0,
  user = { name: 'Darshu', role: 'student', id: 'J65' },
  onSignOut,
}) => (
  <header
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      background: c.bg,
      borderBottom: `1px solid ${c.border}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button type="button" style={ui.btnIcon} onClick={onMenuClick} aria-label="Open menu">
        <Menu size={18} />
      </button>
      <span style={{ fontSize: '17px', fontWeight: 700, color: c.blue }}>LearnX</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button
        type="button"
        style={{ ...ui.btnIcon, position: 'relative' }}
        onClick={onNotificationClick}
        aria-label={`${notificationCount} notifications`}
      >
        <Bell size={16} />
        {notificationCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              minWidth: '18px',
              height: '18px',
              padding: '0 5px',
              borderRadius: '9px',
              background: c.blue,
              color: '#fff',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {notificationCount}
          </span>
        )}
      </button>

      <div style={{ textAlign: 'right', lineHeight: 1.3 }}>
        <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</div>
        <div style={{ fontSize: '11px', color: c.muted }}>
          {user.role === 'faculty' ? 'Faculty' : `Roll ${user.id}`}
        </div>
      </div>

      <button type="button" style={ui.btnGhost} onClick={onSignOut}>
        <LogOut size={14} /> Sign out
      </button>
    </div>
  </header>
);

export default Navbar;
import { ReactNode } from 'react';
import { A2UIAction } from '../types/a2ui';

interface ComponentProps {
  data: Record<string, unknown>;
  actions?: A2UIAction[];
  children?: ReactNode;
  onAction?: (actionId: string, parameters?: Record<string, unknown>) => void;
}

function Container({ children }: ComponentProps) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>;
}

function Card({ data, children }: ComponentProps) {
  const title = data.title ? String(data.title) : null;
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {title && (
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function Text({ data }: ComponentProps) {
  const variant = data.variant as string || 'body';
  const styles: Record<string, React.CSSProperties> = {
    h1: { fontSize: '32px', fontWeight: '700', margin: '0 0 16px 0', color: '#0f172a' },
    h2: { fontSize: '24px', fontWeight: '600', margin: '0 0 12px 0', color: '#1e293b' },
    h3: { fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', color: '#334155' },
    body: { fontSize: '14px', lineHeight: '1.5', margin: '0', color: '#475569' },
    caption: { fontSize: '12px', lineHeight: '1.4', margin: '0', color: '#64748b' }
  };

  const Tag = variant.startsWith('h') ? variant as 'h1' | 'h2' | 'h3' : 'p';
  return <Tag style={styles[variant]}>{data.text as string}</Tag>;
}

function Badge({ data }: ComponentProps) {
  const status = data.status as string || 'default';
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    approved: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    escalate: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
    blocked: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    active: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    expired: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
    default: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' }
  };

  const color = colors[status] || colors.default;

  return (
    <span style={{
      display: 'inline-flex',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      background: color.bg,
      color: color.text,
      border: `1px solid ${color.border}`
    }}>
      {data.text as string}
    </span>
  );
}

function Table({ data }: ComponentProps) {
  const headers = data.headers as string[] || [];
  const rows = data.rows as string[][] || [];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            {headers.map((header, i) => (
              <th key={i} style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#475569'
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: '12px',
                  color: '#64748b'
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KeyValue({ data }: ComponentProps) {
  const items = data.items as Array<{ key: string; value: string }> || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 0',
          borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none'
        }}>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{item.key}</span>
          <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function Button({ data, actions, onAction }: ComponentProps) {
  const variant = data.variant as string || 'primary';
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    secondary: {
      background: 'white',
      color: '#3b82f6',
      border: '1px solid #3b82f6',
      padding: '10px 20px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  };

  const handleClick = () => {
    if (actions && actions.length > 0 && onAction) {
      const action = actions[0];
      onAction(action.action_id, action.parameters);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={styles[variant]}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.background = '#2563eb';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.background = '#3b82f6';
        }
      }}
    >
      {data.text as string}
    </button>
  );
}

function List({ data }: ComponentProps) {
  const items = data.items as string[] || [];

  return (
    <ul style={{ margin: '0', paddingLeft: '24px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '14px', color: '#475569', marginBottom: '4px' }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProgressBar({ data }: ComponentProps) {
  const value = data.value as number || 0;
  const max = data.max as number || 100;
  const percentage = (value / max) * 100;

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <span>{data.label as string}</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        background: '#f1f5f9',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: '#3b82f6',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}

export const ComponentRegistry: Record<string, React.FC<ComponentProps>> = {
  container: Container,
  card: Card,
  text: Text,
  badge: Badge,
  table: Table,
  key_value: KeyValue,
  button: Button,
  list: List,
  progress_bar: ProgressBar
};

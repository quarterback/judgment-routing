import { ReactNode } from 'react';

interface ComponentProps {
  data: Record<string, unknown>;
  children?: ReactNode;
  onAction?: (surfaceId: string, actionName: string, actionData?: Record<string, unknown>) => void;
}

function Text({ data }: ComponentProps) {
  const text = data.text as string || '';
  return (
    <div style={{
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#1e293b',
      whiteSpace: 'pre-wrap'
    }}>
      {text}
    </div>
  );
}

function Container({ data, children }: ComponentProps) {
  const padding = data.padding as string || '16px';
  const gap = data.gap as string || '16px';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding,
      gap
    }}>
      {children}
    </div>
  );
}

function Column({ data, children }: ComponentProps) {
  const gap = data.gap as string || '8px';
  const alignment = data.alignment as string || 'stretch';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap,
      alignItems: alignment
    }}>
      {children}
    </div>
  );
}

function Button({ data, onAction }: ComponentProps) {
  const text = data.text as string || 'Button';
  const action = data.action as { actionName: string; actionData?: Record<string, unknown> } | undefined;

  const handleClick = () => {
    if (action && onAction) {
      onAction('', action.actionName, action.actionData);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'white',
        background: '#3b82f6',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#2563eb';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#3b82f6';
      }}
    >
      {text}
    </button>
  );
}

function List({ data, children }: ComponentProps) {
  const spacing = data.spacing as string || '8px';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: spacing
    }}>
      {children}
    </div>
  );
}

function ListItem({ children }: ComponentProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      {children}
    </div>
  );
}

export const ComponentRegistry: Record<string, React.FC<ComponentProps>> = {
  Text,
  Container,
  Column,
  Button,
  List,
  ListItem
};

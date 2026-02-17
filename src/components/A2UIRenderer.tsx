import { A2UIComponent } from '../types/a2ui';
import { ComponentRegistry } from './ComponentRegistry';

interface A2UIRendererProps {
  component: A2UIComponent;
  components: Record<string, A2UIComponent>;
  onAction?: (actionId: string, parameters?: Record<string, unknown>) => void;
}

export function A2UIRenderer({ component, components, onAction }: A2UIRendererProps) {
  const ComponentImpl = ComponentRegistry[component.component_type];

  if (!ComponentImpl) {
    return (
      <div style={{ padding: '12px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px' }}>
        Unknown component type: {component.component_type}
      </div>
    );
  }

  const children = component.children?.map(childId => {
    const childComponent = components[childId];
    if (!childComponent) return null;
    return (
      <A2UIRenderer
        key={childId}
        component={childComponent}
        components={components}
        onAction={onAction}
      />
    );
  }).filter(Boolean);

  return (
    <ComponentImpl
      data={component.data || {}}
      actions={component.actions || []}
      onAction={onAction}
    >
      {children}
    </ComponentImpl>
  );
}

import React, { useState, useEffect } from 'react';
import { A2UIMessage, ComponentDefinition, A2UIValue, A2UIChildren } from '../types/a2ui-protocol';
import { ComponentRegistry } from './ComponentRegistry';

interface A2UIRendererProps {
  messages: A2UIMessage[];
  onAction?: (surfaceId: string, actionName: string, actionData?: Record<string, unknown>) => void;
}

interface ParsedComponent {
  componentId: string;
  componentType: string;
  props: Record<string, unknown>;
  children?: string[];
}

function extractValue(value: A2UIValue | undefined): unknown {
  if (!value) return undefined;
  if ('literalString' in value) return value.literalString;
  if ('literalNumber' in value) return value.literalNumber;
  if ('literalBoolean' in value) return value.literalBoolean;
  if ('binding' in value) return value.binding;
  return undefined;
}

function extractChildren(children: A2UIChildren | undefined): string[] | undefined {
  if (!children) return undefined;
  if ('explicitList' in children) return children.explicitList;
  if ('binding' in children) return [];
  return undefined;
}

function parseComponent(component: ComponentDefinition): ParsedComponent | null {
  const componentWrapper = component.component;
  const componentType = Object.keys(componentWrapper)[0];
  const componentData = componentWrapper[componentType as keyof typeof componentWrapper];

  if (!componentData || typeof componentData !== 'object') {
    return null;
  }

  const props: Record<string, unknown> = {};
  const children = extractChildren((componentData as { children?: A2UIChildren }).children);

  Object.entries(componentData).forEach(([key, value]) => {
    if (key === 'children') return;
    if (typeof value === 'object' && value !== null && ('literalString' in value || 'literalNumber' in value || 'literalBoolean' in value || 'binding' in value)) {
      props[key] = extractValue(value as A2UIValue);
    } else {
      props[key] = value;
    }
  });

  return {
    componentId: component.componentId,
    componentType,
    props,
    children
  };
}

export function A2UIRenderer({ messages, onAction }: A2UIRendererProps) {
  const [components, setComponents] = useState<Map<string, ParsedComponent>>(new Map());
  const [rootComponentId, setRootComponentId] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    const newComponents = new Map<string, ParsedComponent>();
    let foundRoot: string | null = null;
    let shouldRender = false;

    messages.forEach(msg => {
      if ('surfaceUpdate' in msg.message) {
        const { components: componentDefs } = msg.message.surfaceUpdate;
        componentDefs.forEach(compDef => {
          const parsed = parseComponent(compDef);
          if (parsed) {
            newComponents.set(parsed.componentId, parsed);
            if (parsed.componentId === 'root') {
              foundRoot = 'root';
            }
          }
        });
      }

      if ('beginRendering' in msg.message) {
        shouldRender = true;
      }
    });

    setComponents(newComponents);
    if (foundRoot) {
      setRootComponentId(foundRoot);
    }
    setIsRendering(shouldRender);
  }, [messages]);

  function renderComponent(componentId: string): React.ReactElement | null {
    const component = components.get(componentId);
    if (!component) {
      return null;
    }

    const ComponentImpl = ComponentRegistry[component.componentType];

    if (!ComponentImpl) {
      return (
        <div style={{ padding: '12px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px' }}>
          Unknown component type: {component.componentType}
        </div>
      );
    }

    const children = component.children?.map(childId => renderComponent(childId)).filter(Boolean);

    return (
      <ComponentImpl
        key={component.componentId}
        data={component.props}
        onAction={onAction}
      >
        {children}
      </ComponentImpl>
    );
  }

  if (!isRendering || !rootComponentId) {
    return (
      <div style={{ padding: '20px', color: '#666' }}>
        Waiting for A2UI surface...
      </div>
    );
  }

  return renderComponent(rootComponentId);
}

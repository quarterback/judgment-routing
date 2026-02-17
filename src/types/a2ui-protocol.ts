export type A2UIValue =
  | { literalString: string }
  | { literalNumber: number }
  | { literalBoolean: boolean }
  | { binding: string };

export type A2UIChildren =
  | { explicitList: string[] }
  | { binding: string };

export interface TextComponent {
  component: {
    Text: {
      text: A2UIValue;
    };
  };
}

export interface ContainerComponent {
  component: {
    Container: {
      children?: A2UIChildren;
      padding?: A2UIValue;
      gap?: A2UIValue;
    };
  };
}

export interface ColumnComponent {
  component: {
    Column: {
      children?: A2UIChildren;
      gap?: A2UIValue;
      alignment?: A2UIValue;
    };
  };
}

export interface ButtonComponent {
  component: {
    Button: {
      text: A2UIValue;
      action?: {
        actionName: string;
        actionData?: Record<string, A2UIValue>;
      };
    };
  };
}

export interface ListComponent {
  component: {
    List: {
      children?: A2UIChildren;
      spacing?: A2UIValue;
    };
  };
}

export interface ListItemComponent {
  component: {
    ListItem: {
      children?: A2UIChildren;
    };
  };
}

export type A2UIComponent =
  | TextComponent
  | ContainerComponent
  | ColumnComponent
  | ButtonComponent
  | ListComponent
  | ListItemComponent;

export interface ComponentDefinition {
  componentId: string;
  component: A2UIComponent['component'];
}

export interface SurfaceUpdateMessage {
  message: {
    surfaceUpdate: {
      surfaceId: string;
      components: ComponentDefinition[];
    };
  };
}

export interface BeginRenderingMessage {
  message: {
    beginRendering: {
      surfaceId: string;
    };
  };
}

export interface DataModelUpdateMessage {
  message: {
    dataModelUpdate: {
      path: string[];
      value: A2UIValue;
    };
  };
}

export interface ClientActionMessage {
  message: {
    clientAction: {
      surfaceId: string;
      actionName: string;
      actionData?: Record<string, unknown>;
    };
  };
}

export type A2UIMessage =
  | SurfaceUpdateMessage
  | BeginRenderingMessage
  | DataModelUpdateMessage
  | ClientActionMessage;

export class A2UIMessageBuilder {
  static surfaceUpdate(surfaceId: string, components: ComponentDefinition[]): SurfaceUpdateMessage {
    return {
      message: {
        surfaceUpdate: {
          surfaceId,
          components
        }
      }
    };
  }

  static beginRendering(surfaceId: string): BeginRenderingMessage {
    return {
      message: {
        beginRendering: {
          surfaceId
        }
      }
    };
  }

  static text(componentId: string, text: string): ComponentDefinition {
    return {
      componentId,
      component: {
        Text: {
          text: { literalString: text }
        }
      }
    };
  }

  static container(componentId: string, children: string[], padding?: string, gap?: string): ComponentDefinition {
    return {
      componentId,
      component: {
        Container: {
          children: { explicitList: children },
          ...(padding && { padding: { literalString: padding } }),
          ...(gap && { gap: { literalString: gap } })
        }
      }
    };
  }

  static column(componentId: string, children: string[], gap?: string): ComponentDefinition {
    return {
      componentId,
      component: {
        Column: {
          children: { explicitList: children },
          ...(gap && { gap: { literalString: gap } })
        }
      }
    };
  }

  static button(componentId: string, text: string, actionName?: string, actionData?: Record<string, A2UIValue>): ComponentDefinition {
    return {
      componentId,
      component: {
        Button: {
          text: { literalString: text },
          ...(actionName && {
            action: {
              actionName,
              actionData
            }
          })
        }
      }
    };
  }

  static list(componentId: string, children: string[], spacing?: string): ComponentDefinition {
    return {
      componentId,
      component: {
        List: {
          children: { explicitList: children },
          ...(spacing && { spacing: { literalString: spacing } })
        }
      }
    };
  }

  static listItem(componentId: string, children: string[]): ComponentDefinition {
    return {
      componentId,
      component: {
        ListItem: {
          children: { explicitList: children }
        }
      }
    };
  }
}

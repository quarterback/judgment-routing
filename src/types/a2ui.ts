export interface A2UIComponent {
  component_type: string;
  component_id: string;
  data?: Record<string, unknown>;
  children?: string[];
  actions?: A2UIAction[];
}

export interface A2UIAction {
  action_id: string;
  action_type: string;
  label?: string;
  parameters?: Record<string, unknown>;
}

export interface A2UISurface {
  surface_id: string;
  components: Record<string, A2UIComponent>;
  root_components: string[];
}

export interface A2UIMessage {
  message_id: string;
  type: 'surface' | 'component_update' | 'action_response';
  surface?: A2UISurface;
  updates?: Record<string, Partial<A2UIComponent>>;
}

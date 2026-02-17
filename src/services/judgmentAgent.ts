import { A2UISurface, A2UIComponent } from '../types/a2ui';
import { StrategicContext, AuthorityEnvelope, DecisionReceipt } from '../types/judgment';

export class JudgmentAgent {
  generateStrategicContextSurface(context?: StrategicContext): A2UISurface {
    const components: Record<string, A2UIComponent> = {
      'root': {
        component_type: 'container',
        component_id: 'root',
        children: ['header', 'content']
      },
      'header': {
        component_type: 'card',
        component_id: 'header',
        data: { title: 'Strategic Context' },
        children: context ? ['header-info'] : ['empty-state']
      }
    };

    if (context) {
      components['header-info'] = {
        component_type: 'container',
        component_id: 'header-info',
        children: ['context-id', 'grantor', 'period', 'priorities-card', 'boundaries-card', 'escalation-card']
      };

      components['context-id'] = {
        component_type: 'text',
        component_id: 'context-id',
        data: { variant: 'h2', text: context.context_id }
      };

      components['grantor'] = {
        component_type: 'key_value',
        component_id: 'grantor',
        data: {
          items: [
            { key: 'Authority Grantor', value: context.grantor_name },
            { key: 'Role', value: context.grantor_role },
            { key: 'Active Period', value: `${new Date(context.active_start).toLocaleDateString()} - ${new Date(context.active_end).toLocaleDateString()}` }
          ]
        }
      };

      components['priorities-card'] = {
        component_type: 'card',
        component_id: 'priorities-card',
        data: { title: 'Strategic Priorities' },
        children: Object.keys(context.priorities).map((_, idx) => `priority-${idx}`)
      };

      Object.entries(context.priorities).forEach(([key, priority], idx) => {
        components[`priority-${idx}`] = {
          component_type: 'container',
          component_id: `priority-${idx}`,
          children: [`priority-bar-${idx}`, `priority-text-${idx}`]
        };

        components[`priority-bar-${idx}`] = {
          component_type: 'progress_bar',
          component_id: `priority-bar-${idx}`,
          data: {
            label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: priority.weight * 100,
            max: 100
          }
        };

        components[`priority-text-${idx}`] = {
          component_type: 'text',
          component_id: `priority-text-${idx}`,
          data: { variant: 'caption', text: priority.rationale }
        };
      });

      components['boundaries-card'] = {
        component_type: 'card',
        component_id: 'boundaries-card',
        data: { title: 'Authority Boundaries' },
        children: ['boundaries-list']
      };

      const boundaryItems: string[] = [];

      if (context.authority_boundaries.financial) {
        context.authority_boundaries.financial.forEach(b => {
          boundaryItems.push(`${b.action}: ${b.currency || ''}${b.limit} (escalate at ${b.escalation_threshold || 'N/A'})`);
        });
      }

      if (context.authority_boundaries.communication) {
        context.authority_boundaries.communication.forEach(b => {
          boundaryItems.push(`${b.action}: ${b.limit} ${b.unit}`);
        });
      }

      components['boundaries-list'] = {
        component_type: 'list',
        component_id: 'boundaries-list',
        data: { items: boundaryItems }
      };

      components['escalation-card'] = {
        component_type: 'card',
        component_id: 'escalation-card',
        data: { title: 'Escalation Contacts' },
        children: ['escalation-table']
      };

      components['escalation-table'] = {
        component_type: 'table',
        component_id: 'escalation-table',
        data: {
          headers: ['Authority Level', 'Name', 'Threshold'],
          rows: context.escalation_contacts.map(c => [c.authority_level, c.name, c.threshold])
        }
      };
    } else {
      components['empty-state'] = {
        component_type: 'text',
        component_id: 'empty-state',
        data: { variant: 'body', text: 'No strategic context selected. Create one to get started.' }
      };
    }

    return {
      surface_id: 'strategic-context-surface',
      components,
      root_components: ['root']
    };
  }

  generateAuthorityEnvelopeSurface(envelope?: AuthorityEnvelope): A2UISurface {
    const components: Record<string, A2UIComponent> = {
      'root': {
        component_type: 'container',
        component_id: 'root',
        children: ['header']
      },
      'header': {
        component_type: 'card',
        component_id: 'header',
        data: { title: 'Authority Envelope' },
        children: envelope ? ['envelope-content'] : ['empty-state']
      }
    };

    if (envelope) {
      components['envelope-content'] = {
        component_type: 'container',
        component_id: 'envelope-content',
        children: ['envelope-id', 'status-badge', 'metadata', 'authorities-card', 'priorities-card']
      };

      components['envelope-id'] = {
        component_type: 'text',
        component_id: 'envelope-id',
        data: { variant: 'h2', text: envelope.envelope_id }
      };

      components['status-badge'] = {
        component_type: 'badge',
        component_id: 'status-badge',
        data: { status: envelope.status, text: envelope.status.toUpperCase() }
      };

      components['metadata'] = {
        component_type: 'key_value',
        component_id: 'metadata',
        data: {
          items: [
            { key: 'Task Scope', value: envelope.task_scope },
            { key: 'Issued At', value: new Date(envelope.issued_at).toLocaleString() },
            { key: 'Expires At', value: new Date(envelope.expires_at).toLocaleString() }
          ]
        }
      };

      components['authorities-card'] = {
        component_type: 'card',
        component_id: 'authorities-card',
        data: { title: 'Granted Authorities' },
        children: ['authorities-table']
      };

      const authorityRows = envelope.granted_authorities.map(auth => {
        const limits = [];
        if (auth.max_amount) limits.push(`$${auth.max_amount}`);
        if (auth.max_percentage) limits.push(`${auth.max_percentage}%`);
        if (auth.max_recipients) limits.push(`${auth.max_recipients} recipients`);
        return [auth.action, limits.join(', '), auth.requires_receipt ? 'Yes' : 'No'];
      });

      components['authorities-table'] = {
        component_type: 'table',
        component_id: 'authorities-table',
        data: {
          headers: ['Action', 'Limits', 'Requires Receipt'],
          rows: authorityRows
        }
      };

      components['priorities-card'] = {
        component_type: 'card',
        component_id: 'priorities-card',
        data: { title: 'Active Priorities' },
        children: Object.keys(envelope.active_priorities).map((_, idx) => `priority-${idx}`)
      };

      Object.entries(envelope.active_priorities).forEach(([key, weight], idx) => {
        components[`priority-${idx}`] = {
          component_type: 'progress_bar',
          component_id: `priority-${idx}`,
          data: {
            label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: weight * 100,
            max: 100
          }
        };
      });
    } else {
      components['empty-state'] = {
        component_type: 'text',
        component_id: 'empty-state',
        data: { variant: 'body', text: 'No authority envelope selected.' }
      };
    }

    return {
      surface_id: 'authority-envelope-surface',
      components,
      root_components: ['root']
    };
  }

  generateDecisionReceiptSurface(receipt?: DecisionReceipt): A2UISurface {
    const components: Record<string, A2UIComponent> = {
      'root': {
        component_type: 'container',
        component_id: 'root',
        children: ['header']
      },
      'header': {
        component_type: 'card',
        component_id: 'header',
        data: { title: 'Decision Receipt' },
        children: receipt ? ['receipt-content'] : ['empty-state']
      }
    };

    if (receipt) {
      components['receipt-content'] = {
        component_type: 'container',
        component_id: 'receipt-content',
        children: ['receipt-id', 'decision-badge', 'metadata', 'proposal-card', 'evaluation-card', 'audit-card']
      };

      components['receipt-id'] = {
        component_type: 'text',
        component_id: 'receipt-id',
        data: { variant: 'h2', text: receipt.receipt_id }
      };

      components['decision-badge'] = {
        component_type: 'badge',
        component_id: 'decision-badge',
        data: { status: receipt.decision, text: receipt.decision.toUpperCase() }
      };

      components['metadata'] = {
        component_type: 'key_value',
        component_id: 'metadata',
        data: {
          items: [
            { key: 'Envelope ID', value: receipt.envelope_id },
            { key: 'Timestamp', value: new Date(receipt.timestamp).toLocaleString() },
            { key: 'Executed At', value: receipt.executed_at ? new Date(receipt.executed_at).toLocaleString() : 'Not executed' }
          ]
        }
      };

      components['proposal-card'] = {
        component_type: 'card',
        component_id: 'proposal-card',
        data: { title: 'Agent Proposal' },
        children: ['proposal-kv']
      };

      const proposalItems = Object.entries(receipt.agent_proposal).map(([key, value]) => ({
        key: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: String(value)
      }));

      components['proposal-kv'] = {
        component_type: 'key_value',
        component_id: 'proposal-kv',
        data: { items: proposalItems }
      };

      components['evaluation-card'] = {
        component_type: 'card',
        component_id: 'evaluation-card',
        data: { title: 'Judgment Evaluation' },
        children: ['evaluation-check', 'alignment-card']
      };

      components['evaluation-check'] = {
        component_type: 'key_value',
        component_id: 'evaluation-check',
        data: {
          items: [
            { key: 'Authority Check', value: receipt.judgment_evaluation.authority_check },
            { key: 'Within Threshold', value: receipt.judgment_evaluation.within_threshold ? 'Yes' : 'No' },
            { key: 'Escalation Required', value: receipt.judgment_evaluation.escalation_required ? 'Yes' : 'No' }
          ]
        }
      };

      components['alignment-card'] = {
        component_type: 'card',
        component_id: 'alignment-card',
        data: { title: 'Priority Alignment' },
        children: Object.keys(receipt.judgment_evaluation.priority_alignment).map((_, idx) => `alignment-${idx}`)
      };

      Object.entries(receipt.judgment_evaluation.priority_alignment).forEach(([key, alignment], idx) => {
        components[`alignment-${idx}`] = {
          component_type: 'container',
          component_id: `alignment-${idx}`,
          children: [`alignment-bar-${idx}`, `alignment-text-${idx}`]
        };

        components[`alignment-bar-${idx}`] = {
          component_type: 'progress_bar',
          component_id: `alignment-bar-${idx}`,
          data: {
            label: `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (Weight: ${alignment.weight})`,
            value: alignment.alignment_score * 100,
            max: 100
          }
        };

        components[`alignment-text-${idx}`] = {
          component_type: 'text',
          component_id: `alignment-text-${idx}`,
          data: { variant: 'caption', text: alignment.rationale }
        };
      });

      components['audit-card'] = {
        component_type: 'card',
        component_id: 'audit-card',
        data: { title: 'Audit Trail' },
        children: ['audit-kv']
      };

      components['audit-kv'] = {
        component_type: 'key_value',
        component_id: 'audit-kv',
        data: {
          items: [
            { key: 'Authority Source', value: receipt.audit_trail.authority_source },
            { key: 'Granted By', value: receipt.audit_trail.granted_by },
            { key: 'Decision Rationale', value: receipt.audit_trail.decision_rationale }
          ]
        }
      };
    } else {
      components['empty-state'] = {
        component_type: 'text',
        component_id: 'empty-state',
        data: { variant: 'body', text: 'No decision receipt selected.' }
      };
    }

    return {
      surface_id: 'decision-receipt-surface',
      components,
      root_components: ['root']
    };
  }
}

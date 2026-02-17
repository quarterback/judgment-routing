import { A2UIMessage, A2UIMessageBuilder, ComponentDefinition } from '../types/a2ui-protocol';
import { StrategicContext, AuthorityEnvelope, DecisionReceipt } from '../types/judgment';

export class JudgmentAgent {
  generateStrategicContextMessages(context: StrategicContext): A2UIMessage[] {
    const components: ComponentDefinition[] = [];
    const surfaceId = 'strategic-context-surface';

    components.push(
      A2UIMessageBuilder.column('root', ['title', 'description', 'priorities-section', 'boundaries-section'], '20px')
    );

    components.push(
      A2UIMessageBuilder.text('title', context.name)
    );

    components.push(
      A2UIMessageBuilder.text('description', context.description)
    );

    components.push(
      A2UIMessageBuilder.column('priorities-section', ['priorities-title', 'priorities-list'], '12px')
    );

    components.push(
      A2UIMessageBuilder.text('priorities-title', 'Strategic Priorities')
    );

    const priorityIds: string[] = [];
    context.priorities.forEach((priority, idx) => {
      const itemId = `priority-item-${idx}`;
      const nameId = `priority-name-${idx}`;
      const weightId = `priority-weight-${idx}`;
      const descId = `priority-desc-${idx}`;

      priorityIds.push(itemId);

      components.push(
        A2UIMessageBuilder.column(itemId, [nameId, weightId, descId], '4px')
      );

      components.push(
        A2UIMessageBuilder.text(nameId, `${priority.name} (Weight: ${(priority.weight * 100).toFixed(0)}%)`)
      );

      components.push(
        A2UIMessageBuilder.text(weightId, '█'.repeat(Math.round(priority.weight * 20)))
      );

      components.push(
        A2UIMessageBuilder.text(descId, priority.description)
      );
    });

    components.push(
      A2UIMessageBuilder.list('priorities-list', priorityIds, '12px')
    );

    components.push(
      A2UIMessageBuilder.column('boundaries-section', ['boundaries-title', 'boundaries-list'], '12px')
    );

    components.push(
      A2UIMessageBuilder.text('boundaries-title', 'Authority Boundaries')
    );

    const boundaryIds: string[] = [];
    context.boundaries.forEach((boundary, idx) => {
      const itemId = `boundary-item-${idx}`;
      boundaryIds.push(itemId);
      components.push(
        A2UIMessageBuilder.listItem(itemId, [`boundary-text-${idx}`])
      );
      components.push(
        A2UIMessageBuilder.text(`boundary-text-${idx}`, `• ${boundary}`)
      );
    });

    components.push(
      A2UIMessageBuilder.list('boundaries-list', boundaryIds, '8px')
    );

    return [
      A2UIMessageBuilder.surfaceUpdate(surfaceId, components),
      A2UIMessageBuilder.beginRendering(surfaceId)
    ];
  }

  generateAuthorityEnvelopeMessages(envelope: AuthorityEnvelope): A2UIMessage[] {
    const components: ComponentDefinition[] = [];
    const surfaceId = 'authority-envelope-surface';

    components.push(
      A2UIMessageBuilder.column('root', ['title', 'description', 'granted-by', 'scope-section', 'time-section', 'actions-section'], '20px')
    );

    components.push(
      A2UIMessageBuilder.text('title', envelope.name)
    );

    components.push(
      A2UIMessageBuilder.text('description', envelope.description)
    );

    components.push(
      A2UIMessageBuilder.text('granted-by', `Granted by: ${envelope.granted_by}`)
    );

    components.push(
      A2UIMessageBuilder.column('scope-section', ['scope-title', 'scope-domains', 'scope-financial'], '12px')
    );

    components.push(
      A2UIMessageBuilder.text('scope-title', 'Delegated Scope')
    );

    components.push(
      A2UIMessageBuilder.text('scope-domains', `Domains: ${envelope.scope.domains.join(', ')}`)
    );

    components.push(
      A2UIMessageBuilder.text('scope-financial', `Max Financial Impact: $${envelope.scope.max_financial_impact}`)
    );

    components.push(
      A2UIMessageBuilder.column('time-section', ['time-title', 'time-valid', 'time-duration'], '8px')
    );

    components.push(
      A2UIMessageBuilder.text('time-title', 'Time Bounds')
    );

    components.push(
      A2UIMessageBuilder.text('time-valid', `Valid: ${new Date(envelope.time_bounds.valid_from).toLocaleString()} - ${new Date(envelope.time_bounds.valid_until).toLocaleString()}`)
    );

    components.push(
      A2UIMessageBuilder.text('time-duration', `Max Duration: ${envelope.time_bounds.max_duration_hours} hours`)
    );

    components.push(
      A2UIMessageBuilder.column('actions-section', ['allowed-title', 'allowed-list', 'forbidden-title', 'forbidden-list'], '12px')
    );

    components.push(
      A2UIMessageBuilder.text('allowed-title', 'Allowed Actions')
    );

    const allowedIds: string[] = [];
    envelope.scope.allowed_actions.forEach((action, idx) => {
      const itemId = `allowed-item-${idx}`;
      allowedIds.push(itemId);
      components.push(
        A2UIMessageBuilder.listItem(itemId, [`allowed-text-${idx}`])
      );
      components.push(
        A2UIMessageBuilder.text(`allowed-text-${idx}`, `✓ ${action}`)
      );
    });

    components.push(
      A2UIMessageBuilder.list('allowed-list', allowedIds, '4px')
    );

    components.push(
      A2UIMessageBuilder.text('forbidden-title', 'Forbidden Actions')
    );

    const forbiddenIds: string[] = [];
    envelope.scope.forbidden_actions.forEach((action, idx) => {
      const itemId = `forbidden-item-${idx}`;
      forbiddenIds.push(itemId);
      components.push(
        A2UIMessageBuilder.listItem(itemId, [`forbidden-text-${idx}`])
      );
      components.push(
        A2UIMessageBuilder.text(`forbidden-text-${idx}`, `✗ ${action}`)
      );
    });

    components.push(
      A2UIMessageBuilder.list('forbidden-list', forbiddenIds, '4px')
    );

    return [
      A2UIMessageBuilder.surfaceUpdate(surfaceId, components),
      A2UIMessageBuilder.beginRendering(surfaceId)
    ];
  }

  generateDecisionReceiptMessages(receipt: DecisionReceipt): A2UIMessage[] {
    const components: ComponentDefinition[] = [];
    const surfaceId = 'decision-receipt-surface';

    components.push(
      A2UIMessageBuilder.column('root', ['header', 'situation-section', 'proposal-section', 'evaluation-section', 'outcome-section', 'audit-section'], '24px')
    );

    components.push(
      A2UIMessageBuilder.text('header', `Decision Receipt: ${receipt.id}`)
    );

    components.push(
      A2UIMessageBuilder.column('situation-section', ['situation-title', 'situation-text', 'timestamp'], '8px')
    );

    components.push(
      A2UIMessageBuilder.text('situation-title', 'Situation')
    );

    components.push(
      A2UIMessageBuilder.text('situation-text', receipt.situation)
    );

    components.push(
      A2UIMessageBuilder.text('timestamp', `Time: ${new Date(receipt.timestamp).toLocaleString()}`)
    );

    components.push(
      A2UIMessageBuilder.column('proposal-section', ['proposal-title', 'proposal-action', 'proposal-details'], '8px')
    );

    components.push(
      A2UIMessageBuilder.text('proposal-title', 'Proposed Action')
    );

    components.push(
      A2UIMessageBuilder.text('proposal-action', `Action: ${receipt.proposed_action.action}`)
    );

    const proposalDetails = Object.entries(receipt.proposed_action)
      .filter(([key]) => key !== 'action')
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ');

    components.push(
      A2UIMessageBuilder.text('proposal-details', proposalDetails)
    );

    components.push(
      A2UIMessageBuilder.column('evaluation-section', ['eval-title', 'eval-check', 'eval-score', 'alignment-section'], '12px')
    );

    components.push(
      A2UIMessageBuilder.text('eval-title', 'Judgment Evaluation')
    );

    components.push(
      A2UIMessageBuilder.text('eval-check', `Authority Check: ${receipt.evaluation.authority_check}`)
    );

    components.push(
      A2UIMessageBuilder.text('eval-score', `Overall Score: ${(receipt.evaluation.overall_score * 100).toFixed(0)}% | Confidence: ${(receipt.evaluation.confidence * 100).toFixed(0)}%`)
    );

    components.push(
      A2UIMessageBuilder.column('alignment-section', ['alignment-title', 'alignment-list'], '8px')
    );

    components.push(
      A2UIMessageBuilder.text('alignment-title', 'Priority Alignment')
    );

    const alignmentIds: string[] = [];
    Object.entries(receipt.evaluation.priority_alignment).forEach(([priority, score], idx) => {
      const itemId = `alignment-item-${idx}`;
      const textId = `alignment-text-${idx}`;
      const barId = `alignment-bar-${idx}`;

      alignmentIds.push(itemId);

      components.push(
        A2UIMessageBuilder.column(itemId, [textId, barId], '4px')
      );

      components.push(
        A2UIMessageBuilder.text(textId, `${priority}: ${(score * 100).toFixed(0)}%`)
      );

      components.push(
        A2UIMessageBuilder.text(barId, '█'.repeat(Math.round(score * 20)))
      );
    });

    components.push(
      A2UIMessageBuilder.list('alignment-list', alignmentIds, '8px')
    );

    components.push(
      A2UIMessageBuilder.column('outcome-section', ['outcome-title', 'outcome-badge', 'outcome-reason'], '8px')
    );

    components.push(
      A2UIMessageBuilder.text('outcome-title', 'Outcome')
    );

    const outcomeEmoji = receipt.outcome === 'APPROVED' ? '✓' : receipt.outcome === 'ESCALATED' ? '⬆' : '✗';
    components.push(
      A2UIMessageBuilder.text('outcome-badge', `${outcomeEmoji} ${receipt.outcome}`)
    );

    if (receipt.escalation_reason) {
      components.push(
        A2UIMessageBuilder.text('outcome-reason', `Reason: ${receipt.escalation_reason}`)
      );
    } else {
      components.push(
        A2UIMessageBuilder.text('outcome-reason', '')
      );
    }

    components.push(
      A2UIMessageBuilder.column('audit-section', ['audit-title', 'audit-list'], '8px')
    );

    components.push(
      A2UIMessageBuilder.text('audit-title', 'Audit Trail')
    );

    const auditIds: string[] = [];
    receipt.audit_trail.forEach((entry, idx) => {
      const itemId = `audit-item-${idx}`;
      auditIds.push(itemId);
      components.push(
        A2UIMessageBuilder.listItem(itemId, [`audit-text-${idx}`])
      );
      components.push(
        A2UIMessageBuilder.text(`audit-text-${idx}`, entry)
      );
    });

    components.push(
      A2UIMessageBuilder.list('audit-list', auditIds, '4px')
    );

    return [
      A2UIMessageBuilder.surfaceUpdate(surfaceId, components),
      A2UIMessageBuilder.beginRendering(surfaceId)
    ];
  }
}

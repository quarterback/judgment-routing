import { useState, useEffect } from 'react';
import { A2UIRenderer } from './components/A2UIRenderer';
import { JudgmentAgent } from './services/judgmentAgent';
import { supabase } from './lib/supabase';
import { StrategicContext, AuthorityEnvelope, DecisionReceipt } from './types/judgment';
import { A2UISurface } from './types/a2ui';

function App() {
  const [view, setView] = useState<'contexts' | 'envelopes' | 'receipts'>('contexts');
  const [contexts, setContexts] = useState<StrategicContext[]>([]);
  const [envelopes, setEnvelopes] = useState<AuthorityEnvelope[]>([]);
  const [receipts, setReceipts] = useState<DecisionReceipt[]>([]);
  const [selectedContext, setSelectedContext] = useState<StrategicContext | null>(null);
  const [selectedEnvelope, setSelectedEnvelope] = useState<AuthorityEnvelope | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<DecisionReceipt | null>(null);
  const [surface, setSurface] = useState<A2UISurface | null>(null);

  const agent = new JudgmentAgent();

  useEffect(() => {
    loadData();
  }, [view]);

  useEffect(() => {
    if (view === 'contexts' && selectedContext) {
      setSurface(agent.generateStrategicContextSurface(selectedContext));
    } else if (view === 'envelopes' && selectedEnvelope) {
      setSurface(agent.generateAuthorityEnvelopeSurface(selectedEnvelope));
    } else if (view === 'receipts' && selectedReceipt) {
      setSurface(agent.generateDecisionReceiptSurface(selectedReceipt));
    } else {
      if (view === 'contexts') {
        setSurface(agent.generateStrategicContextSurface());
      } else if (view === 'envelopes') {
        setSurface(agent.generateAuthorityEnvelopeSurface());
      } else {
        setSurface(agent.generateDecisionReceiptSurface());
      }
    }
  }, [view, selectedContext, selectedEnvelope, selectedReceipt]);

  async function loadData() {
    if (view === 'contexts') {
      const { data } = await supabase.from('strategic_contexts').select('*').order('created_at', { ascending: false });
      if (data) setContexts(data);
    } else if (view === 'envelopes') {
      const { data } = await supabase.from('authority_envelopes').select('*').order('created_at', { ascending: false });
      if (data) setEnvelopes(data);
    } else if (view === 'receipts') {
      const { data } = await supabase.from('decision_receipts').select('*').order('created_at', { ascending: false });
      if (data) setReceipts(data);
    }
  }

  async function createSampleData() {
    if (view === 'contexts') {
      const sampleContext = {
        context_id: 'q1-2026-customer-retention',
        active_start: new Date('2026-01-01').toISOString(),
        active_end: new Date('2026-03-31').toISOString(),
        grantor_name: 'Sarah Chen',
        grantor_role: 'Head of Customer Success',
        priorities: {
          customer_retention: { weight: 0.9, rationale: 'Q1 target is 95% retention rate' },
          cost_efficiency: { weight: 0.4, rationale: 'Budget flexibility for high-value accounts' },
          response_speed: { weight: 0.8, rationale: 'Four-hour resolution target for P1 issues' }
        },
        authority_boundaries: {
          financial: [
            { action: 'issue_refund', limit: 2000, currency: 'USD', escalation_threshold: 5000 },
            { action: 'apply_discount', limit: 30, unit: 'percent' }
          ],
          communication: [
            { action: 'send_customer_email', limit: 100, unit: 'recipients', escalation_threshold: 500 }
          ],
          legal: [
            { trigger: 'contract_modification', require_approval: true },
            { trigger: 'liability_language', require_approval: true }
          ]
        },
        escalation_contacts: [
          { authority_level: 'manager', name: 'Sarah Chen', threshold: 'exceeds financial limits' },
          { authority_level: 'legal', name: 'Legal Team', threshold: 'contract or liability issues' }
        ]
      };

      const { data, error } = await supabase.from('strategic_contexts').insert(sampleContext).select();
      if (data) {
        setContexts([...contexts, data[0]]);
        setSelectedContext(data[0]);
      }
      if (error) console.error('Error creating context:', error);
    } else if (view === 'envelopes' && contexts.length > 0) {
      const sampleEnvelope = {
        envelope_id: `env_${Math.random().toString(36).substr(2, 9)}`,
        strategic_context_id: contexts[0].id,
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        task_scope: 'customer_issue_resolution',
        granted_authorities: [
          { action: 'issue_refund', max_amount: 2000, requires_receipt: true },
          { action: 'apply_discount', max_percentage: 30, requires_receipt: true },
          { action: 'send_customer_email', max_recipients: 100, requires_receipt: true }
        ],
        active_priorities: {
          customer_retention: 0.9,
          cost_efficiency: 0.4,
          response_speed: 0.8
        },
        mandatory_escalations: ['contract_modification', 'liability_language', 'amount > 5000', 'recipients > 500'],
        status: 'active'
      };

      const { data, error } = await supabase.from('authority_envelopes').insert(sampleEnvelope).select();
      if (data) {
        setEnvelopes([...envelopes, data[0]]);
        setSelectedEnvelope(data[0]);
      }
      if (error) console.error('Error creating envelope:', error);
    } else if (view === 'receipts' && envelopes.length > 0) {
      const sampleReceipt = {
        receipt_id: `rcpt_${Math.random().toString(36).substr(2, 9)}`,
        envelope_id: envelopes[0].envelope_id,
        timestamp: new Date().toISOString(),
        agent_proposal: {
          action: 'issue_refund',
          amount: 1800,
          currency: 'USD',
          customer_id: 'cust_9284',
          reason: 'Product defect reported, customer lifetime value $24K'
        },
        judgment_evaluation: {
          authority_check: 'within_bounds',
          amount_limit: 2000,
          amount_requested: 1800,
          within_threshold: true,
          priority_alignment: {
            customer_retention: {
              weight: 0.9,
              alignment_score: 0.95,
              rationale: 'High-value customer, retention critical'
            },
            cost_efficiency: {
              weight: 0.4,
              alignment_score: 0.6,
              rationale: 'Cost acceptable given customer value'
            }
          },
          conflicts_detected: null,
          escalation_required: false
        },
        decision: 'approved',
        executed_at: new Date().toISOString(),
        audit_trail: {
          authority_source: 'q1-2026-customer-retention',
          granted_by: 'Sarah Chen, Head of Customer Success',
          decision_rationale: 'Refund within authority limits and aligned with retention priority'
        }
      };

      const { data, error } = await supabase.from('decision_receipts').insert(sampleReceipt).select();
      if (data) {
        setReceipts([...receipts, data[0]]);
        setSelectedReceipt(data[0]);
      }
      if (error) console.error('Error creating receipt:', error);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <header style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Judgment Router
          </h1>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#64748b'
          }}>
            Infrastructure for Delegated Agency using A2UI
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '20px'
        }}>
          <aside style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            height: 'fit-content',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <nav style={{ marginBottom: '24px' }}>
              <button
                onClick={() => setView('contexts')}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '8px',
                  border: 'none',
                  borderRadius: '6px',
                  background: view === 'contexts' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8fafc',
                  color: view === 'contexts' ? 'white' : '#475569',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                Strategic Contexts
              </button>
              <button
                onClick={() => setView('envelopes')}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '8px',
                  border: 'none',
                  borderRadius: '6px',
                  background: view === 'envelopes' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8fafc',
                  color: view === 'envelopes' ? 'white' : '#475569',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                Authority Envelopes
              </button>
              <button
                onClick={() => setView('receipts')}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: view === 'receipts' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8fafc',
                  color: view === 'receipts' ? 'white' : '#475569',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                Decision Receipts
              </button>
            </nav>

            <button
              onClick={createSampleData}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                border: '2px solid #667eea',
                borderRadius: '6px',
                background: 'white',
                color: '#667eea',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              + Create Sample
            </button>

            <div style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '16px'
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#475569'
              }}>
                {view === 'contexts' ? 'Contexts' : view === 'envelopes' ? 'Envelopes' : 'Receipts'}
              </h3>

              <div style={{
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {view === 'contexts' && contexts.map(ctx => (
                  <button
                    key={ctx.id}
                    onClick={() => setSelectedContext(ctx)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '6px',
                      border: selectedContext?.id === ctx.id ? '2px solid #667eea' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: selectedContext?.id === ctx.id ? '#f0f4ff' : 'white',
                      color: '#1e293b',
                      fontSize: '13px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{ctx.context_id}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{ctx.grantor_name}</div>
                  </button>
                ))}

                {view === 'envelopes' && envelopes.map(env => (
                  <button
                    key={env.id}
                    onClick={() => setSelectedEnvelope(env)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '6px',
                      border: selectedEnvelope?.id === env.id ? '2px solid #667eea' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: selectedEnvelope?.id === env.id ? '#f0f4ff' : 'white',
                      color: '#1e293b',
                      fontSize: '13px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{env.envelope_id}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{env.task_scope}</div>
                  </button>
                ))}

                {view === 'receipts' && receipts.map(receipt => (
                  <button
                    key={receipt.id}
                    onClick={() => setSelectedReceipt(receipt)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '6px',
                      border: selectedReceipt?.id === receipt.id ? '2px solid #667eea' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      background: selectedReceipt?.id === receipt.id ? '#f0f4ff' : 'white',
                      color: '#1e293b',
                      fontSize: '13px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{receipt.receipt_id}</div>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background: receipt.decision === 'approved' ? '#dcfce7' : receipt.decision === 'escalate' ? '#fef3c7' : '#fee2e2',
                      color: receipt.decision === 'approved' ? '#166534' : receipt.decision === 'escalate' ? '#92400e' : '#991b1b'
                    }}>
                      {receipt.decision.toUpperCase()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            minHeight: '600px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            {surface && (
              <A2UIRenderer
                component={surface.components[surface.root_components[0]]}
                components={surface.components}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

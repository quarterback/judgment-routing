import { useState } from 'react';
import { A2UIRenderer } from './components/A2UIRenderer';
import { JudgmentAgent } from './services/judgmentAgent';
import { A2UIMessage } from './types/a2ui-protocol';
import { sampleStrategicContext, sampleAuthorityEnvelope, sampleDecisionReceipts } from './data/sampleJudgmentData';

type View = 'context' | 'envelope' | 'receipt';

function App() {
  const [view, setView] = useState<View>('context');
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState<number>(0);
  const [messages, setMessages] = useState<A2UIMessage[]>([]);

  const agent = new JudgmentAgent();

  const handleViewChange = (newView: View) => {
    setView(newView);

    let newMessages: A2UIMessage[] = [];

    if (newView === 'context') {
      newMessages = agent.generateStrategicContextMessages(sampleStrategicContext);
    } else if (newView === 'envelope') {
      newMessages = agent.generateAuthorityEnvelopeMessages(sampleAuthorityEnvelope);
    } else if (newView === 'receipt') {
      newMessages = agent.generateDecisionReceiptMessages(sampleDecisionReceipts[selectedReceiptIndex]);
    }

    setMessages(newMessages);
  };

  const handleReceiptSelect = (index: number) => {
    setSelectedReceiptIndex(index);
    const newMessages = agent.generateDecisionReceiptMessages(sampleDecisionReceipts[index]);
    setMessages(newMessages);
  };

  if (messages.length === 0) {
    const initialMessages = agent.generateStrategicContextMessages(sampleStrategicContext);
    setMessages(initialMessages);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
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
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#0f172a'
          }}>
            Judgment Router Demo
          </h1>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#64748b',
            lineHeight: '1.5'
          }}>
            A2UI v0.8 implementation demonstrating real judgment routing with delegated authority
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '20px'
        }}>
          <aside style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            height: 'fit-content',
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              Navigation
            </h3>

            <nav style={{ marginBottom: '24px' }}>
              <button
                onClick={() => handleViewChange('context')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  border: view === 'context' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: view === 'context' ? '#eff6ff' : 'white',
                  color: view === 'context' ? '#1e40af' : '#475569',
                  fontSize: '14px',
                  fontWeight: view === 'context' ? '600' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                Strategic Context
              </button>

              <button
                onClick={() => handleViewChange('envelope')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  border: view === 'envelope' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: view === 'envelope' ? '#eff6ff' : 'white',
                  color: view === 'envelope' ? '#1e40af' : '#475569',
                  fontSize: '14px',
                  fontWeight: view === 'envelope' ? '600' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                Authority Envelope
              </button>

              <button
                onClick={() => handleViewChange('receipt')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: view === 'receipt' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: view === 'receipt' ? '#eff6ff' : 'white',
                  color: view === 'receipt' ? '#1e40af' : '#475569',
                  fontSize: '14px',
                  fontWeight: view === 'receipt' ? '600' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                Decision Receipts
              </button>
            </nav>

            {view === 'receipt' && (
              <div>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '16px'
                }}>
                  Sample Decisions
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sampleDecisionReceipts.map((receipt, idx) => {
                    const outcomeColors = {
                      APPROVED: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
                      ESCALATED: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
                      BLOCKED: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' }
                    };
                    const colors = outcomeColors[receipt.outcome as keyof typeof outcomeColors];

                    return (
                      <button
                        key={receipt.id}
                        onClick={() => handleReceiptSelect(idx)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: selectedReceiptIndex === idx ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                          borderRadius: '6px',
                          background: selectedReceiptIndex === idx ? '#eff6ff' : 'white',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '6px'
                        }}>
                          Decision #{idx + 1}
                        </div>
                        <div style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: '600',
                          background: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`
                        }}>
                          {receipt.outcome}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          <main style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            minHeight: '600px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0'
          }}>
            <A2UIRenderer messages={messages} />
          </main>
        </div>

        <footer style={{
          marginTop: '24px',
          padding: '16px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '13px'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            This demo shows A2UI v0.8 protocol messages generated by a judgment routing agent.
          </p>
          <p style={{ margin: '0' }}>
            All surfaces use standard catalog components: Text, Column, List, ListItem
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

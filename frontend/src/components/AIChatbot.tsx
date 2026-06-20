'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useBoard } from '@/context/BoardContext';
import type { Board, Card } from '@/types';

interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

interface ApiMessage {
  role: string;
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  isTool?: boolean;
}

const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'getBoard',
      description: 'Get the current board state including all columns and their cards',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'addCard',
      description: 'Add a new card to a specific column',
      parameters: {
        type: 'object',
        properties: {
          columnTitle: { type: 'string', description: 'The column name (e.g. "To Do", "In Progress")' },
          title: { type: 'string', description: 'Card title' },
          details: { type: 'string', description: 'Optional detailed description' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Optional tags' },
        },
        required: ['columnTitle', 'title'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'moveCard',
      description: 'Move a card from one column to another',
      parameters: {
        type: 'object',
        properties: {
          cardTitle: { type: 'string', description: 'Title of the card to move' },
          fromColumn: { type: 'string', description: 'Current column name' },
          toColumn: { type: 'string', description: 'Target column name' },
        },
        required: ['cardTitle', 'fromColumn', 'toColumn'],
      },
    },
  },
];

let msgCounter = 0;
function nextId() {
  msgCounter++;
  return `msg-${msgCounter}`;
}

function cloneBoard(b: Board): Board {
  return JSON.parse(JSON.stringify(b));
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<LocalMessage[]>([
    { id: nextId(), role: 'assistant', content: 'Hi, I\'m TaskForge AI. Ask me anything about your board or tell me what to do!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { board, replaceBoard } = useBoard();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const executeTool = useCallback(
    (localBoard: Board, toolCall: ToolCall): string => {
      const { name, arguments: argsStr } = toolCall.function;
      const args = JSON.parse(argsStr || '{}');

      switch (name) {
        case 'getBoard': {
          return localBoard.columns.map(
            (c) =>
              `${c.title} (${c.cards.length} cards): ${c.cards.map((ca) => `"${ca.title}"`).join(', ')}`
          ).join('\n');
        }
        case 'addCard': {
          const col = localBoard.columns.find(
            (c) => c.title.toLowerCase() === args.columnTitle.toLowerCase()
          );
          if (!col)
            return `Error: No column "${args.columnTitle}". Available: ${localBoard.columns.map((c) => c.title).join(', ')}`;
          const newCard: Card = {
            id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: args.title,
            details: args.details || '',
            priority: 'none',
            dueDate: null,
            tags: (args.tags || []).map((t: string) => ({ label: t, color: '#209dd7' })),
            assignee: null,
            commentCount: 0,
          };
          col.cards.push(newCard);
          return `Added "${args.title}" to "${col.title}".`;
        }
        case 'moveCard': {
          const fromCol = localBoard.columns.find(
            (c) => c.title.toLowerCase() === args.fromColumn.toLowerCase()
          );
          const toCol = localBoard.columns.find(
            (c) => c.title.toLowerCase() === args.toColumn.toLowerCase()
          );
          if (!fromCol) return `Error: No column "${args.fromColumn}".`;
          if (!toCol) return `Error: No column "${args.toColumn}".`;
          const fromIdx = fromCol.cards.findIndex(
            (c) => c.title.toLowerCase() === args.cardTitle.toLowerCase()
          );
          if (fromIdx === -1) return `Error: No card "${args.cardTitle}" in "${args.fromColumn}".`;
          const [moved] = fromCol.cards.splice(fromIdx, 1);
          toCol.cards.push(moved);
          return `Moved "${args.cardTitle}" from "${args.fromColumn}" to "${args.toColumn}".`;
        }
        default:
          return `Unknown tool: ${name}`;
      }
    },
    []
  );

  const sendMessages = useCallback(async (apiMessages: ApiMessage[]) => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages, tools: toolDefinitions }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'API error');
    }
    return res.json();
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: LocalMessage = { id: nextId(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      let apiMessages: ApiMessage[] = [{ role: 'user', content: text }];

      for (let i = 0; i < 5; i++) {
        const data = await sendMessages(apiMessages);
        const choice = data.choices?.[0];
        if (!choice) throw new Error('No response from AI');

        const replyMsg = choice.message;
        const toolCalls = replyMsg.tool_calls;

        if (toolCalls && toolCalls.length > 0) {
          const localBoard = cloneBoard(board);
          const toolResults: { id: string; result: string }[] = [];

          for (const tc of toolCalls) {
            const result = executeTool(localBoard, tc);
            toolResults.push({ id: tc.id, result });
          }

          replaceBoard(localBoard);

          const toolLocals: LocalMessage[] = toolCalls.map((tc: ToolCall) => ({
            id: nextId(),
            role: 'assistant',
            content: `[Executing: ${tc.function.name}]`,
            isTool: true,
          }));
          setMessages((prev) => [...prev, ...toolLocals]);

          apiMessages = [
            ...apiMessages,
            { role: 'assistant', content: null, tool_calls: toolCalls },
            ...toolResults.map((tr) => ({
              role: 'tool' as const,
              tool_call_id: tr.id,
              content: tr.result,
            })),
          ];
        } else {
          const finalText = replyMsg.content || 'Done.';
          setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: finalText }]);
          break;
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: `Error: ${err instanceof Error ? err.message : err}` },
      ]);
    }
    setLoading(false);
  }, [input, loading, sendMessages, executeTool, board, replaceBoard]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(32,157,215,0.5)] hover:shadow-[0_0_30px_rgba(32,157,215,0.7)] transition-shadow duration-300"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        }}
        aria-label="AI Assistant"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-card border border-border rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-background">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">TaskForge AI</p>
              <p className="text-[10px] text-muted-subtle">Powered by OpenRouter</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-muted-subtle hover:text-foreground transition-colors p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : msg.isTool
                      ? 'bg-muted text-muted-foreground text-xs'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-subtle rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-subtle rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-subtle rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask or tell me what to do..."
                className="flex-1 text-sm text-foreground bg-surface-input border border-input rounded-lg px-3 py-2 outline-none focus:border-primary/40 placeholder:text-muted-subtle"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

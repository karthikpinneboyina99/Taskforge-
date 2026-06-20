'use client';

import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef, useEffect } from 'react';
import { useBoard } from '@/context/BoardContext';
import type { Card, Column, Tag } from '@/types';

const commonTags: Tag[] = [
  { label: 'Frontend', color: '#209dd7' },
  { label: 'Backend', color: '#753991' },
  { label: 'DevOps', color: '#ecad0a' },
  { label: 'Security', color: '#dc2626' },
  { label: 'Design', color: '#22c55e' },
  { label: 'Mobile', color: '#f97316' },
  { label: 'API', color: '#a855f7' },
  { label: 'Database', color: '#06b6d4' },
  { label: 'Testing', color: '#84cc16' },
  { label: 'Docs', color: '#6b7280' },
];

const priorityColors: Record<string, string> = {
  urgent: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#209dd7',
  none: '#888888',
};

function TagPicker({ selected, onToggle }: { selected: Tag[]; onToggle: (tag: Tag) => void }) {
  const isSelected = (tag: Tag) => selected.some((t) => t.label === tag.label);
  return (
    <div className="flex flex-wrap gap-1">
      {commonTags.map((tag) => (
        <button
          key={tag.label}
          type="button"
          onClick={() => onToggle(tag)}
          className="text-[10px] px-2 py-1 rounded font-medium transition-colors"
          style={{
            backgroundColor: isSelected(tag) ? `${tag.color}25` : 'color-mix(in srgb, var(--foreground) 5%, transparent)',
            color: isSelected(tag) ? tag.color : 'var(--color-muted-subtle)',
            border: `1px solid ${isSelected(tag) ? `${tag.color}40` : 'transparent'}`,
          }}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
}

function SortableCard({ card, columnId }: { card: Card; columnId: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const { deleteCard, updateCard } = useBoard();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDetails, setEditDetails] = useState(card.details);
  const [editTags, setEditTags] = useState<Tag[]>(card.tags);
  const [editPriority, setEditPriority] = useState(card.priority);
  const [showDetails, setShowDetails] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const openEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(card.title);
    setEditDetails(card.details);
    setEditTags(card.tags);
    setEditPriority(card.priority);
    setEditing(true);
  };

  const saveEdit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) { setEditing(false); return; }
    updateCard(columnId, card.id, {
      title: trimmed,
      details: editDetails,
      tags: editTags,
      priority: editPriority,
    });
    setEditing(false);
  };

  const color = priorityColors[card.priority];

  if (editing) {
    return (
      <div className="bg-muted rounded-lg p-3 border border-primary/40 space-y-2">
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-sm font-medium text-foreground bg-surface-input border border-input rounded px-2 py-1.5 outline-none focus:border-primary/40"
        />
        <textarea
          value={editDetails}
          onChange={(e) => setEditDetails(e.target.value)}
          placeholder="Details (optional)"
          rows={2}
          className="w-full text-xs text-muted-foreground bg-surface-input border border-input rounded px-2 py-1.5 outline-none focus:border-primary/40 resize-none"
        />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-subtle font-medium">Priority:</span>
          {(['none', 'low', 'medium', 'high', 'urgent'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setEditPriority(p)}
              className="text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors"
              style={{
                backgroundColor: editPriority === p ? `${priorityColors[p]}20` : 'color-mix(in srgb, var(--foreground) 5%, transparent)',
                color: editPriority === p ? priorityColors[p] : 'var(--color-muted-subtle)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <div>
          <span className="text-[10px] text-muted-subtle font-medium block mb-1">Tags:</span>
          <TagPicker selected={editTags} onToggle={(tag) => {
            setEditTags((prev) =>
              prev.some((t) => t.label === tag.label)
                ? prev.filter((t) => t.label !== tag.label)
                : [...prev, tag]
            );
          }} />
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={saveEdit} className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/80 transition-colors">Save</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-xs text-muted-subtle hover:text-foreground transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-muted rounded-lg p-3 border border-border hover:border-primary/25 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out cursor-grab active:cursor-grabbing group origin-center"
      data-testid={`card-${card.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {card.priority !== 'none' && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-medium text-muted-subtle uppercase tracking-wider">{card.priority}</span>
            </div>
          )}
          <h4 className="text-sm font-medium text-foreground break-words leading-snug">
            {card.title}
          </h4>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0 -mr-1 -mt-1">
          <button
            onClick={openEdit}
            onPointerDown={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-subtle hover:text-primary rounded p-1"
            aria-label="Edit card"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteCard(columnId, card.id); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-subtle hover:text-red-400 rounded p-1"
            aria-label="Delete card"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {showDetails && card.details && (
        <p className="text-xs text-muted-foreground mt-2 break-words leading-relaxed">{card.details}</p>
      )}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags.map((tag) => (
            <span
              key={tag.label}
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2.5 mt-2 text-[11px] text-muted-subtle">
        {card.dueDate && (
          <span className={new Date(card.dueDate) < new Date() ? 'text-red-400' : ''}>
            {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
        {card.assignee && (
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold bg-secondary/20 text-secondary">
            {card.assignee.avatar}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="ml-auto text-primary hover:underline"
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>
    </div>
  );
}

export function Board() {
  const { board, moveCard } = useBoard();
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const cardId = String(active.id);
    for (const col of board.columns) {
      const found = col.cards.find((c) => c.id === cardId);
      if (found) {
        setActiveCard(found);
        break;
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const overId = String(over.id);

    let sourceColId = '';
    let sourceIdx = -1;
    let targetColId = '';
    let targetIdx = -1;

    for (const col of board.columns) {
      const ci = col.cards.findIndex((c) => c.id === cardId);
      if (ci >= 0) {
        sourceColId = col.id;
        sourceIdx = ci;
      }
    }

    if (sourceColId === '') return;

    for (const col of board.columns) {
      const ci = col.cards.findIndex((c) => c.id === overId);
      if (ci >= 0) {
        targetColId = col.id;
        targetIdx = ci;
        break;
      }
    }

    if (targetColId === '') {
      for (const col of board.columns) {
        if (col.id === overId) {
          targetColId = col.id;
          targetIdx = col.cards.length;
          break;
        }
      }
    }

    if (!targetColId) return;

    moveCard(sourceColId, targetColId, sourceIdx, targetIdx);
  }

  return (
    <div className="flex-1 min-h-0 overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 p-6 min-w-min h-full">
          {board.columns.map((column) => (
            <BoardColumn key={column.id} column={column} />
          ))}
        </div>
        <DragOverlay>
          {activeCard && (
            <div
              className="bg-muted rounded-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-primary/30 rotate-[2deg] w-72"
              style={{
                borderLeft: `3px solid ${priorityColors[activeCard.priority]}`,
              }}
            >
              <p className="text-sm font-semibold text-foreground">{activeCard.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function BoardColumn({ column }: { column: Column }) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const { addCard } = useBoard();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newTags, setNewTags] = useState<Tag[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    addCard(column.id, {
      id: `card-${Date.now()}`,
      title: trimmed,
      details: newDetails.trim(),
      priority: 'none',
      dueDate: null,
      tags: newTags,
      assignee: null,
      commentCount: 0,
    });
    setNewTitle('');
    setNewDetails('');
    setNewTags([]);
    setAdding(false);
  };

  const cancelAdd = () => {
    setAdding(false);
    setNewTitle('');
    setNewDetails('');
    setNewTags([]);
  };

  const progress =
    column.cards.length > 0
      ? Math.round(
          (column.cards.filter((c) => !!c.dueDate).length / column.cards.length) * 100
        )
      : 0;

  return (
    <div
      ref={setNodeRef}
      className="bg-card rounded-xl flex flex-col flex-1 min-w-64 min-h-0 border border-border"
      data-testid={`column-${column.id}`}
    >
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
            <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
          </div>
          <span className="text-xs text-muted-subtle font-medium tabular-nums">{column.cards.length}</span>
        </div>
        {column.cards.length > 0 && (
          <div className="mt-2 w-full bg-foreground/5 rounded-full h-0.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: column.color,
              }}
            />
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <SortableCard key={card.id} card={card} columnId={column.id} />
          ))}
        </SortableContext>
        {column.cards.length === 0 && (
          <div className="flex items-center justify-center h-16 text-xs text-muted-subtle">No cards</div>
        )}
      </div>
      <div className="px-3 pb-3 pt-1">
        {adding ? (
          <div className="space-y-2">
            <input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') cancelAdd(); }}
              placeholder="Card title..."
              className="w-full text-sm text-foreground bg-surface-input border border-input rounded px-2 py-1.5 outline-none focus:border-primary/40"
            />
            <textarea
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
              placeholder="Details (optional)"
              rows={2}
              className="w-full text-xs text-muted-foreground bg-surface-input border border-input rounded px-2 py-1.5 outline-none focus:border-primary/40 resize-none"
            />
            <div>
              <span className="text-[10px] text-muted-subtle font-medium block mb-1">Tags:</span>
              <TagPicker selected={newTags} onToggle={(tag) => {
                setNewTags((prev) =>
                  prev.some((t) => t.label === tag.label)
                    ? prev.filter((t) => t.label !== tag.label)
                    : [...prev, tag]
                );
              }} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/80 transition-colors">Add</button>
              <button onClick={cancelAdd} className="px-3 py-1.5 text-xs text-muted-subtle hover:text-foreground transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full py-2 text-xs text-muted-subtle hover:text-primary hover:bg-foreground/5 rounded-lg transition-colors font-medium"
          >
            + Add Card
          </button>
        )}
      </div>
    </div>
  );
}

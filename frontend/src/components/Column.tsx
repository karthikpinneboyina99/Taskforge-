'use client';

import { Column as ColumnType, Card as CardType } from '@/types';
import { useBoard } from '@/context/BoardContext';
import { Card } from './Card';
import { useState } from 'react';

interface ColumnProps {
  column: ColumnType;
  onDragStart?: (columnId: string, cardId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (columnId: string, e: React.DragEvent) => void;
}

export function Column({
  column,
  onDragStart,
  onDragOver,
  onDrop,
}: ColumnProps) {
  const { addCard, renameColumn } = useBoard();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDetails, setNewCardDetails] = useState('');

  const handleRenameSubmit = () => {
    if (newTitle.trim()) {
      renameColumn(column.id, newTitle.trim());
      setIsRenaming(false);
    }
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      const newCard: CardType = {
        id: `card-${Date.now()}`,
        title: newCardTitle.trim(),
        details: newCardDetails.trim(),
        priority: 'none',
        dueDate: null,
        tags: [],
        assignee: null,
        commentCount: 0,
      };
      addCard(column.id, newCard);
      setNewCardTitle('');
      setNewCardDetails('');
      setShowAddCard(false);
    }
  };

  return (
    <div
      className="
        bg-gray-50 rounded-lg p-4 flex flex-col gap-3
        min-h-96 flex-1 min-w-72
      "
      data-testid={`column-${column.id}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200">
        {isRenaming ? (
          <input
            autoFocus
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') {
                setIsRenaming(false);
                setNewTitle(column.title);
              }
            }}
            className="
              flex-1 px-2 py-1 text-sm font-bold text-gray-900
              bg-white border border-blue-400 rounded
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            data-testid={`column-${column.id}-input`}
          />
        ) : (
          <h2
            onClick={() => setIsRenaming(true)}
            className="
              flex-1 text-sm font-bold text-gray-900 cursor-pointer
              hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded
              transition-colors
            "
            data-testid={`column-${column.id}-title`}
          >
            {column.title}
          </h2>
        )}
        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">
          {column.cards.length}
        </span>
      </div>

      {/* Cards Container */}
      <div
        className="
          flex-1 overflow-y-auto flex flex-col gap-2
          rounded border-2 border-dashed border-transparent
          hover:border-gray-300 transition-colors
          p-2 min-h-64
        "
        onDragOver={onDragOver}
        onDrop={(e) => onDrop && onDrop(column.id, e)}
        data-testid={`column-${column.id}-cards`}
      >
        {column.cards.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            No cards yet
          </div>
        ) : (
          column.cards.map((card) => (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer?.setData('columnId', column.id);
                e.dataTransfer?.setData('cardId', card.id);
                onDragStart?.(column.id, card.id);
              }}
              data-testid={`draggable-card-${card.id}`}
            >
              <Card card={card} columnId={column.id} />
            </div>
          ))
        )}
      </div>

      {/* Add Card Section */}
      {!showAddCard ? (
        <button
          onClick={() => setShowAddCard(true)}
          className="
            w-full px-3 py-2 text-sm text-gray-600 font-medium
            bg-white border border-dashed border-gray-300 rounded
            hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600
            transition-colors
          "
          data-testid={`add-card-button-${column.id}`}
        >
          + Add Card
        </button>
      ) : (
        <div className="bg-white rounded-lg p-3 border border-blue-300 gap-2 flex flex-col">
          <input
            autoFocus
            type="text"
            placeholder="Card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="
              text-sm text-gray-900 px-2 py-1 border border-gray-300 rounded
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            data-testid={`new-card-title-${column.id}`}
          />
          <textarea
            placeholder="Details (optional)..."
            value={newCardDetails}
            onChange={(e) => setNewCardDetails(e.target.value)}
            className="
              text-sm text-gray-900 px-2 py-1 border border-gray-300 rounded
              resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            data-testid={`new-card-details-${column.id}`}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="
                flex-1 px-2 py-1 text-sm bg-blue-500 text-white rounded
                hover:bg-blue-600 font-medium transition-colors
              "
              data-testid={`save-card-button-${column.id}`}
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowAddCard(false);
                setNewCardTitle('');
                setNewCardDetails('');
              }}
              className="
                flex-1 px-2 py-1 text-sm bg-gray-300 text-gray-700 rounded
                hover:bg-gray-400 font-medium transition-colors
              "
              data-testid={`cancel-card-button-${column.id}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

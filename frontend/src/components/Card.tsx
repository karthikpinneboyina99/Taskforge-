'use client';

import { Card as CardType } from '@/types';
import { useBoard } from '@/context/BoardContext';
import { useState } from 'react';

interface CardProps {
  card: CardType;
  columnId: string;
  isDragging?: boolean;
}

export function Card({ card, columnId, isDragging = false }: CardProps) {
  const { deleteCard } = useBoard();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`
        bg-white rounded-xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : ''}
        cursor-grab active:cursor-grabbing
        relative
      `}
      data-testid={`card-${card.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#032147] break-words">
            {card.title}
          </h3>
          {showDetails && (
            <p className="text-xs text-gray-500 mt-1.5 break-words leading-relaxed">
              {card.details}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteCard(columnId, card.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="opacity-0 hover:opacity-100 pointer-events-none hover:pointer-events-auto transition-all duration-150 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 flex-shrink-0 -mr-1 -mt-1"
          title="Delete card"
          aria-label="Delete card"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(!showDetails);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-xs text-gray-400 hover:text-primary mt-2.5 transition-colors font-medium cursor-pointer"
      >
        {showDetails ? 'Hide' : 'Show'} details
      </button>
    </div>
  );
}

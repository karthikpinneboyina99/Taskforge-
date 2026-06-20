'use client';

import dynamic from 'next/dynamic';
import { useBoard } from '@/context/BoardContext';

const Board = dynamic(() => import('@/components/Board').then((m) => m.Board), { ssr: false });

export default function BoardsPage() {
  const { board } = useBoard();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-6 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">{board.title}</h1>
            <p className="text-[11px] text-muted-subtle">
              {board.columns.reduce((sum, col) => sum + col.cards.length, 0)} tasks · {board.columns.length} columns
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <Board />
      </div>
    </div>
  );
}

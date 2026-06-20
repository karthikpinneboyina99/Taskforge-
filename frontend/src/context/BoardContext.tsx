'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Board, BoardContextType, Card } from '@/types';
import { dummyBoard } from '@/lib/dummyData';

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<Board>(dummyBoard);

  const addCard = (columnId: string, card: Card) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, card] } : col
      ),
    }));
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
          : col
      ),
    }));
  };

  const updateCard = (columnId: string, cardId: string, updates: Partial<Omit<Card, 'id'>>) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            }
          : col
      ),
    }));
  };

  const renameColumn = (columnId: string, newTitle: string) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      ),
    }));
  };

  const moveCard = (
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    setBoard((prevBoard) => {
      const sourceColumn = prevBoard.columns.find(
        (col) => col.id === sourceColumnId
      );
      const destColumn = prevBoard.columns.find(
        (col) => col.id === destinationColumnId
      );

      if (!sourceColumn || !destColumn) return prevBoard;

      if (sourceColumnId === destinationColumnId) {
        const cards = [...sourceColumn.cards];
        const [movedCard] = cards.splice(sourceIndex, 1);
        cards.splice(destinationIndex, 0, movedCard);
        return {
          ...prevBoard,
          columns: prevBoard.columns.map((col) =>
            col.id === sourceColumnId ? { ...col, cards } : col
          ),
        };
      }

      const sourceCards = [...sourceColumn.cards];
      const destCards = [...destColumn.cards];
      const [movedCard] = sourceCards.splice(sourceIndex, 1);
      destCards.splice(destinationIndex, 0, movedCard);

      return {
        ...prevBoard,
        columns: prevBoard.columns.map((col) => {
          if (col.id === sourceColumnId) return { ...col, cards: sourceCards };
          if (col.id === destinationColumnId)
            return { ...col, cards: destCards };
          return col;
        }),
      };
    });
  };

  const replaceBoard = (newBoard: Board) => {
    setBoard(newBoard);
  };

  const value: BoardContextType = {
    board,
    addCard,
    deleteCard,
    updateCard,
    renameColumn,
    moveCard,
    replaceBoard,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}

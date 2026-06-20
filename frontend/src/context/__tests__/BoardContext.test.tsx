import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { BoardProvider, useBoard } from '../BoardContext';
import { Card } from '@/types';

function wrapper({ children }: { children: React.ReactNode }) {
  return <BoardProvider>{children}</BoardProvider>;
}

describe('BoardContext', () => {
  it('provides board state', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    expect(result.current.board).toBeDefined();
    expect(result.current.board.columns).toHaveLength(5);
  });

  it('has 5 columns on initialization', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    const columnTitles = result.current.board.columns.map((col) => col.title);
    expect(columnTitles).toEqual(['To Do', 'In Progress', 'Review', 'Testing', 'Done']);
  });

  it('addCard adds a card to the specified column', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    const newCard: Card = {
      id: 'new-card-1',
      title: 'New Card',
      details: 'New details',
    };

    act(() => {
      result.current.addCard('column-1', newCard);
    });

    const column = result.current.board.columns.find((col) => col.id === 'column-1');
    expect(column?.cards).toContainEqual(newCard);
  });

  it('deleteCard removes a card from the specified column', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    const initialCard = result.current.board.columns[0].cards[0];
    const cardToDelete = initialCard.id;

    act(() => {
      result.current.deleteCard('column-1', cardToDelete);
    });

    const column = result.current.board.columns.find((col) => col.id === 'column-1');
    expect(column?.cards.find((c) => c.id === cardToDelete)).toBeUndefined();
  });

  it('renameColumn updates column title', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    act(() => {
      result.current.renameColumn('column-1', 'Renamed Column');
    });

    const column = result.current.board.columns.find((col) => col.id === 'column-1');
    expect(column?.title).toBe('Renamed Column');
  });

  it('moveCard moves a card from one column to another', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    const sourceColumn = result.current.board.columns[0];
    const targetColumn = result.current.board.columns[1];
    const cardToMove = sourceColumn.cards[0];

    const initialSourceCount = sourceColumn.cards.length;
    const initialTargetCount = targetColumn.cards.length;

    act(() => {
      result.current.moveCard(sourceColumn.id, targetColumn.id, 0, 0);
    });

    const updatedSourceColumn = result.current.board.columns.find(
      (col) => col.id === sourceColumn.id
    );
    const updatedTargetColumn = result.current.board.columns.find(
      (col) => col.id === targetColumn.id
    );

    expect(updatedSourceColumn?.cards.length).toBe(initialSourceCount - 1);
    expect(updatedTargetColumn?.cards.length).toBe(initialTargetCount + 1);
    expect(updatedTargetColumn?.cards[0]).toEqual(cardToMove);
  });

  it('throws error when useBoard is used outside provider', () => {
    expect(() => {
      renderHook(() => useBoard());
    }).toThrow('useBoard must be used within a BoardProvider');
  });

  it('preserves other columns when modifying one', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    const otherColumns = result.current.board.columns.slice(1);

    act(() => {
      result.current.renameColumn('column-1', 'Modified');
    });

    const updatedOtherColumns = result.current.board.columns.slice(1);
    expect(updatedOtherColumns).toEqual(otherColumns);
  });

  it('handles multiple operations in sequence', () => {
    const { result } = renderHook(() => useBoard(), { wrapper });

    const newCard: Card = {
      id: 'sequential-card',
      title: 'Sequential Card',
      details: 'Testing sequential operations',
    };

    act(() => {
      result.current.addCard('column-1', newCard);
    });

    const sourceColumn = result.current.board.columns.find((col) => col.id === 'column-1')!;
    const newCardIndex = sourceColumn.cards.findIndex((c) => c.id === newCard.id);

    act(() => {
      result.current.renameColumn('column-1', 'Updated To Do');
      result.current.moveCard('column-1', 'column-2', newCardIndex, 0);
    });

    const toDoColumn = result.current.board.columns.find((col) => col.id === 'column-1');
    const inProgressColumn = result.current.board.columns.find((col) => col.id === 'column-2');

    expect(toDoColumn?.title).toBe('Updated To Do');
    expect(inProgressColumn?.cards[0]).toEqual(newCard);
  });
});

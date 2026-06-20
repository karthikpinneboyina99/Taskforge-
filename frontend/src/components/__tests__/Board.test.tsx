import React from 'react';
import { render, screen } from '@testing-library/react';
import { Board } from '../Board';
import { BoardProvider } from '@/context/BoardContext';

function renderBoardWithProvider() {
  return render(
    <BoardProvider>
      <Board />
    </BoardProvider>
  );
}

describe('Board Component', () => {
  it('renders all columns', () => {
    renderBoardWithProvider();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders all dummy cards', () => {
    renderBoardWithProvider();
    expect(screen.getByText('Design homepage mockup')).toBeInTheDocument();
    expect(screen.getByText('Implement authentication')).toBeInTheDocument();
    expect(screen.getByText('Project setup')).toBeInTheDocument();
  });

  it('has correct number of columns', () => {
    const { container } = renderBoardWithProvider();
    const columnIds = ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'];
    const columns = columnIds.filter((id) =>
      container.querySelector(`[data-testid="column-${id}"]`)
    );
    expect(columns.length).toBe(5);
  });

  it('displays columns in horizontal scroll layout', () => {
    const { container } = renderBoardWithProvider();
    const scrollContainer = container.querySelector('.flex-1.overflow-x-auto');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('renders Board with proper styling', () => {
    const { container } = renderBoardWithProvider();
    const boardContainer = container.querySelector('.flex-1.overflow-x-auto');
    expect(boardContainer).toHaveClass('overflow-x-auto');
  });
});

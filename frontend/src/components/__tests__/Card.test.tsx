import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../Card';
import { Column } from '../Column';
import { BoardProvider, useBoard } from '@/context/BoardContext';

const mockCard = {
  id: 'test-card-1',
  title: 'Test Card Title',
  details: 'Test card details',
};

const mockColumnId = 'test-column-1';

function renderCardWithProvider(card = mockCard, columnId = mockColumnId) {
  return render(
    <BoardProvider>
      <Card card={card} columnId={columnId} />
    </BoardProvider>
  );
}

function ColumnFromBoard({ columnId }: { columnId: string }) {
  const { board } = useBoard();
  const column = board.columns.find((c) => c.id === columnId);
  if (!column) return null;
  return <Column column={column} />;
}

describe('Card Component', () => {
  it('renders card with title', () => {
    renderCardWithProvider();
    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
  });

  it('shows Show details button', () => {
    renderCardWithProvider();
    expect(screen.getByText('Show details')).toBeInTheDocument();
  });

  it('toggles details visibility when Show details is clicked', () => {
    renderCardWithProvider();

    const detailsButton = screen.getByText('Show details');
    expect(screen.queryByText('Test card details')).not.toBeInTheDocument();

    fireEvent.click(detailsButton);
    expect(screen.getByText('Test card details')).toBeInTheDocument();
    expect(screen.getByText('Hide details')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide details'));
    expect(screen.queryByText('Test card details')).not.toBeInTheDocument();
    expect(screen.getByText('Show details')).toBeInTheDocument();
  });

  it('renders delete button', () => {
    renderCardWithProvider();
    const deleteButtons = screen.getAllByLabelText('Delete card');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('calls deleteCard when delete button is clicked', () => {
    render(
      <BoardProvider>
        <ColumnFromBoard columnId="column-1" />
      </BoardProvider>
    );

    expect(screen.getByText('Design homepage mockup')).toBeInTheDocument();
    const deleteButtons = screen.getAllByLabelText('Delete card');
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText('Design homepage mockup')).not.toBeInTheDocument();
  });

  it('has draggable attribute', () => {
    const { container } = renderCardWithProvider();
    const cardElement = container.querySelector('[data-testid="card-test-card-1"]');
    expect(cardElement).toBeInTheDocument();
  });

  it('renders with proper styling classes', () => {
    const { container } = renderCardWithProvider();
    const cardElement = container.querySelector('[data-testid="card-test-card-1"]');
    expect(cardElement).toHaveClass('bg-white', 'rounded-xl', 'p-4');
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Column } from '../Column';
import { BoardProvider, useBoard } from '@/context/BoardContext';
import { Column as ColumnType } from '@/types';

const TEST_COLUMN_ID = 'test-column-1';

const mockColumn: ColumnType = {
  id: TEST_COLUMN_ID,
  title: 'To Do',
  cards: [
    {
      id: 'card-1',
      title: 'Card 1',
      details: 'Details 1',
    },
    {
      id: 'card-2',
      title: 'Card 2',
      details: 'Details 2',
    },
  ],
};

function ColumnFromContext({ columnId }: { columnId: string }) {
  const { board } = useBoard();
  const column = board.columns.find((c) => c.id === columnId) ?? null;
  if (!column) return null;
  return <Column column={column} />;
}

function renderColumnWithProvider(column = mockColumn) {
  return render(
    <BoardProvider>
      <Column column={column} />
    </BoardProvider>
  );
}

describe('Column Component', () => {
  it('renders column title', () => {
    renderColumnWithProvider();
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('displays card count badge', () => {
    renderColumnWithProvider();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders all cards in the column', () => {
    renderColumnWithProvider();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('allows renaming column by clicking title', () => {
    renderColumnWithProvider();
    const title = screen.getByTestId('column-test-column-1-title');

    fireEvent.click(title);
    const input = screen.getByTestId('column-test-column-1-input');
    expect(input).toHaveValue('To Do');
  });

  it('updates column title on Enter', () => {
    render(
      <BoardProvider>
        <ColumnFromContext columnId="column-1" />
      </BoardProvider>
    );

    const title = screen.getByTestId('column-column-1-title');
    fireEvent.click(title);
    const input = screen.getByTestId('column-column-1-input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'New Title' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('New Title')).toBeInTheDocument();
  });

  it('cancels rename on Escape key', () => {
    renderColumnWithProvider();
    const title = screen.getByTestId('column-test-column-1-title');

    fireEvent.click(title);
    const input = screen.getByTestId('column-test-column-1-input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'New Title' } });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.queryByTestId('column-test-column-1-input')).not.toBeInTheDocument();
  });

  it('renders Add Card button', () => {
    renderColumnWithProvider();
    expect(screen.getByTestId('add-card-button-test-column-1')).toBeInTheDocument();
  });

  it('shows add card form when Add Card button is clicked', () => {
    renderColumnWithProvider();
    const addButton = screen.getByTestId('add-card-button-test-column-1');

    fireEvent.click(addButton);

    expect(screen.getByTestId('new-card-title-test-column-1')).toBeInTheDocument();
    expect(screen.getByTestId('new-card-details-test-column-1')).toBeInTheDocument();
    expect(screen.getByTestId('save-card-button-test-column-1')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-card-button-test-column-1')).toBeInTheDocument();
  });

  it('hides add card form when Cancel is clicked', () => {
    renderColumnWithProvider();
    const addButton = screen.getByTestId('add-card-button-test-column-1');

    fireEvent.click(addButton);
    expect(screen.getByTestId('new-card-title-test-column-1')).toBeInTheDocument();

    const cancelButton = screen.getByTestId('cancel-card-button-test-column-1');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('new-card-title-test-column-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('add-card-button-test-column-1')).toBeInTheDocument();
  });

  it('adds new card when Save is clicked with title', () => {
    render(
      <BoardProvider>
        <ColumnFromContext columnId="column-3" />
      </BoardProvider>
    );

    const addButton = screen.getByTestId('add-card-button-column-3');
    fireEvent.click(addButton);

    const titleInput = screen.getByTestId('new-card-title-column-3') as HTMLInputElement;
    const detailsInput = screen.getByTestId('new-card-details-column-3') as HTMLTextAreaElement;

    fireEvent.change(titleInput, { target: { value: 'New Card' } });
    fireEvent.change(detailsInput, { target: { value: 'Card details' } });

    const saveButton = screen.getByTestId('save-card-button-column-3');
    fireEvent.click(saveButton);

    expect(screen.getByText('New Card')).toBeInTheDocument();
    expect(screen.getByTestId('add-card-button-column-3')).toBeInTheDocument();
  });

  it('displays empty state when no cards', () => {
    const emptyColumn: ColumnType = {
      id: 'empty-column',
      title: 'Empty',
      cards: [],
    };

    render(
      <BoardProvider>
        <Column column={emptyColumn} />
      </BoardProvider>
    );

    expect(screen.getByText('No cards yet')).toBeInTheDocument();
  });
});

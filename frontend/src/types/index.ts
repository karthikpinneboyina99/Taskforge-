export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export interface Tag {
  label: string;
  color: string;
}

export interface Assignee {
  name: string;
  avatar: string;
}

export interface Card {
  id: string;
  title: string;
  details: string;
  priority: Priority;
  dueDate: string | null;
  tags: Tag[];
  assignee: Assignee | null;
  commentCount: number;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
  color: string;
}

export interface Board {
  title: string;
  columns: Column[];
}

export interface BoardContextType {
  board: Board;
  addCard: (columnId: string, card: Card) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  updateCard: (columnId: string, cardId: string, updates: Partial<Omit<Card, 'id'>>) => void;
  renameColumn: (columnId: string, newTitle: string) => void;
  moveCard: (
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  replaceBoard: (board: Board) => void;
}

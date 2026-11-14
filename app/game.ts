export type Player = "X" | "O";
export type Board = (Player | null)[];
export type Game = { board: Board; next: Player; scores: Record<Player | "draw", number>; round: number };

export const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

export function result(board: Board): { winner: Player | null; line: number[]; draw: boolean } {
  for (const line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line, draw: false };
    }
  }
  return { winner: null, line: [], draw: board.every(cell => cell !== null) };
}

export function initialGame(): Game {
  return { board: Array(9).fill(null), next: "X", scores: { X: 0, O: 0, draw: 0 }, round: 1 };
}

export function gameReducer(state: Game, action: { type: "play"; index: number } | { type: "new" } | { type: "reset" }): Game {
  if (action.type === "reset") return initialGame();
  if (action.type === "new") return { ...state, board: Array(9).fill(null), next: "X", round: state.round + 1 };
  if (!Number.isInteger(action.index) || action.index < 0 || action.index > 8 || state.board[action.index] || result(state.board).winner || result(state.board).draw) return state;
  const board = [...state.board];
  board[action.index] = state.next;
  const outcome = result(board);
  const scores = { ...state.scores };
  if (outcome.winner) scores[outcome.winner]++;
  else if (outcome.draw) scores.draw++;
  return { ...state, board, next: state.next === "X" ? "O" : "X", scores };
}

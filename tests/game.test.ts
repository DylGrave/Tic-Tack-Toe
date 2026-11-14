import assert from "node:assert/strict";
import { test } from "node:test";
import { gameReducer, initialGame, result, type Game } from "../app/game.ts";

function play(moves: number[], state = initialGame()): Game {
  return moves.reduce((game, index) => gameReducer(game, { type: "play", index }), state);
}

test("alternates players and rejects occupied and invalid cells", () => {
  const state = play([0]);
  assert.equal(state.next, "O");
  for (const index of [0, -1, 9, 1.5, NaN]) assert.equal(gameReducer(state, { type: "play", index }), state);
  assert.equal(play([4], state).board[4], "O");
});

test("every row, column and diagonal wins for either player", () => {
  const winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const line of winningLines) for (const player of ["X", "O"] as const) {
    const board = Array(9).fill(null);
    line.forEach(index => board[index] = player);
    assert.equal(result(board).winner, player);
    assert.deepEqual(result(board).line, line);
  }
});

test("a win increments once and prevents all further moves", () => {
  const state = play([0, 3, 1, 4, 2]);
  assert.equal(result(state.board).winner, "X");
  assert.deepEqual(state.scores, { X: 1, O: 0, draw: 0 });
  assert.equal(gameReducer(state, { type: "play", index: 8 }), state);
  const oWins = play([0,3,1,4,8,5]);
  assert.equal(result(oWins.board).winner, "O");
  assert.equal(oWins.scores.O, 1);
});

test("a full board can draw or win on the final move", () => {
  const draw = play([0,1,2,4,3,5,7,6,8]);
  assert.equal(result(draw.board).draw, true);
  assert.equal(draw.scores.draw, 1);
  assert.equal(gameReducer(draw, { type: "play", index: 0 }), draw);
  const win = play([0,1,4,2,5,3,6,7,8]);
  assert.equal(result(win.board).winner, "X");
  assert.equal(result(win.board).draw, false);
  assert.equal(win.scores.draw, 0);
});

test("new rounds preserve scores while reset clears the session", () => {
  const won = play([0,3,1,4,2]);
  const fresh = gameReducer(won, { type: "new" });
  assert.deepEqual(fresh.board, Array(9).fill(null));
  assert.deepEqual(fresh.scores, won.scores);
  assert.equal(fresh.next, "X");
  assert.equal(fresh.round, 2);
  assert.deepEqual(gameReducer(fresh, { type: "reset" }), initialGame());
});

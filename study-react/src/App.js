// React는 컴포넌트에서 호출하여 무언가를 “기억”할 수 있는 useState라는 특별한 함수를 제공
// Square의 현재 값을 state에 저장하고 Square가 클릭 되면 값을 변경
import { useState } from 'react';

function Square({value, onSquareClick }) {

  // value는 값을 저장하고 
  // setValue는 값을 변경하는 데 사용하는 함수
  // useState에 전달된 null은 이 state 변수의 초깃값으로 사용
  // const [value, setValue] = useState(null);

  // Square 컴포넌트를 클릭하면 X로 채우는 함수
 /*  function handleClick() {
    setValue('X');
  } */

  return (
    // onClick 핸들러에서 set 함수를 호출함으로써 
    // React에 <button>이 클릭 될 때마다 
    // Square를 다시 렌더링
    // 각 사각형에는 고유한 state가 존재 
    // 각 사각형에 저장된 value는 다른 사각형과 완전히 독립적
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

/* ✨ 여러 자식 컴포넌트에서 데이터를 수집하거나 두 자식 컴포넌트가 서로 통신하도록 하려면, 부모 컴포넌트에서 공유 state를 선언
   부모 컴포넌트는 props를 통해 해당 state를 자식 컴포넌트에 전달 가능
   이렇게 하면 자식 컴포넌트가 서로 동기화되고 부모 컴포넌트와도 동기화되도록 유지 가능. */

function Board({ xIsNext, squares, onPlay }) {
  // 플레이어가 움직일 때마다 다음 플레이어를 결정하기 위해 불리언 값인 xIsNext가 반전되고 게임의 state가 저장
  // const [xIsNext, setXIsNext] = useState(true);
  // 9개 사각형에 해당하는 9개의 null의 배열을 기본값으로 하는 state 변수 squares를 선언
  // const [squares, setSquares] = useState(Array(9).fill(null));

  // 보드 컴포넌트 내부에 handleClick 함수를 정의하여 보드의 state를 담고 있는 squares 배열을 업데이트
  function handleClick(i) {
    // 1. calculateWinner(squares)를 호출하여 플레이어가 이겼는지 확인
    // 2. 사각형에 이미 X와 O가 있는지 확인
    // 이미 채워져 있는 경우 보드의 state를 업데이트하기 전에 handleClick 함수에서 조기에 return
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // setSquares 및 setXIsNext 호출을 새로운 onPlay 함수에 대한 단일 호출로 대체
    // -> 사용자가 사각형을 클릭할 때 Game 컴포넌트가 Board를 업데이트
    // setSquares(nextSquares);
    // setXIsNext(!xIsNext);
    onPlay(nextSquares);
  }

  // 게임이 끝났을 때 플레이어에게 알리기 위해 “Winner: X” 또는 “Winner: O”라고 표시
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// 과거 이동 목록을 표시
// 여기에 전체 게임 기록을 포함하는 history state를 배치
/* Square 컴포넌트에서 Board 컴포넌트로 state를 “끌어올렸던” 것처럼, 
   Board 컴포넌트에서 최상위 Game 컴포넌트로 state를 끌어올릴 수 있음.

   이렇게 하면 Game 컴포넌트가 Board 컴포넌트의 데이터를 완전히 제어하고 
   Board의 history에서 이전 순서를 렌더링하도록 지시할 수 있습니다. */
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // jumpTo를 구현하기 전에 사용자가 현재 어떤 단계를 보고 있는지를 추적할 수 있는 Game 컴포넌트
  const [currentMove, setCurrentMove] = useState(0);
  // 다음 플레이어와 이동 기록을 추적하기 위해 Game 컴포넌트에 몇개의 state를 추가
  // const [xIsNext, setXIsNext] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Game 컴포넌트 안에 Board 컴포넌트가 게임을 업데이트할 때 호출할 handlePlay 함수
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // setXIsNext(!xIsNext);
  }

  // 과거 움직임 보여주기 
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 9개의 사각형 배열을 가져와서 승자를 확인하고 
// 적절하게 'X' , 'O' , 또는 null을 반환하는 도우미 함수 calculateWinner를 추가
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
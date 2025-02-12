// 틱택토(Tic-Tac-Toe) 게임 코드 설명
import { useState } from 'react';

/* 
   💡 전체 코드의 실행 흐름
    - Game 컴포넌트가 history, currentMove 등의 상태를 관리
    - Board 컴포넌트가 Game에서 보드 상태를 받아 렌더링
    - Square 컴포넌트는 Board에서 받은 value를 보여주고 클릭 이벤트 처리
    - handleClick(i)에서 클릭하면 새로운 squares 상태를 만들고 onPlay(nextSquares) 호출
    - handlePlay가 history에 새로운 보드 상태를 저장
    - calculateWinner 함수가 승리 여부를 판단하고 결과를 표시
    - 사용자는 jumpTo 버튼을 클릭해 과거 상태로 돌아갈 수 있음
*/

/* 
    🔮 Square 컴포넌트 :  게임 보드의 한 칸을 나타내는 버튼
    - value: 현재 칸에 들어갈 값 (X, O, null)
    - onSquareClick: 버튼을 클릭했을 때 실행할 함수 (부모 컴포넌트에서 전달받음)
    - onClick 이벤트가 발생하면 onSquareClick 함수가 실행
 */
function Square({value, onSquareClick }) {

	return (
   <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}   

/* 
    🔮 Board 컴포넌트 : 게임 보드(3x3)를 담당
    - xIsNext: true이면 X 차례, false이면 O 차례
    - squares: 현재 보드 상태 (9개의 배열 형태로 저장됨)
    - onPlay: 부모에게 새로운 squares 배열을 전달하는 함수
*/
function Board({ xIsNext, squares, onPlay }) {

    // 칸을 클릭했을 때 실행
	function handleClick(i) {
	
    // 이미 승자가 있거나(calculateWinner(squares) !== null)
    // 해당 칸이 채워져 있으면 클릭을 막음.
	if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // 현재 squares 배열의 복사본을 만듦 (React에서 불변성 유지).
    const nextSquares = squares.slice();

    // X 차례면 "X", O 차례면 "O"을 선택한 칸에 저장.
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    // 부모(Game 컴포넌트)에게 새로운 보드 상태를 전달.
    onPlay(nextSquares);
  }
  
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      {/* status에는 현재 플레이어 차례나 승리 메시지가 표시됨 */}
      <div className="status">{status}</div>
      
      {/* Square 컴포넌트를 9개 배치해 3x3 틱택토 보드를 생성 */}
      {/* <Square value={squares[8]} onSquareClick={handleClick(8)} /> : 클릭하기 전에 handleClick(8)이 실행 
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} /> : 버튼을 클릭할 때만 실행 */}
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

/* 
    🔮 Game 컴포넌트 : 게임의 전체 상태 관리
    - history: 게임의 모든 움직임 기록 (배열의 배열 형태)
    - currentMove: 현재 몇 번째 턴인지 저장 (0이면 게임 시작)
    - xIsNext: 짝수 턴이면 X, 홀수 턴이면 O
    - currentSquares: 현재 턴에서 보드 상태 (history[currentMove])
*/
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
   // 보드 상태가 변경되었을 때 실행
   function handlePlay(nextSquares) {

    // history.slice(0, currentMove + 1) : 현재까지의 게임 기록만 남김 (되돌아간 상태에서 새로운 턴이 시작되면 이후 기록을 삭제)
    // nextHistory = [..., nextSquares] : 기존 기록 + 새 보드 상태 추가
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    // 새로운 히스토리 저장
    setHistory(nextHistory);

    // 현재 턴을 업데이트
    setCurrentMove(nextHistory.length - 1);
  }
  
  // 이전 상태로 돌아갈 때 실행
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  // history 배열을 돌면서 "Go to move #X" 버튼을 만듦
  // move === 0이면 "Go to game start" 버튼을 표시
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
        {/* Board 컴포넌트를 렌더링하여 게임을 표시 */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {/* moves 목록을 <ol> 태그 안에 출력하여 과거 이동 기능을 추가 */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 승리 여부 판단 시 실행
// 모든 승리 조건을 lines 배열로 저장
// 보드에서 해당 위치의 값(X 또는 O)이 모두 같으면 승리
function calculateWinner(squares) {
  const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로
      [0, 4, 8], [2, 4, 6],            // 대각선
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // 승리한 플레이어 (X 또는 O)
    }
  }
  return null; // 승리 없음
}
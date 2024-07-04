import React from 'react';
import './App.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      againstComputer: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { againstComputer, xIsNext } = this.state;
    if (againstComputer && !xIsNext && prevState.xIsNext !== xIsNext) {
      setTimeout(() => {
        this.computerMove();
      }, 500);
    }
  }

  handleClick(i) {
    const { history, stepNumber, xIsNext, againstComputer } = this.state;
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    this.setState({
      history: currentHistory.concat([{ squares, move: i }]),
      stepNumber: currentHistory.length,
      xIsNext: !xIsNext,
    });

    if (againstComputer && !xIsNext && !calculateWinner(squares)) {
      setTimeout(() => {
        this.computerMove();
      }, 500);
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleMode(isAgainstComputer) {
    this.setState({
      againstComputer: isAgainstComputer,
      history: [{
        squares: Array(9).fill(null),
        move: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    });

    if (isAgainstComputer) {
      setTimeout(() => {
        this.computerMove();
      }, 500);
    }
  }

  startNewGame = () => {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
        move: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    });

    if (this.state.againstComputer && !this.state.xIsNext) {
      setTimeout(() => {
        this.computerMove();
      }, 500);
    }
  }

  computerMove() {
    const { history, stepNumber } = this.state;
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const squares = current.squares.slice();

    let emptySquares = [];
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        emptySquares.push(i);
      }
    }

    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    const move = emptySquares[randomIndex];

    squares[move] = 'O';
    this.setState({
      history: currentHistory.concat([{ squares, move }]),
      stepNumber: currentHistory.length,
      xIsNext: true,
    });
  }

  render() {
    const { history, stepNumber, againstComputer } = this.state;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Move ${move}: ${move % 2 === 0 ? 'X' : 'O'} at (${step.move % 3 + 1}, ${Math.floor(step.move / 3) + 1})` :
        'Game start';
      return (
        <li key={move}>
          {desc}
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (history.length === 10) {
      status = 'It\'s a draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div><h2>{status}</h2></div>
          <div>
            <input
              type="radio"
              id="human"
              name="playerType"
              value="human"
              checked={!againstComputer}
              onChange={() => this.toggleMode(false)}
            />
            <label htmlFor="human">Player vs Player</label>
          </div>
          <div>
            <input
              type="radio"
              id="computer"
              name="playerType"
              value="computer"
              checked={againstComputer}
              onChange={() => this.toggleMode(true)}
            />
            <label htmlFor="computer">Player vs Computer</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
  <button onClick={this.startNewGame}>Start New Game</button>
</div>

          <div>
            <h2>Move History</h2>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}


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

function App() {
  return (
    <div className="App">
      <header className="custom-header">
        <h1>Tic Tac Toe</h1>
      </header>
      <main>
        <Game />
      </main>
      <footer>
  &copy; 2024, Built by Martin Purification
</footer>

    </div>
  );
}

export default App;

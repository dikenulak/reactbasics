var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};
var StarFrame = React.createClass({
  render: function() {
    var stars = [];
    for(var i = 0; i< this.props.numberOfStars;i++)
      {
        stars.push(<span className="glyphicon glyphicon-star"></span>);
      }
    return (
      <div id ="stars-frame" className="col-sm-5">
        <div className="well">
          {stars}
          </div>
      </div>
    );
  }
})
var ButtonFrame = React.createClass({
  render: function() {
    var disabled,button,correct = this.props.correct;
    switch (correct) {
      case true:
      button = (
        <button className="btn btn-success" onClick={this.props.acceptAnswer}>EQUALS <span className="glyphicon glyphicon-ok"></span></button>
      );
        break;
        case false:
        button = (
          <button className="btn btn-danger">EQUALS <span className="glyphicon glyphicon-remove"></span></button>
        );
          break;
      default:
        disabled = (this.props.selectedNumbers.length === 0);
        button = (
          <button className="btn btn-warning" disabled={disabled} onClick={this.props.checkAnswer}>EQUALS=</button>
        );
    }
    return (
      <div id ="button-frame" className="col-sm-2 text-center">
        {button}
         <button className="btn btn-primary btn-danger" onClick={this.props.reDraw} disabled={this.props.reDraws === 0}>
           <span className="glyphicon glyphicon-refresh"></span>
            &nbsp; {this.props.reDraws}
           </button>
      </div>
    );
  }
})
var AnswerFrame = React.createClass({
  render: function() {
    var props = this.props;
    var selectedNumbers = props.selectedNumbers.map(function(i){
      return(
        <span onClick={props.unselectNumber.bind(null,i)}>
          {i}
          </span>
      )
    })
    return (
      <div id ="answer-frame" className="col-sm-5">
        <div className="well text-center">
          {selectedNumbers}
          </div>
      </div>
    );
  }
})

var NumberFrame = React.createClass({
  render: function() {
    var numbers = [],
    clickNumber= this.props.selectNumber,
    usedNumbers = this.props.usedNumbers,
    className, selectedNumbers = this.props.selectedNumbers;
    for(var i = 0; i<=9; i++){
      className = "number selected-" + (selectedNumbers.indexOf(i)>=0);
      className += " used-" + (usedNumbers.indexOf(i)>=0);
      numbers.push(<div className={className} onClick={clickNumber.bind(null,i)}>{i}</div>);
    }
    return (
      <div id ="number-frame" className="col-sm-12">
        <div className="well text-center">
          {numbers}
        </div>
      </div>
    );
  }
})

var DoneFrame = React.createClass({
  render : function(){
   return(
     <div className="well text-center col-sm-12">
        <h1>{this.props.doneStatus}</h1>
        <button className="btn btn-default" onClick={this.props.resetGame}>Play Again</button>
      </div>
    )
  }
})
var Game = React.createClass({
  getInitialState: function(){
    return{numberOfStars: this.randomNumber(),
       selectedNumbers : [],
       usedNumbers: [],
       reDraws : 5,
     correct: null,
     doneStatus: null
   };
  },
  resetGame: function () {
    this.replaceState(this.getInitialState());
  },
  selectNumber: function (clickedNumber) {
    if(this.state.selectedNumbers.indexOf(clickedNumber) < 0){
     this.setState({
       selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
       correct: null
     })
   }
  },
  unselectNumber: function(clickedNumber){
      var selectedNumbers = this.state.selectedNumbers,
      indexOfNumber = selectedNumbers.indexOf(clickedNumber);
      selectedNumbers.splice(indexOfNumber,1);
      this.setState({
        selectedNumbers: selectedNumbers,
        correct: null
      });
  },
  sumOfSelectedNumbers: function () {
    return this.state.selectedNumbers.reduce(function (a,b) {
      return a+b;
    },0);
  },
  randomNumber: function () {
    return Math.floor(Math.random()*9) + 1;
  },
  checkAnswer: function () {
    var correct = (this.state.numberOfStars === this.sumOfSelectedNumbers());
    this.setState({
      correct: correct
    })
  },
  acceptAnswer: function () {
// acceptAnswer should be mention as usedNumbers
  var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
  this.setState({
    selectedNumbers : [],
    usedNumbers : usedNumbers,
    correct: null,
    numberOfStars :  this.randomNumber()
  },function(){
    this.updateDoneStatus();
  })
  },
  reDraw: function () {
    if(this.state.reDraws > 0){
    this.setState({
      selectedNumbers: [],
      current: null,
      numberOfStars : this.randomNumber(),
      reDraws: this.state.reDraws - 1
   },function () {
     this.updateDoneStatus();
   })
 }
  },
  possibleSolution: function(){
      var numberOfStars = this.state.numberOfStars,
      possibleNumbers = [],
      usedNumbers = this.state.usedNumbers;

      for(var i=0; i<=9; i++){
        if(usedNumbers.indexOf(i)<0){
          possibleNumbers.push(i);
        }
      }
    return possibleCombinationSum(possibleNumbers, numberOfStars);
  },
  updateDoneStatus: function(){
    if(this.state.usedNumbers.length === 9){
      this.setState({
        doneStatus: "Done. Nice!!"
      });
      return;
    }
    if (this.state.reDraws === 0 && !this.possibleSolution()) {
      this.setState({doneStatus: "Game Over!"});
    }
  },
  render: function() {
    var bottomFrame,doneStatus = this.state.doneStatus;
    if(doneStatus){
      bottomFrame = <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/>;
    }else {
      bottomFrame = <NumberFrame selectedNumbers={this.state.selectedNumbers} selectNumber={this.selectNumber}
          usedNumbers={this.state.usedNumbers} />;
      }
    return (
      <div>
        <h1>Play Game</h1>
        <hr/>
        <StarFrame numberOfStars={this.state.numberOfStars} />
        <ButtonFrame selectedNumbers={this.state.selectedNumbers}
                    correct= {this.state.correct}
                    checkAnswer={this.checkAnswer}
                    acceptAnswer={this.acceptAnswer}
                    reDraw = {this.reDraw}
                    reDraws = {this.state.reDraws}/>
        <AnswerFrame selectedNumbers={this.state.selectedNumbers}
          unselectNumber= {this.unselectNumber} />
        {bottomFrame}
      </div>
    );
  }
})
React.render(<Game />, document.getElementById('game'));

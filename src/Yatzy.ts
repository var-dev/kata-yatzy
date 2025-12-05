type Die = 1 | 2 | 3 | 4 | 5 | 6
type FiveDices = [Die, Die, Die, Die, Die]
export default class Yatzy {
  private fiveDices: FiveDices;

  constructor(...fiveDices: FiveDices) {
    this.fiveDices = fiveDices;
  }

  static chance(...fiveDices: FiveDices): number {
    return fiveDices.reduce((accumulator, current) => accumulator + current, 0);
  }
  // Yatzy: if all dice have the same number, the player scores 50 points.
  static yatzy(...fiveDices: FiveDices): number {
    if (new Set(fiveDices).size === 1) { return 50 }
    return 0
  }
  // The player scores the sum of the dice that reads one, two, three, four, five or six, respectively
  static ones(...fiveDices: FiveDices): number {
    return singles(1)(...fiveDices)
  }

  static twos(...fiveDices: FiveDices): number {
    return singles(2)(...fiveDices)
  }

  static threes(...fiveDices: FiveDices): number {
    return singles(3)(...fiveDices)
  }
  // The player scores the sum of the two highest matching dice.
  static score_pair(...fiveDices: FiveDices): number {
    const highestNumber = matchingDices(...fiveDices).reduce((acc,value)=>(value??0)>=(acc??0) ? value : acc, 0)
    return highestNumber! * 2
  }
  // Two pairs: If there are two pairs of dice with the same number, the player scores the sum of these dice
  static two_pair(...fiveDices: FiveDices): number {
    var counts = Array(fiveDices.length).fill(0)
    fiveDices.forEach((value:Die)=>{counts[value-1]++})
    return counts.map((value, index) => value >= 2 ? index+1 : 0).reduce((acc, value)=>acc+value, 0) * 2
  }
  // Four of a kind: If there are four dice with the same number, the player scores the sum of these dice. 
  static four_of_a_kind(...fiveDices: FiveDices): number {
    var counts = Array(fiveDices.length).fill(0)
    fiveDices.forEach((value:Die)=>{counts[value-1]++})
    return counts.map((value, index) => value >= 4 ? index+1 : 0).reduce((acc, value)=>acc+value, 0) * 4
  }
  //Three of a kind: If there are three dice with the same number, the player scores the sum of these dice.
  static three_of_a_kind(...fiveDices: FiveDices): number {
    var counts = Array(fiveDices.length).fill(0)
    fiveDices.forEach((value:Die)=>{counts[value-1]++})
    return counts.map((value, index) => value >= 3 ? index+1 : 0).reduce((acc, value)=>acc+value, 0) * 3
  }
  // Small straight: When placed on “small straight”, if the dice read 1,2,3,4,5,
  // the player scores 15 (the sum of all the dice).
  static smallStraight(d1: number, d2: number, d3: number, d4: number, d5: number): number {
    var tallies;
    tallies = [0, 0, 0, 0, 0, 0, 0];
    tallies[d1 - 1]! += 1;
    tallies[d2 - 1]! += 1;
    tallies[d3 - 1]! += 1;
    tallies[d4 - 1]! += 1;
    tallies[d5 - 1]! += 1;
    if (tallies[0] == 1 && tallies[1] == 1 && tallies[2] == 1 && tallies[3] == 1 && tallies[4] == 1) return 15;
    return 0;
  }

  static largeStraight(d1: number, d2: number, d3: number, d4: number, d5: number): number {
    var tallies;
    tallies = [0, 0, 0, 0, 0, 0, 0, 0];
    tallies[d1 - 1]! += 1;
    tallies[d2 - 1]! += 1;
    tallies[d3 - 1]! += 1;
    tallies[d4 - 1]! += 1;
    tallies[d5 - 1]! += 1;
    if (tallies[1] == 1 && tallies[2] == 1 && tallies[3] == 1 && tallies[4] == 1 && tallies[5] == 1) return 20;
    return 0;
  }

  static fullHouse(d1: number, d2: number, d3: number, d4: number, d5: number): number {
    var tallies;
    var _2 = false;
    var i;
    var _2_at = 0;
    var _3 = false;
    var _3_at = 0;

    tallies = [0, 0, 0, 0, 0, 0, 0, 0];
    tallies[d1 - 1]! += 1;
    tallies[d2 - 1]! += 1;
    tallies[d3 - 1]! += 1;
    tallies[d4 - 1]! += 1;
    tallies[d5 - 1]! += 1;

    for (i = 0; i != 6; i += 1)
      if (tallies[i] == 2) {
        _2 = true;
        _2_at = i + 1;
      }

    for (i = 0; i != 6; i += 1)
      if (tallies[i] == 3) {
        _3 = true;
        _3_at = i + 1;
      }

    if (_2 && _3) return _2_at * 2 + _3_at * 3;
    else return 0;
  }

  fours(): number {
    var sum;
    sum = 0;
    for (let at = 0; at != 5; at++) {
      if (this.fiveDices[at] == 4) {
        sum += 4;
      }
    }
    return sum;
  }

  fives(): number {
    let s = 0;
    var i;
    for (i = 0; i < this.fiveDices.length; i++) if (this.fiveDices[i] == 5) s = s + 5;
    return s;
  }

  sixes(): number {
    let sum = 0;
    for (var at = 0; at < this.fiveDices.length; at++) if (this.fiveDices[at] == 6) sum = sum + 6;
    return sum;
  }
}


function singles(filter:number){
  return (...fiveDices: FiveDices): number => {
    return fiveDices.filter((value)=>value===filter).reduce((accumulator, value) => accumulator + value, 0);
  }
}
function matchingDices(...fiveDices: FiveDices): number[] {
  const matchingDices = fiveDices
    .map((value, index, array)=>{
      if (array.filter(v=>v===value).length>=2){
        return value
      }
      return
      })
    .filter((value) => value !== undefined)
  return matchingDices
}
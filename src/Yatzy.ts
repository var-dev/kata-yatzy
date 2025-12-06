
type Die = 1 | 2 | 3 | 4 | 5 | 6
type IndexDie = 0 | 1 | 2 | 3 | 4 | 5
type FiveDices = [Die, Die, Die, Die, Die]
type Count = 0 | 1 | 2 | 3 | 4 | 5
type NumberOfDiesWith1 = Count
type NumberOfDiesWith2 = Count
type NumberOfDiesWith3 = Count
type NumberOfDiesWith4 = Count
type NumberOfDiesWith5 = Count
type NumberOfDiesWith6 = Count
type Counts = [
  NumberOfDiesWith1,
  NumberOfDiesWith2,
  NumberOfDiesWith3,
  NumberOfDiesWith4,
  NumberOfDiesWith5,
  NumberOfDiesWith6,
]
export default class Yatzy {
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
  static fours(...fiveDices: FiveDices): number {
    return singles(4)(...fiveDices)
  }
  static fives(...fiveDices: FiveDices): number {
    return singles(5)(...fiveDices)
  }
  static sixes(...fiveDices: FiveDices): number {
    return singles(6)(...fiveDices)
  }
  // The player scores the sum of the two highest matching dice.
  static score_pair(...fiveDices: FiveDices): number {
    const highestNumber = matchingDices(...fiveDices).reduce((acc,value)=>(value??0)>=(acc??0) ? value : acc, 0)
    return highestNumber! * 2
  }
  // Two pairs: If there are two pairs of dice with the same number, the player scores the sum of these dice
  static two_pair(...fiveDices: FiveDices): number {
    var counts = Array(6).fill(0) as Counts
    fiveDices.forEach((value:Die)=>{counts[dieValueToIndex(value)]++})
    return counts.map((value, index) => value >= 2 ? indexToDieValue(index) as number : 0).reduce((acc, value)=>acc+value, 0) * 2
  }
  // Four of a kind: If there are four dice with the same number, the player scores the sum of these dice. 
  static four_of_a_kind(...fiveDices: FiveDices): number {
    var counts = Array(6).fill(0) as Counts
    fiveDices.forEach((value:Die)=>{counts[dieValueToIndex(value)]++})
    return counts.map((value, index) => value >= 4 ? indexToDieValue(index) as number : 0).reduce((acc, value)=>acc+value, 0) * 4
  }
  //Three of a kind: If there are three dice with the same number, the player scores the sum of these dice.
  static three_of_a_kind(...fiveDices: FiveDices): number {
    var counts = Array(6).fill(0) as Counts
    fiveDices.forEach((value:Die)=>{counts[dieValueToIndex(value)]++})
    return counts.map((value, index) => value >= 3 ? indexToDieValue(index) as number : 0).reduce((acc, value)=>acc+value, 0) * 3
  }
  // Small straight: When placed on “small straight”, if the dice read 1,2,3,4,5,
  // the player scores 15 (the sum of all the dice).
  static smallStraight(...fiveDices: FiveDices): number {
    var counts = Array(6).fill(0) as Counts
    fiveDices.forEach((value:Die)=>{counts[dieValueToIndex(value)]++})
    return counts
      .slice(0,5)
      .filter((value) => value === 1)
      .filter((value, index, array)=>array.length === 5)
      .reduce((acc, val, index)=>acc + indexToDieValue(index), 0)
  }
  // Large straight: When placed on “large straight”, if the dice read 2,3,4,5,6,
  // the player scores 20 (the sum of all the dice).
  static largeStraight(...fiveDices: FiveDices): number {
    var counts = Array(6).fill(0) as Counts
    fiveDices.forEach((value:Die)=>{counts[dieValueToIndex(value)]++})
    return counts
      .slice(1,6)
      .filter((value) => value === 1)
      .filter((value, index, array)=>array.length === 5)
      .reduce((acc, val, index)=>acc+index+2, 0)
  }
  //Full house: If the dice are two of a kind and three of a kind, the player scores the sum of all the dice. 
  static fullHouse(...fiveDices: FiveDices): number {
    var counts = Array(6).fill(0) as Counts
    fiveDices.forEach((value:Die)=>{counts[dieValueToIndex(value)]++})
    return counts
      .filter((value, index, array)=>array.some((value)=> value === 2))
      .filter((value, index, array)=>array.some((value)=> value === 3))
      .reduce((acc: number, value, index)=>{
        return (indexToDieValue(index))*value + acc
      }, 0 as number)
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

function indexToDieValue(index: number): Die {
  assert(index >= 0 && index <= 5)
  return (index + 1) as Die
}

function dieValueToIndex(dieValue: number): IndexDie {
  assert(dieValue >= 1 && dieValue <= 6)
  return (dieValue - 1) as IndexDie
}
function assert(condition: boolean): asserts condition {
  class AssertError extends Error{}
  if (!condition) {
    throw new AssertError("Assertion error")
  }
}


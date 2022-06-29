import { assert, describe, it } from "./helpers.mjs";
import Rectangle from "../lib/Rectangle.mjs";
import {
  compareTwoRectangles,
  handleInput,
  findAdjacency,
  findContainment,
  findIntersection,
} from "../index.mjs";

// Test setup

// One rect to compare others to
const baseRectangle = new Rectangle({ x: 2, y: 2, height: 8, width: 8});
// Completely distinct
const distinctRectangle = new Rectangle({ x: 11, y: 11, height: 5, width: 7});
// Adjacent
const adjacentProperRectangle = new Rectangle({ x: 2, y: 10, height: 3, width: 8});
const adjacentSublineRectangle = new Rectangle({ x: 10, y: 3, height: 5, width: 7});
const adjacentPartialRectangle = new Rectangle({ x: 1, y: 1, height: 1, width: 4});
// Contained
const containedRectangle = new Rectangle({ x: 3, y: 3, height: 5, width: 6});
const containingRectangle = new Rectangle({ x: 1, y: 1, height: 12, width: 15});
// Intersecting
const intersectingRectangle1 = new Rectangle({ x: 5, y: 3, height: 5, width: 5});
const intersectingRectangle2 = new Rectangle({ x: 10, y: 10, height: 5, width: 5});

describe('Handle Input');
  it('should return true on valid input', () => {
    const result = handleInput([1,1,2,3,3,3,4,5], false)
    assert(result === true);
  });
  it('should return false on invalid input (0 length)', () => {
    const result = handleInput([1,1,0,3,3,3,4,5], false)
    assert(result === false);
  });
  it('should return false on invalid input (out of bounds)', () => {
    const result = handleInput([1,1,-4,3,3,3,4,5], false)
    assert(result === false);
  });

describe('Compare Two Rectangles');
  it('should return data in the correct shape', () => {
    const result = compareTwoRectangles(baseRectangle, distinctRectangle, false);
    assert(result.intersections === null);
    assert(result.adjacency === null);
    assert(typeof result.containment === 'boolean');
  });
  it('should identify two distinct rectangles', () => {
    const result = compareTwoRectangles(baseRectangle, distinctRectangle, false);
    assert(result.intersections === null);
    assert(result.adjacency === null);
    assert(result.containment === false);
  });

describe('Find Adjacency');
  it('should identify two non-adjacent rectangles', () => {
    const result = findAdjacency(baseRectangle, distinctRectangle);
    assert(result === null);
  });
  it('should identify two properly adjacent rectangles', () => {
    const result = findAdjacency(baseRectangle, adjacentProperRectangle);
    assert(result === 'Rectangle 1 and Rectangle 2 are properly adjacent');
  });
  it('should identify two subline adjacent rectangles', () => {
    const result = findAdjacency(baseRectangle, adjacentSublineRectangle);
    assert(result === 'Rectangle 1 and Rectangle 2 are subline adjacent');
  });
  it('should identify two partially adjacent rectangles', () => {
    const result = findAdjacency(baseRectangle, adjacentPartialRectangle);
    assert(result === 'Rectangle 1 and Rectangle 2 are partially adjacent');
  });

describe('Find Containment');
  it('should identify no containment', () => {
    const result = findContainment(baseRectangle, distinctRectangle);
    assert(Array.isArray(result));
    assert(result.length === 2);
    assert(result[0] === false);
    assert(result[1] === false);
  });
  it('should identify rectangle 1 contains rectangle 2', () => {
    const result = findContainment(baseRectangle, containedRectangle);
    assert(Array.isArray(result));
    assert(result[0] === true);
    assert(result[1] === false);
  });
  it('should identify rectangle 2 contains rectangle 1', () => {
    const result = findContainment(baseRectangle, containingRectangle);
    assert(Array.isArray(result));
    assert(result[0] === false);
    assert(result[1] === true);
  });

describe('Find Intersections');
  it('should identify two rectangles which do not intersect', () => {
    const result = findIntersection(baseRectangle, distinctRectangle);
    assert(Array.isArray(result));
    assert(result.length === 0);
  });
  it('should identify two intersecting rectangles', () => {
    const result = findIntersection(baseRectangle, intersectingRectangle1);
    assert(Array.isArray(result));
    result.forEach( i => {
      assert(i.hasOwnProperty('x'));
      assert(i.hasOwnProperty('y'));
      assert(typeof i.x === 'number');
      assert(typeof i.y === 'number');
    })
  });
  it('should identify two points of intersection', () => {
    const result = findIntersection(baseRectangle, intersectingRectangle1);
    assert(Array.isArray(result));
    assert(result.length === 2);
    assert(result[0].x === 9);
    assert(result[0].y === 3);
    assert(result[1].x === 8);
    assert(result[1].y === 8);
  });
  it('should identify one point of intersection', () => {
    const result = findIntersection(baseRectangle, intersectingRectangle2);
    assert(Array.isArray(result));
    assert(result.length === 1);
    assert(result[0].x === 10);
    assert(result[0].y === 10);
  });

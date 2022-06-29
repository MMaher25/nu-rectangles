import Rectangle from "./lib/Rectangle.mjs";
import { draw } from "./script/draw.mjs"

const args = process.argv.slice(2);

/**
 * Instructions:
 *
 * 1. Intersection: You must be able to determine whether two rectangles have one or more
 * intersecting lines and produce a result identifying the points of intersection.
 * 2. Containment: You must be able to determine whether a rectangle is wholly contained within
 * another rectangle.
 * 3. Adjacency: Implement the ability to detect whether two rectangles are adjacent. Adjacency is
 * defined as the sharing of at least one side. Side sharing may be proper, sub-line or partial. A
 * sub-line share is a share where one side of rectangle A is a line that exists as a set of points
 * wholly contained on some other side of rectangle B, where partial is one where some line
 * segment on a side of rectangle A exists as a set of points on some side of Rectangle B.
 **/

/**
 * Finds the intersection points of two Rectangles
 * @param {Rectangle} rect1 An instance of the Rectangle class
 * @param {Rectangle} rect2 An instance of the Rectangle class
 * @returns {{x: Number, y: Number}[]} An array of objects containing the
 * x and y coords of intersection points
 */

export const findIntersection = (rect1, rect2) => {
  const findLineSegmentIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    // Linear algebra! Solution from Paul Bourke
    // http://paulbourke.net/geometry/pointlineplane/
    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    if (denominator === 0) {
      return null;
    }

    const unknownA =
      ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    const unknownB =
      ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    if (unknownA >= 0 && unknownA <= 1 && unknownB >= 0 && unknownB <= 1) {
      return {
        x: x1 + unknownA * (x2 - x1),
        y: y1 + unknownA * (y2 - y1),
      };
    }

    return null;
  };

  const intersection1 = findLineSegmentIntersect(
    ...rect1.sides.horizontal1,
    ...rect2.sides.vertical1
  );
  const intersection2 = findLineSegmentIntersect(
    ...rect1.sides.horizontal1,
    ...rect2.sides.vertical2
  );
  const intersection3 = findLineSegmentIntersect(
    ...rect1.sides.horizontal2,
    ...rect2.sides.vertical1
  );
  const intersection4 = findLineSegmentIntersect(
    ...rect1.sides.horizontal2,
    ...rect2.sides.vertical2
  );
  const intersection5 = findLineSegmentIntersect(
    ...rect1.sides.vertical1,
    ...rect2.sides.horizontal1
  );
  const intersection6 = findLineSegmentIntersect(
    ...rect1.sides.vertical2,
    ...rect2.sides.horizontal1
  );
  const intersection7 = findLineSegmentIntersect(
    ...rect1.sides.vertical1,
    ...rect2.sides.horizontal2
  );
  const intersection8 = findLineSegmentIntersect(
    ...rect1.sides.vertical2,
    ...rect2.sides.horizontal2
  );

  return [
    intersection1,
    intersection2,
    intersection3,
    intersection4,
    intersection5,
    intersection6,
    intersection7,
    intersection8,
  ]
    .filter((i) => i !== null)
    .filter((intersection, i, arr) => {
      // Filter out duplicates
      return !arr.slice(i + 1).reduce((acc, cv) => {
        if (!acc) {
          return cv.x === intersection.x && cv.y === intersection.y;
        }
        return acc;
      }, false);
    });
};

/**
 * Finds if one of two Rectangles is contained within the other
 * @param {Rectangle} rect1 An instance of the Rectangle class
 * @param {Rectangle} rect2 An instance of the Rectangle class
 * @returns {Boolean[]} A touple array of booleans. If [0] is true, rect1 is
 * contained within rect2. If [1] is true, rect2 is contained within rect1.
 * If both are false, no containment exists.
 */

export const findContainment = (rect1, rect2) => {
  const isContained = (rect1, rect2) => {
    const topLeft =
      rect1.vertices[0].x < rect2.vertices[0].x &&
      rect1.vertices[0].y < rect2.vertices[0].y;
    const topRight =
      rect1.vertices[1].x > rect2.vertices[1].x &&
      rect1.vertices[1].y < rect2.vertices[1].y;
    const bottomRight =
      rect1.vertices[2].x > rect2.vertices[2].x &&
      rect1.vertices[2].y > rect2.vertices[2].y;
    const bottomLeft =
      rect1.vertices[3].x < rect2.vertices[3].x &&
      rect1.vertices[3].y > rect2.vertices[3].y;

    return topLeft && topRight && bottomLeft && bottomRight;
  };

  return [isContained(rect1, rect2), isContained(rect2, rect1)];
};

/**
 * Finds if two Rectangles share a border
 * @param {Rectangle} rect1 An instance of the Rectangle class
 * @param {Rectangle} rect2 An instance of the Rectangle class
 * @returns {String|null} A string describing the adjacency of the two
 * rectangles or null if they are not adjacent
 */

export const findAdjacency = (rect1, rect2) => {
  const isAdjacentProper = (rect1, rect2) => {
    const shared = rect1.vertices.filter((vertex1) => {
      return rect2.vertices.reduce((found, vertex2) => {
        if (found) return found;
        return vertex1.x === vertex2.x && vertex1.y === vertex2.y;
      }, false);
    });

    // Since they're rectangles, if they share 2 vertices they're properly adjacent
    return shared.length > 1;
  };

  const isAdjacentSubline = (rect1, rect2) => {
    const topInner =
      rect1.vertices[0].x < rect2.vertices[0].x &&
      rect1.vertices[1].x > rect2.vertices[0].x &&
      rect1.vertices[0].x < rect2.vertices[1].x &&
      rect1.vertices[1].x > rect2.vertices[1].x &&
      rect1.vertices[0].y === rect2.vertices[0].y;
    const topOuter =
      rect1.vertices[0].x < rect2.vertices[2].x &&
      rect1.vertices[1].x > rect2.vertices[2].x &&
      rect1.vertices[0].x < rect2.vertices[3].x &&
      rect1.vertices[1].x > rect2.vertices[3].x &&
      rect1.vertices[0].y === rect2.vertices[2].y;
    const rightInner =
      rect1.vertices[1].y < rect2.vertices[1].y &&
      rect1.vertices[2].y > rect2.vertices[1].y &&
      rect1.vertices[1].y < rect2.vertices[2].y &&
      rect1.vertices[2].y > rect2.vertices[2].y &&
      rect1.vertices[1].x === rect2.vertices[1].x;
    const rightOuter =
      rect1.vertices[1].y < rect2.vertices[0].y &&
      rect1.vertices[2].y > rect2.vertices[0].y &&
      rect1.vertices[1].y < rect2.vertices[3].y &&
      rect1.vertices[2].y > rect2.vertices[3].y &&
      rect1.vertices[1].x === rect2.vertices[3].x;
    const bottomInner =
      rect1.vertices[2].x < rect2.vertices[2].x &&
      rect1.vertices[3].x > rect2.vertices[2].x &&
      rect1.vertices[2].x < rect2.vertices[3].x &&
      rect1.vertices[3].x > rect2.vertices[3].x &&
      rect1.vertices[2].y === rect2.vertices[2].y;
    const bottomOuter =
      rect1.vertices[2].x < rect2.vertices[1].x &&
      rect1.vertices[3].x > rect2.vertices[1].x &&
      rect1.vertices[2].x < rect2.vertices[0].x &&
      rect1.vertices[3].x > rect2.vertices[0].x &&
      rect1.vertices[2].y === rect2.vertices[0].y;
    const leftInner =
      rect1.vertices[3].y > rect2.vertices[3].y &&
      rect1.vertices[0].y < rect2.vertices[3].y &&
      rect1.vertices[3].y > rect2.vertices[0].y &&
      rect1.vertices[0].y < rect2.vertices[0].y &&
      rect1.vertices[3].x === rect2.vertices[3].x;
    const leftOuter =
      rect1.vertices[3].y > rect2.vertices[2].y &&
      rect1.vertices[0].y < rect2.vertices[2].y &&
      rect1.vertices[3].y > rect2.vertices[1].y &&
      rect1.vertices[0].y < rect2.vertices[1].y &&
      rect1.vertices[3].x === rect2.vertices[1].x;

    return (
      topInner ||
      topOuter ||
      rightInner ||
      rightOuter ||
      bottomInner ||
      bottomOuter ||
      leftInner ||
      leftOuter
    );
  };

  const isAdjacentPartial = (rect1, rect2) => {
    const topInner =
      ((rect1.vertices[0].x < rect2.vertices[0].x &&
        rect1.vertices[1].x > rect2.vertices[0].x) ||
        (rect1.vertices[0].x < rect2.vertices[1].x &&
          rect1.vertices[1].x > rect2.vertices[1].x)) &&
      rect1.vertices[0].y === rect2.vertices[0].y;
    const topOuter =
      ((rect1.vertices[0].x < rect2.vertices[2].x &&
        rect1.vertices[1].x > rect2.vertices[2].x) ||
        (rect1.vertices[0].x < rect2.vertices[3].x &&
          rect1.vertices[1].x > rect2.vertices[3].x)) &&
      rect1.vertices[0].y === rect2.vertices[3].y;
    const rightInner =
      ((rect1.vertices[1].y < rect2.vertices[1].y &&
        rect1.vertices[2].y > rect2.vertices[1].y) ||
        (rect1.vertices[1].y < rect2.vertices[2].y &&
          rect1.vertices[2].y > rect2.vertices[2].y)) &&
      rect1.vertices[1].x === rect2.vertices[1].x;
    const rightOuter =
      ((rect1.vertices[1].y < rect2.vertices[0].y &&
        rect1.vertices[2].y > rect2.vertices[0].y) ||
        (rect1.vertices[1].y < rect2.vertices[3].y &&
          rect1.vertices[2].y > rect2.vertices[3].y)) &&
      rect1.vertices[1].x === rect2.vertices[3].x;
    const bottomInner =
      ((rect1.vertices[3].x < rect2.vertices[2].x &&
        rect1.vertices[2].x > rect2.vertices[2].x) ||
        (rect1.vertices[3].x < rect2.vertices[3].x &&
          rect1.vertices[2].x > rect2.vertices[3].x)) &&
      rect1.vertices[2].y === rect2.vertices[2].y;
    const bottomOuter =
      ((rect1.vertices[3].x < rect2.vertices[0].x &&
        rect1.vertices[2].x > rect2.vertices[0].x) ||
        (rect1.vertices[3].x < rect2.vertices[1].x &&
          rect1.vertices[2].x > rect2.vertices[1].x)) &&
      rect1.vertices[2].y === rect2.vertices[1].y;
    const leftInner =
      ((rect1.vertices[3].y < rect2.vertices[3].y &&
        rect1.vertices[0].y > rect2.vertices[3].y) ||
        (rect1.vertices[3].y < rect2.vertices[0].y &&
          rect1.vertices[0].y > rect2.vertices[0].y)) &&
      rect1.vertices[3].x === rect2.vertices[3].x;
    const leftOuter =
      ((rect1.vertices[3].y < rect2.vertices[1].y &&
        rect1.vertices[0].y > rect2.vertices[1].y) ||
        (rect1.vertices[3].y < rect2.vertices[2].y &&
          rect1.vertices[0].y > rect2.vertices[2].y)) &&
      rect1.vertices[3].x === rect2.vertices[2].x;

    return (
      topInner ||
      topOuter ||
      rightInner ||
      rightOuter ||
      bottomInner ||
      bottomOuter ||
      leftInner ||
      leftOuter
    );
  };

  // Proper
  if (isAdjacentProper(rect1, rect2)) {
    return "Rectangle 1 and Rectangle 2 are properly adjacent";
  }
  // Subline
  if (isAdjacentSubline(rect1, rect2)) {
    return "Rectangle 1 and Rectangle 2 are subline adjacent";
  }
  // Partial
  if (isAdjacentPartial(rect1, rect2)) {
    return "Rectangle 1 and Rectangle 2 are partially adjacent";
  }

  return null;
};

/**
 * Compares two Rectangles for adjacency, containment, and intersection
 * @param {Rectangle} rect1 An instance of the Rectangle class
 * @param {Rectangle} rect2 An instance of the Rectangle class
 * @returns {{  intersections: {x: Number, y: Number}[]|null,
 *              adjacency: String|null,
 *              containment: Boolean
 *          }} An object containing the results of the the various comparisons
 */

export const compareTwoRectangles = (rect1, rect2, verbose = true) => {
  const results = { intersections: null, adjacency: null, containment: null };
  const output = [];

  // Find intersections
  const intersections = findIntersection(rect1, rect2);
  if (intersections.length > 0) {
    // Has intersections
    output.push("Intersection points:");
    intersections.forEach((i) => output.push(`  * ${i.x}, ${i.y}`));
    results.intersections = intersections;
  } else {
    // No intersections
    output.push("No intersections");
  }

  // Find containment
  const containment = findContainment(rect1, rect2);
  if (containment.some((x) => x)) {
    output.push(
      `Rectangle ${containment[1] ? "1" : "2"} is contained within Rectangle ${
        containment[1] ? "2" : "1"
      }`
    );
    results.containment = true;
  } else {
    output.push("No containment");
    results.containment = false;
  }

  // Find adjacency
  const adjacency = findAdjacency(rect1, rect2);
  if (adjacency) {
    output.push(adjacency);
    results.adjacency = adjacency;
  } else {
    output.push("No adjacency");
  }

  verbose && output.forEach((line) => console.log(line));
  return results;
};

/**
 * Handles CLI input. Creates new Rectangles and passes them to the compare function
 * @param {Number[]} argsArray An array of 8 numbers from the CLI input.
 * @returns {void}
 */

export const handleInput = (argsArray, verbose = true) => {
  let makeDrawing = false;
  if (argsArray.includes('-d')) {
    makeDrawing = true;
    argsArray = argsArray.filter(x => x !== '-d');
  }
  const [x1, y1, w1, h1, x2, y2, w2, h2] = argsArray;
  const rect1 = new Rectangle({ x: +x1, y: +y1, width: +w1, height: +h1 });
  const rect2 = new Rectangle({ x: +x2, y: +y2, width: +w2, height: +h2 });

  if (verbose && rect1.invalid) {
    console.error("Error with rectangle 1:");
    rect1.errorMessages.forEach((err) => console.error(`  * ${err}`));
  }
  if (verbose && rect2.invalid) {
    console.error("Error with rectangle 2:");
    rect2.errorMessages.forEach((err) => console.error(`  * ${err}`));
  }
  if (rect1.invalid || rect2.invalid) return false;

  const results = compareTwoRectangles(rect1, rect2, verbose);
  makeDrawing && draw(rect1, rect2, results);
  return true;
};

// Invoke handler
handleInput(args);

export default class Rectangle {
  constructor({ x = 0, y = 0, width, height }) {
    this.x = x;
    this.y = y;
    this.width = +width;
    this.height = +height;

    this.vertices = [
      { x, y }, // Top-left
      { x: x + this.width, y }, // Top-right
      { x: x + this.width, y: y + this.height }, // Bottom-right
      { x, y: y + this.height }, // Bottom-left
    ];

    this.sides = {
      horizontal1: [
        this.vertices[0].x,
        this.vertices[0].y,
        this.vertices[1].x,
        this.vertices[1].y,
      ],
      horizontal2: [
        this.vertices[2].x,
        this.vertices[2].y,
        this.vertices[3].x,
        this.vertices[3].y,
      ],
      vertical1: [
        this.vertices[0].x,
        this.vertices[0].y,
        this.vertices[2].x,
        this.vertices[2].y,
      ],
      vertical2: [
        this.vertices[1].x,
        this.vertices[1].y,
        this.vertices[3].x,
        this.vertices[3].y,
      ],
    };

    const failureConditions = [
      { condition: width <= 0, message: "Width must be greater than 0" },
      { condition: height <= 0, message: "Height must be greater than 0" },
      {
        condition: this.vertices.some((v) => v.x < 0 || v.y < 0),
        message: "Out of bounds",
      },
    ];

    if (failureConditions.some((c) => c.condition)) {
      const errorMessages = failureConditions
        .filter((c) => c.condition)
        .map((c) => c.message);
      return { invalid: true, errorMessages };
    }
  }
}

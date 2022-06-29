# Rectangles!

This application compares 2 rectangles to find their points of intersection, if any.

## Comparing Rectangles
To use, run one of the following commands:
```shell
  $ npm run compare <rectangle1 args> <rectangle2 args>
  $ yarn compare <rectangle1 args> <rectangle2 args>
```

Being sure to pass the following arguments for each of the two rectangles:
  origin-x, origin-y, width, height

*NB - the origin is the top-left corner of the rectangle*

e.g. : `npm run compare 1 1 5 3 2 3 4 4`

This would test two rectangles:
  Rectangle 1: Origin at 1,1 width 5 / height 3
  Rectangle 2: Origin at 2,3 width 4 / height 4
  
To implement the draw function, pass a `-d` flag
Drawing output will be rendered to a file in the root project directory: `draw.html`

## Help
For command line help, use the following command:
```shell
  npm run help
```

## Testing
To run unit tests, use one of the following commands:
```shell
  npm run test
  yarn test
```

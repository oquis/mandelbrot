// empecé basado en este post:
// https://progur.com/2017/02/create-mandelbrot-fractal-javascript.html

function isInMandelbrotSet(x, y, iterations) {
  let realComponentOfResult = x;
  let imaginaryComponentOfResult = y;

  for (let i = 0; i < iterations; i++) {
    // Calculate the real and imaginary components of the result
    // separately
    const tempRealComponent =
      realComponentOfResult * realComponentOfResult -
      imaginaryComponentOfResult * imaginaryComponentOfResult +
      x;

    const tempImaginaryComponent =
      2 * realComponentOfResult * imaginaryComponentOfResult + y;

    realComponentOfResult = tempRealComponent;
    imaginaryComponentOfResult = tempImaginaryComponent;
  }

  if (realComponentOfResult * imaginaryComponentOfResult < 5) {
    // In the Mandelbrot set
    return true;
  }
  // Not in the set
  return false;
}

function drawFractal({
  magnificationFactor = 200,
  panX = 2,
  panY = 1.5,
  iterations = 5,
} = {}) {
  // Create Canvas
  let myCanvas = document.createElement("canvas");
  myCanvas.width = 600;
  myCanvas.height = 600;
  document.body.appendChild(myCanvas);

  const ctx = myCanvas.getContext("2d");

  // Start drawing
  for (let x = 0; x < myCanvas.width; x++) {
    for (let y = 0; y < myCanvas.height; y++) {
      const belongsToSet = isInMandelbrotSet(
        x / magnificationFactor - panX,
        y / magnificationFactor - panY,
        iterations
      );

      if (belongsToSet) {
        // Draw a black pixel
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

drawFractal();

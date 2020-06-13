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
  offsetX = 2,
  offsetY = 1.5,
  iterations = 5,
} = {}) {
  // Create Canvas
  const canvas = document.getElementById("canvas");

  const canvasContext = canvas.getContext("2d");

  // Clear the canvas
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  // Start drawing
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      const belongsToSet = isInMandelbrotSet(
        x / magnificationFactor - offsetX,
        y / magnificationFactor - offsetY,
        iterations
      );

      if (belongsToSet) {
        // Draw a black pixel
        canvasContext.fillRect(x, y, 1, 1);
      }
    }
  }
}

drawFractal();

// setup event handlers
(() => {
  const controls = document.forms["controls"];

  /**
   * Handle form submition
   */
  controls.onsubmit = () => {
    console.log("draw fractal");

    drawFractal({
      magnificationFactor: controls["zoom"].value,
      offsetX: controls["offsetX"].value,
      offsetY: controls["offsetY"].value,
      iterations: controls["iterations"].value,
    });

    console.log("fractal drawn");

    // cancel form submission
    return false;
  };

  controls.onreset = () => {
    drawFractal();
  };
})();

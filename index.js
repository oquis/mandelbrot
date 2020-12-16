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

    const result = realComponentOfResult * imaginaryComponentOfResult;
    // Return a number as a percentage
    const resultPercent = (i / iterations) * 100;

    // Minimum result to break
    if (result > 1) return resultPercent;
  }
  // Not in the set
  return 0;
}

function showLoadingOverlay() {
  const html = document.querySelector('html');
  html.style.setProperty('--loadingOverlay', 'visible');
}

function hideLoadingOverlay() {
  const html = document.querySelector('html');
  html.style.setProperty('--loadingOverlay', 'hidden');
}

function drawCanvas({
  magnificationFactor = 200,
  offsetX = 2,
  offsetY = 2,
  iterations = 5,
  color = 0,
} = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Create Canvas
      const canvas = document.getElementById('canvas');
      // TODO: no debería estar aquí, debería estar en eventos
      // "onload" de la página y "resize" de window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const canvasContext = canvas.getContext('2d');

      setTimeout(() => {
        // Start drawing
        for (let x = 0; x < canvas.width; x++) {
          for (let y = 0; y < canvas.height; y++) {
            const belongsToSet = isInMandelbrotSet(
              x / magnificationFactor - offsetX,
              y / magnificationFactor - offsetY,
              iterations
            );

            if (belongsToSet === 0) {
              // Draw a black pixel
              canvasContext.fillStyle = '#000';
              canvasContext.fillRect(x, y, 1, 1);
            } else {
              // Draw a colorful pixel
              canvasContext.fillStyle = `hsl(${color}, 100%, ${belongsToSet}%`;
              canvasContext.fillRect(x, y, 1, 1);
            }
          }
        }
        resolve(true);
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
}

function getControlValues() {
  const controls = document.forms['controls'];

  return {
    magnificationFactor: controls.zoom.value,
    offsetX: controls.offsetX.value,
    offsetY: controls.offsetY.value,
    iterations: controls.iterations.value,
    color: controls.color.value,
  };
}

async function drawFractal(values) {
  showLoadingOverlay();
  await drawCanvas(values);
  hideLoadingOverlay();
}

// setup event handlers
(() => {
  const controls = document.forms['controls'];

  /**
   * Handle form submition
   */
  controls.onsubmit = () => {
    drawFractal(getControlValues());

    // cancel form submission
    return false;
  };

  controls.onreset = () => {
    drawFractal();
  };

  // resize the canvas to fill browser window dynamically
  window.addEventListener(
    'resize',
    () => {
      const canvas = document.getElementById('canvas');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      /**
       * Your drawings need to be inside this function otherwise they will be reset when
       * you resize the browser window and the canvas will be cleared.
       */
      drawFractal(getControlValues());
    },
    false
  );
})();

// draw initial fractal
drawFractal(getControlValues());

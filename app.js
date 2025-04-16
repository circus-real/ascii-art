document.getElementById("imageInput").addEventListener("change", function () {
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");

  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function () {
      imagePreview.src = reader.result;
    };

    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
  }
});

document
  .getElementById("generateButton")
  .addEventListener("click", function () {
    const imageInput = document.getElementById("imageInput");
    const asciiArtContainer = document.getElementById("asciiArt");
    const imagePreview = document.getElementById("imagePreview");

    if (!imagePreview.src || !imagePreview.complete) {
      alert("Please upload an image first.");
      return;
    }

    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function () {
        const img = new Image();
        img.src = reader.result;

        img.onload = function () {
          const asciiArt = generateAsciiArt(img);
          asciiArtContainer.textContent = asciiArt;
        };
      };

      reader.readAsDataURL(file);
    }
  });

document.getElementById("copyButton").addEventListener("click", function () {
  const asciiArt = document.getElementById("asciiArt");
  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNodeContents(asciiArt);
  selection.removeAllRanges();
  selection.addRange(range);

  navigator.clipboard.writeText(asciiArt.textContent)
    .then(() => {
      alert("Output copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy text: ", err);
    });
  selection.removeAllRanges();

  alert("Output copied to clipboard!");
});

function generateAsciiArt(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const maxWidth = 100;
  const maxHeight = 100;

  // Use naturalWidth/naturalHeight for JPGs with EXIF orientation
  const imgWidth = image.naturalWidth || image.width;
  const imgHeight = image.naturalHeight || image.height;
  const aspectRatio = imgWidth / imgHeight;

  let newWidth = maxWidth;
  let newHeight = newWidth / aspectRatio;

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  // Ensure dimensions are integers
  newWidth = Math.floor(newWidth);
  newHeight = Math.floor(newHeight);

  // Double the height for square-like characters
  canvas.width = newWidth;
  canvas.height = newHeight * 2;
  context.drawImage(image, 0, 0, newWidth, newHeight);

  const imageData = context.getImageData(0, 0, newWidth, newHeight).data;
  let asciiArt = "";

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const pixelIndex = (y * newWidth + x) * 4;
      const r = imageData[pixelIndex];
      const g = imageData[pixelIndex + 1];
      const b = imageData[pixelIndex + 2];
      const grayValue = (r + g + b) / 3;
      const asciiChar = getAsciiChar(grayValue);
      asciiArt += asciiChar;
    }
    asciiArt += "\n"; // Newline for each row
  }

  return asciiArt;
}

function getAsciiChar(grayValue) {
  const asciiChars = "@%#*+=-:. ";
  const index = Math.floor((grayValue / 255) * (asciiChars.length - 1));
  return asciiChars.charAt(index);
}

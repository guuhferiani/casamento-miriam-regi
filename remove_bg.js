import { Jimp } from "jimp";

async function removeBackground() {
  try {
    const image = await Jimp.read("src/assets/flowers.png");
    
    // Iterate over each pixel
    image.scan((x, y, idx) => {
      const red = image.bitmap.data[idx + 0];
      const green = image.bitmap.data[idx + 1];
      const blue = image.bitmap.data[idx + 2];
      
      // If the pixel is close to white, make it transparent
      // Flowers might have light parts, so be careful. We'll use a threshold of 240.
      if (red > 235 && green > 235 && blue > 235) {
        // To make edges softer, we could blend alpha, but let's do a hard cut first or simple gradient
        const avg = (red + green + blue) / 3;
        // Map 235-255 to alpha 255-0
        let alpha = 255;
        if (avg >= 250) {
           alpha = 0;
        } else {
           alpha = Math.max(0, 255 - ((avg - 235) * (255 / 15)));
        }
        image.bitmap.data[idx + 3] = alpha;
      }
    });

    await image.write("src/assets/flowers_transparent.png");
    console.log("Background removed successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

removeBackground();

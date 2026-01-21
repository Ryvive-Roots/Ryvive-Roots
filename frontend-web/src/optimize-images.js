import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

await imagemin(["src/assets/**/*.{jpg,png,jpeg}"], {
  destination: "src/assets/optimized",
  plugins: [
    imageminWebp({
      quality: 75
    })
  ]
});

console.log("✅ Images optimized successfully");

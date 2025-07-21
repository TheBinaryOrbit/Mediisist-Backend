const deleteImage = (imagePath) => {
  const fullPath = path.join(__dirname, "..", imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      } else {
        console.log("Image deleted successfully:", fullPath);
      }
    });
};

export default deleteImage;
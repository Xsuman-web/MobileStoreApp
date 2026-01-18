const imageInput = document.getElementById("image");
const submitBtn = document.getElementById("submitBtn");
const preview = document.getElementById("preview");

if (imageInput) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    // preview
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");

    // enable submit
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
  });
}

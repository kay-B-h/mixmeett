document
  .querySelector(".current-user-nav-btn")
  .addEventListener("click", () => {
    document.querySelector(".user-modal");
    classList.toggle("hide");
  });
let newPostBtn = document.querySelector(".new-post");
let form = document.querySelector(".new-post-form");
document.querySelector(".new-post").addEventListener("click", () => {
  if (form.classList.contains("hide")) {
    //change text in btn
    newPostBtn.textContent = "close";
  } else {
    newPostBtn.textContent = "+ new post";
  }
  form.classList.toggle("hide");
});

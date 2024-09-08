const selectMenus = document.querySelectorAll(".select-menu");

selectMenus.forEach((optionMenu) => {
    const selectBtn = optionMenu.querySelector(".select-btn");
    const options = optionMenu.querySelectorAll(".option");
    const sBtn_text = optionMenu.querySelector(".button");

    selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));
});


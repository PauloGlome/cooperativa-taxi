const darkBtn = document.getElementById("darkBtn");

function ativarTema() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("tema", "dark");
        darkBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        localStorage.setItem("tema", "light");
        darkBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}

if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
    darkBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

darkBtn.addEventListener("click", ativarTema);
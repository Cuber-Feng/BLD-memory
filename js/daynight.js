function toggleMode() {
    if (document.body.classList.contains("dark")) {

        document.body.classList.remove("dark");
        document.body.classList.add("light");

        document.querySelectorAll("body *").forEach(el => {
            el.classList.remove("dark");
            el.classList.add("light");
        });

        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");

        document.querySelectorAll("body *").forEach(el => {
            el.classList.remove("light");
            el.classList.add("dark");
        });
        localStorage.setItem("theme", "dark");
    }
}
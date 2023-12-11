fetch("nav.html")
  .then((response) => response.text())
  .then((data) => {
    const navElement = document.querySelector("nav");
    navElement.innerHTML = data;
  });

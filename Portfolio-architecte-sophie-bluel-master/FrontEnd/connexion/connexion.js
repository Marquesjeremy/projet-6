const form = document.querySelector("form");
const Error = document.querySelector("#msgError");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const getForm = new FormData(form);
    const objForm = Object.fromEntries(getForm);
    setForm("http://localhost:5678/api/users/login", objForm);
});

const setForm = async (url, objForm) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(objForm),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.ok) {
      Error.style.display = "none";
      getToken(response);
      location.href = "./index.html";
    } else {
      Error.classList.add("error");
      Error.textContent = "Erreur dans l’identifiant ou le mot de passe";
    }
  } catch (e) {
    console.log(e);
  }
};

const getToken = async (response) => {
  try {
    const body = await response.json();
    localStorage.setItem("token", JSON.stringify(body));
  } catch (e) {
    console.log(e);
  }
};
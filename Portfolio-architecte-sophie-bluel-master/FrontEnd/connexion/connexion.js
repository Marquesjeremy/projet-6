const form = document.querySelector("form");
const error = document.querySelector("#msgError");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const getForm = new FormData(form);
  const objForm = Object.fromEntries(getForm);
  setForm("http://localhost:5678/api/users/login", objForm);
});

const setForm = async (url, form) => {
  try {
    const requete = await fetch(url, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (requete.ok) {
      error.style.display = "none";
      getToken(requete);
      location.href = "../../../index.html";
    } else {
      error.classList.add("error");
      error.textContent = "Erreur dans l’identifiant ou le mot de passe";
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
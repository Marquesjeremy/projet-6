const filtres = document.querySelector(".filtres");
const gallery = document.querySelector(".gallery");
const allProject = document.querySelector("#all");
const login = document.querySelector("#login");
const edition = document.querySelectorAll(".modeEdition");
const modifProject = document.querySelector("#modifAjout");

// Création des balises figure qui contiennet les images et la légende
const createFigureElement = (project) => {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figCaption = document.createElement("figcaption");
  gallery.append(figure);
  figure.append(img, figCaption);
  img.setAttribute("crossorigin", "anonymous");
  img.src = project.imageUrl;
  figCaption.textContent = project.title;
};
// Récupérer toutes les catégories
const getCategory = async () => {
  try {
    const requete = await fetch("http://localhost:5678/api/categories", {
      method: "GET",
    });

    if (!requete.ok) {
      throw "Un problème est survenu";
    } else {
      return await requete.json();
    }
  } catch (e) {
    console.log(e);
  }
};
// Création des filtres dynamiquement
const createFiltreElement = (arrayProject) => {
  const allCategory = getCategory();
  allCategory.then(async (response) => {
    response.map((category) => {
      let filtre = document.createElement("li");
      filtres.append(filtre);
      filtre.classList.add("filtre");
      filtre.textContent = category.name;

      filtre.addEventListener("click", () => {
        let sort = sortCategory(arrayProject, filtre.textContent);
        gallery.innerHTML = "";
        displayHomeElement(sort);
      });
    });
  });
};
// Trier les catégories selon la valeur de categoryFiltre
const sortCategory = (arrayProject, categoryFiltre) => {
  const sort = arrayProject.filter((category) => {
    return category.category.name === categoryFiltre;
  });
  return sort;
};
// Affiche tous les éléments sur la page principal
const displayHomeElement = (arrayProject) => {
  const element = arrayProject.map((project) => {
    return createFigureElement(project);
  });
  return element;
};
// La requête qui récupère les données depuis le serveur
const getData = async () => {
  try {
    const requete = await fetch("http://localhost:5678/api/works", {
      method: "GET",
    });

    if (!requete.ok) {
      throw console.log("Un problème est survenu");
    } else {
      const data = await requete.json();
      displayHomeElement(data);
      createFiltreElement(data);

      allProject.addEventListener("click", () => {
        gallery.innerHTML = "";
        displayHomeElement(data);
      });
    }
  } catch (e) {
    alert(e);
  }
};
getData();

// Mode connecter
const modeEdition = () => {
  login.textContent = "logout";
  filtres.style.display = "none";
  for (let edit of edition) {
    edit.classList.remove("editionNone");
    edit.classList.add("editionBlock");
  }
  login.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
};
// Mode déconnecter
const modeNotEdition = () => {
  login.textContent = "login";
  filtres.style.display = "flex";
  for (let edit of edition) {
    edit.classList.remove("editionBlock");
    edit.classList.add("editionNone");
  }
};

localStorage.getItem("token") ? modeEdition() : modeNotEdition();

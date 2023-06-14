const body = document.querySelector("body");
const filtres = document.querySelector(".filtres");
const gallery = document.querySelector(".gallery");
const allProject = document.querySelector("#all");
const login = document.querySelector("#login");
const edition = document.querySelectorAll(".modeEdition");
const modifProject = document.querySelector("#modifAjout");
const windowModale = document.querySelector(".modale");
const btnClosemodale = document.querySelector(".close");
const galleryModale = document.querySelector(".galleryModale");
const modaleProject = document.querySelector(".modaleAddProject");
const btnAddProjectModale = document.querySelector(".btnAddProjectModale");
const btnCloseSecondModale = document.querySelector(".btnCloseAddModale");
const backWindow = document.querySelector(".back");
const formAddProject = document.querySelector(".addProject");
const inputFile = document.querySelector("#image");
const getImg = document.querySelector("#newImg");
const inputTitle = document.querySelector("#title");
const selectCategory = document.querySelector("#category");
const btnSecondModale = document.querySelector(".bouton_add_picture");
const getToken = JSON.parse(localStorage.getItem("token"));


const resetProjectId = () => {
  projectId = [];
  localStorage.removeItem("idDelete");
};


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


const getCategory = async () => {
  try {
    const requete = await fetch("http://localhost:5678/api/categories", {
      method: "GET",
    });

    if (!requete.ok) {
      throw "Un problème est survenu";
    } else {
      const data = await requete.json();
      displayCategory(data);
      return data;
    }
  } catch (e) {
    console.log(e);
  }
};


const createFiltreElement = (arrayProject) => {
  const allCategory = getCategory();
  allCategory.then(async (response) => {
    for (let category of response) {
      let filtre = document.createElement("li");
      filtres.append(filtre);
      filtre.classList.add("filtre");
      filtre.textContent = category.name;

      filtre.addEventListener("click", () => {
        let sort = sortCategory(arrayProject, filtre.textContent);
        gallery.innerHTML = "";
        displayElement(sort);
      });
    }
  });
};


const sortCategory = (arrayProject, categoryFiltre) => {
  const sort = arrayProject.filter((category) => {
    return category.category.name === categoryFiltre;
  });
  return sort;
};


const displayElement = (arrayProject) => {
  let index = 0;
  for (let project of arrayProject) {
    createFigureElement(project);
    createFigureModale(project.imageUrl, project, index, arrayProject);
    index++;
  }
};


const getData = async () => {
  try {
    const requete = await fetch("http://localhost:5678/api/works", {
      method: "GET",
    });

    if (!requete.ok) {
      throw console.log("Un problème est survenu");
    } else {
      const data = await requete.json();
      resetProjectId(); // Réinitialise la variable projectId
      galleryModale.innerHTML = "";
      displayElement(data);
      createFiltreElement(data);
      getId(data);
      allProject.addEventListener("click", () => {
        gallery.innerHTML = "";
        displayElement(data);
      });
    }
  } catch (e) {
    alert(e);
  }
};


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

  modifProject.addEventListener("click", () => {
    modale();
  });
  btnClosemodale.addEventListener("click", () => {
    closeModale();
  });
};


const modeNotEdition = () => {
  login.textContent = "login";
  filtres.style.display = "flex";
  for (let edit of edition) {
    edit.classList.remove("editionBlock");
    edit.classList.add("editionNone");
  }
};


localStorage.getItem("token") ? modeEdition() : modeNotEdition();
const modale = () => {
  body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  windowModale.style.display = "block";
};


const closeModale = () => {
  modaleProject.style.display = "none";
  windowModale.style.display = "none";
  body.style.backgroundColor = "#fffff9";
  document.documentElement.style.overflow = "visible";
};


const deleteProject = async (id) => {
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken.token}`,
    },
  });

  const index = projectId.indexOf(id);
  if (index !== -1) {
    projectId.splice(index, 1);
    localStorage.setItem("idDelete", JSON.stringify(projectId));
  }
};


const createFigureModale = (srcImg, project, index, arrayProject) => {
  let figure = document.createElement("figure");
  let span = document.createElement("span");
  let img = document.createElement("img");
  let figCaption = document.createElement("figcaption");
  galleryModale.append(figure);
  figure.append(span, img, figCaption);
  span.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  figCaption.textContent = "éditer";
  img.src = srcImg;
  img.classList.add("imgModale");
  span.classList.add("deleteProject");
  img.setAttribute("crossorigin", "anonymous");
  let zoom = document.createElement('span');
  figure.append(zoom);
  zoom.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right"></i>'
  zoom.classList.add('figureZoom')

  if(index > 0) {
    zoom.style.display = "none"
  }

  span.addEventListener("click", () => {
    deleteProject(project.id);
    arrayProject.splice(index, 1);
    galleryModale.innerHTML = "";
    gallery.innerHTML = "";
    displayElement(arrayProject);
  });  
};


const setNewProject = async (data) => {
  try {
    const requete = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken.token}`,
        accept: "application/json",
      },
      body: data,
    });
    if (requete.status === 201) {
      gallery.innerHTML = "";
      getData();
    } else {
      throw "Un problème est survenu";
    }
  } catch (e) {
    console.log(e);
  }
};


const displayCategory = (category) => {
  for (let catego of category) {
    createElemCategory(catego);
  }
};


const displayGetImg = () => {
  const divIcon = document.querySelector(".icone-picture");
  const inputFile = document.querySelector("#image").files[0];
  const spanExtension = document.querySelector(".extension");
  const btnAddFile = document.querySelector(".btnAddFile");
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      newImg.src = reader.result;
    },
    false
  );

  if (inputFile) {
    reader.readAsDataURL(inputFile);
  }

  divIcon.style.display = "none";
  newImg.style.display = "block";
  spanExtension.style.display = "none";
  btnAddFile.style.display = "none";
};


const createElemCategory = (text) => {
  if(selectCategory.childElementCount < 3) {
    let option = document.createElement("option");
    selectCategory.append(option);
    option.value = text.id;
    option.textContent = text.name;
  }
};


const getId = (data) => {
  let id = 0;
  for (let maxId of data) {
    if (maxId.id > id) {
      id = maxId.id;
    }
  }
  localStorage.setItem("id", id);
};


formAddProject.addEventListener("input", (e) => {
  e.preventDefault();
  if (inputFile.value !== "" && getImg.src !== "") {
    btnSecondModale.disabled = false;
    btnSecondModale.classList.remove("btnDisabled");
    displayGetImg();
  }
  if (inputTitle.value === "" && getImg.src !== "") {
    btnSecondModale.disabled = true;
    btnSecondModale.classList.add("btnDisabled");
  }
});


formAddProject.addEventListener("submit", (e) => {
  e.preventDefault();
  const titre = document.querySelector("#title").value;
  const image = document.querySelector("#image").files[0];
  const categoryId = selectCategory.selectedIndex + 1;

  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", titre);
  formData.append("category", categoryId);
  if (image.size <= 4000000) {
    setNewProject(formData);
  } else {
    const p = document.querySelector(".imgError");
    const divIcon = document.querySelector(".icone-picture");
    const spanExtension = document.querySelector(".extension");
    const btnAddFile = document.querySelector(".btnAddFile");
    p.style.display = "block";
    divIcon.style.display = "block";
    newImg.style.display = "none";
    spanExtension.style.display = "block";
    btnAddFile.style.display = "block";
  }
  modaleProject.style.display = "none";
  body.style.backgroundColor = "";
});


btnCloseSecondModale.addEventListener("click", () => {
  resetForm();
  closeModale();
});


backWindow.addEventListener("click", () => {
  resetForm();
  modaleProject.style.display = "none";
  windowModale.style.display = "block";
});

const resetForm = () => {
  formAddProject.reset(); // Réinitialise les valeurs du formulaire
  inputFile.value = ""; // Réinitialise la valeur de l'input de fichier
  getImg.src = ""; // Réinitialise l'aperçu de l'image
  newImg.style.display = "none"; // Masque l'aperçu de l'image
  const divIcon = document.querySelector(".icone-picture");
  const spanExtension = document.querySelector(".extension");
  const btnAddFile = document.querySelector(".btnAddFile");
  divIcon.style.display = "block"; // Affiche l'icône de l'image par défaut
  spanExtension.style.display = "block"; // Affiche le message d'extension de fichier
  btnAddFile.style.display = "block"; // Affiche le bouton pour ajouter un fichier
};

btnAddProjectModale.addEventListener("click", () => {
  windowModale.style.display = "none";
  modaleProject.style.display = "block";
  resetProjectId();
});


if (localStorage.getItem("idDelete")) {
  let arrayDelete = JSON.parse(localStorage.getItem("idDelete"));
  for (let id of arrayDelete) {
    deleteProject(id);
  }
  localStorage.removeItem("idDelete");
}

getData();

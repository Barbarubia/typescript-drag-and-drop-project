"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Project Type
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFunction) {
        this.listeners.push(listenerFunction);
    }
    addProject(title, description, numOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength != null &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}
// autobind decorator
function autobind(_target, _methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return adjustedDescriptor;
}
// Step 1: voglio rendere il form visibile spostando il form incluso nel tag template con id "project-input" all'interno del tag div con id "app"
class ProjectForm {
    constructor() {
        this.templateElement = document.getElementById("project-input"); // seleziono l'elemento template con tag "project-input"
        this.hostElement = document.getElementById("app"); // seleziono l'elemento div con tag "app"
        // uso il metodo importNode per importare il contenuto (.content) dell'elemento template selezionato. Il secondo argomento "true" dichiara che voglio importare tutti gli elementi discendenti.
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input"; // assegno l'id "user-input" all'elemento contenente il form per definire lo stile
        // seleziono tutti i campi del form
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    // funzione che, se i dati immessi sono corretti, ritorna un elemento di tipo tuple: un array di X elementi in cui ogni elemento è di un tipo definito
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        // validazione degli input usando l'interface Validatable
        const titleValidatable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        const peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 9,
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert("Dati non validi, prova di nuovo");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    // funzione che ripulisce il form
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    // al submit del form (vedi funzione configure) eseguo la funzione gatherUserInput. Uso il decorator autobind
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
    // funzione che esegue la funzione submitHandler al submit del form
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    // funzione che "attacca" il form (this.element) dopo l'inizio (afterbegin) del tag div con id "app" (this.hostElement)
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
__decorate([
    autobind
], ProjectForm.prototype, "submitHandler", null);
const showProjectForm = new ProjectForm();
// Step 2: Visualizzare liste dei progetti in corso e dei progetti terminati
class ProjectsList {
    // Definisco il costruttore tenendo conto che avrò 2 tipo di liste: una per i progetti in corso (active-projects) e una per i progetti terminati (finished-projects)
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById("projects-list");
        this.hostElement = document.getElementById("app");
        this.assignedProjects = [];
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectState.addListener((projects) => {
            // filtro i progetti in base al loro status active o finished
            const relevantProjects = projects.filter((project) => {
                if (this.type === "active") {
                    return project.status === ProjectStatus.Active;
                }
                return project.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = "";
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            listEl.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
        this.element.querySelector("ul").id = listId;
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}
const activeProjectsList = new ProjectsList("active");
const finishedProjectsList = new ProjectsList("finished");

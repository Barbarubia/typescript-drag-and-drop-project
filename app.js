"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// autobind decorator
function autobind(_target, _methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        }
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
    // al submit del form (vedi funzione configure) stampo in console i dati immessi dall'utente. Uso il decorator autobind
    submitHandler(event) {
        event.preventDefault();
        console.log("Titolo: " + this.titleInputElement.value);
        console.log("Descrizione: " + this.descriptionInputElement.value);
        console.log("Persone: " + this.peopleInputElement.value);
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

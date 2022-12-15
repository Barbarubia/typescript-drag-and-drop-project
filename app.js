"use strict";
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
    // al submit del form (vedi funzione configure) stampo in console i dati immessi dall'utente
    submitHandler(event) {
        event.preventDefault();
        console.log("Titolo: " + this.titleInputElement.value);
        console.log("Descrizione: " + this.descriptionInputElement.value);
        console.log("Persone: " + this.peopleInputElement.value);
    }
    // funzione che esegue la funzione submitHandler al submit del form. Uso il metodo bind per poter creare una catena di funzioni preimpostando l'oggetto this.
    configure() {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    }
    // funzione che "attacca" il form (this.element) dopo l'inizio (afterbegin) del tag div con id "app" (this.hostElement)
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
const showProjectForm = new ProjectForm();

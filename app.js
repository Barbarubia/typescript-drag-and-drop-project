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
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
const showProjectForm = new ProjectForm();

// Step 1: voglio rendere il form visibile spostando il form incluso nel tag template con id "project-input" all'interno del tag div con id "app"

class ProjectForm {
  templateElement: HTMLTemplateElement; // L'elemento DOM che contiene il form non visibile è un elemento di tipo HTML con tag template
  hostElement: HTMLDivElement; // L'elemento DOM dove voglio mostrare il form è un elemento di tipo HTML con tag div
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement; // seleziono l'elemento template con tag "project-input"
    this.hostElement = document.getElementById("app")! as HTMLDivElement; // seleziono l'elemento div con tag "app"

    // uso il metodo importNode per importare il contenuto (.content) dell'elemento template selezionato. Il secondo argomento "true" dichiara che voglio importare tutti gli elementi discendenti.
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input"; // assegno l'id "user-input" all'elemento contenente il form per definire lo stile

    // seleziono tutti i campi del form
    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();

    this.attach();
  }

  // al submit del form (vedi funzione configure) stampo in console i dati immessi dall'utente
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log("Titolo: " + this.titleInputElement.value);
    console.log("Descrizione: " + this.descriptionInputElement.value);
    console.log("Persone: " + this.peopleInputElement.value);
  }

  // funzione che esegue la funzione submitHandler al submit del form. Uso il metodo bind per poter creare una catena di funzioni preimpostando l'oggetto this.
  private configure() {
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }

  // funzione che "attacca" il form (this.element) dopo l'inizio (afterbegin) del tag div con id "app" (this.hostElement)
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const showProjectForm = new ProjectForm();

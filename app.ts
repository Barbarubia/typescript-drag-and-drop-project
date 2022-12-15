// Step 1: voglio rendere il form visibile spostando il form incluso nel tag template con id "project-input" all'interno del tag div con id "app"

class ProjectForm {
  templateElement: HTMLTemplateElement; // L'elemento DOM che contiene il form non visibile è un elemento di tipo HTML con tag template
  hostElement: HTMLDivElement; // L'elemento DOM dove voglio mostrare il form è un elemento di tipo HTML con tag div
  element: HTMLFormElement;

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
    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const showProjectForm = new ProjectForm();

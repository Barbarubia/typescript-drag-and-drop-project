// autobind decorator
function autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
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
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();

    this.attach();
  }

  // funzione che, se i dati immessi sono corretti, ritorna un elemento di tipo tuple: un array di X elementi in cui ogni elemento è di un tipo definito
  private gatherUserInput(): [string, string, number] | undefined {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // validazione degli input
    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert("Dati non validi, prova di nuovo");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  // funzione che ripulisce il form
  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  // al submit del form (vedi funzione configure) eseguo la funzione gatherUserInput. Uso il decorator autobind
  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  // funzione che esegue la funzione submitHandler al submit del form
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  // funzione che "attacca" il form (this.element) dopo l'inizio (afterbegin) del tag div con id "app" (this.hostElement)
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const showProjectForm = new ProjectForm();

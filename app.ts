// Gestione stato dei progetti
class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFunction: Function) {
    this.listeners.push(listenerFunction);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople,
    };
    this.projects.push(newProject);
    for (const listenerFunction of this.listeners) {
      listenerFunction(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Validatore dati
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

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

    // validazione degli input usando l'interface Validatable
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 9,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
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
      projectState.addProject(title, desc, people);
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

// Step 2: Visualizzare liste dei progetti in corso e dei progetti terminati
class ProjectsList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  // Definisco il costruttore tenendo conto che avrò 2 tipo di liste: una per i progetti in corso (active-projects) e una per i progetti terminati (finished-projects)
  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "projects-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.title;
      listEl.appendChild(listItem)
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
    this.element.querySelector("ul")!.id = listId;
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

const activeProjectsList = new ProjectsList("active");
const finishedProjectsList = new ProjectsList("finished");

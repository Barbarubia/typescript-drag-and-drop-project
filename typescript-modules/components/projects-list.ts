import { BaseComponent } from "./base-component.js";
import { DragTarget } from "../models/drag-drop.js";
import { autobind } from "../decorators/autobind.js";
import { Project, ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";

export class ProjectsList
  extends BaseComponent<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  get projectStatus() {
    if (this.type === "active") {
      return "IN CORSO";
    } else {
      return "TERMINATI";
    }
  }

  // Definisco il costruttore tenendo conto che avrò 2 tipo di liste: una per i progetti in corso (active-projects) e una per i progetti terminati (finished-projects)
  constructor(private type: "active" | "finished") {
    super("projects-list", "app", false, `${type}-projects`); // si usa per richiamare il constructor della classe ereditata
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      // modifico l'aspetto dell'area dove posso spostare gli elementi "draggati"
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const projectId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      projectId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
    // ripristino l'aspetto dell'area dove posso spostare gli elementi "draggati"
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  @autobind
  dragLeaveHandler(_event: DragEvent) {
    // ripristino l'aspetto dell'area dove posso spostare gli elementi "draggati"
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
    projectState.addListener((projects: Project[]) => {
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
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("h2")!.textContent =
      "PROGETTI " + this.projectStatus;
    this.element.querySelector("ul")!.id = listId;
  }
}
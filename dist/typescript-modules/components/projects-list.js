var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseComponent } from "./base-component.js";
import { autobind } from "../decorators/autobind.js";
import { ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";
export class ProjectsList extends BaseComponent {
    get projectStatus() {
        if (this.type === "active") {
            return "IN CORSO";
        }
        else {
            return "TERMINATI";
        }
    }
    // Definisco il costruttore tenendo conto che avrò 2 tipo di liste: una per i progetti in corso (active-projects) e una per i progetti terminati (finished-projects)
    constructor(type) {
        super("projects-list", "app", false, `${type}-projects`); // si usa per richiamare il constructor della classe ereditata
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            // modifico l'aspetto dell'area dove posso spostare gli elementi "draggati"
            const listEl = this.element.querySelector("ul");
            listEl.classList.add("droppable");
        }
    }
    dropHandler(event) {
        const projectId = event.dataTransfer.getData("text/plain");
        projectState.moveProject(projectId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
        // ripristino l'aspetto dell'area dove posso spostare gli elementi "draggati"
        const listEl = this.element.querySelector("ul");
        listEl.classList.remove("droppable");
    }
    dragLeaveHandler(_event) {
        // ripristino l'aspetto dell'area dove posso spostare gli elementi "draggati"
        const listEl = this.element.querySelector("ul");
        listEl.classList.remove("droppable");
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = "";
        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul").id, projectItem);
        }
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
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
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("h2").textContent =
            "PROGETTI " + this.projectStatus;
        this.element.querySelector("ul").id = listId;
    }
}
__decorate([
    autobind
], ProjectsList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], ProjectsList.prototype, "dropHandler", null);
__decorate([
    autobind
], ProjectsList.prototype, "dragLeaveHandler", null);
//# sourceMappingURL=projects-list.js.map
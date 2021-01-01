class ProjectInput {
  templateEl: HTMLTemplateElement;
  renderEl: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.templateEl = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.renderEl = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild! as HTMLFormElement;
    console.log(this.element);
    this.append();
  }

  private append() {
    this.renderEl.insertAdjacentElement('afterbegin', this.element);
  }
}

const projectInput = new ProjectInput();

class ProjectInput {
  templateEl: HTMLTemplateElement;
  renderEl: HTMLDivElement;
  element: HTMLFormElement;
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      'project-input'
    ) as HTMLTemplateElement;
    this.renderEl = document.getElementById('app') as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputEl = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;

    this.descriptionInputEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;

    this.peopleInputEl = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
    this.append();
  }

  private append() {
    this.renderEl.insertAdjacentElement('afterbegin', this.element);
  }

  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputEl.value);
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler.bind(this));
  }
}

const projectInput = new ProjectInput();

// Autobind decorator
const Autobind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
  const initialMethod = descriptor.value;
  const updatedMethod: PropertyDescriptor = {
    configurable: true,
    get() {
      return initialMethod.bind(this);
    },
  };
  return updatedMethod;
};

// ProjectInput class
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

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      console.log(title, description, people);
      this.clearForm();
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private getUserInput(): [string, string, number] | void {
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const people = this.peopleInputEl.value;

    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      people.trim().length === 0
    ) {
      alert('Invalid input');
      return;
    } else {
      return [title, description, +people];
    }
  }

  private clearForm() {
    this.titleInputEl.value = '';
    this.descriptionInputEl.value = '';
    this.peopleInputEl.value = '';
  }
}

const projectInput = new ProjectInput();

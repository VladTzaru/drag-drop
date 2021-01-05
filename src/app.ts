enum DOMPointers {
  TEMPLATE_EL_ID = '#project-input',
  RENDER_EL_ID = '#app',
  ELEMENT_ID = 'user-input',
  TITLE_ID = '#title',
  DESCRIPTION_ID = '#description',
  PEOPLE_ID = '#people',
  PROJECT_LIST_ID = '#project-list',
}

// Validation
interface Validate<T> {
  value: T;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// Project type

enum ProjectStatus {
  ACTIVE,
  FINISHED,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project state management (Singleton object)

type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.ACTIVE
    );

    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

const validate = (input: Validate<string | number>) => {
  let isValid = true;
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  // != covers both undefined & null
  if (input.minLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length >= input.minLength;
  }

  if (input.maxLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length <= input.maxLength;
  }

  if (input.min != null && typeof input.value === 'number') {
    isValid = isValid && input.value >= input.min;
  }

  if (input.max != null && typeof input.value === 'number') {
    isValid = isValid && input.value <= input.max;
  }

  return isValid;
};

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
    this.templateEl = document.querySelector(
      DOMPointers.TEMPLATE_EL_ID
    ) as HTMLTemplateElement;
    this.renderEl = document.querySelector(
      DOMPointers.RENDER_EL_ID
    ) as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = DOMPointers.ELEMENT_ID;

    this.titleInputEl = this.element.querySelector(
      DOMPointers.TITLE_ID
    ) as HTMLInputElement;

    this.descriptionInputEl = this.element.querySelector(
      DOMPointers.DESCRIPTION_ID
    ) as HTMLInputElement;

    this.peopleInputEl = this.element.querySelector(
      DOMPointers.PEOPLE_ID
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
      projectState.addProject(title, description, people);
      this.clearForm();
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private getUserInput(): [string, string, number] | void {
    const title = this.titleInputEl.value;
    const description = this.descriptionInputEl.value;
    const people = +this.peopleInputEl.value;

    const titleValidation: Validate<string> = {
      value: title,
      required: true,
      minLength: 3,
    };

    const descriptionValidation: Validate<string> = {
      value: description,
      required: true,
      minLength: 5,
    };

    const peopleValidation: Validate<number> = {
      value: people,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidation) ||
      !validate(descriptionValidation) ||
      !validate(peopleValidation)
    ) {
      alert('Invalid input');
      return;
    } else {
      return [title, description, people];
    }
  }

  private clearForm() {
    this.titleInputEl.value = '';
    this.descriptionInputEl.value = '';
    this.peopleInputEl.value = '';
  }
}

// Component base class (Abstract class cannot be instantiated)
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  renderEl: T;
  element: U;

  constructor(
    templateID: string,
    renderElemID: string,
    insertAtStart: boolean,
    newElemID?: string
  ) {
    this.templateEl = document.querySelector(templateID) as HTMLTemplateElement;
    this.renderEl = document.querySelector(renderElemID) as T;
    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as U;

    if (newElemID) this.element.id = newElemID;

    this.append(insertAtStart);
  }

  private append(insertAtStart: boolean) {
    this.renderEl.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void; // Abstract methods require all classes that inherit to have these methods
  abstract renderContent(): void;
}

// ProjectList class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private projectStatus: 'active' | 'finished') {
    super(
      DOMPointers.PROJECT_LIST_ID,
      DOMPointers.RENDER_EL_ID,
      false,
      `${projectStatus}-projects`
    );

    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.projectStatus}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const project of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = project.title;
      listEl.appendChild(listItem);
    }
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const filteredProjects = projects.filter((project) => {
        if (this.projectStatus === 'active') {
          return project.status === ProjectStatus.ACTIVE;
        } else {
          return project.status === ProjectStatus.FINISHED;
        }
      });
      this.assignedProjects = filteredProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.projectStatus}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector(
      'h2'
    )!.textContent = `${this.projectStatus.toUpperCase()} PROJECTS`;
  }
}

// Calls
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');

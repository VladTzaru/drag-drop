enum DOMPointers {
  TEMPLATE_EL_ID = '#project-input',
  RENDER_EL_ID = '#app',
  ELEMENT_ID = 'user-input',
  TITLE_ID = '#title',
  DESCRIPTION_ID = '#description',
  PEOPLE_ID = '#people',
}

// Validation
interface Validate {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

const validate = (input: Validate) => {
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

    const titleValidation: Validate = {
      value: title,
      required: true,
    };

    const descriptionValidation: Validate = {
      value: description,
      required: true,
      minLength: 5,
    };

    const peopleValidation: Validate = {
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

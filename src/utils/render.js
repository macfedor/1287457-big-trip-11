export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderPosition = {
  AFTERBEGIN: `afterBegin`,
  BEFOREEND: `beforeEnd`,
  AFTEREND: `afterEnd`
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const renderComponent = (container, component, place) => {
  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case renderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case renderPosition.AFTEREND:
      if (container.nextSibling) {
        container.parentNode.insertBefore(component.getElement(), container.nextSibling);
      } else {
        container.parentNode.append(component.getElement());
      }
      break;
  }
};

export const renderElement = (container, elem, place) => {
  container.insertAdjacentHTML(place, elem);
};

export const removeElement = (elem) => {
  elem.remove();
};

export const replace = (newComponent, oldComponent) => {
  const oldElement = oldComponent.getElement();
  const newElement = newComponent.getElement();
  const container = oldElement.parentElement;

  const isExistsElements = !!(oldElement && newElement && container);
  if (isExistsElements && container.contains(oldElement)) {
    container.replaceChild(newElement, oldElement);
  }
};

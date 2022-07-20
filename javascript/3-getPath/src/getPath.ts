function getClasses(element: HTMLElement) {
  const classes = [];
  element.classList.forEach((cls) => {
    if (checkSelectorString(cls)) {
      classes.push(cls);
    }
  });
  return classes.length > 0 ? `.${classes.join(".")}` : "";
}

function checkSelectorString(str: string) {
  return str.search(/[~!@$%^&*()+=,.\/';:"?><\[\]\\{}|`#]/) === -1;
}

function findSameNestedNode(element: HTMLElement, selector: string) {
  return Array.from(element.children).filter((e) => e.matches(selector));
}

export function getPath(element: HTMLElement, document?: Document) {
  document = document || window.document; // akondakov - for browser;

  let path = "";
  let currentElement = element;

  do {
    const parent = currentElement.parentElement;
    const id = currentElement.getAttribute("id");
    let itemPath;
    if (id) {
      // try to use the id
      itemPath =
        checkSelectorString(id) &&
        findSameNestedNode(parent, `#${id}`).length === 1
          ? `#${id}`
          : undefined;
    }
    if (!itemPath && currentElement.classList.length > 0) {
      // try to use the css classes
      const classes = getClasses(currentElement);
      const sameChilds = findSameNestedNode(
        parent,
        `${currentElement.tagName}${classes}`
      );
      itemPath =
        sameChilds.length === 1 ? currentElement.tagName + classes : undefined;
    }
    if (!itemPath) {
      // use the tag and nth-child
      const index =
        parent &&
        findSameNestedNode(parent, `${currentElement.tagName}`).length > 1
          ? Array.from(parent.children).indexOf(currentElement) + 1
          : undefined;
      itemPath = `${currentElement.tagName}${
        index ? `:nth-child(${index})` : ""
      }`;
    }

    path = itemPath + (path === "" ? "" : ">" + path);
    currentElement = currentElement.parentElement;
  } while (currentElement && document.querySelectorAll(path).length > 1);
  return path;
}

/*

Mhai Markup Language Framework -(MMLF)-

*/

/*

--!!!REMINDER!!!--

This file contains critical content that must not be altered under any circumstances.
The developers strictly prohibit any modification to the code within this file.
Changes to the content may result in system instability, data corruption, or loss of functionality.

*/

let isRendererProcessed = false;
let glblNotification = undefined;

class Renderer extends HTMLElement {
    constructor() {
        super();
        if (!isRendererProcessed) {
            const notification = this.getAttribute('notif') || 'true';
            if(notification == 'true'){
                glblNotification = notification
                alert('Welcome To MMLF')
            }
            try {
                switch (this.checkType(this.getAttribute('type'))) {
                    case 'manual':
                        this.manual();
                        break;
                    case 'markup':
                        this.markup();
                        break;
                    case 'info':
                        this.info();
                        break;
                    default:
                        this.info();
                        break;
                }
                isRendererProcessed = true;
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    checkType(typ) {
        const validTypes = ['manual', 'markup', 'info'];
      
        if (!validTypes.includes(typ)) {
            throw new SyntaxError(`Syntax Error:The type "${typ}",Are not valid make sure that the type is spelled correctly.`);
        }
        return typ;
    }

    info() {
        console.log('information');
    }

    markup() {
      if (glblNotification == 'true') {
          alert('The Renderer is Set to Auto');
      }
  
      // Fetch component.html asynchronously
      const fetchData = async () => {
          await fetchComponentHTML();
      };
  
      // Define <obj-A> tag only after onDataLoadedCallback is initialized
      customElements.define('obj-a', class extends HTMLElement {
          connectedCallback() {
              const componentName = this.getAttribute('component');
  
              if (!componentName) {
                  console.error('Error: <obj-a tag must have a "component" attribute.');
                  return;
              }
  
              fetchData().then(() => {
  
                  const components = interpreter(componentHTML);
  
                  if (components[componentName]) {
                      this.innerHTML = components[componentName];
                  } else {
                      console.error(`Error: Component "${componentName}" not found.`);
                  }
              });
          }
      });
    }
  
    manual() {
        console.log('it set to manual');
    }
}

customElements.define('mmlf-render', Renderer);

// Component Area

let componentHTML; // Variable to store the fetched HTML content
let onDataLoadedCallback; // Callback to notify when data is loaded

async function fetchComponentHTML() {
  try {
    // Fetch component.html asynchronously
    const response = await fetch(`./MMLF/components/mmlf.component.xht`);

    if (!response.ok) {
      throw new Error(`Failed to fetch component.html (HTTP status ${response.status})`);
    }

    componentHTML = await response.text();

    // Notify the callback that data is loaded
    if (typeof onDataLoadedCallback === 'function') {
      onDataLoadedCallback();
    }
  } catch (error) {
    console.error('Error fetching component.html:', error);
    // Handle error if needed
    throw error;
  }
}

// ... (Asyncronous RunTime)

export function render() {
    try {
      // Reset componentHTML and onDataLoadedCallback
      componentHTML = undefined;
      onDataLoadedCallback = undefined;
  
      // Check if the element is set to manual
      if (!isRendererProcessed || (isRendererProcessed && document.querySelector('mmlf-render').getAttribute('type') !== 'manual')) {
        throw new Error('Type Error: The element must be set to manual for rendering. Check the "type" attribute.');
      }
  
      // Fetch component.html asynchronously
      fetchComponentHTML();
  
      // Return an object with a synchronous method to get the data
      return {
        getComponents() {
          if (!componentHTML) {
            throw new Error('Component HTML is not yet loaded. Call loadDataAndRedirect and wait for onDataLoadedCallback.');
          }
          return interpreter(componentHTML);
        },
        start(callback) {
          onDataLoadedCallback = callback;
        },
      };
    } catch (error) {
      console.error(error.message);
    }
}
  

//Iterpreter Area -Prohibited Not Used-

function interpreters(inputString) {
    const regex = /<component name="([^"]+)">([\s\S]*?)<\/component>/g;
    const matches = inputString.matchAll(regex);
    const result = {};

    for (const match of matches) {
        const componentName = match[1];
        const componentContent = match[2].trim();
        result[componentName] = componentContent;
    }

    return result;
}

// iterpreterV2

function interpreter(inputString) {
  const regex = /<component name="([^"]+)">([\s\S]*?)<\/component>/g;
  const matches = inputString.matchAll(regex);
  const result = {};

  function isValidComponentName(name) {
    return /^[a-zA-Z0-9]+$/.test(name);
  }

  for (const match of matches) {
      const componentName = match[1];
      const componentContent = match[2].trim();

      // Check if the component name is valid (contains only letters or numbers)
      if (!isValidComponentName(componentName)) {
          console.error(`Error: Invalid component name "${componentName}". Only letters and numbers are allowed.`);
          continue;
      }

      result[componentName] = componentContent;
  }

  return result;
}

export function getState(data, template) {
  // Replace placeholders in the template with values from the data object
  const replacedString = template.replace(/\${(.*?)}/g, (match, p1) => {
    const key = p1.trim(); // Trim any extra whitespace
    return data[key] !== undefined ? data[key] : match;
  });
return replacedString;
}
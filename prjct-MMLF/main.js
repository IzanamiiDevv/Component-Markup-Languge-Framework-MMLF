// main.js

import { render } from './MMLF/build/1.0/index.js';


let state = true

const Render = render();

Render.start(() => {
    const { demo, myComponent } = Render.getComponents();

    console.log(demo);
    document.getElementById('display').innerHTML = myComponent;
});
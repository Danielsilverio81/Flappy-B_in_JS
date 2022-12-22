function newElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier');
    const border = newElement('div', 'borde');
    const body = newElement('div', 'body');

    this.element.appendChild(reverse ? 'body' : 'borde');
    this.element.appendChild(reverse ? 'borde' : 'body');
    setHeight = heigh => body.style.height = `${heigh}px`;
}

function PairOfBarriers(height, opening, x ) {
    this.element = newElement('div', 'pair-of-barriers');
    this.higher = new Barrier(true);
    this.lower = new Barrier(false);

    this.element.appendChild(this.higher.element);
    this.element.appendChild(this.lower.element);

    this.drawOpening = () => {
        const heightHigher = Math.random() * (height - opening);
        const heightLower = height - opening - heightHigher;

        this.higher.setHeight(heightHigher);
        this.lower.setHeight(heightLower);
    }
    this.getX = () => parseInt(this.element.style.left.split('px')[0]);
    this.setX = x => this.element.style.left = `${x}px`;
    this.getWidth = () => this.element.clientWidth;
    this.drawOpening();
    this.setX(x);
}
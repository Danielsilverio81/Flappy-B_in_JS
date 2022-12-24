function newElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier');
    const border = newElement('div', 'borde');
    const body = newElement('div', 'body');

    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);
    this.setHeight = heigh => body.style.height = `${heigh}px`;
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

function Barriers(height, width, opening, espace, valueChange, setPont) {
    this.pairs = [
        new PairOfBarriers(height, opening, width),
        new PairOfBarriers(height, opening, width + espace),
        new PairOfBarriers(height, opening, width + espace * 2),
        new PairOfBarriers(height, opening, width + espace * 3),
    ]

    let changeBarrier = valueChange;
    this.animation = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - changeBarrier)

            if(pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + espace * this.pairs.length)
                pair.drawOpening()
            }

            const middle = width / 2;
            const crossed = pair.getX() + changeBarrier >= middle &&
            pair.getX() < middle
            if(crossed) setPont()
        })
    }
}

function Bird(heighGame) {
    let fly = false;

    this.element = newElement('img', 'bird');
    this.element.src = '../assets/img/passaro.png'

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0]);
    this.setY = y => this.element.style.bottom = `${y}px`;

    window.onkeydown = e => fly = true;
    window.onkeyup = e => fly = false;

    this.animation = () => {
        const newY = this.getY() + (fly ? 8 : -6);
        const heighMax = heighGame - this.element.clientHeight;

        if(newY <= 0) {
            this.setY(0)
        } else if(newY >= heighMax) {
            this.setY(heighMax)
        } else {
            this.setY(newY)
        }
    }
    this.setY(heighGame / 2)
}

function Progress() {
    this.element = newElement('span', 'progress');
    this.newPoints = point => {
        this.element.innerHTML = point;
    }
    this.newPoints(0);
}

function areOverlapping(elementA, elementB) {
    const a = elementA.getBoundingClientRect();
    const b = elementB.getBoundingClientRect();
    const horizontal = a.left + a.width >= b.left
    && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
    && b.top + b.height >= a.top
    return horizontal && vertical;
}

function collided(bird, barriers) {
    let collided = false;
    barriers.pairs.forEach(pairOfBarriers => {
        if(!collided) {
            const higher = pairOfBarriers.higher.element;
            const lower = pairOfBarriers.lower.element;
            collided = areOverlapping(bird.element, higher)
            || areOverlapping(bird.element, lower)
        }
    })
    return collided;
}

function FlappyBird(valueChange) {
    let points = 0;
    const gameArea = document.querySelector('[flappy]');
    const height = gameArea.clientHeight;
    const width = gameArea.clientWidth;

    const progress = new Progress;
    const barriers = new Barriers(height, width, 245, 340, valueChange, () => progress.newPoints(++points));
    const bird = new Bird(height);

    gameArea.appendChild(progress.element);
    gameArea.appendChild(bird.element);

    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element));

    this.start = () => {
        const timer =setInterval(() => {
            barriers.animation()
            bird.animation()

            if(collided(bird, barriers)) {
                clearInterval(timer);
            }
        }, 20)
    }
}

function initialDisplay() {
    
}


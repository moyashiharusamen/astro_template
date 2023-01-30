export default class BaseLayout {
    constructor() {
        const header: HTMLBodyElement = <HTMLBodyElement>document.querySelector('body');
        header.classList.add('BaseLayout');
    }
}

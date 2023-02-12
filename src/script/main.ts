import Toggle from './Toggle';
import Modal from './Modal';

document.querySelectorAll('.toggle').forEach((element: Object) => {
    new Toggle(element);
});
document.querySelectorAll('.modal').forEach((element: Object) => {
    new Modal(element);
});

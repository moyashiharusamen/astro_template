import Toggle from './Toggle';
import Modal from './Modal';

document.querySelectorAll('.toggle').forEach(element => {
    new Toggle(element);
});
document.querySelectorAll('.modal').forEach(element => {
    new Modal(element);
});

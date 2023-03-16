import Toggle from "./Toggle";
import Modal from "./Modal";
import Accordion from "./Accordion";
import Tab from "./Tab";

document.querySelectorAll(".toggle").forEach((element: Object) => {
  new Toggle(element);
});
document.querySelectorAll(".modal").forEach((element: Object) => {
  new Modal(element);
});
document.querySelectorAll(".accordion").forEach((element: Object) => {
  new Accordion(element);
});
document.querySelectorAll(".tab").forEach((element: Object) => {
  new Tab(element);
});

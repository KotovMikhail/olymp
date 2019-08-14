export default class Accordion {
  constructor(props) {
    this.el = props.el;
    this.collapsible = props.collapsible;
    this.active = props.active;
    this.heightStyle = props.heightStyle;
    this.animate = props.animate;
    this.headers = document.querySelectorAll(props.headers);
  
    if (document.querySelector(this.el)) {
      $(this.el).accordion({
        collapsible: this.collapsible,
        active: this.active,
        heightStyle: this.heightStyle,
        animate: this.animate
      });
      
      Array.from(this.headers).forEach((it) => {
        it.addEventListener(`click`, (e) => e.currentTarget.blur());
      });
    }
  }
}

export class AddOn {
  constructor(options) {
    this._handleClick = this._handleClick.bind(this);

    this.init(options);
  }

  _handleClick() {
    alert('Button clicked!');
  }

  init(options) {
    document.getElementById(options.id).addEventListener('click', this._handleClick, false);
  }
}
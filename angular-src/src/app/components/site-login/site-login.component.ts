import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-login',
  templateUrl: './site-login.component.html',
  styleUrls: ['./site-login.component.scss']
})
export class SiteLoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.generateInputStyles() // generate styles for both inputs and buttonss to give random color effect
    this.generateButtonStyles()
  }

  // colours array to use for random hover effects
  colours: Array<string> = ["#00be9c", "#20ce6d", "#2c97df", "#9c56b8", "#ecf0f1", "#f3c500", "#e87e04", "#ea4b36"]
  buttonStyles: Array<object> = []
  inputStyles: Array<object> = []

  // set styling start

  generateButtonStyles() {
    let buttonCount = document.getElementsByClassName("form-button") // get total number of form inputs
    for(let i = 0; i < buttonCount.length; i++) {
      let max = Math.floor(this.colours.length);
      let randomStyle = Math.floor(Math.random() * max)
      this.buttonStyles.push({"color": this.colours[randomStyle], "border": "4px solid" + this.colours[randomStyle]})
    }
  }

  generateInputStyles() {
    let inputCount = document.getElementsByClassName("form-input") // get total number of form inputs
    for(let i = 0; i < inputCount.length; i++) {
      let max = Math.floor(this.colours.length);
      let randomStyle = Math.floor(Math.random() * max)
      this.inputStyles.push({"color": this.colours[randomStyle]})
    }
  }

  applyInputStyle(index) {
    return this.inputStyles[index]
  }

  applyButtonStyle(index) {
    return this.buttonStyles[index]
  }

}

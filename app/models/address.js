app.models.address = Backbone.Model.extend({
  localStorage: new Backbone.LocalStorage('user-backbone'),
  defaults: {
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: ""
  },
  validate: function (attrs) {
    let errors = [];
    if (attrs.address1.trim() === "") {
      errors.push({name: "address1", message: "Please enter an address"});
    }
    if (attrs.city.trim() === "") {
      errors.push({name: "city", message: "Please enter a city"});
    }
    if (attrs.state.trim() === "") {
      errors.push({name: "state", message: "Please enter a state"});
    }
    if (isNaN(attrs.zip) || attrs.zip.toString().trim().length < 5 || attrs.zip.toString().trim().length > 5) { // only us zips for now.
      errors.push({name: "zip", message: "Please enter a valid us zipcode"});
    }
    if (errors.length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});
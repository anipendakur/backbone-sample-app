app.views.address = Backbone.View.extend({
  template: _.template(document.getElementById("address-view").innerHTML),
  initialize: function () {
    this.model.bind('change', this.render, this);
  },
  render: function () {
    this.el.innerHTML = this.template({
      address1: this.model.get('address1'),
      address2: this.model.get('address2'),
      city: this.model.get('city'),
      state: this.model.get('state'),
      zip: this.model.get('zip')
    });
  }
});

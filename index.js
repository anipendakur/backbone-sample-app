
let app = (() => {
  let api = {
    views: {},
    models: {},
    collections: {},
    container: null,
    router: null,
    products: null,
    address: null,
    init: function () {
      this.container = document.getElementsByClassName('container')[0];
      this.products = new api.collections.products();
      this.address = new api.models.address();
      ViewsFactory.list();
      ViewsFactory.address();
      ViewsFactory.addressform();
      ViewsFactory.form();
      return this;
    }
  },
  event_bus = _({}).extend(Backbone.Events),
  ViewsFactory = {
    address: function () {
      if (!this.addressView) {
        this.addressView = new api.views.address({
          model: api.address,
          el: document.getElementById("address-container")
        });
      }
      return this.addressView;
    },
    list: function () {
      if (!this.listView) {
        this.listView = new api.views.list({
          model: api.products,
          el: document.getElementById("list-container"),
          eb: event_bus
        });
      }
    },
    form: function() {
      if (!this.formView) {
        this.formView = new api.views.form({
          model: api.products,
          el: document.getElementById("product-form-container"),
          eb: event_bus
        });
      }
      return this.formView;
    },
    addressform: function() {
      if (!this.addressFormView) {
        this.addressFormView = new api.views.addressform({
          model: api.address,
          el: document.getElementById("address-form-container"),
          eb: event_bus
        });
      }
      return this.addressFormView;
    }
  },
  Router = Backbone.Router.extend({
    routes: {
      "": "root",
      "update": "root"
    },
    root: function () {
    }
  });
  api.router = new Router();
  // Expose the api to the world.
  return api;
})();
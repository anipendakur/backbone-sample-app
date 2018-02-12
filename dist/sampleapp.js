
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
app.models.product = Backbone.Model.extend({
  defaults: {
    color: "black",
    size: "small",
    imgSrc: "",
    quantity: 1
  }
});
(function () {
  app.collections.products = Backbone.Collection.extend({
    initialize: function () {
    },
    model: app.models.product
  });
}());
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

app.views.addressform = Backbone.View.extend({
  events: {
    "click .button.finish": "save"
  },
  initialize: function (opts) {
    this.eb = opts.eb;
    this.eb.on("page1", this.render, this);
    this.model.on("invalid", this.showErrors.bind(this));
    this.model.on("change", this.hideErrors.bind(this));
  },
  render: function () {
    let tmp,
      html = document.getElementById("address-form").innerHTML;
    tmp = _.template(html, {});
    this.el.innerHTML = tmp();
    this.delegateEvents();
    return this;
  },
  save: function (e) {
    let me = this;
    e.preventDefault();
    this.model.save({
      address1 : document.querySelector('input[name=address1]').value,
      address2 : document.querySelector('input[name=address2]').value,
      city : document.querySelector('input[name=city]').value,
      state : document.querySelector('input[name=state]').value,
      zip : document.querySelector('input[name=zip]').value
    }, {
      patch: true
    });
  },
  showErrors: function (model, errors, opts) {
    let errHtml = '<ul>',
      errEl = this.el.querySelector('.address-err');
    errors.forEach(err => {
      let ips = this.el.querySelectorAll('input');
      ips.forEach((ip) => {
        if (ip.name === err.name) {
          ip.classList.add('is-invalid');
          errHtml += '<li>' + err.message + '</li>';
        }
      });
    });
    errHtml += '</ul>';
    errEl.innerHTML = errHtml;
    errEl.classList.remove('hide');
  },
  hideErrors: function () {
    let ips = this.el.querySelectorAll('input'),
    errEl = this.el.querySelector('.address-err');
    ips.forEach((ip) => {
      ip.classList.remove('is-invalid');
    });
    errEl.innerHTML = '';
    errEl.classList.add('hide');
    this.eb.trigger('page2');
  }
});

app.views.form = Backbone.View.extend({
  events: {
    "click button.add": "save",
    "change #prop": "changeView"
  },
  initialize: function(opts) {
    this.eb = opts.eb;
    this.render();
  },
  render: function(index) {
    let tmp,
      html = document.getElementById("product-form").innerHTML;
      tmp = _.template(html, {});
    this.el.innerHTML = tmp();
    this.delegateEvents();
    return this;
  },
  save: function (e) {
    e.preventDefault();
    let imgSrc = document.getElementById("img").src,
      size = document.getElementById("size").value,
      color = document.getElementById("color").value,
      quantity = document.getElementById("quantity-input").value;
    this.model.add({
      imgSrc: imgSrc,
      color: color,
      size: size,
      quantity: quantity
    });
    this.randomizeImg();
    this.eb.trigger("page1");
  },
  changeView: function (e) {
    e.preventDefault();

    let prop = document.getElementById("prop").value;

    ["size", "color", "quantity"].forEach((id, ind) => {
      if (id === prop) {
        document.getElementById(id).classList.remove('hide');
      } else {
        document.getElementById(id).classList.add('hide');
      }
    });
  },
  randomizeImg: function () {
    let imgEl = document.getElementById("img"),
      items = ["shoe", "dress", "tie", "shirt", "sock", "umbrella"],
      item = items[Math.floor(Math.random() * items.length)];
    imgEl.src = '/app/img/' + item + '.jpg';
  }
});
app.views.list = Backbone.View.extend({
  template: _.template(document.getElementById("list-view").innerHTML),
  initialize: function (opts) {
    this.eb = opts.eb;
    this.eb.on("page2", this.show, this);
    this.model.bind('add', this.render, this);
  },
  render: function () {
    let prdTmp = _.template(document.getElementById("prod-view").innerHTML),
      rowHtml = '';
    if (this.model.length) {
      this.model.each((prod, index) => {
        rowHtml += prdTmp({
          index: index + 1,
          name: prod.get('name'),
          color: prod.get('color'),
          size: prod.get('size'),
          quantity: prod.get('quantity'),
          imgSrc: prod.get('imgSrc')
        });
      });
      this.el.innerHTML = this.template({rowHtml: rowHtml});
    }
  },
  show: function () {
    this.el.classList.remove('hide');
  }
});
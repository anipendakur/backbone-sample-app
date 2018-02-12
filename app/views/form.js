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
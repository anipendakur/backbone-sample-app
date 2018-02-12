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
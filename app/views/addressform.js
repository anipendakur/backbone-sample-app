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

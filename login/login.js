// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['jquery'], function($) {
    var Login;
    Login = (function() {

      function Login() {
        this._determineClient = __bind(this._determineClient, this);

        this._triggerModal = __bind(this._triggerModal, this);

        this._submitEmailRegistration = __bind(this._submitEmailRegistration, this);

        this._enableLoginRegistration = __bind(this._enableLoginRegistration, this);

        var _this = this;
        this._overrideDependencies();
        this.my = {
          zid: $.cookie('zid'),
          session: $.cookie("sgn") === "temp" || $.cookie("sgn") === "perm",
          currentUrl: window.location.href,
          popupTypes: ["login", "register", "account", "reset", "confirm"]
        };
        $(document).ready(function() {
          $('body').bind('new_zid_obtained', function() {
            return _this.my.zid = $.cookie('zid');
          });
          _this._welcomeMessage();
          _this._toggleLogIn();
          _this._enableLoginRegistration();
          $.each(_this.my.popupTypes, function(index, type) {
            return _this._bindForms(type);
          });
          return $("a.logout").click(function(e) {
            return _this._logOut(e);
          });
        });
      }

      Login.prototype.toggleRegistrationDiv = function($div) {
        if (!this.my.session) {
          this.wireupSocialLinks($div.show());
          return $.each(this.my.popupTypes, function(type) {
            return this._bindForms(type);
          });
        }
      };

      Login.prototype.expireCookie = function(cookie) {
        var options;
        options = {
          expires: new Date(1),
          path: "/",
          domain: "." + window.location.host
        };
        return $.cookie(cookie, "", options);
      };

      Login.prototype.wireupSocialLinks = function($div) {
        var baseUrl, fbLink, googleLink, twitterLink;
        baseUrl = "" + zutron_host + "?zid_id=" + this.my.zid + "&referrer=" + this.my.currentUrl + "&technique=";
        fbLink = $div.find("a.icon_facebook48");
        twitterLink = $div.find("a.icon_twitter48");
        googleLink = $div.find("a.icon_google_plus48");
        this._bindSocialLink(fbLink, "" + baseUrl + "facebook", $div);
        this._bindSocialLink(twitterLink, "" + baseUrl + "twitter", $div);
        return this._bindSocialLink(googleLink, "" + baseUrl + "google_oauth2", $div);
      };

      Login.prototype._welcomeMessage = function() {
        if ($.cookie("user_type") === "new") {
          this._triggerModal($("#welcome_message"));
        }
        return this.expireCookie("user_type");
      };

      Login.prototype._enableLoginRegistration = function() {
        var _this = this;
        $('#zutron_register_form form').submit(function(e) {
          return _this._submitEmailRegistration($(e.target));
        });
        $('#zutron_account_form form').submit(function(e) {
          return _this._submitChangeEmail($(e.target));
        });
        $('#zutron_login_form form').submit(function(e) {
          return _this._submitLogin($(e.target));
        });
        $('#zutron_reset_form form').submit(function(e) {
          return _this._submitPasswordReset($(e.target));
        });
        return $('#zutron_confirm_form form').submit(function(e) {
          return _this._submitPasswordConfirm($(e.target));
        });
      };

      Login.prototype._submitEmailRegistration = function($form) {
        var _this = this;
        this._setHiddenValues($form);
        return $.ajax({
          type: 'POST',
          data: $form.serialize(),
          url: "" + zutron_host + "/auth/identity/register",
          beforeSend: function(xhr) {
            xhr.overrideMimeType("text/json");
            return xhr.setRequestHeader("Accept", "application/json");
          },
          success: function(data) {
            if (data['redirectUrl']) {
              return _this._redirectOnSuccess(data, $form);
            } else {
              return _this._generateErrors(data, $form.parent().find(".errors"));
            }
          },
          error: function(errors) {
            return _this._generateErrors($.parseJSON(errors.responseText), $form.parent().find(".errors"));
          }
        });
      };

      Login.prototype._submitLogin = function($form) {
        var _this = this;
        this._setHiddenValues($form);
        return $.ajax({
          type: "POST",
          data: $form.serialize(),
          url: "" + zutron_host + "/auth/identity/callback",
          beforeSend: function(xhr) {
            xhr.overrideMimeType("text/json");
            return xhr.setRequestHeader("Accept", "application/json");
          },
          success: function(data) {
            if (data['redirectUrl']) {
              return _this._redirectOnSuccess(data, $form);
            } else {
              return _this._generateErrors(data, $form.parent().find(".errors"));
            }
          },
          error: function(errors) {
            return _this._generateErrors($.parseJSON(errors.responseText), $form.parent().find(".errors"));
          }
        });
      };

      Login.prototype._submitChangeEmail = function($form) {
        var new_email,
          _this = this;
        this._setHiddenValues($form);
        new_email = {
          profile: {
            email: $('input[name="new_email"]').val(),
            email_confirmation: $('input[name="new_email_confirm"]').val()
          }
        };
        return $.ajax({
          type: "GET",
          data: new_email,
          datatype: 'json',
          url: "" + zutron_host + "/zids/" + this.my.zid + "/profile/edit.json",
          beforeSend: function(xhr) {
            xhr.overrideMimeType("text/json");
            return xhr.setRequestHeader("Accept", "application/json");
          },
          success: function(data) {
            var error;
            if ((data != null) && data.email) {
              error = {
                'email': data.email
              };
              return _this._generateErrors(error, $form.parent().find(".errors"));
            } else {
              return $('#zutron_account_form').prm_dialog_close();
            }
          },
          error: function(errors) {
            return _this._generateErrors($.parseJSON(errors.responseText), $form.parent().find(".errors"));
          }
        });
      };

      Login.prototype._submitPasswordReset = function($form) {
        var _this = this;
        return $.ajax({
          type: 'POST',
          data: $form.serialize(),
          url: "" + zutron_host + "/password_reset",
          beforeSend: function(xhr) {
            xhr.overrideMimeType("text/json");
            return xhr.setRequestHeader("Accept", "application/json");
          },
          success: function(data) {
            var error;
            if ((data != null) && data.error) {
              error = {
                'password': data.error
              };
              return _this._generateErrors(error, $form.parent().find(".errors"));
            } else {
              $form.parent().empty();
              $('.reset_success').html(data.success).show();
              return _this._determineClient($form);
            }
          },
          error: function(errors) {
            return _this._generateErrors($.parseJSON(errors.responseText), $form.parent().find(".errors"));
          }
        });
      };

      Login.prototype._submitPasswordConfirm = function($form) {
        var _this = this;
        return $.ajax({
          type: 'POST',
          data: $form.serialize(),
          url: "" + zutron_host + "/password_confirmation",
          beforeSend: function(xhr) {
            xhr.overrideMimeType("text/json");
            return xhr.setRequestHeader("Accept", "application/json");
          },
          success: function(data) {
            var error;
            if ((data != null) && data.error) {
              error = {
                'password': data.error
              };
              return _this._generateErrors(error, $form.parent().find(".errors"));
            } else {
              $form.parent().empty();
              $('.reset_success').html(data.success).show();
              return _this._determineClient($form);
            }
          },
          error: function(errors) {
            return _this._generateErrors($.parseJSON(errors.responseText), $form.parent().find(".errors"));
          }
        });
      };

      Login.prototype._clearInputs = function(formID) {
        var $inputs, $labels;
        $inputs = $(formID + ' input[type="email"]').add($(formID + ' input[type="password"]'));
        $labels = $("#z_form_labels label");
        return $inputs.each(function(index, elem) {
          $(elem).focus(function() {
            return $($labels[index]).hide();
          });
          $(elem).blur(function() {
            if ($(elem).val() === '') {
              return $($labels[index]).show();
            }
          });
          return $($labels[index]).click(function() {
            return $inputs[index].focus();
          });
        });
      };

      Login.prototype._redirectOnSuccess = function(obj, $form) {
        $form.prm_dialog_close();
        if (obj.redirectUrl) {
          return window.location.assign(obj.redirectUrl);
        }
      };

      Login.prototype._generateErrors = function(error, $box) {
        var $form, messages,
          _this = this;
        this._clearErrors($box.parent());
        messages = '';
        if (error != null) {
          $form = $box.parent().find('form');
          $.each(error, function(key, value) {
            var formattedError;
            $form.find("#" + key).parent('p').addClass('error');
            formattedError = _this._formatError(key, value);
            messages += "<li>" + formattedError + "</li>";
            return $form.find('.error input:first').focus();
          });
        } else {
          messages += "An error has occured.";
        }
        return $box.append("<ul>" + messages + "</ul>");
      };

      Login.prototype._formatError = function(key, value) {
        switch (key) {
          case "base":
            return value;
          case "auth_key":
            if (value) {
              return value;
            } else {
              return '';
            }
            break;
          case "email":
            if (value) {
              return "Email " + value;
            } else {
              return '';
            }
            break;
          case "password":
            if (value) {
              return "Password " + value;
            } else {
              return '';
            }
            break;
          case "password_confirmation":
            return "Password Confirmation " + value;
        }
      };

      Login.prototype._toggleLogIn = function() {
        var $changeLink, $logLink, $regLink;
        $regLink = $("a.register");
        $logLink = $("a.login");
        $changeLink = $('a.account');
        if (this.my.session) {
          $changeLink.parent().removeClass('hidden');
          $regLink.parent().addClass('hidden');
          return $logLink.addClass("logout").text('Logout');
        } else {
          $regLink.parent().removeClass('hidden');
          return $logLink.addClass("login").text('Login');
        }
      };

      Login.prototype._bindForms = function(type) {
        var formID,
          _this = this;
        formID = "#zutron_" + type + "_form";
        if (this.MOBILE) {
          this.wireupSocialLinks($(formID));
        }
        this._clearInputs(formID);
        return $("a." + type).click(function() {
          $('.prm_dialog').prm_dialog_close();
          return _this._triggerModal($(formID));
        });
      };

      Login.prototype._triggerModal = function($div) {
        this._clearErrors($div);
        $div.prm_dialog_open();
        $div.on("click", "a.close", function() {
          return $div.prm_dialog_close();
        });
        return this.wireupSocialLinks($div);
      };

      Login.prototype._clearErrors = function($div) {
        $div.find('form p').removeClass('error');
        return $div.find('.errors').empty();
      };

      Login.prototype._bindSocialLink = function($link, url, $div) {
        var _this = this;
        return $link.on("click", function() {
          var options, staySignedIn;
          staySignedIn = $div.find('input[type="checkbox"]').attr('checked');
          if (staySignedIn) {
            options = {
              path: "/",
              domain: window.location.host
            };
            $.cookie("stay", "true", options);
          } else {
            _this.expireCookie("sgn");
          }
          return _this._redirectTo(url);
        });
      };

      Login.prototype._logOut = function(e) {
        e.preventDefault();
        this.expireCookie("zid");
        this.expireCookie("sgn");
        return window.location.replace(this.my.currentUrl);
      };

      Login.prototype._redirectTo = function(url) {
        var _this = this;
        return $.ajax({
          type: "get",
          url: zutron_host + "/ops/heartbeat/riak",
          success: function() {
            return window.location.assign(url);
          },
          error: function() {
            _this.my.registrationForm.prm_dialog_close();
            $("#zutron_login_form, #zutron_registration").prm_dialog_close();
            return _this._triggerModal($("#zutron_error"));
          }
        });
      };

      Login.prototype._setHiddenValues = function($form) {
        $form.find("input#state").val(this.my.zid);
        return $form.find("input#origin").val(this.my.currentUrl);
      };

      Login.prototype._determineClient = function($form) {
        var clients,
          _this = this;
        if (this.my.currentUrl.indexOf(client > 0 && (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)))) {
          clients = ["iOS", "android"];
          return $.each(clients, function(client) {
            var my_client;
            my_client = _this.my.currentUrl.substring(_this.my.currentUrl.indexOf('client'), location.href.length);
            my_client = my_client.split("=")[1].toLowerCase();
            _this._createAppButton(my_client);
            return false;
          });
        }
      };

      Login.prototype._createAppButton = function(client) {
        var btn, launch_url;
        if (client === 'ios') {
          launch_url = "a";
        }
        if (client === 'android') {
          launch_url = "b";
        }
        btn = "<a href='" + launch_url + "' class='" + client + " app_button'>" + client + "</a>";
        return $('#app_container').html(btn);
      };

      Login.prototype._overrideDependencies = function() {
        this.MOBILE = window.location.host.match(/(^m\.|^local\.m\.)/) != null;
        this.BIGWEB = !this.MOBILE;
        if (this.BIGWEB) {
          this._clearInputs = function() {};
        }
        if (this.MOBILE) {
          $.fn.prm_dialog_close = function() {};
          $.fn.prm_dialog_open = function() {};
          return this._triggerModal = function() {};
        }
      };

      return Login;

    })();
    return {
      instance: {},
      init: function() {
        return this.instance = new Login();
      },
      wireupSocialLinks: function() {
        return this.instance.wireupSocialLinks();
      },
      toggleRegistrationDiv: function() {
        return this.instance.toggleRegistrationDiv();
      },
      expireCookie: function() {
        return this.instance.expireCookie();
      },
      session: function() {
        return this.instance.my.session;
      }
    };
  });

}).call(this);

/* globals $ */
function scrollToElement (element) {
  $('html, body').animate({
    scrollTop: element.offset().top
  }, 1000)
}

function renderError (el, message) {
  console.log(message)
  el.text(message)
  el.css({
    color: '#d35400',
    display: 'inline'
  })
}

$(function () {
  window.addEventListener('submit', function (e) {
    e.preventDefault()
    var requiredMatched = true
    var form = $('form')
    var inputs = $('input[data-required]')
    var githubUsername = $('#githubUsername').get(0)

    inputs.each(function (i, el) {
      if (!el.checkValidity() || el.value === '') {
        el.setAttribute('required', true)
        requiredMatched = false
        scrollToElement(form)
      }
    })

    if (githubUsername.value !== '' && !githubUsername.checkValidity()) {
      requiredMatched = false
    }

    if (requiredMatched) {
      $.ajax({
        url: form.attr('action'),
        type: form.attr('method'),
        data: form.serialize()
      }).then(function (data) {
        $('.overlay-container').show()
        $('#join-button').hide()
        // To clear fields, so no annoying closing messages displayed by browser
        form.get(0).reset()
      }, function (res) {
        var data = JSON.parse(res.responseText)

        var errorElement
        if (!data.emailValid) {
          errorElement = $('label[for=email] .error')
          scrollToElement(errorElement)
          renderError(errorElement, ' - ' + data.errorMessage)
        } else if (!data.githubValid) {
          errorElement = $('label[for=githubUsername] .error')
          scrollToElement(errorElement)
          renderError(errorElement, ' - ' + data.errorMessage)
        } else {
          errorElement = $('#other-error')
          scrollToElement(form)
          renderError(errorElement, data.errorMessage)
        }
      })
    }
  })
})

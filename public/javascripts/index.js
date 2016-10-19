/* globals $ */
function scrollToElement (element) {
  $('html, body').animate({
    scrollTop: element.offset().top
  }, 1000)
}

function renderError (el, message) {
  console.log('Appending: ' + message)
  el.text(' - ' + message)
}

$(function () {
  window.addEventListener('submit', function (e) {
    e.preventDefault()
    var requiredMatched = true
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
        url: '/join',
        type: 'POST',
        data: $('form').serialize()
      }).then(function (data) {
        $('.overlay-container').show()
        $('#join-button').hide()
        // To clear fields, so no annoying closing messages displayed by browser
        document.querySelector('form').reset()
      }, function (res) {
        var data = JSON.parse(res.responseText)

        var errorElement
        if (!data.success && !data.emailValid) {
          errorElement = $('label[for=email] span')
          console.log(data.errorMessage)
          scrollToElement(errorElement, data.errorMessage)
          renderError(errorElement, data.errorMessage)
        } else if (!data.success && !data.githubValid) {
          errorElement = $('label[for=githubUsername] span')
          console.log(data.errorMessage)
          scrollToElement(errorElement)
          renderError(errorElement, data.errorMessage)
        }
      })
    }
  })
})

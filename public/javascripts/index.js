/* globals $ */
function scrollToElement (element) {
  $('html, body').animate({
    scrollTop: element.offset().top
  }, 1000)
}

function renderError (el, message) {
  console.log('Appending:' + message)
  el.append(' - ' + message)
}

$(function () {
  window.addEventListener('submit', function (e) {
    var requiredMatched = true
    e.preventDefault()
    var inputs = document.querySelectorAll('input[data-required]')
    Array.prototype.slice.call(inputs).forEach(function (el) {
      if (el.getAttribute('pattern') ? !(new RegExp(el.getAttribute('pattern')).test(el.value)) : el.value === '') {
        e.stopPropagation()
        el.setAttribute('required', true)
        requiredMatched = false
      }
    })
    if (requiredMatched) {
      $.ajax({
        url: '/join',
        type: 'POST',
        data: $('form').serialize()
      }).done(function (data) {
        var errorElement
        if (!(data.success && data.emailValid)) {
          errorElement = $('label[for=email]')
          console.log(data.errorMessage)
          scrollToElement(errorElement, data.errorMessage)
          renderError(errorElement, data.errorMessage)
        } else if (!(data.success && data.emailValid)) {
          errorElement = $('label[for=githubUsername]')
          console.log(data.errorMessage)
          scrollToElement(errorElement)
          renderError(errorElement, data.errorMessage)
        } else {
          $('.overlay-container').show()
          $('#join-button').hide()
          // To clear fields, so no annoying closing messages displayed by browser
          document.querySelector('form').reset()
        }
      })
    }
  })
})

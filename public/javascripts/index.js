/* globals $ */

$(function () {
  window.addEventListener('submit', function (e) {
    var requiredMatched = true
    e.preventDefault()
    var inputs = document.querySelectorAll('input[data-required]')
    var githubUsername = document.querySelector('#githubUsername')
    Array.prototype.slice.call(inputs).forEach(function (el) {
      if (el.getAttribute('pattern') ? !(new RegExp(el.getAttribute('pattern')).test(el.value)) : el.value === '') {
        e.stopPropagation()
        el.setAttribute('required', true)
        requiredMatched = false
      }
    })

    if (githubUsername.value !== '' && !(new RegExp(githubUsername.getAttribute('pattern')).test(githubUsername.value))) {
      e.stopPropagation()
      requiredMatched = false
    }

    if (requiredMatched) {
      $.ajax({
        url: '/join',
        type: 'POST',
        data: $('form').serialize()
      }).done(function (data) {
        document.querySelector('.overlay-container').style.display = 'block'
        document.querySelector('#join-button').style.display = 'none'
        // To clear fields, so no annoying closing messages displayed by browser
        document.querySelector('form').reset()
      }).fail(function () {
        document.querySelector('#githubUsername').style.border = '1px solid red'
      })
    }
  })
})

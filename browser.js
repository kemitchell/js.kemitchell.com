var codemirror = require('codemirror')
require('codemirror/mode/javascript/javascript')
var diff = require('diff')

var consoleBuffer = []
// var originalConsole = window.console

window.console = {
  log: function (argument) {
    consoleBuffer.push(argument.toString())
  }
}

var challenges = require('./challenges')
var currentChallenge
var unsuccessfulRuns

var editor

document.addEventListener('DOMContentLoaded', function () {
  var textarea = document.getElementById('editor')
  editor = codemirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: 'javascript',
    gutters: ['locks']
  })
  editor.setOption('extraKeys', {
    'Ctrl-Enter': runCode,
    'Ctrl-Return': runCode
  })
  var button = document.getElementById('button')
  button.addEventListener('click', runCode)
  loadChallenge()
})

window.onpopstate = loadChallenge

function loadChallenge () {
  var hash = window.location.hash.substring(1)
  var parsed = parseInt(hash)
  if (/^\d+$/.test(hash) && parsed > 0) {
    showChallenge(parsed)
  } else {
    showChallenge()
  }
}

function runCode () {
  'use strict'
  var exception
  try {
    eval(editor.getValue()) /* eslint no-eval: "off" */
  } catch (error) {
    exception = error
  }
  if (exception) {
    showException(exception)
  } else {
    var difference = diff.diffLines(
      currentChallenge.target.join('\n'),
      consoleBuffer.join('\n'),
      {newlineIsToken: true}
    )
    showDifference(difference)
    var success = !difference.some(function (item) {
      return item.added || item.removed
    })
    if (success) {
      setTimeout(celebrate, 1000)
    } else {
      unsuccessfulRuns++
      if (unsuccessfulRuns >= 3) {
        showHints()
      }
    }
    consoleBuffer = []
  }
}

var nanomodal = require('nanomodal')

nanomodal.customShow = function (defaultShow, modalAPI) {
  defaultShow()
  modalAPI.overlay.el.style.opacity = 0.5
  modalAPI.modal.el.style.opacity = 1
}
nanomodal.customHide = function (defaultHide, modalAPI) {
  modalAPI.overlay.el.style.opacity = 0
  modalAPI.modal.el.style.opacity = 0
  if (document.body.style.transition !== undefined) {
    setTimeout(defaultHide, 500)
  } else {
    defaultHide()
  }
}

function celebrate () {
  var modal = nanomodal('\u2714', {
    buttons: [],
    classes: ['celebration'],
    autoRemove: true
  })
  modal.show()
  setTimeout(function () {
    showChallenge()
    modal.hide()
  }, 1000)
}

function graduate () {
  window.location = 'diploma.html'
}

var NO_ENTRY = '\u26d4'

function showChallenge (optionalChallengeNumber) {
  var nextChallengeNumber = (
    optionalChallengeNumber ||
    (challenges.indexOf(currentChallenge) + 2)
  )
  var nextIndex = nextChallengeNumber - 1
  var nextChallenge = challenges[nextIndex]
  if (nextChallenge) {
    currentChallenge = nextChallenge
    unsuccessfulRuns = 0
    var h2 = document.getElementById('challenge')
    h2.className = ''
    removeAllChildren(h2)
    h2.appendChild(
      document.createTextNode(
        'js#' + (nextIndex + 1) + '/' + challenges.length
      )
    )
    removeAllChildren(document.getElementById('hints'))
    if (window.location.hash.substring(1) !== nextChallengeNumber) {
      window.history.pushState({}, '', '#' + (nextIndex + 1))
    }
    editor.setValue(currentChallenge.code.join('\n'))
    if (currentChallenge.lock) {
      var doc = editor.getDoc()
      currentChallenge.lock.forEach(function (lineNumber) {
        doc.markText(
          {
            line: lineNumber,
            ch: 0
          },
          {
            line: lineNumber,
            ch: currentChallenge.code[lineNumber].length + 1
          },
          {
            readOnly: true,
            inclusiveLeft: true
          }
        )
        var marker = document.createElement('div')
        marker.className = 'lock'
        marker.appendChild(document.createTextNode(NO_ENTRY))
        doc.setGutterMarker(lineNumber, 'locks', marker)
      })
    }
    showDifference(
      diff.diffLines(
        currentChallenge.target.join('\n'),
        '',
        {newlineIsToken: true}
      )
    )
  } else {
    graduate()
  }
}

function showDifference (difference) {
  var readout = document.getElementById('readout')
  removeAllChildren(readout)
  var lineDifference = difference.reduce(function (lines, item) {
    return lines.concat(
      item.value
        .split('\n')
        .map(function (line) {
          var object = {
            value: line.replace(/ /g, '␣')
          }
          if (item.added) {
            object.added = true
          } else if (item.removed) {
            object.removed = true
          }
          return object
        })
    )
  }, [])
  lineDifference.forEach(function (item) {
    var span = document.createElement('span')
    if (item.added) {
      span.className = 'added'
    } else if (item.removed) {
      span.className = 'removed'
    } else {
      span.className = 'correct'
    }
    span.appendChild(document.createTextNode(item.value))
    readout.appendChild(span)
  })
}

function showException (exception) {
  var readout = document.getElementById('readout')
  removeAllChildren(readout)
  var span = document.createElement('span')
  span.className = 'exception'
  span.appendChild(
    document.createTextNode(
      exception.toString()
    )
  )
  readout.appendChild(span)
}

function showHints () {
  var hints = document.getElementById('hints')
  removeAllChildren(hints)
  currentChallenge.needs.forEach(function (concept) {
    var li = document.createElement('li')
    var code = document.createElement('code')
    code.appendChild(document.createTextNode(concept))
    li.appendChild(code)
    hints.appendChild(li)
  })
}

function removeAllChildren (parent) {
  parent.innerHTML = ''
}

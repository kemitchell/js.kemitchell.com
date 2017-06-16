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

var editor

document.addEventListener('DOMContentLoaded', function () {
  var textarea = document.getElementById('editor')
  editor = codemirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: 'javascript'
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
  eval(editor.getValue()) /* eslint no-eval: "off" */
  var target = currentChallenge.target.join('\n')
  var output = consoleBuffer.join('\n')
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
    setTimeout(
      function () {
        celebrate()
        showChallenge()
      },
      250
    )
  }
  consoleBuffer = []
}

function celebrate () {
  window.alert('\u2714')
}

function showChallenge (optionalChallengeNumber) {
  var nextChallengeNumber = (
    optionalChallengeNumber ||
    (challenges.indexOf(currentChallenge) + 2)
  )
  var nextIndex = nextChallengeNumber - 1
  var nextChallenge = challenges[nextIndex]
  if (nextChallenge) {
    currentChallenge = nextChallenge
    var h2 = document.getElementById('challenge')
    h2.className = ''
    removeAllChildren(h2)
    h2.appendChild(
      document.createTextNode('js#' + (nextIndex + 1))
    )
    if (window.location.hash.substring(1) !== nextChallengeNumber) {
      window.history.pushState({}, '', '#' + (nextIndex + 1))
    }
    editor.setValue(currentChallenge.code.join('\n'))
    showDifference(
      diff.diffLines(
        currentChallenge.target.join('\n'),
        '',
        {newlineIsToken: true}
      )
    )
  } else {
    // TODO: Celebrate completion!
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
          var object = {value: line}
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
    }
    span.appendChild(document.createTextNode(item.value))
    readout.appendChild(span)
  })
}

function removeAllChildren (parent) {
  parent.innerHTML = ''
}

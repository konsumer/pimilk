import butterchurn from 'butterchurn'
import butterchurnPresets from 'butterchurn-presets'

window.AudioContext = window.AudioContext || window.webkitAudioContext
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

const canvas = document.getElementsByTagName('canvas')[0]
const select = document.getElementsByTagName('select')[0]
const button = document.getElementsByTagName('button')[0]

let visualizer

button.addEventListener('click', async e => {
  button.style.display = 'none'
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  const audioContext = new window.AudioContext()
  const gainNode = audioContext.createGain()
  gainNode.connect(audioContext.destination)
  const microphoneStream = audioContext.createMediaStreamSource(stream)
  microphoneStream.connect(gainNode)
  visualizer.connectAudio(gainNode)
  visualizer = butterchurn.createVisualizer(audioContext, canvas, {
    width: canvas.clientWidth,
    height: canvas.clientHeight
  })
  visualizer.loadPreset(preset, 0.0)
})

const presets = butterchurnPresets.getPresets()
let preset = Object.values(presets)[0]
select.innerHTML = Object.keys(presets).map(p => `<option>${p}</option>`).join('')
select.addEventListener('change', e => {
  preset = presets[select.options[select.selectedIndex].value]
  if (visualizer) {
    visualizer.loadPreset(preset, 5.0)
  }
})

window.addEventListener('resize', e => visualizer && visualizer.setRendererSize(canvas.clientWidth, canvas.clientHeight))

window.requestAnimationFrame(() => visualizer && visualizer.render())

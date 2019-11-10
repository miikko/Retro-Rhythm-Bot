const queue = []

const enqueue = (audio) => {
  queue.push(audio)
  return queue.length
}

const dequeue = () => {
  return queue.shift()
}

const pushToFront = (audio) => {
  return queue.unshift(audio)
}

const peek = () => {
  return queue.length > 0 ? queue[0] : null
}

const getLength = () => queue.length

module.exports = { enqueue, dequeue, pushToFront, peek, getLength }
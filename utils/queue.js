const queue = []

const enqueue = (url) => {
  queue.push(url)
  return queue.length
}

const dequeue = () => {
  return queue.shift()
}

const pushToFront = (url) => {
  return queue.unshift(url)
}

const peek = () => {
  return queue.length > 0 ? queue[0] : null
}

const getLength = () => queue.length

module.exports = { enqueue, dequeue, pushToFront, peek, getLength }
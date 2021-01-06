import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  // Atvaizdavimas
  const [streets, setStreets] = useState({})
  const [queueData, setQueueData] = useState([])
  let fakeApiArr = []

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(
        'https://raw.githubusercontent.com/zemirco/sf-city-lots-json/master/citylots.json'
      )

      let streetArr = []
      data.features.forEach((e) => {
        if (!streetArr.includes(e.properties.STREET))
          streetArr = [...streetArr, e.properties.STREET]
      })

      setStreets(streetArr)
    }
    fetch()
  }, [])

  // Queue dalis

  async function createQueue(urlArr) {
    const queue = urlArr
    const maxRequests = 5
    let reqInQueue = 0
    let i = 0

    return await new Promise((resolve) => {
      const result = []

      const fetchData = setInterval(async () => {
        if (queue.filter((url) => url).length === 0) {
          clearInterval(fetchData)
          resolve(result)
        }

        if (reqInQueue >= maxRequests || i > queue.length - 1) {
          return
        }

        const index = i++
        const url = queue[index]

        reqInQueue++

        result[index] = await fetch(url).then((res) => res.json())
        reqInQueue--
        setQueueData([...queueData, result])

        delete queue[index]
      }, 100)
    })
  }

  const requestQueueHandler = () => {
    for (let i = 1; i <= 100; i++) {
      fakeApiArr = [...fakeApiArr, `https://swapi.dev/api/planets/${i}/`]
    }
    createQueue(fakeApiArr)
  }

  return (
    <div className='App'>
      <div>
        Streets:
        {streets.length > 0 &&
          streets.map((str, i) => (
            <p key={i}>
              {i + 1}.{str}
            </p>
          ))}
      </div>
      <div>
        <button onClick={requestQueueHandler}>Fetch!</button>
        {queueData[0] &&
          queueData[0].map((planet) => (
            <p>
              Star Wars planet:
              {planet.detail === ' Not found'
                ? 'Oops no more planets'
                : planet.name}
            </p>
          ))}
      </div>
    </div>
  )
}

export default App

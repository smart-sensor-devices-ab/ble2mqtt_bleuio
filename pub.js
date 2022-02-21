const clientId = 'hibouair_' + Math.random().toString(16).substr(2, 8)

//const host = 'ws://broker.emqx.io:8083/mqtt'
const host = 'wss://mqtt.flespi.io:443'

const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  username:'jBDIjD3M0UIogn2IiHvBfW3ydn1CAstHTUd2l6CbPapVmftsKNTPxKcAY13mhkS0',
  password:'jBDIjD3M0UIogn2IiHvBfW3ydn1CAstHTUd2l6CbPapVmftsKNTPxKcAY13mhkS0',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'HibouAirMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
}

const client = mqtt.connect(host, options)
client.on('connect',()=>{
    console.log('connected mqtt client',clientId)

})

client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})

var topic = 'HibouAirTopic'

// Publish
setInterval(() => {
    var msg = 'temp :'+Math.floor(Math.random() * 30)
    client.publish(topic, msg, { qos: 0, retain: false })
    console.log("Message sent!", msg);
    document.getElementById('output').innerHTML += msg+"<br>";

  }, 5000);
//client.publish('HibouAirTopic', 'ws connection demo...!', { qos: 0, retain: false })


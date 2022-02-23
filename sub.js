const clientId = 'hibouair_' + Math.random().toString(16).substr(2, 8)
import * as mqtt from "mqtt" 

//const host = 'ws://broker.emqx.io:8083/mqtt'
const host = 'wss://mqtt.flespi.io:443'

const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  username:'eymVF39YbcQEqcuICINSkKlyqu3xs8kvwug2ngOoguRwx93ZHEFSeQgtb7Qr5YMs',
  password:'eymVF39YbcQEqcuICINSkKlyqu3xs8kvwug2ngOoguRwx93ZHEFSeQgtb7Qr5YMs',
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
  client.subscribe('HibouAirTopic', { qos: 0 })
})
client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})


  
  // Received
client.on('message', (topic, message, packet) => {
  console.log(JSON.parse(message))
  //console.log('Received Message: ' + message + '\nOn topic: ' + topic)
  document.getElementById('output').innerHTML += message.toString()+"<br>";

})


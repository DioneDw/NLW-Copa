import Fastify from "fastify";


async function bootstrap(){
 
  const fastify = Fastify({
    logger: true,
  })

// Primeira porta - bolão
fastify.get('/pools/count', (req, res)=> {
  return { count : 0}
})





await fastify.listen({ port:3333 })


}
bootstrap()
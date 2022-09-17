const clamp = (x, min, max) => Math.max(Math.min(x, max), min)
const random = (min, max) => (max - min) * Math.random() + min

class Particle {
    static velocityDamp      = random(0,1)
    static timeStep          = random(.1,.5)
    static effectiveDistance = {}
    static spreadMargin      = .2
    
    constructor(color, x, y) {
        this.onEdge = this.wrap

        this.color = color 
        this.velocity = {x:0,y:0}

        this.x = x
        this.y = y
    }

    clamp() {
        this.x = clamp(this.x, 0, canv.width)
        this.y = clamp(this.y, 0, canv.height)
    }

    bounce() {
        if(this.x >= canv.width  || this.x <= 0) this.velocity.x *= -1
        if(this.y >= canv.height || this.y <= 0) this.velocity.y *= -1
        this.clamp()
    }

    wrap() {
        if(this.x < 0) this.x = canv.width
        if(this.x > canv.width) this.x = 0
        if(this.y < 0) this.y = canv.height
        if(this.y > canv.height) this.y = 0

        this.clamp()
    }

    static addRule(cause, effect, strength){
        rules.push([cause, effect, strength])
    }

    static create(color, x, y) {
        let pt = new Particle(color, x, y)
        particles.all.push(pt)

        if(!particles.hasOwnProperty(color))
            particles[color] = []
        
        particles[color].push(pt)
    }

    static rule(cause, effect, attraction) {
        for(let causeParticle of particles[cause]) {
            for(let effectParticle of particles[effect]) {
                if(causeParticle != effectParticle) {
                    // get position difference
                    let dx = causeParticle.x - effectParticle.x
                    let dy = causeParticle.y - effectParticle.y
                    // let dist = dx**2 + dy**2
                    let dist = Math.hypot(dx, dy)

                    // add attraction force
                    if(dist < Particle.effectiveDistance[cause]) {
                        effectParticle.velocity.x += dx * attraction * 1/dist * Particle.timeStep
                        effectParticle.velocity.y += dy * attraction * 1/dist * Particle.timeStep
                    }
                }
            }
        }
    }

    static populate(color, ammount) {
        let margin = Particle.spreadMargin
        for(let i = 0; i < ammount; i++) {
            let x = random(canv.width  * margin, canv.width  - canv.width *margin)
            let y = random(canv.height * margin, canv.height - canv.height*margin)
            Particle.create(color, x, y)
        }
    }

    update() {
        // reverse velocity when hit the edge
        this.onEdge()

        this.x += this.velocity.x
        this.y += this.velocity.y

        // dampen velocity
        this.velocity.x *= Particle.velocityDamp
        this.velocity.y *= Particle.velocityDamp

        this.draw()
    }

    draw() {
        c.fillStyle = this.color
        c.beginPath()
        c.arc(this.x, this.y, 3, 0, 2*Math.PI)
        c.fill()
    }
}
